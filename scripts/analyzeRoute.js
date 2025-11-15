import fs from 'fs';
import { DOMParser } from '@xmldom/xmldom';

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

// Parse coordinates from KML format (lng,lat,altitude)
function parseCoordinates(coordString) {
  return coordString
    .trim()
    .split(/\s+/)
    .map(line => {
      const [lng, lat] = line.split(',').map(parseFloat);
      return { lat, lng };
    })
    .filter(coord => !isNaN(coord.lat) && !isNaN(coord.lng));
}

// Calculate cumulative distances and find mile markers
function calculateMileMarkers(route) {
  const mileMarkers = [];
  let cumulativeDistance = 0;
  
  for (let i = 1; i < route.length; i++) {
    const prev = route[i - 1];
    const curr = route[i];
    const segmentDistance = haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng);
    cumulativeDistance += segmentDistance;
    
    // Check if we've passed any mile markers
    const currentMile = Math.floor(cumulativeDistance);
    const lastMile = mileMarkers.length > 0 ? mileMarkers[mileMarkers.length - 1].mile : -1;
    
    if (currentMile > lastMile && currentMile <= 26) {
      // Interpolate to find exact position at mile marker
      const targetDistance = currentMile;
      const distanceToTarget = targetDistance - (cumulativeDistance - segmentDistance);
      const ratio = distanceToTarget / segmentDistance;
      
      const lat = prev.lat + (curr.lat - prev.lat) * ratio;
      const lng = prev.lng + (curr.lng - prev.lng) * ratio;
      
      mileMarkers.push({
        mile: currentMile,
        lat,
        lng,
        cumulativeDistance: targetDistance
      });
    }
  }
  
  // Add finish line (26.2 miles)
  if (route.length > 0) {
    const finish = route[route.length - 1];
    mileMarkers.push({
      mile: 26.2,
      lat: finish.lat,
      lng: finish.lng,
      cumulativeDistance: cumulativeDistance
    });
  }
  
  return { mileMarkers, totalDistance: cumulativeDistance };
}

// Main analysis function
function analyzeRoute() {
  const kmlPath = './public/Copy of 2025 Novant Health Charlotte Marathon.kml';
  const kmlContent = fs.readFileSync(kmlPath, 'utf-8');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(kmlContent, 'text/xml');
  
  const placemarks = xmlDoc.getElementsByTagName('Placemark');
  let firstHalfRoute = null;
  let secondHalfRoute = null;
  
  // Find the routes
  for (let i = 0; i < placemarks.length; i++) {
    const placemark = placemarks[i];
    const name = placemark.getElementsByTagName('name')[0]?.textContent || '';
    const lineString = placemark.getElementsByTagName('LineString')[0];
    
    if (lineString) {
      const coordsText = lineString.getElementsByTagName('coordinates')[0]?.textContent;
      if (coordsText) {
        const route = parseCoordinates(coordsText);
        
        if (name.includes('1st Half')) {
          firstHalfRoute = route;
          console.log(`Found 1st Half route: ${route.length} points`);
        } else if (name.includes('2nd Half') || name.includes('Second Half')) {
          secondHalfRoute = route;
          console.log(`Found 2nd Half route: ${route.length} points`);
        }
      }
    }
  }
  
  if (!firstHalfRoute || !secondHalfRoute) {
    console.error('Could not find both halves of the route!');
    console.log('First half found:', !!firstHalfRoute);
    console.log('Second half found:', !!secondHalfRoute);
    return;
  }
  
  // Combine routes (full marathon)
  const fullRoute = [...firstHalfRoute, ...secondHalfRoute];
  console.log(`\nFull marathon route: ${fullRoute.length} total points`);
  
  // Calculate mile markers
  const { mileMarkers, totalDistance } = calculateMileMarkers(fullRoute);
  console.log(`\nTotal route distance: ${totalDistance.toFixed(2)} miles`);
  console.log(`\nMile markers found: ${mileMarkers.length}`);
  
  // Output mile markers
  console.log('\n=== MILE MARKERS ===');
  mileMarkers.forEach(marker => {
    console.log(`Mile ${marker.mile}: ${marker.lat.toFixed(6)}, ${marker.lng.toFixed(6)}`);
  });
  
  // Find start and finish coordinates
  const startPlacemark = Array.from(placemarks).find(p => {
    const name = p.getElementsByTagName('name')[0]?.textContent || '';
    return name.includes('Start Line');
  });
  
  const finishPlacemark = Array.from(placemarks).find(p => {
    const name = p.getElementsByTagName('name')[0]?.textContent || '';
    return name.includes('Finish Line');
  });
  
  let startCoord = null;
  let finishCoord = null;
  
  if (startPlacemark) {
    const point = startPlacemark.getElementsByTagName('Point')[0];
    if (point) {
      const coords = point.getElementsByTagName('coordinates')[0]?.textContent;
      if (coords) {
        const [lng, lat] = coords.split(',').map(parseFloat);
        startCoord = { lat, lng };
      }
    }
  }
  
  if (finishPlacemark) {
    const point = finishPlacemark.getElementsByTagName('Point')[0];
    if (point) {
      const coords = point.getElementsByTagName('coordinates')[0]?.textContent;
      if (coords) {
        const [lng, lat] = coords.split(',').map(parseFloat);
        finishCoord = { lat, lng };
      }
    }
  }
  
  // Output results
  const results = {
    start: startCoord,
    finish: finishCoord,
    fullRoute: fullRoute,
    mileMarkers: mileMarkers,
    totalDistance: totalDistance,
    firstHalfPoints: firstHalfRoute.length,
    secondHalfPoints: secondHalfRoute.length
  };
  
  fs.writeFileSync('./route-analysis.json', JSON.stringify(results, null, 2));
  console.log('\n=== RESULTS SAVED TO route-analysis.json ===');
  console.log(`Start: ${startCoord?.lat}, ${startCoord?.lng}`);
  console.log(`Finish: ${finishCoord?.lat}, ${finishCoord?.lng}`);
  
  return results;
}

analyzeRoute();
