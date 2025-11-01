import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spectatorSpots } from '../data/raceData';
import { SpectatorSpot } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { MapPin, Navigation as NavIcon, Car } from 'lucide-react';

const SpectatorGuidePage = () => {
  const navigate = useNavigate();
  const [selectedSpot, setSelectedSpot] = useState<SpectatorSpot | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const spot = spectatorSpots.find(s => s.id === hash);
      if (spot) {
        setSelectedSpot(spot);
        setTimeout(() => {
          const element = document.getElementById(`spot-${hash}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, []);

  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-4">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4 flex items-center space-x-3">
            <MapPin className="w-8 h-8 md:w-10 md:h-10 text-[#5e6ad2]" aria-hidden="true" />
            <span>Spectator Viewing Spots</span>
          </h1>
          <p className="text-lg md:text-xl text-[#6B7280]">
            Choose the best locations to cheer on your runner
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {spectatorSpots.map((spot) => (
              <div
                key={spot.id}
                id={`spot-${spot.id}`}
                onClick={() => setSelectedSpot(spot)}
                className={`card cursor-pointer transition-all duration-200 ${
                  selectedSpot?.id === spot.id
                    ? 'ring-2 ring-[#5e6ad2] shadow-lg'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-[#1F2937]">
                    Mile {spot.mileMarker}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getCrowdLevelColor(spot.crowdLevel)}`}>
                    {spot.crowdLevel} crowd
                  </span>
                </div>
                <p className="text-base text-[#1F2937] font-semibold mb-2">{spot.name}</p>
                <p className="text-sm text-[#6B7280] line-clamp-2">
                  {spot.description}
                </p>
                {spot.travelTimeFromPrevious && spot.travelTimeFromPrevious > 0 && (
                  <div className="mt-2 text-sm text-[#5e6ad2] font-semibold flex items-center space-x-1">
                    <Car className="w-3 h-3" aria-hidden="true" />
                    <span>~{spot.travelTimeFromPrevious} min from previous spot</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedSpot ? (
              <Card className="sticky top-20">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4 flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-2">
                        {selectedSpot.name}
                      </h2>
                      <div className="flex items-center flex-wrap gap-3">
                        <Badge variant="primary">Mile {selectedSpot.mileMarker}</Badge>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCrowdLevelColor(selectedSpot.crowdLevel)}`}>
                          {selectedSpot.crowdLevel} crowd
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-[#6B7280]">{selectedSpot.description}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-2 flex items-center space-x-2">
                      <span>🅿️</span>
                      <span>Parking</span>
                    </h3>
                    <p className="text-base text-[#6B7280]">{selectedSpot.parking}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-2 flex items-center space-x-2">
                      <span>♿</span>
                      <span>Accessibility</span>
                    </h3>
                    <p className="text-base text-[#6B7280]">{selectedSpot.accessibility}</p>
                  </div>

                  {selectedSpot.amenities.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-[#1F2937] mb-2 flex items-center space-x-2">
                        <span>🏪</span>
                        <span>Amenities</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSpot.amenities.map((amenity, index) => (
                          <Badge key={index} variant="secondary">{amenity}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSpot.photoOps.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-[#1F2937] mb-2 flex items-center space-x-2">
                        <span>📸</span>
                        <span>Photo Opportunities</span>
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-base text-[#6B7280]">
                        {selectedSpot.photoOps.map((op, index) => (
                          <li key={index}>{op}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedSpot.tips.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-[#1F2937] mb-2 flex items-center space-x-2">
                        <span>💡</span>
                        <span>Tips</span>
                      </h3>
                      <ul className="space-y-2">
                        {selectedSpot.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#5e6ad2] mr-2 mt-1">▸</span>
                            <span className="text-base text-[#6B7280]">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-2">
                    <Button
                      variant="primary"
                      className="w-full flex items-center justify-center space-x-2"
                      onClick={() => navigate(`/map?spot=${selectedSpot.id}`)}
                    >
                      <MapPin className="w-5 h-5" aria-hidden="true" />
                      <span>View on Map</span>
                    </Button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.coordinates.lat},${selectedSpot.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        variant="secondary"
                        className="w-full flex items-center justify-center space-x-2"
                      >
                        <NavIcon className="w-5 h-5" aria-hidden="true" />
                        <span>Get Directions</span>
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-96 flex items-center justify-center text-center">
                <div>
                  <div className="text-6xl mb-4">👈</div>
                  <p className="text-xl text-[#6B7280]">
                    Select a spot to see details
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpectatorGuidePage;
