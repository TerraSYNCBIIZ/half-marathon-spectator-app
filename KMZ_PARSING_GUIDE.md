# KMZ File Parsing Instructions

## ✅ Setup Complete!

I've set up everything for you:

1. ✅ **Google Maps API Key** - Added to `.env` file
2. ✅ **KMZ Parser** - Created utility to parse KMZ files
3. ✅ **Parser Page** - Created a page to parse your KMZ file

## 📋 Next Steps to Parse Your KMZ File:

### Option 1: Use the Parser Page (Easiest)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the parser page:**
   - Navigate to: `http://localhost:5173/parse-kmz`
   - Or go to the app and add `/parse-kmz` to the URL

3. **Upload your KMZ file:**
   - Click "Choose File" 
   - Select `Copy of 2025 Novant Health Charlotte Marathon.kmz`
   - The parser will extract all routes and markers

4. **Copy the route data:**
   - Click "Copy Route Data" button
   - This copies the route coordinates to your clipboard

5. **Update raceData.ts:**
   - Open `src/data/raceData.ts`
   - Find the `route:` array in `raceInfo`
   - Replace it with the copied data
   - Save the file

### Option 2: Manual Parsing (If needed)

If the parser page doesn't work, you can:

1. **Extract the KMZ file manually:**
   - Rename `Copy of 2025 Novant Health Charlotte Marathon.kmz` to `.zip`
   - Extract it with any ZIP tool
   - Find the `.kml` file inside

2. **Open the KML file:**
   - Open the `.kml` file in a text editor
   - Look for `<LineString>` tags (these are routes)
   - Look for `<Point>` tags (these are markers)
   - Copy the coordinates from the `<coordinates>` tags

3. **Update raceData.ts:**
   - Convert coordinates from `lng,lat` format to `{ lat: X, lng: Y }` format
   - Update the route array

## 🔍 What the Parser Extracts:

- **Routes**: All LineString paths from your KMZ file
- **Markers**: All Point markers with their names and coordinates
- **Placemarks**: All placemark data including descriptions

## 📝 After Parsing:

Once you've updated `raceData.ts` with the route data:

1. **Refresh your app** - The map should now show the correct route
2. **Check the map** - Go to `/map` to see your route displayed
3. **Update spectator spots** - You may want to add markers as spectator spots

## 🆘 Troubleshooting:

- **Parser not working?** Make sure `jszip` is installed: `npm install`
- **API key not working?** Check that `.env` file exists and has the key
- **Map not loading?** Check browser console for errors

## 🎯 Quick Test:

After parsing, test everything:
1. Go to `/map` - Should show your route
2. Go to `/plan` - Should show timeline with route data
3. Check Google Maps is loading (not showing error message)

That's it! Your KMZ file will be parsed and ready to use.

