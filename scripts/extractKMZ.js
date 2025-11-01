// Script to parse KMZ file and update raceData.ts
// Run this script to extract route and marker data from the KMZ file

import { parseKMZFromPath } from './utils/kmlParser.js';
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function extractKMZData() {
  try {
    console.log('Parsing KMZ file...');
    
    // Path to the KMZ file in the project root
    const kmzPath = join(__dirname, '../Copy of 2025 Novant Health Charlotte Marathon.kmz');
    
    // Parse the KMZ file
    const parsed = await parseKMZFromPath(kmzPath);
    
    console.log('Parsed data:');
    console.log(`- ${parsed.routes.length} route(s)`);
    console.log(`- ${parsed.markers.length} marker(s)`);
    console.log(`- ${parsed.placemarks.length} placemark(s)`);
    
    // Log route coordinates
    if (parsed.routes.length > 0) {
      console.log('\nRoute coordinates:');
      parsed.routes.forEach((route, index) => {
        console.log(`Route ${index + 1}: ${route.length} points`);
        if (route.length > 0) {
          console.log(`  First point: ${route[0].lat}, ${route[0].lng}`);
          console.log(`  Last point: ${route[route.length - 1].lat}, ${route[route.length - 1].lng}`);
        }
      });
    }
    
    // Log markers
    if (parsed.markers.length > 0) {
      console.log('\nMarkers:');
      parsed.markers.forEach((marker, index) => {
        console.log(`${index + 1}. ${marker.name}: ${marker.coordinate.lat}, ${marker.coordinate.lng}`);
      });
    }
    
    // Read current raceData.ts
    const raceDataPath = join(__dirname, '../src/data/raceData.ts');
    let raceDataContent = readFileSync(raceDataPath, 'utf-8');
    
    // Update route if we have route data
    if (parsed.routes.length > 0) {
      const mainRoute = parsed.routes[0]; // Use the first route
      const routeString = mainRoute.map(coord => 
        `    { lat: ${coord.lat}, lng: ${coord.lng} }`
      ).join(',\n');
      
      // Replace the route array
      raceDataContent = raceDataContent.replace(
        /route:\s*\[[\s\S]*?\]/,
        `route: [\n${routeString}\n  ]`
      );
      
      console.log('\n✅ Updated route in raceData.ts');
    }
    
    // Write updated raceData.ts
    writeFileSync(raceDataPath, raceDataContent, 'utf-8');
    
    console.log('\n✅ Successfully updated raceData.ts');
    console.log('\nNext steps:');
    console.log('1. Review the updated raceData.ts file');
    console.log('2. Update spectator spots manually if needed');
    console.log('3. Run npm run dev to see the updated map');
    
  } catch (error) {
    console.error('Error extracting KMZ data:', error);
    process.exit(1);
  }
}

extractKMZData();

