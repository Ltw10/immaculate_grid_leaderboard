# Image Upload Setup Guide

This guide will help you set up image uploads for grid scores.

## Step 1: Update Database Schema

1. Go to your Supabase project → **SQL Editor**
2. Run this SQL to add the `image_url` column to your scores table:

```sql
ALTER TABLE immaculate_grid.scores ADD COLUMN IF NOT EXISTS image_url text;
```

Or if you haven't run the main setup script yet, the updated `supabase_setup.sql` already includes this column.

## Step 2: Set Up Supabase Storage (grid images)

If you already ran **`supabase_setup.sql`** or **`supabase_migrate_public_to_immaculate_grid.sql`**, the **`grid-images`** bucket and `storage.objects` policies are already applied—skip this step.

To add storage only to an existing project that already has **`immaculate_grid.scores`**, run **`supabase_storage_setup.sql`** in the SQL Editor (same content as the storage block at the end of the main setup scripts).

Alternatively, create the bucket and policies manually:

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it `grid-images`
4. Make it **Public**
5. Click **Create bucket**
6. Go to **Policies** tab and create these policies:

**Read Policy:**
- Policy name: "Allow public read access to grid images"
- Allowed operation: SELECT
- Policy definition: `bucket_id = 'grid-images'`

**Upload Policy:**
- Policy name: "Allow public upload access to grid images"
- Allowed operation: INSERT
- Policy definition: `bucket_id = 'grid-images'`

**Update Policy:**
- Policy name: "Allow public update access to grid images"
- Allowed operation: UPDATE
- Policy definition: `bucket_id = 'grid-images'`

**Delete Policy:**
- Policy name: "Allow public delete access to grid images"
- Allowed operation: DELETE
- Policy definition: `bucket_id = 'grid-images'`

## Step 3: How It Works

### Image Storage Rules

- **Top 9 + Current Day**: Users can have images for their top 9 scores (lowest scores) plus today's score
- **Maximum 10 images**: At any time, a user can have at most 10 images
- **Automatic cleanup**: When uploading a new image that exceeds the limit, the worst (highest) score's image is automatically deleted
- **Current day always kept**: Today's score image is always preserved, even if it's not in the top 9

### Using the Feature

1. **View Player History**: Click on any player from the leaderboard
2. **Edit Grid**: Click on any grid entry in the player's history
3. **Upload Image**: In the modal, use the file input to upload a grid image
4. **Edit Score**: You can also update the score value in the same modal
5. **Delete Image**: Click "Delete Image" to remove an uploaded image

### Visual Indicators

- Grid entries with images show a 📷 icon
- Click any grid entry to open the edit modal
- Images are displayed in the modal when available

## Troubleshooting

### Images Not Uploading

- Verify the storage bucket `grid-images` exists and is public
- Check that storage policies are set up correctly
- Check browser console for error messages
- Verify your Supabase credentials in `storage.js`

### "Cannot upload image" Error

- This means the score is not in the user's top 9 and it's not today's score
- Only the 9 best (lowest) scores plus today's score can have images
- Try uploading an image for a better score or wait until tomorrow if it's today's score

### Images Not Displaying

- Check that the storage bucket is set to public
- Verify the image URL is correct in the database
- Check browser console for CORS or loading errors

