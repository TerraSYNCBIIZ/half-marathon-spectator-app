import { useState, useMemo } from 'react';
import { KMLPlacemark } from '../../hooks/useKMLData';
import { SpectatorSpot } from '../../types';
import { getMarkerCategory, getMarkerIconInfo, CATEGORY_ICONS, MarkerCategory } from '../../utils/markerIcons';
import { getSpectatorSpotIcon } from '../../utils/spectatorSpotIcons';
import { Navigation, X, Flag, Milestone, Droplet, Music, Layers, Building, MapPin, CircleDot } from 'lucide-react';

const iconMap = {
  'flag': Flag,
  'milestone': Milestone,
  'droplet': Droplet,
  'music': Music,
  'layers': Layers,
  'building': Building,
  'map-pin': MapPin,
  'circle-dot': CircleDot,
};

interface MapSidebarProps {
  placemarks: KMLPlacemark[];
  selectedPlacemark: KMLPlacemark | null;
  onPlacemarkSelect: (placemark: KMLPlacemark) => void;
  spectatorSpots?: SpectatorSpot[];
  selectedSpectatorSpot?: string | null;
  onSpectatorSpotSelect?: (spotId: string) => void;
  onClose?: () => void;
}

const MapSidebar: React.FC<MapSidebarProps> = ({
  placemarks,
  selectedPlacemark,
  onPlacemarkSelect,
  spectatorSpots = [],
  selectedSpectatorSpot,
  onSpectatorSpotSelect,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Count placemarks by category
  const categoryCounts = useMemo(() => {
    const counts: Record<MarkerCategory, number> = {
      'start-finish': 0,
      'mile-marker': 0,
      'water-station': 0,
      'entertainment': 0,
      'corral': 0,
      'facility': 0,
      'spectator-spot': 0,
      'other': 0,
    };
    
    // Don't count 'other' category - we're removing it
    
    placemarks.forEach(p => {
      const category = getMarkerCategory(p.name);
      counts[category]++;
    });
    
    return counts;
  }, [placemarks]);

  // Build category info with counts
  const categoryInfo = useMemo(() => {
    const info: Record<string, { label: string; iconName: string; count: number; category?: MarkerCategory; color: string }> = {
      all: { label: 'All Markers', iconName: 'map-pin', count: placemarks.length, color: '#6366f1' },
    };
    
    (Object.keys(CATEGORY_ICONS) as MarkerCategory[]).forEach(category => {
      // Skip 'other' category - we don't want to show it
      if (category === 'other') return;
      
      const categoryData = CATEGORY_ICONS[category];
      const count = categoryCounts[category];
      if (count > 0) {
        info[category] = {
          label: categoryData.label,
          iconName: categoryData.emoji,
          count,
          category,
          color: categoryData.color,
        };
      }
    });
    
    return info;
  }, [placemarks.length, categoryCounts]);

  const getDirectionsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  const filteredPlacemarks = useMemo(() => {
    if (selectedCategory === 'all') return placemarks;
    
    const categoryKey = selectedCategory as MarkerCategory;
    return placemarks.filter(p => getMarkerCategory(p.name) === categoryKey);
  }, [placemarks, selectedCategory]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-24 z-[1000] bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <MapPin className="w-6 h-6 text-[#5e6ad2]" />
      </button>
    );
  }

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-lg shadow-2xl z-[1000] flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-[#5e6ad2] text-white">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <h2 className="font-bold text-lg">Race Markers</h2>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            onClose?.();
          }}
          className="text-white hover:bg-white/20 rounded p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Category Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Filter by Category</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(categoryInfo).map(([key, info]) => {
            const Icon = iconMap[info.iconName as keyof typeof iconMap] || MapPin;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`
                  px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2
                  ${selectedCategory === key
                    ? 'bg-[#5e6ad2] text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                <Icon size={16} style={{ color: selectedCategory === key ? 'white' : info.color }} />
                <span className="text-xs flex-1 text-left truncate">{info.label}</span>
                <span className="text-xs opacity-75 font-semibold">({info.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Marker List */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Spectator Spots Section */}
        {spectatorSpots.length > 0 && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Your Spectator Spots</h3>
            <div className="space-y-1">
              {spectatorSpots.map((spot) => {
                const spotConfig = getSpectatorSpotIcon(spot.id, spot.name);
                return (
                  <div
                    key={`spectator-${spot.id}`}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all border
                      ${selectedSpectatorSpot === spot.id
                        ? 'bg-[#f3f4f6] border-[#5e6ad2] shadow-md scale-[1.02]'
                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                      }
                    `}
                    onClick={() => onSpectatorSpotSelect?.(spot.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 flex items-start space-x-3">
                        <div 
                          className="p-2 rounded-lg flex items-center justify-center" 
                          style={{ backgroundColor: `${spotConfig.fillColor}20` }}
                        >
                          <span style={{ fontSize: '18px' }}>{spotConfig.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 truncate">
                            {spot.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            Mile {spot.mileMarker}
                          </p>
                          <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                            <span className="mr-1" style={{ color: spotConfig.fillColor }}>📍</span>
                            Your Spot
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {selectedSpectatorSpot === spot.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${spot.coordinates.lat},${spot.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-[#5e6ad2] text-white px-3 py-2 rounded-lg text-center text-xs font-medium hover:bg-[#4f5bc7] transition-colors flex items-center justify-center space-x-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Navigation size={14} />
                          <span>Get Directions</span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Race Markers Section */}
        <div className="mb-2">
          <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Race Markers</h3>
        </div>
        {filteredPlacemarks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No markers in this category</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredPlacemarks.map((placemark) => {
              const categoryInfo = getMarkerIconInfo(placemark.name);
              const Icon = iconMap[categoryInfo.emoji as keyof typeof iconMap] || MapPin;
              
              return (
                <div
                  key={placemark.id}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all border
                    ${selectedPlacemark?.id === placemark.id
                      ? 'bg-[#f3f4f6] border-[#5e6ad2] shadow-md scale-[1.02]'
                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }
                  `}
                  onClick={() => onPlacemarkSelect(placemark)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 flex items-start space-x-3">
                      <div 
                        className="p-2 rounded-lg" 
                        style={{ backgroundColor: `${categoryInfo.color}20` }}
                      >
                        <Icon size={18} style={{ color: categoryInfo.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 truncate">
                          {placemark.name}
                        </h4>
                        {placemark.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {placemark.description.replace(/<[^>]*>/g, '')}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                          <Icon size={12} className="mr-1" style={{ color: categoryInfo.color }} />
                          {categoryInfo.label}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedPlacemark?.id === placemark.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                      <a
                        href={getDirectionsUrl(placemark.coordinates.lat, placemark.coordinates.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#5e6ad2] text-white px-3 py-2 rounded-lg text-center text-xs font-medium hover:bg-[#4f5bc7] transition-colors flex items-center justify-center space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Navigation size={14} />
                        <span>Get Directions</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSidebar;
