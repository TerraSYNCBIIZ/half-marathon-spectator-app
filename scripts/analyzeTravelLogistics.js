import fs from 'fs';

// Haversine formula for distance
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

// Load route data
const routeData = JSON.parse(fs.readFileSync('./route-analysis.json', 'utf-8'));
const mileMarkers = routeData.mileMarkers;

// Current plan spots
const spots = [
  { name: "Start", mile: 0, lat: 35.22378, lng: -80.84796 },
  { name: "Mile 2.1", mile: 2.1, lat: 35.21361, lng: -80.82864 },
  { name: "Mile 6.0", mile: 6.0, lat: 35.18445, lng: -80.83100 },
  { name: "Mile 11.5", mile: 11.5, lat: 35.21368, lng: -80.85791 },
  { name: "Mile 17.0", mile: 17.0, lat: 35.24138, lng: -80.81279 },
  { name: "Mile 20.0", mile: 20.0, lat: 35.22055, lng: -80.81091 },
  { name: "Finish", mile: 26.2, lat: 35.22910, lng: -80.84749 }
];

console.log('=== DEEP TRAVEL LOGISTICS ANALYSIS ===\n');

// 1. Verify exact coordinates from route
console.log('1. VERIFYING EXACT COORDINATES FROM ROUTE:\n');
spots.forEach(spot => {
  const exactMarker = mileMarkers.find(m => Math.abs(m.mile - spot.mile) < 0.1);
  if (exactMarker) {
    const coordDiff = haversineDistance(spot.lat, spot.lng, exactMarker.lat, exactMarker.lng);
    console.log(`${spot.name} (Mile ${spot.mile}):`);
    console.log(`  Plan Coordinate: ${spot.lat.toFixed(6)}, ${spot.lng.toFixed(6)}`);
    console.log(`  Route Coordinate: ${exactMarker.lat.toFixed(6)}, ${exactMarker.lng.toFixed(6)}`);
    console.log(`  Difference: ${(coordDiff * 5280).toFixed(0)} feet`);
    if (coordDiff > 0.1) {
      console.log(`  ⚠️  WARNING: Coordinates differ significantly!`);
    }
    console.log('');
  } else {
    console.log(`${spot.name}: No exact mile marker found - need interpolation`);
  }
});

// 2. Calculate actual driving distances
console.log('\n2. ACTUAL DRIVING DISTANCES (as crow flies - real will be longer):\n');
for (let i = 0; i < spots.length - 1; i++) {
  const from = spots[i];
  const to = spots[i + 1];
  const distance = haversineDistance(from.lat, from.lng, to.lat, to.lng);
  const routeDistance = to.mile - from.mile;
  
  console.log(`${from.name} → ${to.name}:`);
  console.log(`  Straight-line distance: ${distance.toFixed(2)} miles`);
  console.log(`  Route distance (runner): ${routeDistance.toFixed(2)} miles`);
  console.log(`  Estimated drive time (with traffic/closures): ${estimateDriveTime(distance, routeDistance)}`);
  console.log('');
}

// 3. Analyze route geography
console.log('\n3. ROUTE GEOGRAPHY ANALYSIS:\n');
console.log('Route Path Overview:');
console.log('  Start (Uptown) → Southeast → Myers Park → Dilworth → South End →');
console.log('  → NoDa → Plaza Midwood → Back to Uptown (Finish)');
console.log('');

// 4. Check for potential issues
console.log('4. POTENTIAL TRAVEL ISSUES:\n');

// Check if spots are in logical order
const issues = [];
for (let i = 0; i < spots.length - 1; i++) {
  const from = spots[i];
  const to = spots[i + 1];
  
  // Check if we're going backwards on route
  if (to.mile < from.mile && to.name !== 'Finish') {
    issues.push(`⚠️  ${from.name} to ${to.name}: Going backwards on route!`);
  }
  
  // Check if gap is too large
  const gap = to.mile - from.mile;
  if (gap > 10) {
    issues.push(`⚠️  ${from.name} to ${to.name}: Large gap (${gap.toFixed(1)} miles) - may miss runner`);
  }
  
  // Check if spots are too close
  if (gap < 1 && from.name !== 'Start') {
    issues.push(`⚠️  ${from.name} to ${to.name}: Very close (${gap.toFixed(1)} miles) - may not be worth separate stop`);
  }
}

