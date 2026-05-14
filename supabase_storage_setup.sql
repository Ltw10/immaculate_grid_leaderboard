-- Grid image storage (Supabase platform schema: storage.* cannot be moved into immaculate_grid;
-- buckets and object RLS policies must live under storage.* per Supabase Storage.)
-- Run after immaculate_grid scores exist, or use supabase_setup.sql / supabase_migrate_public_to_immaculate_grid.sql
-- which already include this block.

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
