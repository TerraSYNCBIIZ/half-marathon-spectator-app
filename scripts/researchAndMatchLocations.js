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
  
  // Check all route points
  for (let i = 0; i < route.length; i++) {
    const point = route[i];
    const distance = haversineDistance(targetLat, targetLng, point.lat, point.lng);
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestPoint = point;
      closestIndex = i;
    }
  }
  
  // Calculate cumulative distance to find exact mile marker
  let cumulativeDistance = 0;
  let exactMile = 0;
  
  for (let i = 1; i <= closestIndex; i++) {
    const prev = route[i - 1];
    const curr = route[i];
    cumulativeDistance += haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng);
  }
  
  exactMile = cumulativeDistance;
  
  // Find which mile marker range this falls in
  let approximateMile = 0;
  for (let i = 0; i < mileMarkers.length - 1; i++) {
    if (cumulativeDistance >= mileMarkers[i].cumulativeDistance && 
        cumulativeDistance < mileMarkers[i + 1].cumulativeDistance) {
      // Interpolate between mile markers
      const distToCurrent = cumulativeDistance - mileMarkers[i].cumulativeDistance;
      const distBetweenMarkers = mileMarkers[i + 1].cumulativeDistance - mileMarkers[i].cumulativeDistance;
      const ratio = distToCurrent / distBetweenMarkers;
      approximateMile = mileMarkers[i].mile + (mileMarkers[i + 1].mile - mileMarkers[i].mile) * ratio;
      break;
    }
  }
  
  return {
    routePoint: closestPoint,
    distance: closestDistance,
    routeIndex: closestIndex,
    exactMile: exactMile,
    approximateMile: approximateMile
  };
}

// Load route data
const routeData = JSON.parse(fs.readFileSync('./route-analysis.json', 'utf-8'));
const route = routeData.fullRoute;
const mileMarkers = routeData.mileMarkers;

// Known good spectator spots from research (with approximate coordinates - we'll refine these)
const researchSpots = [
  {
    name: "Mile 2: Fourth Street and Hawthorne Lane",
    description: "Near Novant Health Hospital, ample parking",
    lat: 35.2143, // Approximate - need to verify
    lng: -80.8296,
    amenities: ["Central Coffee Co.", "Sunflour Baking Company"]
  },
  {
    name: "Miles 6.25-7.34: Queens Road West",
    description: "Wide median, stately trees, historic homes",
    lat: 35.1843,
    lng: -80.8311,
    amenities: ["Not Just Coffee - Dilworth", "Laurel Market"]
  },
  {
    name: "Mile 10: East Morehead Street",
    description: "Between S. McDowell and S. Tryon",
    lat: 35.2117,
    lng: -80.8463,
    amenities: ["Rhino Market & Deli", "Community Matters Café"]
  },
  {
    name: "Mile 12.7: Marathon/Half Split",
    description: "The Sole cheer section, where routes diverge",
    lat: 35.2170,
    lng: -80.8645,
    amenities: ["Earl's Grocery", "Crispy Banh Mi"]
  },
  {
    name: "Miles 15-17 & 21-23: North Davidson (NoDa)",
    description: "See runners twice, vibrant arts district",
    lat: 35.2415,
    lng: -80.8127,
    amenities: ["Smelly Cat Coffeehouse", "Heist Brewery"]
  },
  {
    name: "Miles 18 & 20: The Plaza and Mecklenburg Avenue",
    description: "See runners twice from same location",
    lat: 35.2340,
    lng: -80.8063,
    amenities: ["Zada Jane's Corner Café", "Common Market Oakwold"]
  }
];

// Not Just Coffee locations (need to find exact coordinates)
const notJustCoffeeLocations = [
  {
    name: "Not Just Coffee - Packard Place",
    address: "222 S Church St, Charlotte, NC",
    lat: 35.2271, // Need to verify
    lng: -80.8431
  },
  {
    name: "Not Just Coffee - Atherton Mill",
    address: "2230 Park Rd, Charlotte, NC",
    lat: 35.1950, // Need to verify
    lng: -80.8250
  },
  {
    name: "Not Just Coffee - Dilworth",
    address: "1235 East Blvd, Charlotte, NC",
    lat: 35.1920, // Need to verify
    lng: -80.8260
  }
];

console.log('=== RESEARCHED SPECTATOR SPOTS ===\n');

researchSpots.forEach(spot => {
  const result = findClosestRoutePointAndMile(spot.lat, spot.lng, route, mileMarkers);
  
  console.log(`${spot.name}`);
  console.log(`  Description: ${spot.description}`);
  console.log(`  Research Location: ${spot.lat}, ${spot.lng}`);
  console.log(`  Closest Route Point: ${result.routePoint.lat.toFixed(6)}, ${result.routePoint.lng.toFixed(6)}`);
  console.log(`  Distance from Route: ${(result.distance * 5280).toFixed(0)} feet (${result.distance.toFixed(3)} miles)`);
  console.log(`  Exact Mile on Route: ${result.exactMile.toFixed(2)} miles`);
  console.log(`  Approximate Mile Marker: ${result.approximateMile.toFixed(1)}`);
  console.log(`  Nearby Amenities: ${spot.amenities.join(', ')}`);
  console.log('');
});

console.log('\n=== NOT JUST COFFEE LOCATIONS ===\n');

notJustCoffeeLocations.forEach(business => {
  const result = findClosestRoutePointAndMile(business.lat, business.lng, route, mileMarkers);
  
  console.log(`${business.name}`);
  console.log(`  Address: ${business.address}`);
  console.log(`  Business Location: ${business.lat}, ${business.lng}`);
  console.log(`  Closest Route Point: ${result.routePoint.lat.toFixed(6)}, ${result.routePoint.lng.toFixed(6)}`);
  console.log(`  Distance from Route: ${(result.distance * 5280).toFixed(0)} feet (${result.distance.toFixed(3)} miles)`);
  console.log(`  Exact Mile on Route: ${result.exactMile.toFixed(2)} miles`);
  console.log(`  Approximate Mile Marker: ${result.approximateMile.toFixed(1)}`);
  console.log('');
});

// Output recommendations
console.log('\n=== RECOMMENDED SPECTATOR SPOTS (Based on Research) ===\n');

const recommendations = researchSpots.map(spot => {
  const result = findClosestRoutePointAndMile(spot.lat, spot.lng, route, mileMarkers);
  return {
    ...spot,
    routePoint: result.routePoint,
    exactMile: result.exactMile,
    approximateMile: result.approximateMile,
    distanceFromRoute: result.distance
  };
}).sort((a, b) => a.approximateMile - b.approximateMile);

recommendations.forEach((rec, index) => {
  console.log(`${index + 1}. ${rec.name}`);
  console.log(`   Route Coordinate: ${rec.routePoint.lat.toFixed(6)}, ${rec.routePoint.lng.toFixed(6)}`);
  console.log(`   Mile Marker: ~${rec.approximateMile.toFixed(1)}`);
  console.log(`   ${rec.description}`);
  console.log(`   Amenities: ${rec.amenities.join(', ')}`);
  console.log('');
});

// Save recommendations
fs.writeFileSync('./spectator-spot-recommendations.json', JSON.stringify(recommendations, null, 2));
console.log('Recommendations saved to spectator-spot-recommendations.json');

