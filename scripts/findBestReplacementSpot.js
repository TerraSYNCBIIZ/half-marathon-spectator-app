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

// Find closest point on route
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
  
  let cumulativeDistance = 0;
  for (let i = 1; i <= closestIndex; i++) {
    const prev = route[i - 1];
    const curr = route[i];
    cumulativeDistance += haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng);
  }
  
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

console.log('=== OPTIONS FOR REPLACING MILE 12 ===\n');

// Option 1: NoDa spot (miles 15-17 & 21-23) - see runners TWICE!
const noDaSpot = {
  name: "NoDa (North Davidson) - See Runners TWICE!",
  description: "Vibrant arts district - see Rachel at miles ~17 AND ~22 from same location!",
  researchLocation: "North Davidson St in NoDa",
  lat: 35.2415,
  lng: -80.8127,
  amenities: {
    coffee: ["Smelly Cat Coffeehouse (514 E 36th St)", "Trade and Lore Coffee (3306 N Davidson St)"],
    food: ["Haberdish (3106 N Davidson St)", "Heist Brewery (2909 N Davidson St)"],
    parking: "Street parking in NoDa"
  },
  whyOptimal: "SEE RUNNERS TWICE! First pass at ~mile 17, second pass at ~mile 22. Artsy vibe, great restaurants, perfect for longer break"
};

const noDaResult = findClosestRoutePointAndMile(noDaSpot.lat, noDaSpot.lng, route, mileMarkers);
console.log('OPTION 1: NoDa Spot (Between 12-20)');
console.log(`  Name: ${noDaSpot.name}`);
console.log(`  Route Coordinate: ${noDaResult.routePoint.lat.toFixed(6)}, ${noDaResult.routePoint.lng.toFixed(6)}`);
console.log(`  Mile Marker: ~${noDaResult.approximateMile.toFixed(1)}`);
console.log(`  ${noDaSpot.description}`);
console.log(`  Coffee: ${noDaSpot.amenities.coffee.join('; ')}`);
console.log(`  Food: ${noDaSpot.amenities.food.join('; ')}`);
console.log(`  Why: ${noDaSpot.whyOptimal}`);
console.log('');

// Option 2: Spot between 20-26 (near finish)
// Let's check what's around mile 22-24
const mile22Marker = mileMarkers.find(m => m.mile === 22);
const mile23Marker = mileMarkers.find(m => m.mile === 23);
const mile24Marker = mileMarkers.find(m => m.mile === 24);

console.log('OPTION 2: Between Mile 20-26 (Near Finish)');
if (mile22Marker) {
  console.log(`  Mile 22 Location: ${mile22Marker.lat.toFixed(6)}, ${mile22Marker.lng.toFixed(6)}`);
}
if (mile23Marker) {
  console.log(`  Mile 23 Location: ${mile23Marker.lat.toFixed(6)}, ${mile23Marker.lng.toFixed(6)}`);
}
if (mile24Marker) {
  console.log(`  Mile 24 Location: ${mile24Marker.lat.toFixed(6)}, ${mile24Marker.lng.toFixed(6)}`);
}
console.log('  Note: Need to research actual businesses/amenities in this area');
console.log('  Pro: Close to finish, easy transition');
console.log('  Con: Less researched, may have fewer amenities');
console.log('');

// Recommendation
console.log('=== RECOMMENDATION ===\n');
console.log('RECOMMEND: NoDa Spot (Option 1)');
console.log('Reasons:');
console.log('1. Well-researched and known good spectator location');
console.log('2. SEE RUNNERS TWICE from same spot (mile ~17 and ~22)');
console.log('3. Great amenities: Smelly Cat Coffeehouse, Haberdish restaurant');
console.log('4. Vibrant arts district - fun place to spend time');
console.log('5. Fills the gap nicely between mile 11.5 and mile 20');
console.log('6. Better value - two viewings for one location!');
console.log('');

console.log('FINAL PLAN WOULD BE:');
console.log('  Start (0.0)');
console.log('  Mile 2.1 - Fourth & Hawthorne');
console.log('  Mile 6.0 - Queens Road West');
console.log('  Mile 11.5 - Not Just Coffee South End');
console.log('  Mile ~17 - NoDa (first pass) ⭐ NEW');
console.log('  Mile 20.0 - The Wall (critical support)');
console.log('  Finish (26.2)');
console.log('');
console.log('Note: At NoDa, you can also see Rachel again at mile ~22, but that might be too close to mile 20.');
console.log('The main value is seeing her at mile ~17, which fills the gap perfectly.');

