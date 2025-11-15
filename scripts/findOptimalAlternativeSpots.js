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

// Find exact coordinate at mile
function findCoordinateAtMile(targetMile, mileMarkers) {
  for (let i = 0; i < mileMarkers.length - 1; i++) {
    if (mileMarkers[i].mile <= targetMile && mileMarkers[i + 1].mile >= targetMile) {
      const before = mileMarkers[i];
      const after = mileMarkers[i + 1];
      const ratio = (targetMile - before.mile) / (after.mile - before.mile);
      return {
        lat: before.lat + (after.lat - before.lat) * ratio,
        lng: before.lng + (after.lng - before.lng) * ratio,
        mile: targetMile
      };
    }
  }
  return mileMarkers[mileMarkers.length - 1];
}

// Load route data
const routeData = JSON.parse(fs.readFileSync('./route-analysis.json', 'utf-8'));
const mileMarkers = routeData.mileMarkers;

console.log('=== FINDING OPTIMAL ALTERNATIVE SPOTS ===\n');

// Current problematic spot: Mile 17 (NoDa)
const mile17 = findCoordinateAtMile(17, mileMarkers);
const mile11_5 = findCoordinateAtMile(11.5, mileMarkers);
const mile20 = findCoordinateAtMile(20, mileMarkers);

console.log('Current Plan Issues:');
console.log(`  Mile 11.5 → Mile 17: ${haversineDistance(mile11_5.lat, mile11_5.lng, mile17.lat, mile17.lng).toFixed(2)} miles`);
console.log(`  Drive time: 15-20 min (cross-city, challenging)`);
console.log('');

// Option 1: Find spot between Mile 20-26 (easier travel, closer to finish)
console.log('=== OPTION 1: Spot Between Mile 20-26 (Near Finish) ===\n');
const options20_26 = [21, 22, 23, 24, 25];

options20_26.forEach(mile => {
  const coord = findCoordinateAtMile(mile, mileMarkers);
  const distFrom20 = haversineDistance(mile20.lat, mile20.lng, coord.lat, coord.lng);
  const distToFinish = haversineDistance(coord.lat, coord.lng, findCoordinateAtMile(26.2, mileMarkers).lat, findCoordinateAtMile(26.2, mileMarkers).lng);
  
  console.log(`Mile ${mile}:`);
  console.log(`  Coordinate: ${coord.lat.toFixed(6)}, ${coord.lng.toFixed(6)}`);
  console.log(`  Distance from Mile 20: ${distFrom20.toFixed(2)} miles (${(distFrom20 * 1.4 * 60 / 22).toFixed(0)} min drive)`);
  console.log(`  Distance to Finish: ${distToFinish.toFixed(2)} miles`);
  console.log(`  Why Good: Close to finish, easy transition, final push support`);
  console.log('');
});

// Option 2: Find spot between Mile 12-17 (easier than NoDa)
console.log('=== OPTION 2: Spot Between Mile 12-17 (Easier Access) ===\n');
const options12_17 = [13, 14, 15, 16];

options12_17.forEach(mile => {
  const coord = findCoordinateAtMile(mile, mileMarkers);
  const distFrom11_5 = haversineDistance(mile11_5.lat, mile11_5.lng, coord.lat, coord.lng);
  const distTo20 = haversineDistance(coord.lat, coord.lng, mile20.lat, mile20.lng);
  
  console.log(`Mile ${mile}:`);
  console.log(`  Coordinate: ${coord.lat.toFixed(6)}, ${coord.lng.toFixed(6)}`);
  console.log(`  Distance from Mile 11.5: ${distFrom11_5.toFixed(2)} miles (${(distFrom11_5 * 1.4 * 60 / 22).toFixed(0)} min drive)`);
  console.log(`  Distance to Mile 20: ${distTo20.toFixed(2)} miles (${(distTo20 * 1.4 * 60 / 22).toFixed(0)} min drive)`);
  console.log(`  Why Good: Easier access, better spacing, less stress`);
  console.log('');
});

// Option 3: Skip intermediate spot, go straight to Mile 20
console.log('=== OPTION 3: Skip Intermediate, Go Straight to Mile 20 ===\n');
const dist11_5_to_20 = haversineDistance(mile11_5.lat, mile11_5.lng, mile20.lat, mile20.lng);
console.log(`Mile 11.5 → Mile 20:`);
console.log(`  Distance: ${dist11_5_to_20.toFixed(2)} miles`);
console.log(`  Drive time: ${(dist11_5_to_20 * 1.4 * 60 / 22).toFixed(0)}-${(dist11_5_to_20 * 1.4 * 60 / 22 + 5).toFixed(0)} min`);
console.log(`  Why Good: Less stops = less stress, more time at each spot`);
console.log(`  Trade-off: Fewer viewing opportunities`);
console.log('');

// Recommendation
console.log('=== RECOMMENDATION ===\n');
console.log('BEST OPTION: Mile 22-24 (Between Mile 20 and Finish)');
console.log('Reasons:');
console.log('  1. Easy travel from Mile 20 (short drive)');
console.log('  2. Close to finish (easy transition)');
console.log('  3. Final push support (critical moment)');
console.log('  4. Less stress, more comfort');
console.log('  5. Can grab coffee/food on way to finish');
console.log('');
console.log('ALTERNATIVE: Mile 13-15 (Between Mile 11.5 and Mile 20)');
console.log('Reasons:');
console.log('  1. Easier access than NoDa');
console.log('  2. Better spacing');
console.log('  3. Less cross-city driving');
console.log('');

// Calculate optimal plan
console.log('=== OPTIMAL PLAN COMPARISON ===\n');

const planA = {
  name: 'Current Plan (with Mile 17)',
  spots: ['Start', 'Mile 2.1', 'Mile 6', 'Mile 11.5', 'Mile 17', 'Mile 20', 'Finish'],
  issues: ['Long cross-city drive', 'Tight timing', 'Stressful']
};

const planB = {
  name: 'Option: Mile 22 (Near Finish)',
  spots: ['Start', 'Mile 2.1', 'Mile 6', 'Mile 11.5', 'Mile 20', 'Mile 22', 'Finish'],
  benefits: ['Easy travel', 'Less stress', 'Final push support', 'Close to finish']
};

const planC = {
  name: 'Option: Mile 14 (Mid-Race)',
  spots: ['Start', 'Mile 2.1', 'Mile 6', 'Mile 11.5', 'Mile 14', 'Mile 20', 'Finish'],
  benefits: ['Better spacing', 'Easier access', 'Less cross-city driving']
};

const planD = {
  name: 'Simplified: 5 Spots',
  spots: ['Start', 'Mile 2.1', 'Mile 6', 'Mile 11.5', 'Mile 20', 'Finish'],
  benefits: ['Most relaxed', 'Less stress', 'More time at each spot', 'Still 5 viewing opportunities']
};

[planA, planB, planC, planD].forEach(plan => {
  console.log(`${plan.name}:`);
  console.log(`  Spots: ${plan.spots.join(' → ')}`);
  if (plan.issues) {
    console.log(`  Issues: ${plan.issues.join(', ')}`);
  }
  if (plan.benefits) {
    console.log(`  Benefits: ${plan.benefits.join(', ')}`);
  }
  console.log('');
});

console.log('RECOMMENDED: Plan B (Mile 22) or Plan D (Simplified)');
console.log('Both prioritize efficiency, comfort, and supporting Rachel best!');

