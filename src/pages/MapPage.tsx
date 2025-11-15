import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import NativeGoogleMap from '../components/GoogleMap/NativeGoogleMap';
import { KMLPlacemark } from '../hooks/useKMLData';
import { spectatorSpots } from '../data/raceData';
import { Coordinate } from '../types';

const MapPage = () => {
  const [searchParams] = useSearchParams();
  const selectedSpotId = searchParams.get('spot') || '';

  const selectedSpot = useMemo(() => {
    return spectatorSpots.find(spot => spot.id === selectedSpotId);
  }, [selectedSpotId]);

  const mapCenter: Coordinate = useMemo(() => {
    if (selectedSpot) {
      return selectedSpot.coordinates;
    }
    return { lat: 35.2174, lng: -80.8346 };
  }, [selectedSpot]);

  const handleMarkerClick = (placemark: KMLPlacemark) => {
    console.log('KML Marker clicked:', placemark.name);
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-[#F9FAFB] overflow-hidden" style={{ minHeight: '600px', height: 'calc(100vh - 4rem)' }}>
      <NativeGoogleMap
        center={mapCenter}
        zoom={selectedSpotId ? 15 : 13}
        selectedSpotId={selectedSpotId}
        onMarkerClick={handleMarkerClick}
        onSpectatorSpotClick={(spotId: string) => {
          console.log('Spectator spot clicked:', spotId);
        }}
      />
    </div>
  );
};

export default MapPage;
