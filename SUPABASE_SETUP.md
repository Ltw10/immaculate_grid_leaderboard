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

## Step 2: Set Up the Database Table

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy and paste the contents of `supabase_setup.sql` into the editor
4. Click "Run" (or press Ctrl/Cmd + Enter)
5. You should see "Success. No rows returned"

This will create:

- A `scores` table with columns: `id`, `player_name`, `grid_date`, `score`
- Indexes for faster queries
- Row Level Security (RLS) policies that allow public read/write access
- Automatic timestamp tracking

## Step 3: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Project Settings** → **Data API & API Keys** (left sidebar)
2. You'll find:
   - **Project URL**: Copy this (looks like `https://xxxxx.supabase.co`)
   - **Publishable Key**: Copy this (starts with `eyJ...`)

## Step 4: Configure the App

1. Open `js/storage.js`
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
   const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
   ```
3. With your actual values:
   ```javascript
   const SUPABASE_URL = "https://xxxxx.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
   ```
4. Save the file

## Step 5: Test the Setup

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

- Make sure you ran the SQL setup script (`supabase_setup.sql`)
- Verify that Row Level Security policies were created
- Check the Supabase dashboard → Authentication → Policies

### Scores Not Appearing

- Check the browser console (F12) for error messages
- Verify the table was created: Go to Supabase → Table Editor → `scores` table
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