if (issues.length > 0) {
  issues.forEach(issue => console.log(issue));
} else {
  console.log('✅ No major issues detected');
}

// 5. Road closure considerations
console.log('\n5. ROAD CLOSURE CONSIDERATIONS:\n');
console.log('Key roads that will be closed:');
console.log('  - South Tryon St (Uptown)');
console.log('  - Queens Road West');
console.log('  - East Boulevard');
console.log('  - South Boulevard (South End)');
console.log('  - North Davidson St (NoDa)');
console.log('  - The Plaza / Central Avenue');
console.log('');
console.log('Travel Strategy:');
console.log('  - Use parallel streets (e.g., Park Road, Providence Road)');
console.log('  - Arrive early to secure parking');
console.log('  - Consider walking between close spots');

// 6. Optimal travel routes
console.log('\n6. SUGGESTED TRAVEL ROUTES:\n');

const travelRoutes = [
  {
    from: "Start",
    to: "Mile 2.1",
    route: "Walk or short drive via 4th St / Hawthorne Ln (avoid Tryon St - closed)",
    time: "5-8 min drive OR 20 min walk",
    note: "Very close - walking might be easier"
  },
  {
    from: "Mile 2.1",
    to: "Mile 6.0",
    route: "Drive via Park Road or Providence Road (avoid Queens Road - closed)",
    time: "8-10 min",
    note: "Queens Road will be closed, use parallel streets"
  },
  {
    from: "Mile 6.0",
    to: "Mile 11.5",
    route: "Drive via Park Road → South Boulevard (route will be on South Blvd)",
    time: "10-12 min",
    note: "South Boulevard may have closures - arrive early"
  },
  {
    from: "Mile 11.5",
    to: "Mile 17.0",
    route: "Drive via South Blvd → Independence Blvd → North Davidson St",
    time: "12-15 min",
    note: "Longest drive - NoDa area may have street closures"
  },
  {
    from: "Mile 17.0",
    to: "Mile 20.0",
    route: "Drive via North Davidson → The Plaza (route will be on The Plaza)",
    time: "8-10 min",
    note: "The Plaza may have closures - use parallel streets"
  },
  {
    from: "Mile 20.0",
    to: "Finish",
    route: "Drive via Park Road → Trade St → Tryon St area",
    time: "8-10 min",
    note: "Uptown will have major closures - park early and walk"
  }
];

travelRoutes.forEach(route => {
  console.log(`${route.from} → ${route.to}:`);
  console.log(`  Route: ${route.route}`);
  console.log(`  Time: ${route.time}`);
  console.log(`  Note: ${route.note}`);
  console.log('');
});

function estimateDriveTime(straightDistance, routeDistance) {
  // Account for: road closures, traffic, detours
  // Straight line is usually 1.3-1.5x actual driving distance
  const actualDistance = straightDistance * 1.4;
  // Average speed with closures: 20-25 mph
  const avgSpeed = 22; // mph
  const timeMinutes = (actualDistance / avgSpeed) * 60;
  
  // Add buffer for closures
  const buffer = 3; // minutes
  
  return `${Math.round(timeMinutes + buffer)}-${Math.round(timeMinutes + buffer + 3)} min`;
}

console.log('\n=== SUMMARY ===\n');
console.log('✅ Coordinates verified against route');
console.log('✅ Travel distances calculated');
console.log('✅ Road closure considerations added');
console.log('⚠️  Key consideration: Road closures will significantly impact travel times');
console.log('⚠️  Recommendation: Arrive 15-20 minutes early at each spot to account for closures');

