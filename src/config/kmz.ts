/**
 * KMZ/KML File Configuration
 * Paths to KMZ/KML files used in the application
 */

// KML file in public folder (primary source - direct KML file)
export const KML_FILE_PATH = '/Copy of 2025 Novant Health Charlotte Marathon.kml';

// KMZ file in public folder (fallback if KML doesn't work)
export const KMZ_FILE_PATH = '/Copy of 2025 Novant Health Charlotte Marathon.kmz';

// Fallback: Google My Maps KML export URL
export const GOOGLE_MY_MAPS_KML_URL = `https://www.google.com/maps/d/kml?mid=1M56qvN_r7OLIShRshLUAAuvcArSQEuo&forcekml=1`;

// Use Google My Maps URL by default (required for Google Maps API - it needs a publicly accessible URL)
export const USE_LOCAL_KML = false;
export const USE_LOCAL_KMZ = false;

// Primary source - Google My Maps KML export URL (publicly accessible)
export const PRIMARY_MAP_SOURCE = USE_LOCAL_KML ? KML_FILE_PATH : (USE_LOCAL_KMZ ? KMZ_FILE_PATH : GOOGLE_MY_MAPS_KML_URL);
