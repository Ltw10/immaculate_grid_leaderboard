# Supabase Setup Guide

This guide will help you set up Supabase as the backend for the Immaculate Grid Tracker.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Immaculate Grid Tracker (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to you
4. Click "Create new project" and wait for it to be set up (takes ~2 minutes)

## Step 2: Expose the app schema (required for REST)

Leaderboard tables live in the **`immaculate_grid`** schema (not `public`) so they stay separate from other projects sharing the same database.

1. In the Supabase dashboard go to **Project Settings** → **Data API**
2. Under **Exposed schemas**, add **`immaculate_grid`** (keep `public` if you use it elsewhere)
3. Save

## Step 3: Set Up the Database Table

**New project (empty database):**

1. Go to **SQL Editor** → New query
2. Paste and run `supabase_setup.sql`
3. You should see "Success. No rows returned"

**Already have `public.scores` with data:** do **not** run `supabase_setup.sql` (it would create a second table). Instead:

1. Complete **Step 2** above first
2. Run `supabase_migrate_public_to_immaculate_grid.sql` once. That moves `public.scores` into `immaculate_grid` with `ALTER TABLE ... SET SCHEMA` so all existing rows stay safe

This creates:

- Schema **`immaculate_grid`** with table **`scores`** (`id`, `player_name`, `grid_date`, `score`, `image_url`, timestamps), indexes, RLS policies, and the **`updated_at`** trigger
- **`storage`** bucket **`grid-images`** and its RLS policies (Supabase requires these to live in the `storage` schema; they cannot be moved into `immaculate_grid`)

## Step 4: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Project Settings** → **Data API & API Keys** (left sidebar)
2. You'll find:
   - **Project URL**: Copy this (looks like `https://xxxxx.supabase.co`)
   - **Publishable Key**: Copy this (starts with `eyJ...`)

## Step 5: Configure the App

1. Open `js/storage.js`
2. Set your project values (keep `SUPABASE_DB_SCHEMA` identical to the Postgres schema name and to an entry in **Exposed schemas**):
   ```javascript
   const SUPABASE_URL = "https://xxxxx.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
   const SUPABASE_DB_SCHEMA = "immaculate_grid";
   ```
3. Save the file

## Step 6: Test the Setup

1. Open your app in a browser
2. Try adding a score using the "Add Score" button
3. Check the browser console (F12) for any errors
4. If successful, you should see the score appear in the leaderboard

## Troubleshooting

### "Failed to fetch" Error

- Verify your `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Make sure you copied the full URL (including `https://`)
- Check that your Supabase project is active

### "permission denied" Error

- Make sure you ran `supabase_setup.sql` (new project) or `supabase_migrate_public_to_immaculate_grid.sql` (existing `public.scores`)
- Confirm **`immaculate_grid`** is listed under **Exposed schemas** (Project Settings → Data API)
- Verify that Row Level Security policies were created
- Check the Supabase dashboard → Authentication → Policies

### "schema must be one of" / empty REST response

- Add **`immaculate_grid`** to **Exposed schemas** and save, then retry the app

### Scores Not Appearing

- Check the browser console (F12) for error messages
- Verify the table: **Table Editor** → schema **`immaculate_grid`** → **`scores`**
- Make sure the SQL script ran successfully

### CORS Errors

- Supabase handles CORS automatically, so this shouldn't be an issue
- If you see CORS errors, check that you're using the correct URL format

## Security Note

The current setup allows **anyone** to read, write, update, and delete scores. This is fine for a personal/friends leaderboard, but if you want to add authentication or restrict access, you'll need to:

1. Modify the RLS policies in Supabase
2. Implement authentication in the app
3. Use authenticated API keys instead of the anon key

For now, the public access setup is perfect for a shared leaderboard among friends!
