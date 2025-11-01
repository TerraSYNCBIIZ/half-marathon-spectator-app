import { useMemo, useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLES } from '../../config/googleMaps';
import { useKMLData, KMLPlacemark } from '../../hooks/useKMLData';
import { spectatorSpots } from '../../data/raceData';
import MapSidebar from '../Map/MapSidebar';
import { getMarkerIconInfo, createMarkerIcon, getMarkerCategory } from '../../utils/markerIcons';
import './kmlStyles.css';

interface NativeGoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  selectedSpotId?: string;
  onMarkerClick?: (placemark: KMLPlacemark) => void;
  onSpectatorSpotClick?: (spotId: string) => void;
}

const NativeGoogleMap: React.FC<NativeGoogleMapProps> = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  selectedSpotId,
  onMarkerClick,
  onSpectatorSpotClick,
}) => {
  const [selectedMarker, setSelectedMarker] = useState<KMLPlacemark | null>(null);
  const [selectedSpotMarker, setSelectedSpotMarker] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  // Load KML data from the public URL
  const kmlUrl = 'https://www.google.com/maps/d/kml?mid=1M56qvN_r7OLIShRshLUAAuvcArSQEuo&forcekml=1';
  const { data, loading, error } = useKMLData(kmlUrl);

  // Filter routes to only show full marathon (exclude 5K and half marathon splits)
  const marathonRoutes = useMemo(() => {
    if (!data) return [];
    return data.routes.filter(route => {
      const name = route.name.toLowerCase();
      // Only show routes that contain "2nd half" or full marathon routes
      // Exclude 5K routes
      return !name.includes('5k') && !name.includes('chick');
    });
  }, [data]);

  // Filter placemarks to exclude 5K markers
  const marathonPlacemarks = useMemo(() => {
    if (!data) return [];
    return data.placemarks.filter(p => {
      const name = p.name.toLowerCase();
      return !name.includes('5k');
    });
  }, [data]);

  const mapContainerStyle = useMemo(
    () => ({
      width: '100%',
      height: '100%',
    }),
    []
  );

  const mapOptions = useMemo(
    () => ({
      styles: MAP_STYLES,
      disableDefaultUI: true,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      gestureHandling: 'cooperative',
    }),
    []
  );

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
    console.log('Map loaded');
  }, []);

  const handleMarkerClick = useCallback((placemark: KMLPlacemark) => {
    setSelectedMarker(placemark);
    if (onMarkerClick) {
      onMarkerClick(placemark);
    }
  }, [onMarkerClick]);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
    setSelectedSpotMarker(null);
  }, []);

  const handleSpectatorSpotClick = useCallback((spotId: string) => {
    setSelectedSpotMarker(spotId);
    setSelectedMarker(null);
    if (onSpectatorSpotClick) {
      onSpectatorSpotClick(spotId);
    }
  }, [onSpectatorSpotClick]);

  const handleSidebarPlacemarkSelect = useCallback((placemark: KMLPlacemark) => {
    setSelectedMarker(placemark);
    setSelectedSpotMarker(null);
    if (mapInstance) {
      mapInstance.panTo(placemark.coordinates);
      mapInstance.setZoom(16);
    }
  }, [mapInstance]);

  // Fit map to bounds if we have data
  useMemo(() => {
    if (mapInstance && marathonRoutes.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      marathonRoutes.forEach((r) => {
        r.coordinates.forEach((c) => {
          bounds.extend({ lat: c.lat, lng: c.lng });
        });
      });
      // Add some padding
      mapInstance.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  }, [mapInstance, marathonRoutes]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <p className="text-red-600 font-semibold mb-2">Google Maps API Key Required</p>
          <p className="text-sm text-gray-600">
            Please set VITE_GOOGLE_MAPS_API_KEY in your .env file
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar */}
      {data && (
        <MapSidebar
          placemarks={marathonPlacemarks}
          selectedPlacemark={selectedMarker}
          onPlacemarkSelect={handleSidebarPlacemarkSelect}
        />
      )}

      <LoadScript
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        loadingElement={<div className="h-full w-full flex items-center justify-center">Loading map...</div>}
      >
        <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={mapOptions}
        onLoad={handleMapLoad}
      >
        {/* Render marathon routes only */}
        {marathonRoutes.map((route) => (
          <Polyline
            key={route.id}
            path={route.coordinates}
            options={{
              strokeColor: route.color || '#4f46e5',
              strokeWeight: route.width || 4,
              strokeOpacity: 0.9,
              zIndex: 1,
            }}
          />
        ))}

        {/* Render KML markers with unique icons based on category */}
        {marathonPlacemarks.map((placemark) => {
          // Determine category and get appropriate icon
          const category = getMarkerCategory(placemark.name);
          const markerIcon = createMarkerIcon(category);

          return (
            <Marker
              key={placemark.id}
              position={placemark.coordinates}
              title={placemark.name}
              onClick={() => handleMarkerClick(placemark)}
              icon={markerIcon}
              zIndex={selectedMarker?.id === placemark.id ? 1000 : 10}
              animation={selectedMarker?.id === placemark.id ? window.google?.maps?.Animation?.BOUNCE : undefined}
            />
          );
        })}

        {/* Render spectator spots from the app */}
        {mapInstance && spectatorSpots.map((spot) => (
          <Marker
            key={`spot-${spot.id}`}
            position={spot.coordinates}
            title={spot.name}
            onClick={() => handleSpectatorSpotClick(spot.id)}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
              fillColor: '#10b981',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
              scale: 12,
            }}
            label={{
              text: '📍',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
            zIndex={100}
          />
        ))}

        {/* Info window for selected KML marker */}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.coordinates}
            onCloseClick={handleInfoWindowClose}
          >
            <div className="p-3 max-w-sm">
              <h3 className="font-bold text-gray-900 mb-2 text-base">{selectedMarker.name}</h3>
              {selectedMarker.description && (
                <div
                  className="text-sm text-gray-700 mb-3"
                  dangerouslySetInnerHTML={{ __html: selectedMarker.description }}
                />
              )}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.coordinates.lat},${selectedMarker.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#5e6ad2] text-white px-3 py-2 rounded text-center text-sm font-medium hover:bg-[#4f5bc7] transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4M5 19l-2-7 20-4-10 6.5"/>
                  </svg>
                  <span>Get Directions</span>
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Race marker
              </p>
            </div>
          </InfoWindow>
        )}

        {/* Info window for selected spectator spot */}
        {selectedSpotMarker && (
          <InfoWindow
            position={spectatorSpots.find(s => s.id === selectedSpotMarker)?.coordinates || center}
            onCloseClick={handleInfoWindowClose}
          >
            <div className="p-2 max-w-xs">
              {(() => {
                const spot = spectatorSpots.find(s => s.id === selectedSpotMarker);
                if (!spot) return null;
                return (
                  <>
                    <div className="flex items-start space-x-2 mb-2">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <h3 className="font-bold text-gray-900 text-base">{spot.name}</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{spot.description}</p>
                    <div className="flex items-center space-x-1 text-xs font-semibold text-[#5e6ad2] mb-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      </svg>
                      <span>Mile {spot.mileMarker}</span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                      Spectator spot from your guide
                    </p>
                  </>
                );
              })()}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Loading/Error overlays */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[999]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e6ad2] mx-auto mb-2"></div>
            <p className="text-gray-600">Loading race map data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg shadow-lg z-[1001] max-w-md">
          <div className="flex items-center space-x-2 mb-1">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="font-semibold">Error Loading Map Data</p>
          </div>
          <p className="text-sm">{error}</p>
        </div>
      )}

      </LoadScript>
    </>
  );
};

export default NativeGoogleMap;

