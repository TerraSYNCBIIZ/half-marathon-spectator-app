import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  Flag, 
  MapPin, 
  Trophy, 
  Coffee, 
  UtensilsCrossed,
  Navigation,
  ChevronDown,
  Footprints
} from 'lucide-react';

interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'pre-race' | 'race' | 'spectator' | 'post-race';
  location?: string;
  mileMarker?: number;
  spotId?: string;
  nearbyCoffee?: string;
  nearbyFood?: string;
  parking?: string;
  parkingLocations?: string;
}

interface ParsedAmenity {
  name: string;
  address: string;
  distance: string;
}

interface TimelineProps {
  items: TimelineItem[];
  onItemClick?: (item: TimelineItem) => void;
}

const Timeline: React.FC<TimelineProps> = ({ items, onItemClick }) => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Parse amenity string like "Not Just Coffee - Packard Place (222 S Church St, Charlotte, NC, 0.08 mi / 2 min walk)"
  const parseAmenities = (amenityStr: string): ParsedAmenity[] => {
    if (!amenityStr || amenityStr.trim() === '') {
      return [];
    }
    
    const amenities: ParsedAmenity[] = [];
    
    // Split by ), to separate multiple amenities (handles multiple entries)
    const parts = amenityStr.split(/\),\s*/);
    
    parts.forEach((part) => {
      let trimmed = part.trim();
      if (!trimmed) return;
      
      // Add back the closing paren if it was removed by split
      if (!trimmed.endsWith(')')) {
        trimmed += ')';
      }
      
      // Match pattern: "Name (contents)"
      const match = trimmed.match(/^(.+?)\s*\((.+)\)$/);
      if (match) {
        const name = match[1].trim();
        const inParens = match[2].trim();
        
        // Split contents by comma
        const contentParts = inParens.split(',').map(p => p.trim());
        
        if (contentParts.length >= 2) {
          // Last part is distance, everything else is address
          const distance = contentParts[contentParts.length - 1];
          const address = contentParts.slice(0, -1).join(', ');
          
          amenities.push({
            name,
            address,
            distance,
          });
        } else {
          // Single item - treat as address
          amenities.push({
            name,
            address: inParens,
            distance: 'nearby',
          });
        }
      }
    });
    
    return amenities;
  };

  const getTypeColor = (type: TimelineItem['type']) => {
    switch (type) {
      case 'pre-race':
        return 'bg-blue-500';
      case 'race':
        return 'bg-green-500';
      case 'spectator':
        return 'bg-[#5e6ad2]';
      case 'post-race':
        return 'bg-[#8b95ed]';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: TimelineItem['type'], title: string) => {
    // Check title for specific icons
    if (title.includes('Travel')) {
      return title.includes('Walk') ? Footprints : Car;
    }
    if (title.includes('Coffee')) {
      return Coffee;
    }
    if (title.includes('Lunch') || title.includes('Food')) {
      return UtensilsCrossed;
    }
    if (title.includes('Finish Line')) {
      return Flag;
    }
    
    // Default by type
    switch (type) {
      case 'pre-race':
        return Car;
      case 'race':
        return Flag;
      case 'spectator':
        return MapPin;
      case 'post-race':
        return Trophy;
      default:
        return MapPin;
    }
  };

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200" />

      <div className="space-y-6">
        {items.map((item, index) => {
          const isExpanded = expandedItems.has(item.id);
          const isLast = index === items.length - 1;

          return (
            <div key={item.id} className="relative">
              {/* Timeline Dot */}
              <div
                className={`absolute left-0 w-12 h-12 rounded-full ${getTypeColor(
                  item.type
                )} flex items-center justify-center text-white text-lg font-bold z-10 shadow-lg`}
                style={{ top: '0.5rem' }}
              >
                {(() => {
                  const IconComponent = getTypeIcon(item.type, item.title);
                  return <IconComponent size={24} strokeWidth={2.5} />;
                })()}
              </div>

              {/* Content Card */}
              <div
                className={`ml-16 card transition-all duration-200 cursor-pointer ${
                  isExpanded ? 'ring-2 ring-[#5e6ad2] shadow-xl' : 'hover:shadow-xl'
                }`}
                onClick={() => {
                  toggleExpand(item.id);
                  onItemClick?.(item);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-[#5e6ad2]">{item.time}</span>
                      {item.mileMarker !== undefined && (
                        <span className="bg-[#f3f4f6] text-[#5e6ad2] px-2 py-1 rounded-full text-sm font-semibold">
                          Mile {item.mileMarker}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    {item.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                        <Navigation size={14} className="flex-shrink-0" />
                        <span className="font-medium">{item.location}</span>
                      </div>
                    )}
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{item.description}</p>
                  </div>
                  <button
                    className={`ml-4 text-gray-400 hover:text-gray-600 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronDown size={24} />
                  </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {/* Main Location Buttons */}
                    {item.location && (
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center space-x-2 bg-[#5e6ad2] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4f5bc7] transition-colors"
                        >
                          <Navigation size={16} />
                          <span>Get Directions</span>
                        </a>
                    {item.spotId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/map?spot=${item.spotId}`);
                          }}
                            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            <MapPin size={16} />
                            <span>View on Map</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Coffee Amenities */}
                    {item.nearbyCoffee && parseAmenities(item.nearbyCoffee).length > 0 && (
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Coffee size={16} className="text-amber-600" />
                          <h4 className="font-semibold text-sm text-amber-900">Coffee Options</h4>
                        </div>
                        <div>
                          {parseAmenities(item.nearbyCoffee).map((amenity, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(amenity.address + ', Charlotte, NC')}`, '_blank');
                              }}
                              className="w-full text-left p-3 bg-white rounded-lg border-2 border-amber-200 hover:border-amber-400 hover:shadow-md transition-all mb-2"
                        >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold text-sm text-gray-900 mb-1">{amenity.name}</div>
                                  <div className="text-xs text-gray-600">{amenity.address}</div>
                                  <div className="flex items-center gap-1 mt-2 text-xs text-amber-600 font-semibold">
                                    <Navigation size={12} />
                                    <span>{amenity.distance}</span>
                                  </div>
                                </div>
                                <Navigation size={20} className="text-amber-600 flex-shrink-0 ml-3" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Food Amenities */}
                    {item.nearbyFood && parseAmenities(item.nearbyFood).length > 0 && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <UtensilsCrossed size={16} className="text-green-600" />
                          <h4 className="font-semibold text-sm text-green-900">Food Options</h4>
                        </div>
                        <div>
                          {parseAmenities(item.nearbyFood).map((amenity, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(amenity.address + ', Charlotte, NC')}`, '_blank');
                              }}
                              className="w-full text-left p-3 bg-white rounded-lg border-2 border-green-200 hover:border-green-400 hover:shadow-md transition-all mb-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold text-sm text-gray-900 mb-1">{amenity.name}</div>
                                  <div className="text-xs text-gray-600">{amenity.address}</div>
                                  <div className="flex items-center gap-1 mt-2 text-xs text-green-600 font-semibold">
                                    <Navigation size={12} />
                                    <span>{amenity.distance}</span>
                                  </div>
                                </div>
                                <Navigation size={20} className="text-green-600 flex-shrink-0 ml-3" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Parking Locations */}
                    {item.parkingLocations && parseAmenities(item.parkingLocations).length > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Car size={16} className="text-blue-600" />
                          <h4 className="font-semibold text-sm text-blue-900">Parking</h4>
                        </div>
                        <div>
                          {parseAmenities(item.parkingLocations).map((amenity, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(amenity.address + ', Charlotte, NC')}`, '_blank');
                              }}
                              className="w-full text-left p-3 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all mb-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold text-sm text-gray-900 mb-1">{amenity.name}</div>
                                  <div className="text-xs text-gray-600">{amenity.address}</div>
                                  <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 font-semibold">
                                    <Navigation size={12} />
                                    <span>{amenity.distance}</span>
                                  </div>
                                </div>
                                <Navigation size={20} className="text-blue-600 flex-shrink-0 ml-3" />
                              </div>
                        </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Parking Info (General Text) */}
                    {item.parking && item.parking.length > 20 && !item.parkingLocations && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Car size={16} className="text-blue-600" />
                          <h4 className="font-semibold text-sm text-blue-900">Parking</h4>
                        </div>
                        <p className="text-sm text-blue-800">{item.parking}</p>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 text-center pt-2">
                      <p>Tap to collapse</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="absolute left-6 top-12 bottom-0 w-1 bg-gray-200" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;

