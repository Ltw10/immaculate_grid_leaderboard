# Immaculate Grid Tracker

A web application to track and compare Immaculate Grid scores with friends.

## Features

- 📊 Leaderboard showing players ranked by average score
- 📅 Track scores by date
- 📈 Individual player statistics and history
- 💾 Persistent data storage using browser localStorage
- 📱 Mobile-friendly responsive design

## File Structure

```
immaculate-grid-tracker/
├── index.html          # Main HTML file
├── js/
│   ├── app.js         # Main React component
│   ├── storage.js     # Storage utilities
│   └── icons.js       # SVG icon components
└── README.md          # This file
```

## Deployment to GitHub Pages

### Step 1: Create Repository Structure

1. Create a new repository on GitHub
2. Create the following folder structure in your repository:
   ```
   immaculate-grid-tracker/
   ├── index.html
   └── js/
       ├── app.js
       ├── storage.js
       └── icons.js
   ```

### Step 2: Upload Files

Upload each file to its corresponding location:

- `index.html` goes in the root directory
- All `.js` files go in the `js/` folder

### Step 3: Enable GitHub Pages

1. Go to your repository settings
2. Navigate to **Pages** (in the left sidebar)
3. Under **Source**, select:
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
4. Click **Save**

### Step 4: Access Your Site

Your site will be available at:

```
https://[your-username].github.io/[repository-name]/
```

It may take a few minutes for the site to become available after enabling GitHub Pages.

## Local Development

To test locally, you can use any simple HTTP server:

**Using Python:**

```bash
python -m http.server 8000
```

**Using Node.js (http-server):**

```bash
npx http-server
```

Then open `http://localhost:8000` in your browser.

## How to Use

1. **Add Score**: Click the "Add Score" button to enter a player's name, date, and score (0-900)
2. **View Leaderboard**: See all players ranked by their average score
3. **View Player Details**: Click on any player to see their complete score history
4. **Delete Scores**: In the player detail view, you can delete individual scores

## Data Storage

All data is stored locally in your browser using localStorage. This means:

- Data persists between sessions
- Data is private to your browser
- Clearing browser data will delete all scores
- Each browser/device maintains separate data

## Browser Compatibility

Works in all modern browsers that support:

- ES6 JavaScript
- React 18
- localStorage API

## License

Free to use and modify for personal use.
