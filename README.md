# June Lorian — Your Garden

A companion web app for the June Lorian ADHD music YouTube channel. Collect flowers for every focus session you complete.

## Setup Instructions

### 1. Configure Google Sheets

1. Create a new Google Sheet with the following columns:
   - `spell` - The secret spell from your video
   - `flower_label` - Short name for the flower
   - `flower_image_url` - Public URL to your sticker image
   - `video_title` - Title of the associated YouTube video

2. Example data:
   ```
   spell,flower_label,flower_image_url,video_title
   first step taken,first step,https://drive.google.com/uc?id=YOUR_FILE_ID,Getting Started with Focus
   the spell is cast,spell cast,https://drive.google.com/uc?id=YOUR_FILE_ID,Deep Work Session
   the night was mine,night owl,https://drive.google.com/uc?id=YOUR_FILE_ID,Night Focus Music
   ```

3. Publish the sheet as CSV:
   - File → Share → Publish to web
   - Choose "Comma-separated values (.csv)"
   - Copy the published URL

4. Update `app.js`:
   - Replace `YOUR_GOOGLE_SHEET_CSV_URL_HERE` with your CSV URL

### 2. Create Icons

Create two PNG icons for PWA:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)
- `favicon.png` (32x32 pixels)

Use the app's color scheme (#B8D8D8 background, #C8394A accent).

### 3. Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to deploy your app.

Alternatively, connect your GitHub repo to Vercel for automatic deployments.

## Features

- ✨ Collect unique flowers by entering spells from YouTube videos
- 💾 All data stored locally (no account needed)
- 📱 PWA support (add to home screen)
- 🎨 Beautiful, calming design
- 🌸 Custom sticker images from Google Sheets

## How It Works

1. Watch a June Lorian video
2. Note the spell at the end
3. Enter the spell in the app
4. Add a memory of what you accomplished
5. Watch your flower bloom in your garden

## Technical Details

- Pure frontend (HTML, CSS, JavaScript)
- No backend required
- Data stored in localStorage
- Google Sheets as CMS
- PWA with service worker
- Mobile-first responsive design

## License

© June Lorian. All rights reserved.
