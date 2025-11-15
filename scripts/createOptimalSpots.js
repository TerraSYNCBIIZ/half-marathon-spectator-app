import fs from 'fs';

// Haversine formula
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find closest point on route and calculate exact mile marker
function findClosestRoutePointAndMile(targetLat, targetLng, route, mileMarkers) {
  let closestPoint = null;
  let closestDistance = Infinity;
  let closestIndex = 0;
  
  for (let i = 0; i < route.length; i++) {
    const point = route[i];
    const distance = haversineDistance(targetLat, targetLng, point.lat, point.lng);
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestPoint = point;
      closestIndex = i;
    }
  }
  
  // Calculate cumulative distance
  let cumulativeDistance = 0;
  for (let i = 1; i <= closestIndex; i++) {
    const prev = route[i - 1];
    const curr = route[i];
    cumulativeDistance += haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng);
  }
  
  // Find approximate mile marker
  let approximateMile = 0;
  for (let i = 0; i < mileMarkers.length - 1; i++) {
    if (cumulativeDistance >= mileMarkers[i].cumulativeDistance && 
        cumulativeDistance < mileMarkers[i + 1].cumulativeDistance) {
      const distToCurrent = cumulativeDistance - mileMarkers[i].cumulativeDistance;
      const distBetweenMarkers = mileMarkers[i + 1].cumulativeDistance - mileMarkers[i].cumulativeDistance;
      const ratio = distBetweenMarkers > 0 ? distToCurrent / distBetweenMarkers : 0;
      approximateMile = mileMarkers[i].mile + (mileMarkers[i + 1].mile - mileMarkers[i].mile) * ratio;
      break;
    }
  }
  
  return {
    routePoint: closestPoint,
    distance: closestDistance,
    exactMile: cumulativeDistance,
    approximateMile: approximateMile
  };
}

// Load route data
const routeData = JSON.parse(fs.readFileSync('./route-analysis.json', 'utf-8'));
const route = routeData.fullRoute;
const mileMarkers = routeData.mileMarkers;

// Based on research from runcharlotte.com and other sources - these are the ACTUAL best spots
const optimalSpectatorSpots = [
  {
    name: "Start Line - Romare Bearden Park",
    description: "The starting line! Experience the excitement and energy.",
    researchLocation: "525 S Tryon St / Romare Bearden Park",
    lat: 35.223853, // From KML start line marker
    lng: -80.848008,
    amenities: {
      coffee: ["Not Just Coffee - Packard Place (222 S Church St, 0.1 mi walk)"],
      food: ["Amélie's French Bakery (380 S College St, 0.2 mi walk)"],
      parking: "7th Street Station parking deck or 300 S Tryon St garage"
    },
    whyOptimal: "Official start, great atmosphere, parking available, coffee nearby"
  },
  {
    name: "Mile 2: Fourth Street and Hawthorne Lane",
    description: "Near Novant Health Hospital, ample parking, early race excitement",
    researchLocation: "Fourth St & Hawthorne Ln intersection",
    lat: 35.2143,
    lng: -80.8296,
    amenities: {
      coffee: ["Central Coffee Co. (719 Louise Ave, nearby)", "Sunflour Baking Company (2001 E 7th St, nearby)"],
      food: ["Various breakfast spots"],
      parking: "Ample parking near hospital"
    },
    whyOptimal: "Early race spot, good parking, coffee shops nearby, less crowded than start"
  },
  {
    name: "Miles 6.25-7.34: Queens Road West",
    description: "Wide median, stately trees, historic homes - most beautiful spot on course",
    researchLocation: "Queens Road West near Selwyn Avenue",
    lat: 35.1843,
    lng: -80.8311,
    amenities: {
      coffee: ["Not Just Coffee - Dilworth (1235 East Blvd, 0.5 mi drive)", "Laurel Market (nearby)"],
      food: ["Various options in Myers Park"],
      parking: "Street parking on Queens Road or residential streets"
    },
    whyOptimal: "Most scenic spot, wide viewing area, less crowded, beautiful backdrop"
  },
  {
    name: "Mile 10: East Morehead Street",
    description: "Between S. McDowell and S. Tryon - good for seeing runners before finish push",
    researchLocation: "East Morehead St between S McDowell & S Tryon",
    lat: 35.2117,
    lng: -80.8463,
    amenities: {
      coffee: ["Rhino Market & Deli (nearby)", "Community Matters Café (nearby)"],
      food: ["Various lunch options"],
      parking: "Street parking or nearby lots"
    },
    whyOptimal: "Good mid-race spot, accessible, amenities nearby"
  },
  {
    name: "Mile 12.7: Marathon/Half Split - The Sole Cheer Station",
    description: "Where marathoners and half marathoners split - energetic cheer section",
    researchLocation: "Marathon/Half split point",
    lat: 35.2170,
    lng: -80.8645,
    amenities: {
      coffee: ["Earl's Grocery (nearby)", "Crispy Banh Mi (nearby)"],
      food: ["Food trucks often at cheer station"],
      parking: "Street parking or nearby lots"
    },
    whyOptimal: "Official cheer station, high energy, significant race moment, food vendors"
  },
  {
    name: "Mile 11.5: Not Just Coffee South End Area",
    description: "Near Not Just Coffee at 2000 South Blvd - perfect coffee break spot",
    researchLocation: "Near 2000 South Blvd (Not Just Coffee South End)",
    lat: 35.2100, // Approximate - need exact
    lng: -80.8600, // Approximate - need exact
    amenities: {
      coffee: ["Not Just Coffee - South End (2000 South Blvd, ON ROUTE!)"],
      food: ["Various South End restaurants"],
      parking: "South End parking options"
    },
    whyOptimal: "Coffee shop right on/near route, perfect timing for mid-race break"
  },
  {
    name: "Miles 15-17 & 21-23: North Davidson (NoDa)",
    description: "See runners TWICE from same location! Vibrant arts district",
    researchLocation: "North Davidson St in NoDa neighborhood",
    lat: 35.2415,
    lng: -80.8127,
    amenities: {
      coffee: ["Smelly Cat Coffeehouse (514 E 36th St, nearby)", "Trade and Lore Coffee (3306 N Davidson St)"],
      food: ["Haberdish (3106 N Davidson St)", "Heist Brewery (2909 N Davidson St)"],
      parking: "Street parking in NoDa"
    },
    whyOptimal: "See runners twice without moving! Artsy vibe, great restaurants, perfect for longer break"
  },
  {
    name: "Miles 18 & 20: The Plaza and Mecklenburg Avenue",
    description: "See runners TWICE from same location! Critical support zone",
    researchLocation: "The Plaza & Mecklenburg Ave intersection",
    lat: 35.2340,
    lng: -80.8063,
    amenities: {
      coffee: ["Zada Jane's Corner Café (1601 Central Ave, nearby)", "Common Market Oakwold (nearby)"],
      food: ["Various Plaza Midwood restaurants"],
      parking: "Street parking in Plaza Midwood"
    },
    whyOptimal: "See runners twice! Mile 18 and Mile 20 - critical support moments, great neighborhood"
  },
  {
    name: "Mile 20: The Wall - Critical Support",
    description: "Mile 20 is where runners hit 'The Wall' - MOST IMPORTANT support location",
    researchLocation: "Near mile 20 on route",
    lat: 35.220554, // From mile marker
    lng: -80.810909,
    amenities: {
      coffee: ["Grab coffee on way to finish"],
      food: ["Save appetite for post-race lunch"],
      parking: "Street parking or nearby garages"
    },
    whyOptimal: "CRITICAL support moment - runners need maximum encouragement here"
  },
  {
    name: "Finish Line - 4th Street near Mint Street",
    description: "THE FINISH LINE! Celebrate Rachel's incredible achievement!",
    researchLocation: "4th Street behind Truist Field",
    lat: 35.229100, // From KML finish line marker
    lng: -80.847490,
    amenities: {
      coffee: ["Not Just Coffee nearby"],
      food: ["The King's Kitchen (129 W Trade St, 0.2 mi walk) - PERFECT POST-RACE LUNCH"],
      parking: "Same as start line"
    },
    whyOptimal: "The moment of triumph! Walking distance to lunch spot"
  }
];

