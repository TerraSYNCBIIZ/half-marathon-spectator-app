import { parseKMZ } from './utils/kmlParser';
import { spectatorSpots, raceInfo } from './data/raceData';

/**
 * Utility to parse KMZ file in the browser
 * Call this function when a user uploads a KMZ file
 */
export async function parseKMZFile(file: File): Promise<void> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const parsed = await parseKMZ(arrayBuffer);
    
    console.log('Parsed KMZ data:', parsed);
    
    // Update route if we have route data
    if (parsed.routes.length > 0) {
      const mainRoute = parsed.routes[0];
      console.log(`Found route with ${mainRoute.length} points`);
      console.log('First point:', mainRoute[0]);
      console.log('Last point:', mainRoute[mainRoute.length - 1]);
      
      // You can update raceData.ts manually or use this data
      return parsed;
    }
    
    // Update markers if we have marker data
    if (parsed.markers.length > 0) {
      console.log(`Found ${parsed.markers.length} markers`);
      parsed.markers.forEach((marker, index) => {
        console.log(`${index + 1}. ${marker.name}:`, marker.coordinate);
      });
    }
    
    return parsed;
  } catch (error) {
    console.error('Error parsing KMZ file:', error);
    throw error;
  }
}

/**
 * Update race data with parsed KMZ data
 * This is a helper function to manually update raceData.ts
 */
export function generateRaceDataUpdate(parsed: ReturnType<typeof parseKMZ> extends Promise<infer T> ? T : never) {
  if (parsed.routes.length > 0) {
    const mainRoute = parsed.routes[0];
    const routeString = mainRoute.map(coord => 
      `    { lat: ${coord.lat}, lng: ${coord.lng} }`
    ).join(',\n');
    
    console.log('\n=== Route Data for raceData.ts ===');
    console.log(`route: [\n${routeString}\n  ]`);
  }
  
  if (parsed.markers.length > 0) {
    console.log('\n=== Marker Data ===');
    parsed.markers.forEach((marker, index) => {
      console.log(`Marker ${index + 1}:`);
      console.log(`  Name: ${marker.name}`);
      console.log(`  Coordinates: { lat: ${marker.coordinate.lat}, lng: ${marker.coordinate.lng} }`);
      if (marker.description) {
        console.log(`  Description: ${marker.description}`);
      }
    });
  }
}

