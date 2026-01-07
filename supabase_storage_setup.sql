-- Supabase Storage setup for grid images
-- Run this SQL in your Supabase SQL Editor after setting up the scores table

-- Create a storage bucket for grid images
INSERT INTO storage.buckets (id, name, public)
VALUES ('grid-images', 'grid-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create a policy that allows anyone to read images
CREATE POLICY "Allow public read access to grid images"
ON storage.objects FOR SELECT
USING (bucket_id = 'grid-images');

-- Create a policy that allows anyone to upload images
CREATE POLICY "Allow public upload access to grid images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'grid-images');

-- Create a policy that allows anyone to update images
CREATE POLICY "Allow public update access to grid images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'grid-images')
WITH CHECK (bucket_id = 'grid-images');

-- Create a policy that allows anyone to delete images
CREATE POLICY "Allow public delete access to grid images"
ON storage.objects FOR DELETE
USING (bucket_id = 'grid-images');