console.log('=== OPTIMAL SPECTATOR SPOTS (Based on Research) ===\n');

const finalSpots = optimalSpectatorSpots.map(spot => {
  const result = findClosestRoutePointAndMile(spot.lat, spot.lng, route, mileMarkers);
  return {
    ...spot,
    routeCoordinate: result.routePoint,
    exactMile: result.exactMile,
    approximateMile: result.approximateMile,
    distanceFromRoute: result.distance
  };
}).sort((a, b) => a.approximateMile - b.approximateMile);

// Select 4-5 optimal spots between start and finish
const selectedSpots = [
  finalSpots[0], // Start
  finalSpots[1], // Mile 2
  finalSpots[2], // Mile 6-7 (Queens Road)
  finalSpots[5], // Mile 11.5 (Not Just Coffee South End) - USER MENTIONED THIS!
  finalSpots[6], // Miles 15-17 & 21-23 (NoDa - see twice!)
  finalSpots[8], // Mile 20 (The Wall)
  finalSpots[9]  // Finish
];

console.log('SELECTED OPTIMAL SPOTS (4-5 between start/finish):\n');

selectedSpots.forEach((spot, index) => {
  console.log(`${index + 1}. ${spot.name}`);
  console.log(`   Route Coordinate: ${spot.routeCoordinate.lat.toFixed(6)}, ${spot.routeCoordinate.lng.toFixed(6)}`);
  console.log(`   Mile Marker: ~${spot.approximateMile.toFixed(1)}`);
  console.log(`   ${spot.description}`);
  if (spot.amenities.coffee) {
    console.log(`   Coffee: ${spot.amenities.coffee.join('; ')}`);
  }
  if (spot.amenities.food) {
    console.log(`   Food: ${spot.amenities.food.join('; ')}`);
  }
  console.log(`   Why Optimal: ${spot.whyOptimal}`);
  console.log('');
});

// Save final recommendations
fs.writeFileSync('./final-spectator-spots.json', JSON.stringify(selectedSpots, null, 2));
console.log('Final spots saved to final-spectator-spots.json');

