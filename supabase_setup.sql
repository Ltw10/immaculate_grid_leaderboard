-- Supabase setup for Immaculate Grid Tracker.
-- Relational objects live in schema immaculate_grid. Storage bucket + object policies are appended
-- at the end; Supabase requires those to remain in the storage.* catalog (not movable to immaculate_grid).
-- Run this SQL in the Supabase SQL Editor for a NEW project (no existing public.scores).
--
-- Before the app can use REST: Dashboard → Project Settings → API → "Exposed schemas"
-- → add: immaculate_grid → Save.

create schema if not exists immaculate_grid;

-- Supabase Data API: expose schema + objects (see https://supabase.com/docs/guides/api/using-custom-schemas)
grant usage on schema immaculate_grid to anon, authenticated, service_role;

create table immaculate_grid.scores (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  score int not null,
  grid_date date not null,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

comment on schema immaculate_grid is 'Immaculate Grid Leaderboard app (scores + trigger).';
comment on table immaculate_grid.scores is 'Leaderboard rows; image_url targets Storage bucket grid-images.';

create index if not exists idx_scores_name_date
  on immaculate_grid.scores (player_name, grid_date);

create index if not exists idx_scores_date
  on immaculate_grid.scores (grid_date desc);

grant select, insert, update, delete on immaculate_grid.scores to anon, authenticated, service_role;

alter table immaculate_grid.scores enable row level security;

create policy "Allow public read access" on immaculate_grid.scores
  for select using (true);

create policy "Allow public insert access" on immaculate_grid.scores
  for insert with check (true);

create policy "Allow public update access" on immaculate_grid.scores
  for update using (true) with check (true);

create policy "Allow public delete access" on immaculate_grid.scores
  for delete using (true);

create or replace function immaculate_grid.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

grant execute on function immaculate_grid.update_updated_at_column() to anon, authenticated, service_role;

create trigger update_scores_updated_at
  before update on immaculate_grid.scores
  for each row
  execute function immaculate_grid.update_updated_at_column();

grant all on all tables in schema immaculate_grid to anon, authenticated, service_role;
grant all on all routines in schema immaculate_grid to anon, authenticated, service_role;
grant all on all sequences in schema immaculate_grid to anon, authenticated, service_role;

alter default privileges for role postgres in schema immaculate_grid
  grant all on tables to anon, authenticated, service_role;
alter default privileges for role postgres in schema immaculate_grid
  grant all on routines to anon, authenticated, service_role;
alter default privileges for role postgres in schema immaculate_grid
  grant all on sequences to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Storage (bucket + policies): required to stay in Supabase `storage` schema.
-- The app uses bucket id `grid-images` (see js/storage.js). Not movable into
-- immaculate_grid; included here so all project DB setup is one script.
-- ---------------------------------------------------------------------------

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
