import fs from 'fs';

// Haversine formula to calculate distance between two coordinates
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find closest point on route to a given coordinate
function findClosestRoutePoint(targetLat, targetLng, route, mileMarkers) {
  let closestPoint = null;
  let closestDistance = Infinity;
  let closestIndex = 0;
  let closestMile = 0;
  
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
  
  // Find which mile marker this is closest to
  for (let i = 0; i < mileMarkers.length - 1; i++) {
    const currentMile = mileMarkers[i];
    const nextMile = mileMarkers[i + 1];
    
    const distToCurrent = haversineDistance(
      closestPoint.lat, closestPoint.lng,
      currentMile.lat, currentMile.lng
    );
    const distToNext = haversineDistance(
      closestPoint.lat, closestPoint.lng,
      nextMile.lat, nextMile.lng
    );
    
    if (distToCurrent < distToNext) {
      closestMile = currentMile.mile;
      break;
    }
  }
  
  return {
    routePoint: closestPoint,
    distance: closestDistance,
    routeIndex: closestIndex,
    approximateMile: closestMile
  };
}

// Business locations to check (we'll add more as we research)
const businesses = [
  {
    name: "Not Just Coffee - Packard Place",
    address: "222 S Church St, Charlotte, NC",
    lat: 35.2271, // Approximate - need to verify
    lng: -80.8431
  },
  {
    name: "Not Just Coffee - Atherton Mill",
    address: "2230 Park Rd, Charlotte, NC",
    lat: 35.1950, // Approximate - need to verify
    lng: -80.8250
  },
  {
    name: "Central Coffee Co.",
    address: "Elizabeth Avenue, Charlotte, NC",
    lat: 35.2180, // Approximate
    lng: -80.8330
  },
  {
    name: "The King's Kitchen",
    address: "129 W Trade St, Charlotte, NC",
    lat: 35.2280, // Approximate
    lng: -80.8450
  }
];

// Load route data
const routeData = JSON.parse(fs.readFileSync('./route-analysis.json', 'utf-8'));
const route = routeData.fullRoute;
const mileMarkers = routeData.mileMarkers;

console.log('Finding closest route points to businesses...\n');

businesses.forEach(business => {
  const result = findClosestRoutePoint(business.lat, business.lng, route, mileMarkers);
  
  console.log(`${business.name}`);
  console.log(`  Address: ${business.address}`);
  console.log(`  Business Location: ${business.lat}, ${business.lng}`);
  console.log(`  Closest Route Point: ${result.routePoint.lat.toFixed(6)}, ${result.routePoint.lng.toFixed(6)}`);
  console.log(`  Distance from Route: ${(result.distance * 5280).toFixed(0)} feet (${result.distance.toFixed(3)} miles)`);
  console.log(`  Approximate Mile Marker: ${result.approximateMile}`);
  console.log('');
});

// Also find closest points for known good spectator spots
const spectatorSpots = [
  {
    name: "Queens Road West & Selwyn Avenue",
    description: "Classic spectator spot - wide median",
    lat: 35.1843, // Approximate
    lng: -80.8311
  },
  {
    name: "East Morehead & South McDowell",
    description: "Marathon/Half split point",
    lat: 35.2100, // Approximate
    lng: -80.8500
  },
  {
    name: "The Plaza & Mecklenburg Avenue",
    description: "Dual viewing spot (miles 18 & 20)",
    lat: 35.2340, // Approximate
    lng: -80.8060
  }
];

console.log('\n=== KNOWN GOOD SPECTATOR SPOTS ===\n');

spectatorSpots.forEach(spot => {
  const result = findClosestRoutePoint(spot.lat, spot.lng, route, mileMarkers);
  
  console.log(`${spot.name}`);
  console.log(`  Description: ${spot.description}`);
  console.log(`  Spot Location: ${spot.lat}, ${spot.lng}`);
  console.log(`  Closest Route Point: ${result.routePoint.lat.toFixed(6)}, ${result.routePoint.lng.toFixed(6)}`);
  console.log(`  Distance from Route: ${(result.distance * 5280).toFixed(0)} feet (${result.distance.toFixed(3)} miles)`);
  console.log(`  Approximate Mile Marker: ${result.approximateMile}`);
  console.log('');
});

