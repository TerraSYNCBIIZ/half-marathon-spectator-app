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
  
  // Calculate cumulative distance to find exact mile marker
  let cumulativeDistance = 0;
  for (let i = 1; i <= closestIndex; i++) {
    const prev = route[i - 1];
    const curr = route[i];
    cumulativeDistance += haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng);
  }
  
  // Find which mile marker range this falls in
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
    routeIndex: closestIndex,
    exactMile: cumulativeDistance,
    approximateMile: approximateMile
  };
}

// Load route data
const routeData = JSON.parse(fs.readFileSync('./route-analysis.json', 'utf-8'));
const route = routeData.fullRoute;
const mileMarkers = routeData.mileMarkers;

// All known Not Just Coffee locations in Charlotte (with approximate coordinates - need to verify)
const notJustCoffeeLocations = [
  {
    name: "Not Just Coffee - Packard Place",
    address: "222 S Church St, Charlotte, NC 28202",
    lat: 35.2271,
    lng: -80.8431,
    note: "Uptown, near start"
  },
  {
    name: "Not Just Coffee - Atherton Mill",
    address: "2230 Park Rd, Charlotte, NC 28209",
    lat: 35.1950,
    lng: -80.8250,
    note: "Dilworth area"
  },
  {
    name: "Not Just Coffee - Dilworth",
    address: "1235 East Blvd, Charlotte, NC",
    lat: 35.1920,
    lng: -80.8260,
    note: "East Boulevard"
  },
  {
    name: "Not Just Coffee - South End",
    address: "2000 South Blvd, Charlotte, NC",
    lat: 35.2100, // Approximate - need to verify
    lng: -80.8600, // Approximate - need to verify
    note: "South End area"
  },
  {
    name: "Not Just Coffee - 7th Street Public Market",
    address: "224 E 7th St, Charlotte, NC",
    lat: 35.2280,
    lng: -80.8420,
    note: "Uptown, near finish"
  }
];

console.log('=== ALL NOT JUST COFFEE LOCATIONS MATCHED TO ROUTE ===\n');

notJustCoffeeLocations.forEach(business => {
  const result = findClosestRoutePointAndMile(business.lat, business.lng, route, mileMarkers);
  
  console.log(`${business.name}`);
  console.log(`  Address: ${business.address}`);
  console.log(`  Note: ${business.note}`);
  console.log(`  Business Location (approx): ${business.lat}, ${business.lng}`);
  console.log(`  Closest Route Point: ${result.routePoint.lat.toFixed(6)}, ${result.routePoint.lng.toFixed(6)}`);
  console.log(`  Distance from Route: ${(result.distance * 5280).toFixed(0)} feet (${result.distance.toFixed(3)} miles)`);
  console.log(`  Exact Mile on Route: ${result.exactMile.toFixed(2)} miles`);
  console.log(`  Approximate Mile Marker: ${result.approximateMile.toFixed(1)}`);
  console.log('');
});

// Check mile 11 location
const mile11Marker = mileMarkers.find(m => m.mile === 11);
if (mile11Marker) {
  console.log('=== MILE 11 LOCATION ===');
  console.log(`Mile 11 Route Coordinate: ${mile11Marker.lat.toFixed(6)}, ${mile11Marker.lng.toFixed(6)}`);
  console.log('');
  
  // Find which Not Just Coffee is closest to mile 11
  let closestToMile11 = null;
  let closestDistToMile11 = Infinity;
  
  notJustCoffeeLocations.forEach(business => {
    const dist = haversineDistance(
      business.lat, business.lng,
      mile11Marker.lat, mile11Marker.lng
    );
    if (dist < closestDistToMile11) {
      closestDistToMile11 = dist;
      closestToMile11 = business;
    }
  });
  
  if (closestToMile11) {
    console.log(`Closest Not Just Coffee to Mile 11:`);
    console.log(`  ${closestToMile11.name}`);
    console.log(`  Address: ${closestToMile11.address}`);
    console.log(`  Distance from Mile 11: ${(closestDistToMile11 * 5280).toFixed(0)} feet (${closestDistToMile11.toFixed(3)} miles)`);
  }
}

// Also check for other coffee shops that might be near mile 11
console.log('\n=== OTHER COFFEE SHOPS TO RESEARCH ===\n');
console.log('Need to find exact coordinates for:');
console.log('- Central Coffee Co. (Elizabeth Avenue area)');
console.log('- Rhino Market & Deli (East Morehead area)');
console.log('- Community Matters Café (East Morehead area)');
console.log('- Any other coffee shops near mile 10-12');

