/**
 * Marker Icon Utilities
 * Maps marker categories to unique Google Maps icons
 */

export type MarkerCategory = 
  | 'start-finish'
  | 'mile-marker'
  | 'water-station'
  | 'entertainment'
  | 'corral'
  | 'facility'
  | 'spectator-spot'
  | 'other';

export interface CategoryInfo {
  icon: string;
  color: string;
  emoji: string;
  label: string;
}

// Google Maps marker icon URLs with different colors
export const CATEGORY_ICONS: Record<MarkerCategory, CategoryInfo> = {
  'start-finish': {
    icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    color: '#ef4444',
    emoji: 'flag',
    label: 'Start & Finish',
  },
  'mile-marker': {
    icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    color: '#3b82f6',
    emoji: 'milestone',
    label: 'Mile Markers',
  },
  'water-station': {
    icon: 'https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png',
    color: '#06b6d4',
    emoji: 'droplet',
    label: 'Water Stations',
  },
  'entertainment': {
    icon: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
    color: '#a855f7',
    emoji: 'music',
    label: 'Entertainment',
  },
  'corral': {
    icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    color: '#eab308',
    emoji: 'layers',
    label: 'Corrals',
  },
  'facility': {
    icon: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
    color: '#f97316',
    emoji: 'building',
    label: 'Facilities',
  },
  'spectator-spot': {
    icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
    color: '#10b981',
    emoji: 'map-pin',
    label: 'Your Spots',
  },
  'other': {
    icon: 'https://maps.google.com/mapfiles/ms/icons/pink-dot.png',
    color: '#ec4899',
    emoji: 'circle-dot',
    label: 'Other',
  },
};

/**
 * Determines the category of a marker based on its name
 */
export function getMarkerCategory(markerName: string): MarkerCategory {
  const name = markerName.toLowerCase();

  if (name.includes('start') || name.includes('finish')) {
    return 'start-finish';
  }
  
  if (name.includes('mile') || name.match(/\d+\s*mile/)) {
    return 'mile-marker';
  }
  
  if (name.includes('water')) {
    return 'water-station';
  }
  
  if (name.includes('entertainment') || name.includes('dj') || name.includes('smile') || name.includes('running company') || name.includes('community organization')) {
    return 'entertainment';
  }
  
  if (name.includes('corral')) {
    return 'corral';
  }
  
  if (
    name.includes('medical') ||
    name.includes('bag check') ||
    name.includes('expo') ||
    name.includes('lounge') ||
    name.includes('solutions') ||
    name.includes('will call') ||
    name.includes('volunteer') ||
    name.includes('stage') ||
    name.includes('awards') ||
    name.includes('facilities') ||
    name.includes('weigh in')
  ) {
    return 'facility';
  }
  
  return 'other';
}

/**
 * Gets the icon info for a marker based on its name
 */
export function getMarkerIconInfo(markerName: string): CategoryInfo {
  const category = getMarkerCategory(markerName);
  return CATEGORY_ICONS[category];
}

/**
 * Gets all unique categories present in a list of marker names
 */
export function getUniqueCategories(markerNames: string[]): MarkerCategory[] {
  const categories = new Set<MarkerCategory>();
  markerNames.forEach(name => {
    categories.add(getMarkerCategory(name));
  });
  return Array.from(categories).sort();
}

/**
 * Creates a Google Maps marker icon configuration
 * Only call this when google.maps is available (after map loads)
 */
export function createMarkerIcon(category: MarkerCategory, size: number = 32): google.maps.Icon {
  const info = CATEGORY_ICONS[category];
  
  // If google.maps is not available, return a fallback that will be replaced
  // This should only happen during initial render before map loads
  if (typeof google === 'undefined' || !google.maps) {
    // Return just the URL - Google Maps will use default sizing
    return {
      url: info.icon,
    } as google.maps.Icon;
  }
  
  return {
    url: info.icon,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size),
  };
}

