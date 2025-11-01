import { useMemo, useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, KmlLayer } from '@react-google-maps/api';
import { Coordinate } from '../../types';
import { GOOGLE_MAPS_API_KEY, DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLES } from '../../config/googleMaps';
import { PRIMARY_MAP_SOURCE } from '../../config/kmz';
import './kmlStyles.css';

interface GoogleMapComponentProps {
  center?: Coordinate;
  zoom?: number;
  onKmlPlacemarkClick?: (name: string, coordinates: Coordinate) => void;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  onKmlPlacemarkClick,
}) => {
  const [kmlError, setKmlError] = useState<string | null>(null);
  const [kmlStatus, setKmlStatus] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const kmlLayerRef = useRef<google.maps.KmlLayer | null>(null);

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
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
    }),
    []
  );

  // Use KML file as primary source
  const kmlUrl = useMemo(() => {
    return PRIMARY_MAP_SOURCE;
  }, []);

  // Handle map load
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
  };

  // Handle KML layer load
  const handleKmlLayerLoad = (kmlLayer: google.maps.KmlLayer) => {
    kmlLayerRef.current = kmlLayer;
    console.log('KML Layer loaded successfully');
    
    // Check the status of the KML layer
    const status = kmlLayer.getStatus();
    console.log('KML Layer status:', status);
    
    if (status === google.maps.KmlLayerStatus.DOCUMENT_NOT_FOUND) {
      setKmlError('KML document not found. Make sure your Google My Maps is set to "Public on the web".');
      setKmlStatus('ERROR');
    } else if (status === google.maps.KmlLayerStatus.FETCH_ERROR) {
      setKmlError('Error fetching KML. Check your internet connection and map privacy settings.');
      setKmlStatus('ERROR');
    } else if (status === google.maps.KmlLayerStatus.INVALID_DOCUMENT) {
      setKmlError('Invalid KML document. Please check the KML file format.');
      setKmlStatus('ERROR');
    } else if (status === google.maps.KmlLayerStatus.INVALID_REQUEST) {
      setKmlError('Invalid KML request. Please check the URL.');
      setKmlStatus('ERROR');
    } else if (status === google.maps.KmlLayerStatus.LIMITS_EXCEEDED) {
      setKmlError('KML layer limits exceeded. The map may be too complex.');
      setKmlStatus('ERROR');
    } else if (status === google.maps.KmlLayerStatus.TIMED_OUT) {
      setKmlError('KML layer timed out. Please try again.');
      setKmlStatus('ERROR');
    } else if (status === google.maps.KmlLayerStatus.OK) {
      setKmlStatus('OK');
      console.log('KML Layer is OK and should be visible');
      
      // Get the default viewport from the KML
      const defaultViewport = kmlLayer.getDefaultViewport();
      if (defaultViewport && mapRef.current) {
        console.log('Fitting map to KML bounds:', defaultViewport);
        mapRef.current.fitBounds(defaultViewport);
      }
    }
    
    // Set up click handlers for KML placemarks
    if (kmlLayer && mapRef.current) {
      google.maps.event.addListener(kmlLayer, 'click', (event: any) => {
        if (event.featureData && onKmlPlacemarkClick) {
          const name = event.featureData.name || '';
          const coordinates = event.latLng ? {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          } : center;
          
          onKmlPlacemarkClick(name, coordinates);
        }
      });
    }
  };

  // Log KML URL for debugging
  useEffect(() => {
    if (kmlUrl && mapLoaded) {
      console.log('Loading KMZ/KML from:', kmlUrl);
      setKmlError(null);
      setKmlStatus('LOADING');
      
      // Test if URL is accessible (for HTTP URLs)
      if (kmlUrl.startsWith('http')) {
        fetch(kmlUrl, { method: 'HEAD' })
          .then((response) => {
            console.log('KML URL fetch test:', response.status, response.statusText);
            if (!response.ok) {
              setKmlError(`KML URL returned ${response.status}. Map may not be public.`);
              setKmlStatus('ERROR');
            } else {
              setKmlStatus('OK');
            }
          })
          .catch((err) => {
            console.error('KML URL fetch error:', err);
            // Don't set error for local files
            if (kmlUrl.startsWith('http')) {
              setKmlError('Cannot access KML URL. Check map privacy settings.');
              setKmlStatus('ERROR');
            }
          });
      } else {
        // Local file - assume it exists
        setKmlStatus('OK');
      }
    }
  }, [kmlUrl, mapLoaded]);

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
      <LoadScript 
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        loadingElement={<div className="h-full w-full flex items-center justify-center">Loading map...</div>}
        onLoad={() => console.log('Google Maps API script loaded')}
        onError={(error) => console.error('Google Maps API load error:', error)}
      >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={mapOptions}
        onLoad={handleMapLoad}
      >
        {/* KML Layer - Loads KMZ file directly (primary source of truth) */}
            {kmlUrl && mapLoaded && (
              <KmlLayer
                url={kmlUrl}
                options={{
                  preserveViewport: true,
                  suppressInfoWindows: false,
                  clickable: true,
                }}
                onLoad={handleKmlLayerLoad}
                onStatusChanged={() => {
                  // Check status after a brief delay to ensure KML layer is fully initialized
                  if (kmlLayerRef.current) {
                    setTimeout(() => {
                      const kmlStatus = kmlLayerRef.current?.getStatus();
                      console.log('KML Layer getStatus():', kmlStatus);
                      console.log('KML URL being used:', kmlUrl);
                      
                      if (kmlStatus === google.maps.KmlLayerStatus.OK) {
                        setKmlStatus('OK');
                        setKmlError(null);
                      } else if (kmlStatus !== undefined && kmlStatus !== null) {
                        // Map status codes to error messages
                        const statusMessages: Partial<Record<google.maps.KmlLayerStatus, string>> = {
                          [google.maps.KmlLayerStatus.DOCUMENT_NOT_FOUND]: 'KML document not found. Make sure your Google My Maps is set to "Public on the web".',
                          [google.maps.KmlLayerStatus.FETCH_ERROR]: 'Error fetching KML. Check your internet connection.',
                          [google.maps.KmlLayerStatus.INVALID_DOCUMENT]: 'Invalid KML document format.',
                          [google.maps.KmlLayerStatus.INVALID_REQUEST]: 'Invalid KML request. Check the URL.',
                          [google.maps.KmlLayerStatus.LIMITS_EXCEEDED]: 'KML layer limits exceeded. Map may be too complex.',
                          [google.maps.KmlLayerStatus.TIMED_OUT]: 'KML layer timed out.',
                        };
                        
                        const errorMsg = statusMessages[kmlStatus] || `KML Layer error: ${kmlStatus}`;
                        setKmlError(errorMsg);
                        setKmlStatus('ERROR');
                      }
                    }, 100);
                  }
                }}
              />
            )}
      </GoogleMap>
      
      {/* Error Display */}
      {kmlError && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg z-[1001] max-w-md">
          <p className="font-semibold mb-1">⚠️ KMZ/KML Loading Issue</p>
          <p className="text-sm">{kmlError}</p>
          <p className="text-xs mt-2">
            Status: {kmlStatus || 'Unknown'}
          </p>
          <p className="text-xs mt-1">
            Source: {PRIMARY_MAP_SOURCE.includes('.kml') ? 'Local KML file' : PRIMARY_MAP_SOURCE.includes('.kmz') ? 'Local KMZ file' : 'Google My Maps'}
          </p>
        </div>
      )}
    </LoadScript>
  );
};

export default GoogleMapComponent;
