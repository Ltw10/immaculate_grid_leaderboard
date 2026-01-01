# Immaculate Grid Tracker

A web application to track and compare Immaculate Grid scores with friends. Data is stored in Supabase so everyone can see the same leaderboard!

## Features

- 📊 Leaderboard showing players ranked by average score
- 📅 Track scores by date
- 📈 Individual player statistics and history
- 💾 Persistent data storage using Supabase
- 🔄 Real-time data syncing across all users
- 📱 Mobile-friendly responsive design

## File Structure

```
immaculate-grid-tracker/
├── index.html          # Main HTML file
├── js/
│   ├── app.js         # Main React component
│   ├── storage.js     # Supabase API integration
│   └── icons.js       # SVG icon components
├── supabase_setup.sql # Database setup script
├── SUPABASE_SETUP.md  # Detailed Supabase setup guide
└── README.md          # This file
```

## Quick Start

### Step 1: Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the `supabase_setup.sql` script
4. Get your credentials from **Project Settings** → **Data API & API Keys**:
   - Project URL
   - Publishable Key

For detailed instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

### Step 2: Configure the App

1. Open `js/storage.js`
2. Replace the placeholder values with your Supabase credentials:
   ```javascript
   const SUPABASE_URL = "https://xxxxx.supabase.co";
   const SUPABASE_ANON_KEY = "your-publishable-key-here";
   ```

### Step 3: Run Locally

**Using Python:**

```bash
python -m http.server 8000
```

**Using Node.js (http-server):**

```bash
npx http-server
```

Then open `http://localhost:8000` in your browser.

### Step 4: Deploy (Optional)

1. Create a new repository on GitHub
2. Upload your files maintaining the structure above
3. Go to repository **Settings** → **Pages**
4. Under **Source**, select:
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
5. Click **Save**
6. Your site will be available at: `https://[your-username].github.io/[repository-name]/`

## How to Use

1. **Add Score**: Click the "Add Score" button to enter a player's name, date, and score (0-900)
2. **View Leaderboard**: See all players ranked by their average score
3. **Refresh Data**: Click the "Refresh" button to fetch the latest scores from Supabase
4. **View Player Details**: Click on any player to see their complete score history
5. **Delete Scores**: In the player detail view, you can delete individual scores

## Data Storage

All data is stored in your Supabase database, which means:

- ✅ Data is shared across all users
- ✅ Everyone sees the same leaderboard in real-time (after refresh)
- ✅ You can view and edit data directly in Supabase dashboard
- ✅ Data persists forever (backed by Supabase)
- ✅ Automatic timestamps for created_at and updated_at

## Troubleshooting

### "Failed to fetch" Error

- Verify your `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `js/storage.js` are correct
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

## Local Development

To test locally:

**Using Python:**

```bash
python -m http.server 8000
```

**Using Node.js (http-server):**

```bash
npx http-server
```

Then open `http://localhost:8000` in your browser.

**Note:** The app will connect to your live Supabase database even when testing locally.

## Browser Compatibility

Works in all modern browsers that support:

- ES6 JavaScript
- React 18
- Fetch API

## Privacy & Security

- The current setup allows **anyone** to read, write, update, and delete scores
- This is fine for a personal/friends leaderboard
- If you want to add authentication or restrict access, you'll need to:
  - Modify the RLS policies in Supabase
  - Implement authentication in the app
  - Use authenticated API keys instead of the anon key

## License

Free to use and modify for personal use.

## Support

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Verify your Supabase project is properly set up
3. Make sure the SUPABASE_URL and SUPABASE_ANON_KEY are correctly set in `js/storage.js`
4. Review the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) guide for detailed setup instructions
