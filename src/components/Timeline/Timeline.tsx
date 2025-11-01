import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'pre-race' | 'race' | 'spectator' | 'post-race';
  location?: string;
  mileMarker?: number;
  spotId?: string;
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

  const getTypeIcon = (type: TimelineItem['type']) => {
    switch (type) {
      case 'pre-race':
        return '🚗';
      case 'race':
        return '🏃';
      case 'spectator':
        return '📍';
      case 'post-race':
        return '🎉';
      default:
        return '•';
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
                {getTypeIcon(item.type)}
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
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                    {item.location && (
                      <p className="text-sm text-gray-600 mb-2">📍 {item.location}</p>
                    )}
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                  <button
                    className={`ml-4 text-gray-400 hover:text-gray-600 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {item.spotId && (
                      <div className="space-y-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/guide#${item.spotId}`);
                            // Scroll to the spot after navigation
                            setTimeout(() => {
                              const element = document.getElementById(`spot-${item.spotId}`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }, 100);
                          }}
                          className="btn-primary w-full"
                        >
                          View Spot Details →
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/map?spot=${item.spotId}`);
                          }}
                          className="btn-secondary w-full"
                        >
                          View on Map →
                        </button>
                      </div>
                    )}
                    <div className="text-sm text-gray-600">
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

