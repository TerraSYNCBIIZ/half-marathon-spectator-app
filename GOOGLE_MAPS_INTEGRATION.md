# 🗺️ Google Maps Integration Guide

This guide explains how to extract data from your Google Maps link and integrate it into the app.

## Getting Data from Your Google Maps

Your Google Maps link: `https://www.google.com/maps/d/u/0/edit?mid=1mWKdMgo0ZO9FbnjfAmSkNwoHJqUGM84&ll=35.20119747473279%2C-80.84369682892324&z=14`

### Step 1: Access Your Map

1. Open the Google Maps link in your browser
2. Sign in if prompted
3. You'll see your custom map with markers and routes

### Step 2: Export Map Data

**Option A: Manual Method**
1. Click on each marker/location
2. Note the name and any descriptions
3. Right-click the marker → "What's here?"
4. Copy the coordinates shown at the bottom

**Option B: KML Export**
1. In your Google My Maps, click the menu (⋮)
2. Select "Export to KML/KMZ"
3. Download the file
4. Open it in a text editor to extract coordinates

### Step 3: Add to raceData.ts

#### Update Race Route

Look for the `route` array in `src/data/raceData.ts`:

```typescript
route: [
  { lat: 35.2271, lng: -80.8431 },  // Start
  { lat: 35.2350, lng: -80.8400 },  // Point 1
  { lat: 35.1950, lng: -80.8300 },  // Point 2
  // Add more points following the route
  { lat: 35.2271, lng: -80.8431 },  // Finish
]
```

**Tips:**
- Add points every 0.5-1 mile for smooth curves
- More points = more accurate route display
- First and last points should be start/finish

#### Update Spectator Spots

Update the `spectatorSpots` array:

```typescript
{
  id: "spot-1",
  name: "Mile 3 - Plaza Midwood",  // From your map marker
  mileMarker: 3,
  coordinates: { 
    lat: 35.2100,  // From Google Maps
    lng: -80.8150 
  },
  description: "Great neighborhood spot with local cafes",
  parking: "Street parking on Central Ave",
  accessibility: "Sidewalks available",
  amenities: ["Coffee shops", "Restrooms", "Food"],
  photoOps: ["Neighborhood murals", "Historic buildings"],
  crowdLevel: "medium",
  tips: [
    "Arrive 30 minutes early",
    "Park on side streets",
    "Bring cash for coffee"
  ],
  travelTimeFromPrevious: 8  // Drive time in minutes
}
```

### Step 4: Finding Coordinates

**From Google Maps Web:**
1. Right-click any location
2. Click "What's here?"
3. Coordinates appear at bottom
4. Format: `35.2271, -80.8431` → `{ lat: 35.2271, lng: -80.8431 }`

**From Map URL:**
Your URL contains: `ll=35.20119747473279%2C-80.84369682892324`
- This is the center point of your map
- Use this to verify your data is correct

### Step 5: Estimate Mile Markers

If not marked on your map:
1. Use Google Maps "Measure distance" tool
2. Right-click on route → "Measure distance"
3. Click along the route to measure
4. Note distances at each spectator spot

### Step 6: Travel Times

Calculate drive times between spots:
1. In Google Maps, get directions from Spot A to Spot B
2. Note the driving time
3. Add to `travelTimeFromPrevious` field
4. This helps spectators plan multi-spot viewing

## Real Example from Charlotte

Based on your map location (Charlotte, NC area), here's a sample spot:

```typescript
{
  id: "spot-freedom-park",
  name: "Freedom Park",
  mileMarker: 6,
  coordinates: { 
    lat: 35.1950, 
    lng: -80.8300 
  },
  description: "Beautiful park setting, one of the most scenic spots",
  parking: "Freedom Park lot on East Boulevard - arrive early",
  accessibility: "Paved paths throughout park",
  amenities: ["Restrooms", "Playground", "Water fountains", "Picnic areas"],
  photoOps: ["Lake backdrop", "Park fountain", "Greenery"],
  crowdLevel: "high",
  tips: [
    "Popular spot - arrive 45 min early",
    "Great for families",
    "Can see runners multiple times on loop",
    "Bring picnic blanket"
  ],
  travelTimeFromPrevious: 10
}
```

## Quick Update Checklist

- [ ] Update `raceInfo.name` with actual race name
- [ ] Update `raceInfo.date` with race date
- [ ] Update `raceInfo.startTime` with actual start time
- [ ] Add all spectator spot coordinates from your map
- [ ] Add route coordinates (at least 10-15 points)
- [ ] Verify all coordinates are in Charlotte area (lat ~35.2, lng ~-80.8)
- [ ] Calculate travel times between spots
- [ ] Add parking details for each spot
- [ ] Add local tips and amenities

## Testing Your Data

After updating:
1. Run `npm run dev`
2. Check the Map page - markers should appear in Charlotte
3. Verify route line connects start to finish
4. Test "Get Directions" links from each spot
5. Use Timing Calculator to ensure times make sense

## Pro Tips

🎯 **Accuracy**: Use at least 3 decimal places for coordinates
📍 **Coverage**: Space spots 2-3 miles apart for best spectating
⏱️ **Timing**: Add 5-10 min buffer to travel times for parking
🚗 **Routes**: Test drive routes before race day if possible
📱 **Mobile**: Check map on phone - that's how you'll use it race day

## Need Help?

If you have trouble:
1. Share a screenshot of your Google Map
2. Export the KML file for automated extraction
3. Send list of locations and I can format them

## Next Steps

Once your data is added:
1. Test the app thoroughly
2. Share with other spectators
3. Print a backup copy of key info
4. Enjoy race day! 🎉

