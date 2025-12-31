# Immaculate Grid Tracker

A web application to track and compare Immaculate Grid scores with friends. Data is stored in Google Sheets so everyone can see the same leaderboard!

## Features

- 📊 Leaderboard showing players ranked by average score
- 📅 Track scores by date
- 📈 Individual player statistics and history
- 💾 Persistent data storage using Google Sheets
- 🔄 Real-time data syncing across all users
- 📱 Mobile-friendly responsive design

## File Structure

```
immaculate-grid-tracker/
├── index.html          # Main HTML file
├── js/
│   ├── app.js         # Main React component
│   ├── storage.js     # Google Sheets API integration
│   └── icons.js       # SVG icon components
└── README.md          # This file
```

## Setup Instructions

### Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "Immaculate Grid Scores"
3. In Row 1, add these headers:
   - A1: `Name`
   - B1: `Date`
   - C1: `Score`

### Step 2: Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste the following code:

```javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();

  // Skip header row and convert to array of objects
  const scores = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      // Only include rows with a name
      scores.push({
        name: data[i][0],
        date: data[i][1],
        score: data[i][2],
      });
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ scores: scores })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    if (data.action === "add") {
      // Add a new score
      sheet.appendRow([data.name, data.date, data.score]);
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, message: "Score added" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === "delete") {
      // Delete a score
      const allData = sheet.getDataRange().getValues();
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][0] === data.name && allData[i][1] === data.date) {
          sheet.deleteRow(i + 1);
          return ContentService.createTextOutput(
            JSON.stringify({ success: true, message: "Score deleted" })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, message: "Score not found" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === "update") {
      // Update an existing score
      const allData = sheet.getDataRange().getValues();
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][0] === data.name && allData[i][1] === data.date) {
          sheet.getRange(i + 1, 3).setValue(data.score);
          return ContentService.createTextOutput(
            JSON.stringify({ success: true, message: "Score updated" })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }
      // If not found, add it
      sheet.appendRow([data.name, data.date, data.score]);
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, message: "Score added" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: "Unknown action" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. **Save the script** (Ctrl+S or Cmd+S)
5. **Deploy the script:**
   - Click **Deploy** → **New deployment**
   - Click the gear icon next to "Select type" → Choose **Web app**
   - Settings:
     - Description: "Immaculate Grid API"
     - Execute as: **Me**
     - Who has access: **Anyone**
   - Click **Deploy**
   - You'll be asked to authorize - click **Authorize access**
   - On the warning screen, click **Advanced** → **Go to [project name] (unsafe)**
   - Click **Allow**
6. **Copy the Web App URL** (it ends with `/exec`)

### Step 3: Configure Your App

1. Open `js/storage.js`
2. Find this line:
   ```javascript
   const SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE";
   ```
3. Replace it with your actual Web App URL:
   ```javascript
   const SCRIPT_URL = "https://script.google.com/macros/s/YOUR_ID_HERE/exec";
   ```
4. Save the file

### Step 4: Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Upload your files maintaining this structure:
   ```
   your-repo/
   ├── index.html
   └── js/
       ├── app.js
       ├── storage.js
       └── icons.js
   ```
3. Go to repository **Settings** → **Pages**
4. Under **Source**, select:
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
5. Click **Save**
6. Your site will be available at: `https://[your-username].github.io/[repository-name]/`

## How to Use

1. **Add Score**: Click the "Add Score" button to enter a player's name, date, and score (0-900)
2. **View Leaderboard**: See all players ranked by their average score
3. **Refresh Data**: Click the "Refresh" button to fetch the latest scores from Google Sheets
4. **View Player Details**: Click on any player to see their complete score history
5. **Delete Scores**: In the player detail view, you can delete individual scores

## Data Storage

All data is stored in your Google Sheet, which means:

- ✅ Data is shared across all users
- ✅ Everyone sees the same leaderboard in real-time (after refresh)
- ✅ You can view and edit data directly in Google Sheets
- ✅ Data persists forever (backed by Google)
- ✅ You can manually add/edit scores in the spreadsheet

## Troubleshooting

### "Failed to load data" Error

- Check that your `SCRIPT_URL` in `js/storage.js` is correct
- Make sure it ends with `/exec` not `/edit`
- Verify the Apps Script is deployed as "Anyone" can access

### "Too many redirects" in Apps Script

- Sign out of all Google accounts
- Sign back in to only the account that owns the sheet
- Try using Chrome profiles or Incognito mode with one account

### Scores not saving

- Check the browser console (F12) for error messages
- Verify the Apps Script has proper permissions
- Make sure the Google Sheet has headers in row 1: Name, Date, Score

### Multiple Google Accounts Issue

- Use account-specific URLs: Add `/u/0/` after `google.com` in your sheet URL
- Example: `https://docs.google.com/spreadsheets/u/0/d/YOUR_SHEET_ID/edit`
- Or use Chrome profiles to separate accounts

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

**Note:** The app will still connect to your live Google Sheet even when testing locally.

## Browser Compatibility

Works in all modern browsers that support:

- ES6 JavaScript
- React 18
- Fetch API

## Privacy & Security

- The Google Apps Script is deployed as "Anyone" can access, meaning anyone with the URL can read/write data
- No authentication is built in - anyone can add or delete scores
- Consider this when sharing the app publicly
- You can view all data directly in your Google Sheet

## License

Free to use and modify for personal use.

## Support

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Verify your Google Apps Script is properly deployed
3. Make sure the SCRIPT_URL is correctly set in `js/storage.js`
4. Test by manually adding a row to your Google Sheet and clicking "Refresh"
