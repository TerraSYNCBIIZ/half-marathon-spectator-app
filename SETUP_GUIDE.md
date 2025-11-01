# 🎯 Complete Setup Guide

## What You've Got

A fully functional Half Marathon Spectator App with:
- ✅ Interactive map with race route
- ✅ Detailed spectator spot guides
- ✅ Timing calculator
- ✅ Race information page
- ✅ Mobile-responsive design
- ✅ Beautiful, modern UI

## Quick Start (5 minutes)

### 1. Install & Run

```bash
cd half-marathon-spectator-app
npm install
npm run dev
```

Open your browser to the URL shown (usually http://localhost:5173)

### 2. Customize Your Race

Edit `src/data/raceData.ts`:

**Update Basic Info:**
```typescript
export const raceInfo: RaceInfo = {
  name: "YOUR RACE NAME",           // e.g., "Thunder Road Half Marathon"
  date: "2025-12-06",                // YYYY-MM-DD format
  startTime: "07:30 AM",             // Race start time
  distance: 13.1,                    // Keep as 13.1 for half marathon
  location: "Charlotte, NC",         // City, State
  route: [/* coordinates */]         // We'll add these next
};
```

### 3. Add Your Spectator Spots

From your Google Maps link, add each viewing location:

```typescript
{
  id: "spot-1",                      // Unique ID
  name: "Freedom Park",              // Location name
  mileMarker: 6,                     // Mile number
  coordinates: { 
    lat: 35.1950,                    // From Google Maps
    lng: -80.8300 
  },
  description: "Beautiful park...",  // Why this spot is good
  parking: "Park lot on East Blvd",  // Where to park
  accessibility: "Paved paths",      // Accessibility info
  amenities: ["Restrooms", "Food"],  // What's available
  photoOps: ["Lake", "Fountain"],    // Photo opportunities
  crowdLevel: "high",                // low/medium/high
  tips: ["Arrive early"],            // Helpful tips
  travelTimeFromPrevious: 10         // Drive time from last spot
}
```

### 4. Test Everything

- Click through all pages
- Check map markers appear correctly
- Test timing calculator
- Verify "Get Directions" links work

## Detailed Customization

### Getting Coordinates from Google Maps

**Method 1: Right-click method**
1. Open Google Maps
2. Right-click on location
3. Click "What's here?"
4. Copy coordinates (e.g., `35.2271, -80.8431`)

**Method 2: From URL**
- Your URL contains: `ll=35.20119747473279,-80.84369682892324`
- Use these as reference points

**Method 3: Search address**
1. Search for address in Google Maps
2. URL will show coordinates
3. Copy from URL bar

### Adding the Race Route

The route is a line connecting points along the course:

```typescript
route: [
  { lat: 35.2271, lng: -80.8431 },  // Mile 0 - Start
  { lat: 35.2300, lng: -80.8400 },  // Mile 1
  { lat: 35.2350, lng: -80.8350 },  // Mile 2
  // ... add points every 1-2 miles
  { lat: 35.2271, lng: -80.8431 },  // Mile 13.1 - Finish
]
```

**Tips:**
- Add 10-15 points minimum
- More points = smoother line
- Follow actual race route
- Start and finish can be same location

### Customizing Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eef2ff',   // Lightest
    500: '#6366f1',  // Main color
    600: '#4f46e5',  // Hover state
    700: '#4338ca',  // Active state
  },
  runner: {
    orange: '#f97316',  // Accent color 1
    yellow: '#fbbf24',  // Accent color 2
  }
}
```

### Adding More Spectator Spots

Copy this template for each new spot:

```typescript
{
  id: "spot-X",  // Change X to unique number
  name: "Location Name",
  mileMarker: 0,  // Mile number
  coordinates: { lat: 0, lng: 0 },  // Update with real coords
  description: "Why this spot is great",
  parking: "Where to park",
  accessibility: "Accessibility details",
  amenities: ["Amenity 1", "Amenity 2"],
  photoOps: ["Photo spot 1", "Photo spot 2"],
  crowdLevel: "medium",  // low/medium/high
  tips: [
    "Tip 1",
    "Tip 2"
  ],
  travelTimeFromPrevious: 0  // Minutes to drive here
},
```

## Race Day Preparation

### 1 Week Before
- [ ] Finalize all spectator spots
- [ ] Add actual route coordinates
- [ ] Test app on mobile device
- [ ] Share link with family/friends
- [ ] Check parking restrictions

### Day Before
- [ ] Check weather forecast
- [ ] Plan your spectator route
- [ ] Calculate timing for your runner's pace
- [ ] Charge all devices
- [ ] Make signs

### Race Morning
- [ ] Load app on phone
- [ ] Save to home screen for quick access
- [ ] Have backup: screenshot key info
- [ ] Arrive early at first spot

## Deployment Options

### Option 1: Vercel (Easiest, Free)

```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts. You'll get a URL like: `your-app.vercel.app`

### Option 2: Netlify

```bash
npm run build
```

Drag the `dist` folder to: https://app.netlify.com/drop

### Option 3: GitHub Pages

1. Push to GitHub repository
2. Go to Settings → Pages
3. Select branch and /dist folder
4. Save

### Sharing the App

Once deployed, you get a URL. Share it via:
- Text message
- Email
- QR code (generate at qr-code-generator.com)
- Social media
- Family group chat

## Tips for Success

### 📍 Location Planning
- Research spots in advance
- Drive the route before race day
- Consider traffic patterns
- Have a backup plan

### ⏱️ Timing Strategy
- Add 10-15 min buffer to calculator times
- Runners slow down in later miles
- Traffic delays are common
- Start/finish areas are busiest

### 📱 Tech Setup
- Install as PWA (Add to Home Screen)
- Download offline maps
- Bring portable charger
- Have phone numbers saved

### 👥 Group Coordination
- Share the app link beforehand
- Assign spots to different people
- Set up group chat
- Establish meeting points

## Troubleshooting

**Map not showing?**
- Check coordinates are correct format
- Verify latitude ~35.2, longitude ~-80.8 for Charlotte
- Make sure route array has at least 2 points

**Markers in wrong place?**
- Verify lat/lng not swapped
- Check negative sign on longitude (west = negative)
- Use Google Maps to verify coordinates

**Timing seems off?**
- Adjust pace in calculator
- Remember: 10 min/mile is ~2:11 finish time
- Add slowdown factor for realistic times

**App won't install?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Update Node.js to latest version
- Check for typos in config files

## Support & Updates

### Making Changes
1. Edit files in `src/` folder
2. Save - app updates automatically
3. Test changes in browser
4. Rebuild for production: `npm run build`

### Version Control
```bash
git init
git add .
git commit -m "Initial setup"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Future Races
- Duplicate the folder
- Update race data
- Keep the original for next year!

## Example: Complete Charlotte Race

See `GOOGLE_MAPS_INTEGRATION.md` for detailed Charlotte-specific setup using your Google Maps data.

## Final Checklist

Before race day:
- [ ] All spectator spots added with coordinates
- [ ] Race route displayed on map
- [ ] Timing calculator tested with expected pace
- [ ] Parking info verified for each spot
- [ ] Amenities and tips added
- [ ] Travel times calculated
- [ ] Weather info updated
- [ ] App tested on mobile
- [ ] Link shared with spectators
- [ ] Backup screenshots taken

## You're Ready! 🎉

Your app is built and ready to make spectating easier and more fun. Have an amazing race day!

---

**Need Help?**
- Check README.md for technical details
- See GOOGLE_MAPS_INTEGRATION.md for coordinate extraction
- Review raceData.ts for examples

