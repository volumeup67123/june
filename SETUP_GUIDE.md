# Setup Guide for June Lorian Garden

## Step 1: Set Up Google Sheets

### Create Your Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "June Lorian Garden Spells"

### Add Column Headers (Row 1)

```
spell | flower_label | flower_image_url | video_title
```

### Add Your Spells (Starting from Row 2)

Example:
```
first step taken | first step | https://drive.google.com/uc?id=YOUR_FILE_ID_1 | Getting Started with Focus
the spell is cast | spell cast | https://drive.google.com/uc?id=YOUR_FILE_ID_2 | Deep Work Session
the night was mine | night owl | https://drive.google.com/uc?id=YOUR_FILE_ID_3 | Night Focus Music
something was made | creator | https://drive.google.com/uc?id=YOUR_FILE_ID_4 | Creative Flow State
i showed up | showed up | https://drive.google.com/uc?id=YOUR_FILE_ID_5 | Consistency Matters
stars aligned | stars | https://drive.google.com/uc?id=YOUR_FILE_ID_6 | Perfect Timing
the work is done | work done | https://drive.google.com/uc?id=YOUR_FILE_ID_7 | Task Completion
```

### How to Get Google Drive Image URLs

1. Upload your sticker image to Google Drive
2. Right-click the file → **Share** → Change to **"Anyone with the link"**
3. Copy the share link (looks like: `https://drive.google.com/file/d/FILE_ID/view`)
4. Extract the FILE_ID from the URL
5. Use this format in your sheet: `https://drive.google.com/uc?id=FILE_ID`

**Tip:** The `uc?id=` format gives you a direct image URL that works in `<img>` tags.

### Publish as CSV

1. Click **File** → **Share** → **Publish to web**
2. In the dropdown, select your sheet (usually "Sheet1")
3. Change format from "Web page" to **"Comma-separated values (.csv)"**
4. Click **Publish**
5. Copy the URL (it will look like: `https://docs.google.com/spreadsheets/d/e/...`)

### Update app.js

1. Open `app.js`
2. Find line 2: `const GOOGLE_SHEET_CSV_URL = 'YOUR_GOOGLE_SHEET_CSV_URL_HERE';`
3. Replace with your CSV URL:
   ```javascript
   const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?output=csv';
   ```

## Step 2: Create Icons

You need 3 icon files. You can use any design tool (Figma, Canva, Photoshop):

### Design Guidelines
- Background: #B8D8D8 (ice blue)
- Accent: #C8394A (red)
- Consider using a simple flower or "JL" monogram

### Required Files
- `icon-192.png` - 192x192 pixels
- `icon-512.png` - 512x512 pixels  
- `favicon.png` - 32x32 pixels

Place these files in the root directory.

### Quick Option
Use a placeholder generator like [favicon.io](https://favicon.io) or create simple colored squares for testing.

## Step 3: Test Locally

1. Open `index.html` in a browser
2. Try entering a spell from your Google Sheet
3. Check if the flower appears

**Note:** Some browsers block local file access. Use a local server:

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have npx)
npx serve
```

Then visit `http://localhost:8000`

## Step 4: Deploy to Vercel

### Option A: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow prompts (press Enter to accept defaults)

5. Your app is live! Vercel will give you a URL.

### Option B: Using GitHub + Vercel Dashboard

1. Create a GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. Go to [vercel.com](https://vercel.com)
4. Click "New Project"
5. Import your GitHub repository
6. Click "Deploy"

## Step 5: Test PWA Features

### On Mobile (iOS)
1. Open your deployed URL in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. The app will appear as an icon on your home screen

### On Mobile (Android)
1. Open your deployed URL in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home Screen"
4. The app will appear as an icon

### On Desktop
1. Open your deployed URL in Chrome
2. Look for the install icon in the address bar
3. Click to install

## Step 6: Add Spells to Your Videos

In your YouTube video descriptions or end screens, include:

```
🌸 Collect your flower: [YOUR_VERCEL_URL]
Today's spell: "first step taken"
```

## Updating Spells

Just edit your Google Sheet! The app will:
- Check for updates every hour
- Cache spells for offline use
- Automatically load new spells

No code changes needed.

## Troubleshooting

### Spells not loading
- Check your Google Sheet is published as CSV
- Verify the URL in `app.js` is correct
- Check browser console for errors (F12)

### Icons not showing
- Make sure icon files are in the root directory
- Check file names match exactly: `icon-192.png`, `icon-512.png`, `favicon.png`

### PWA not installing
- Must be served over HTTPS (Vercel does this automatically)
- Check `manifest.json` is accessible at `/manifest.json`
- Check service worker is registered (browser console)

## Need Help?

Check the browser console (F12) for error messages. Most issues are:
1. Wrong Google Sheets URL
2. Missing icon files
3. Typos in spell names

Good luck with your garden! 🌸
