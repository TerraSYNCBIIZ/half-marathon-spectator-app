import { useMemo, useState, useCallback, memo, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLES } from '../../config/googleMaps';
import { useKMLData, KMLPlacemark } from '../../hooks/useKMLData';
import { spectatorSpots } from '../../data/raceData';
import MapSidebar from '../Map/MapSidebar';
import { createMarkerIcon, getMarkerCategory } from '../../utils/markerIcons';
import './kmlStyles.css';

interface NativeGoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  selectedSpotId?: string;
  onMarkerClick?: (placemark: KMLPlacemark) => void;
  onSpectatorSpotClick?: (spotId: string) => void;
}

const NativeGoogleMap: React.FC<NativeGoogleMapProps> = memo(({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  onMarkerClick,
  onSpectatorSpotClick,
}) => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<KMLPlacemark | null>(null);
  const [selectedSpotMarker, setSelectedSpotMarker] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocationMarker, setUserLocationMarker] = useState<google.maps.Marker | null>(null);
  const [locationWatchId, setLocationWatchId] = useState<number | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // Initialize with calculated height immediately if window is available
  const getInitialHeight = () => {
    if (typeof window !== 'undefined') {
      const viewportHeight = window.innerHeight;
      return `${Math.max(viewportHeight - 64, 600)}px`;
    }
    return '600px';
  };
  const [containerHeight, setContainerHeight] = useState<string>(getInitialHeight());

  // Load KML data from the public URL
  const kmlUrl = 'https://www.google.com/maps/d/kml?mid=1M56qvN_r7OLIShRshLUAAuvcArSQEuo&forcekml=1';
  const { data, error } = useKMLData(kmlUrl);

  // Filter routes to show ONLY the full marathon route (both halves combined)
  const marathonRoutes = useMemo(() => {
    if (!data) return [];
    return data.routes.filter(route => {
      const name = route.name.toLowerCase();
      
      // Exclude 5K routes
      if (name.includes('5k') || name.includes('chick')) return false;
      
      // Show both 1st and 2nd half to display the full marathon course
      // They should render as one continuous route
      return name.includes('1st half') || name.includes('2nd half');
    });
  }, [data]);

  // Filter placemarks - only show essential markers
  const marathonPlacemarks = useMemo(() => {
    if (!data) return [];
    return data.placemarks.filter(p => {
      const name = p.name.toLowerCase();
      
      // Exclude 5K markers
      if (name.includes('5k')) return false;
      
      // Exclude HCM second half markers
      if (name.includes('hcm second half') || name.includes('second half')) return false;
      
      // Exclude entertainment markers
      if (name.includes('entertainment') || name.includes('dj') || name.includes('smile') || 
          name.includes('running company') || name.includes('community organization')) {
        return false;
      }
      
      // Exclude water stations
      if (name.includes('water')) return false;
      
      // Exclude facilities
      if (name.includes('medical') || name.includes('bag check') || name.includes('expo') ||
          name.includes('lounge') || name.includes('solutions') || name.includes('will call') ||
          name.includes('volunteer') || name.includes('stage') || name.includes('awards') ||
          name.includes('facilities') || name.includes('weigh in')) {
        return false;
      }
      
      // Only show Corral C (Rachel's corral) - exclude all other corrals
      if (name.includes('corral')) {
        // Only show if it's Corral C
        return name.includes('corral c') || name.includes('c corral');
      }
      
      // Keep start/finish and mile markers
      return true;
    });
  }, [data]);

  // Calculate container height after mount to ensure proper dimensions
  useEffect(() => {
    const calculateHeight = () => {
      if (typeof window !== 'undefined') {
        const viewportHeight = window.innerHeight;
        const calculatedHeight = Math.max(viewportHeight - 64, 600);
        const heightString = `${calculatedHeight}px`;
        setContainerHeight(heightString);
        
        if (mapContainerRef.current) {
          mapContainerRef.current.style.height = heightString;
          mapContainerRef.current.style.minHeight = '600px';
        }
      }
    };

    // Calculate once on mount
    calculateHeight();

    // Debounced resize handler
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateHeight, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const mapContainerStyle = useMemo(() => ({
    width: '100%',
    height: containerHeight || '600px',
    minHeight: '600px',
    position: 'relative' as const,
    display: 'block',
  }), [containerHeight]);

  const mapOptions = useMemo(
    () => ({
      styles: MAP_STYLES,
      disableDefaultUI: true,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      gestureHandling: 'cooperative',
      backgroundColor: '#e5e7eb',
    }),
    []
  );

  const [, setSpectatorMarkers] = useState<google.maps.Marker[]>([]);

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

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
    
    // Set container height once
    const mapDiv = map.getDiv();
    if (mapDiv && containerHeight) {
      mapDiv.style.height = containerHeight;
      mapDiv.style.minHeight = '600px';
    }
    
    // Create spectator markers using native Google Maps API
    const markers: google.maps.Marker[] = [];
    
    spectatorSpots.forEach((spot) => {
      const marker = new google.maps.Marker({
        position: spot.coordinates,
        map: map,
        title: spot.name,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32),
        },
        zIndex: 1000,
      });
      
      marker.addListener('click', () => {
        handleSpectatorSpotClick(spot.id);
      });
      
      markers.push(marker);
    });
    
    setSpectatorMarkers(markers);

    // Start tracking user location
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);

          // Create or update user location marker (blue dot)
          if (!userLocationMarker) {
            const marker = new google.maps.Marker({
              position: userPos,
              map: map,
              title: 'Your Location',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3,
              },
              zIndex: 2000,
            });
            setUserLocationMarker(marker);
          } else {
            userLocationMarker.setPosition(userPos);
          }
        },
        (error) => {
          console.error('Location access denied:', error.message);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );
      setLocationWatchId(watchId);
    }
  }, [handleSpectatorSpotClick, userLocationMarker]);

  const handleSidebarPlacemarkSelect = useCallback((placemark: KMLPlacemark) => {
    setSelectedMarker(placemark);
    setSelectedSpotMarker(null);
    if (mapInstance) {
      mapInstance.panTo(placemark.coordinates);
      mapInstance.setZoom(16);
    }
  }, [mapInstance]);


  // Fit map to bounds after map and routes are fully loaded
  useEffect(() => {
    if (!mapInstance || marathonRoutes.length === 0) return;

    let isMounted = true;
    let attemptCount = 0;
    const maxAttempts = 10;

    const tryFitBounds = () => {
      if (!isMounted || attemptCount >= maxAttempts) return;
      attemptCount++;

      // Check if map container has valid dimensions
      const mapDiv = mapInstance.getDiv();
      const rect = mapDiv?.getBoundingClientRect();
      
      if (!rect || rect.width < 100 || rect.height < 100) {
        // Container not ready yet, try again
        requestAnimationFrame(tryFitBounds);
        return;
      }

      // Map container has valid dimensions, now fit bounds
      const bounds = new google.maps.LatLngBounds();
      marathonRoutes.forEach((route) => {
        route.coordinates.forEach((coord) => {
          bounds.extend({ lat: coord.lat, lng: coord.lng });
        });
      });
      
      // Fit bounds with padding
      mapInstance.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    };

    // Wait for map to be idle, then use requestAnimationFrame to ensure layout is complete
    const idleListener = google.maps.event.addListenerOnce(mapInstance, 'idle', () => {
      // Use RAF to wait for browser to finish any pending layout/paint
      requestAnimationFrame(() => {
        requestAnimationFrame(tryFitBounds);
      });
    });

    return () => {
      isMounted = false;
      if (idleListener) {
        google.maps.event.removeListener(idleListener);
      }
    };
  }, [mapInstance, marathonRoutes]);

  // Simplified resize handling - only responds to actual window resize
  useEffect(() => {
    if (!mapInstance) return;

    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (mapInstance) {
          google.maps.event.trigger(mapInstance, 'resize');
        }
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [mapInstance]);

  // Cleanup location tracking on unmount
  useMemo(() => {
    return () => {
      if (locationWatchId !== null) {
        navigator.geolocation.clearWatch(locationWatchId);
      }
      if (userLocationMarker) {
        userLocationMarker.setMap(null);
      }
    };
  }, [locationWatchId, userLocationMarker]);

  // Button to center map on user location
  const centerOnUserLocation = useCallback(() => {
    if (mapInstance && userLocation) {
      mapInstance.panTo(userLocation);
      mapInstance.setZoom(16);
    }
  }, [mapInstance, userLocation]);

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
    <div 
      ref={mapContainerRef} 
      style={{ 
        width: '100%', 
        height: containerHeight, 
        position: 'relative', 
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Sidebar */}
      {data && (
        <MapSidebar
          placemarks={marathonPlacemarks}
          selectedPlacemark={selectedMarker}
          onPlacemarkSelect={handleSidebarPlacemarkSelect}
          spectatorSpots={spectatorSpots}
          selectedSpectatorSpot={selectedSpotMarker}
          onSpectatorSpotSelect={handleSpectatorSpotClick}
        />
      )}

      <LoadScript 
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        onLoad={() => {
          setIsGoogleLoaded(true);
        }}
        onError={(error) => {
          console.error('[MAP] LoadScript error:', error);
        }}
      >
        {isGoogleLoaded && (
          <div 
            id="google-map-wrapper"
            style={{ 
              width: '100%', 
              height: containerHeight, 
              position: 'relative', 
              flex: 1,
              minHeight: '600px'
            }}
          >
            <GoogleMap
            mapContainerStyle={{
              ...mapContainerStyle,
              height: containerHeight, // Force explicit pixel height
            }}
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
        {mapInstance && marathonPlacemarks.map((placemark) => {
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

        {/* Spectator spot routes removed - they caused visual clutter and performance issues */}

        {/* Spectator spots are now created using native Google Maps API in handleMapLoad */}
        {/* This avoids React component re-render issues */}

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
            <div className="p-3 max-w-sm">
              {(() => {
                const spot = spectatorSpots.find(s => s.id === selectedSpotMarker);
                if (!spot) return null;
                
                return (
                  <>
                    <div className="flex items-start space-x-2 mb-2">
                      <svg className="w-5 h-5 text-[#5e6ad2] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base">{spot.name}</h3>
                        <div className="flex items-center space-x-1 text-xs font-semibold text-[#5e6ad2] mt-1">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          </svg>
                          <span>Mile {spot.mileMarker}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{spot.description}</p>
                    
                    {/* Travel info removed - spectator routes have been disabled */}
                    
                    {/* Amenities */}
                    {spot.nearbyCoffee && (
                      <div className="bg-amber-50 p-2 rounded mb-2 text-xs">
                        <div className="font-semibold text-amber-900 mb-1">☕ Coffee:</div>
                        <div className="text-amber-700">{spot.nearbyCoffee}</div>
                      </div>
                    )}
                    
                    {spot.nearbyFood && (
                      <div className="bg-green-50 p-2 rounded mb-2 text-xs">
                        <div className="font-semibold text-green-900 mb-1">🍽️ Food:</div>
                        <div className="text-green-700">{spot.nearbyFood}</div>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${spot.coordinates.lat},${spot.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#5e6ad2] text-white px-3 py-2 rounded text-center text-sm font-medium hover:bg-[#4f5bc7] transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 11l3 3L22 4M5 19l-2-7 20-4-10 6.5"/>
                        </svg>
                        <span>Directions</span>
                      </a>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                      Your spectator spot
                    </p>
                  </>
                );
              })()}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
          </div>
        )}

      {/* Loading/Error overlays - Removed because it blocks the map */}

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

      {/* Center on My Location button */}
      {userLocation && (
        <button
          onClick={centerOnUserLocation}
          className="fixed bottom-24 right-4 z-[1001] bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200"
          title="Center on my location"
        >
          <svg className="w-6 h-6 text-[#4285F4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
          </svg>
        </button>
      )}
    </div>
  );
});

NativeGoogleMap.displayName = 'NativeGoogleMap';

export default NativeGoogleMap;

