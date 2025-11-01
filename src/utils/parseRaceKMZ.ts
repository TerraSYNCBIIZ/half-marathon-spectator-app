import { parseKMZ } from './utils/kmlParser';

// Parse the KMZ file from the project root
async function parseRaceKMZ() {
  try {
    // Fetch the KMZ file
    const response = await fetch('/Copy of 2025 Novant Health Charlotte Marathon.kmz');
    if (!response.ok) {
      throw new Error(`Failed to fetch KMZ file: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const parsed = await parseKMZ(arrayBuffer);
    
    console.log('✅ Successfully parsed KMZ file!');
    console.log(`Found ${parsed.routes.length} route(s)`);
    console.log(`Found ${parsed.markers.length} marker(s)`);
    
    // Display route data
    if (parsed.routes.length > 0) {
      const mainRoute = parsed.routes[0];
      console.log(`\nRoute has ${mainRoute.length} coordinate points`);
      console.log('First point:', mainRoute[0]);
      console.log('Last point:', mainRoute[mainRoute.length - 1]);
    }
    
    // Display markers
    if (parsed.markers.length > 0) {
      console.log('\nMarkers found:');
      parsed.markers.forEach((marker, index) => {
        console.log(`${index + 1}. ${marker.name}`);
        console.log(`   Location: ${marker.coordinate.lat}, ${marker.coordinate.lng}`);
      });
    }
    
    return parsed;
  } catch (error) {
    console.error('Error parsing KMZ:', error);
    return null;
  }
}

// Auto-run when this module is imported
parseRaceKMZ();

