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

// Find exact coordinate at specific mile marker
function findCoordinateAtMile(targetMile, route, mileMarkers) {
  // Find the two mile markers that bracket the target mile
  let beforeMarker = null;
  let afterMarker = null;
  
  for (let i = 0; i < mileMarkers.length - 1; i++) {
    if (mileMarkers[i].mile <= targetMile && mileMarkers[i + 1].mile >= targetMile) {
      beforeMarker = mileMarkers[i];
      afterMarker = mileMarkers[i + 1];
      break;
    }
  }
  
  if (!beforeMarker || !afterMarker) {
    // If target is beyond last marker, use last marker
    return mileMarkers[mileMarkers.length - 1];
  }
  
  // Interpolate between the two markers
  const distanceBetween = afterMarker.mile - beforeMarker.mile;
  const distanceToTarget = targetMile - beforeMarker.mile;
  const ratio = distanceToTarget / distanceBetween;
  
  const lat = beforeMarker.lat + (afterMarker.lat - beforeMarker.lat) * ratio;
  const lng = beforeMarker.lng + (afterMarker.lng - beforeMarker.lng) * ratio;
  
  return { mile: targetMile, lat, lng };
}

// Load route data
const routeData = JSON.parse(fs.readFileSync('./route-analysis.json', 'utf-8'));
const route = routeData.fullRoute;
const mileMarkers = routeData.mileMarkers;

console.log('=== EXACT COORDINATES FOR ALL SPOTS ===\n');

// Get exact coordinates for each spot
const exactSpots = [
  { name: "Start", mile: 0 },
  { name: "Mile 2.1", mile: 2.1 },
  { name: "Mile 6.0", mile: 6.0 },
  { name: "Mile 11.5", mile: 11.5 },
  { name: "Mile 17.0", mile: 17.0 },
  { name: "Mile 20.0", mile: 20.0 },
  { name: "Finish", mile: 26.2 }
];

exactSpots.forEach(spot => {
  const exact = findCoordinateAtMile(spot.mile, route, mileMarkers);
  console.log(`${spot.name}:`);
  console.log(`  Exact Coordinate: ${exact.lat.toFixed(6)}, ${exact.lng.toFixed(6)}`);
  console.log(`  Mile: ${exact.mile}`);
  console.log('');
});

// Also check mile 11 specifically (user said Not Just Coffee is closer to mile 11)
console.log('=== CHECKING MILE 11 (User mentioned Not Just Coffee) ===\n');
const mile11 = findCoordinateAtMile(11, route, mileMarkers);
console.log(`Mile 11 Exact: ${mile11.lat.toFixed(6)}, ${mile11.lng.toFixed(6)}`);
console.log(`Mile 11.5 Exact: ${findCoordinateAtMile(11.5, route, mileMarkers).lat.toFixed(6)}, ${findCoordinateAtMile(11.5, route, mileMarkers).lng.toFixed(6)}`);
console.log('');

// Verify Not Just Coffee South End location
const notJustCoffeeSouthEnd = { lat: 35.2100, lng: -80.8600 }; // Approximate
const mile11Coord = { lat: mile11.lat, lng: mile11.lng };
const mile11_5Coord = findCoordinateAtMile(11.5, route, mileMarkers);

const distToMile11 = haversineDistance(notJustCoffeeSouthEnd.lat, notJustCoffeeSouthEnd.lng, mile11Coord.lat, mile11Coord.lng);
const distToMile11_5 = haversineDistance(notJustCoffeeSouthEnd.lat, notJustCoffeeSouthEnd.lng, mile11_5Coord.lat, mile11_5Coord.lng);

console.log('Not Just Coffee South End (2000 South Blvd) - Approximate Location:');
console.log(`  Distance to Mile 11: ${(distToMile11 * 5280).toFixed(0)} feet (${distToMile11.toFixed(3)} miles)`);
console.log(`  Distance to Mile 11.5: ${(distToMile11_5 * 5280).toFixed(0)} feet (${distToMile11_5.toFixed(3)} miles)`);
console.log('');

// Output JSON for easy copy-paste
console.log('=== JSON FORMAT ===\n');
const spotsJson = exactSpots.map(spot => {
  const exact = findCoordinateAtMile(spot.mile, route, mileMarkers);
  return {
    name: spot.name,
    mile: exact.mile,
    lat: parseFloat(exact.lat.toFixed(6)),
    lng: parseFloat(exact.lng.toFixed(6))
  };
});
console.log(JSON.stringify(spotsJson, null, 2));

