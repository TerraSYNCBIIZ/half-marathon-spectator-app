// Google Maps API configuration
// Get your API key from: https://console.cloud.google.com/google/maps-apis

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Debug logging - will show in production console
if (typeof window !== 'undefined') {
  console.log('🔑 API Key Status:', {
    exists: !!GOOGLE_MAPS_API_KEY,
    length: GOOGLE_MAPS_API_KEY?.length,
    preview: GOOGLE_MAPS_API_KEY?.substring(0, 15) + '...'
  });
}

// Google My Maps Map ID
// Extract from URL: https://www.google.com/maps/d/u/0/edit?mid=YOUR_MAP_ID
export const GOOGLE_MY_MAPS_ID = '1M56qvN_r7OLIShRshLUAAuvcArSQEuo';

// Default map center (Charlotte, NC - from your map)
export const DEFAULT_CENTER = {
  lat: 35.2174,
  lng: -80.8346,
};

// Default zoom level
export const DEFAULT_ZOOM = 13;

// Map style options
export const MAP_STYLES = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
];

// Route polyline options
export const ROUTE_POLYLINE_OPTIONS = {
  strokeColor: '#4f46e5',
  strokeOpacity: 0.8,
  strokeWeight: 4,
  zIndex: 1,
};

// Marker options (will be set after Google Maps loads)
export const getMarkerOptions = () => ({
  clickable: true,
});
