-- One-time migration: move existing leaderboard data from public.scores into schema immaculate_grid.
-- This is a metadata-only move (ALTER ... SET SCHEMA); all rows stay attached to the same table OID.
--
-- Do this IN ORDER:
-- 1) Dashboard → Project Settings → API → "Exposed schemas" → add: immaculate_grid → Save.
-- 2) Run this entire script in SQL Editor (moves relational data to immaculate_grid + ensures storage bucket/policies).
-- 3) Deploy the app (storage.js sends Accept-Profile / Content-Profile for immaculate_grid).
--
-- Do NOT run supabase_setup.sql afterward on the same project (you already have scores).

create schema if not exists immaculate_grid;

grant usage on schema immaculate_grid to anon, authenticated, service_role;

-- Move table + indexes + RLS policies + triggers (data stays intact).
do $$
begin
  if to_regclass('public.scores') is not null and to_regclass('immaculate_grid.scores') is null then
    alter table public.scores set schema immaculate_grid;
  end if;
end $$;

-- Keep the trigger function alongside the table (cleaner than leaving it in public).
do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where p.proname = 'update_updated_at_column'
      and n.nspname = 'public'
      and not exists (
        select 1 from pg_proc p2
        join pg_namespace n2 on n2.oid = p2.pronamespace
        where p2.proname = 'update_updated_at_column'
          and n2.nspname = 'immaculate_grid'
      )
  ) then
    alter function public.update_updated_at_column() set schema immaculate_grid;
  end if;
end $$;

-- If there was no function (unusual), create it in-schema so updates still bump updated_at.
create or replace function immaculate_grid.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Ensure trigger points at in-schema function (skip if no scores table yet).
do $tr$
begin
  if to_regclass('immaculate_grid.scores') is null then
    return;
  end if;
  execute 'drop trigger if exists update_scores_updated_at on immaculate_grid.scores';
  execute 'create trigger update_scores_updated_at before update on immaculate_grid.scores for each row execute function immaculate_grid.update_updated_at_column()';
end $tr$;

do $grant_scores$
begin
  if to_regclass('immaculate_grid.scores') is not null then
    execute 'grant select, insert, update, delete on table immaculate_grid.scores to anon, authenticated, service_role';
  end if;
end $grant_scores$;

grant execute on function immaculate_grid.update_updated_at_column() to anon, authenticated, service_role;

grant all on all tables in schema immaculate_grid to anon, authenticated, service_role;
grant all on all routines in schema immaculate_grid to anon, authenticated, service_role;
grant all on all sequences in schema immaculate_grid to anon, authenticated, service_role;

alter default privileges for role postgres in schema immaculate_grid
  grant all on tables to anon, authenticated, service_role;
alter default privileges for role postgres in schema immaculate_grid
  grant all on routines to anon, authenticated, service_role;
alter default privileges for role postgres in schema immaculate_grid
  grant all on sequences to anon, authenticated, service_role;

-- Storage footprint (must remain in `storage` schema; see supabase_setup.sql).
insert into storage.buckets (id, name, public)
values ('grid-images', 'grid-images', true)
on conflict (id) do nothing;

drop policy if exists "Allow public read access to grid images" on storage.objects;
create policy "Allow public read access to grid images"
on storage.objects for select
using (bucket_id = 'grid-images');

drop policy if exists "Allow public upload access to grid images" on storage.objects;
create policy "Allow public upload access to grid images"
on storage.objects for insert
with check (bucket_id = 'grid-images');

drop policy if exists "Allow public update access to grid images" on storage.objects;
create policy "Allow public update access to grid images"
on storage.objects for update
using (bucket_id = 'grid-images')
with check (bucket_id = 'grid-images');

drop policy if exists "Allow public delete access to grid images" on storage.objects;
create policy "Allow public delete access to grid images"
on storage.objects for delete
using (bucket_id = 'grid-images');
