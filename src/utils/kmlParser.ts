import { DOMParser } from 'xmldom';
import JSZip from 'jszip';
import { Coordinate } from '../types';

export interface KMLPlacemark {
  name: string;
  coordinates: Coordinate[];
  description?: string;
  styleUrl?: string;
}

export interface ParsedKML {
  placemarks: KMLPlacemark[];
  routes: Coordinate[][];
  markers: Array<{
    name: string;
    coordinate: Coordinate;
    description?: string;
  }>;
}

/**
 * Parse KML file content and extract coordinates, routes, and markers
 */
export function parseKML(kmlContent: string): ParsedKML {
  const parser = new DOMParser();
  const kmlDoc = parser.parseFromString(kmlContent, 'text/xml');

  const placemarks: KMLPlacemark[] = [];
  const routes: Coordinate[][] = [];
  const markers: Array<{ name: string; coordinate: Coordinate; description?: string }> = [];

  // Get all Placemark elements
  const placemarkNodes = kmlDoc.getElementsByTagName('Placemark');

  for (let i = 0; i < placemarkNodes.length; i++) {
    const placemark = placemarkNodes[i];
    const nameNode = placemark.getElementsByTagName('name')[0];
    const name = nameNode?.textContent || `Placemark ${i + 1}`;

    const descriptionNode = placemark.getElementsByTagName('description')[0];
    const description = descriptionNode?.textContent || undefined;

    const styleUrlNode = placemark.getElementsByTagName('styleUrl')[0];
    const styleUrl = styleUrlNode?.textContent || undefined;

    // Check for LineString (route)
    const lineStringNode = placemark.getElementsByTagName('LineString')[0];
    if (lineStringNode) {
      const coordinatesNode = lineStringNode.getElementsByTagName('coordinates')[0];
      if (coordinatesNode) {
        const coords = parseCoordinates(coordinatesNode.textContent || '');
        if (coords.length > 0) {
          routes.push(coords);
          placemarks.push({
            name,
            coordinates: coords,
            description,
            styleUrl,
          });
        }
      }
    }

    // Check for Point (marker)
    const pointNode = placemark.getElementsByTagName('Point')[0];
    if (pointNode) {
      const coordinatesNode = pointNode.getElementsByTagName('coordinates')[0];
      if (coordinatesNode) {
        const coords = parseCoordinates(coordinatesNode.textContent || '');
        if (coords.length > 0) {
          markers.push({
            name,
            coordinate: coords[0],
            description,
          });
        }
      }
    }
  }

  return {
    placemarks,
    routes,
    markers,
  };
}

/**
 * Parse coordinate string from KML format (lng,lat,altitude or lng,lat)
 */
function parseCoordinates(coordinateString: string): Coordinate[] {
  const coords: Coordinate[] = [];
  const lines = coordinateString.trim().split(/\s+/);

  for (const line of lines) {
    const parts = line.split(',');
    if (parts.length >= 2) {
      const lng = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);

      if (!isNaN(lat) && !isNaN(lng)) {
        coords.push({ lat, lng });
      }
    }
  }

  return coords;
}

/**
 * Parse KMZ file (ZIP archive containing KML)
 */
export async function parseKMZ(kmzFile: File | ArrayBuffer): Promise<ParsedKML> {
  try {
    // Load the KMZ file
    const zip = await JSZip.loadAsync(kmzFile);
    
    // Find the KML file inside (usually doc.kml or the first .kml file)
    const kmlFiles = Object.keys(zip.files).filter(name => name.endsWith('.kml'));
    
    if (kmlFiles.length === 0) {
      throw new Error('No KML file found in KMZ archive');
    }
    
    // Get the first KML file (usually doc.kml)
    const kmlFileName = kmlFiles[0];
    const kmlFile = zip.files[kmlFileName];
    
    if (!kmlFile) {
      throw new Error(`KML file ${kmlFileName} not found in archive`);
    }
    
    // Read the KML content
    const kmlContent = await kmlFile.async('text');
    
    // Parse the KML content
    return parseKML(kmlContent);
  } catch (error) {
    console.error('Error parsing KMZ file:', error);
    throw error;
  }
}

/**
 * Parse KMZ file from file path (for Node.js environments)
 */
export async function parseKMZFromPath(filePath: string): Promise<ParsedKML> {
  const fs = await import('fs/promises');
  const fileBuffer = await fs.readFile(filePath);
  return parseKMZ(fileBuffer.buffer);
}
