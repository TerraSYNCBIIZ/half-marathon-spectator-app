/**
 * Unique icons for each spectator spot
 * Each spot gets a distinct icon to make them easily identifiable on the map
 */

export type SpectatorSpotType = 
  | 'start'
  | 'early-race'
  | 'scenic'
  | 'coffee-break'
  | 'critical-support'
  | 'final-push'
  | 'finish'
  | 'lunch';

export interface SpotIconConfig {
  fillColor: string;
  strokeColor: string;
  scale: number;
  label: string;
  emoji: string;
  iconUrl: string;
}

export const SPOT_ICONS: Record<SpectatorSpotType, SpotIconConfig> = {
  'start': {
    fillColor: '#ef4444', // Red - Start line
    strokeColor: '#ffffff',
    scale: 14,
    label: '🚩',
    emoji: '🚩',
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  },
  'early-race': {
    fillColor: '#3b82f6', // Blue - Early race
    strokeColor: '#ffffff',
    scale: 12,
    label: '📍',
    emoji: '📍',
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  },
  'scenic': {
    fillColor: '#10b981', // Green - Scenic beauty
    strokeColor: '#ffffff',
    scale: 12,
    label: '🌳',
    emoji: '🌳',
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
  },
  'coffee-break': {
    fillColor: '#f59e0b', // Amber - Coffee break
    strokeColor: '#ffffff',
    scale: 12,
    label: '☕',
    emoji: '☕',
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
  },
  'critical-support': {
    fillColor: '#dc2626', // Dark red - Critical support
    strokeColor: '#ffffff',
    scale: 14,
    label: '💪',
    emoji: '💪',
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  },
  'final-push': {
    fillColor: '#8b5cf6', // Purple - Final push
    strokeColor: '#ffffff',
    scale: 12,
    label: '🏃',
    emoji: '🏃',
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
  },
  'finish': {
    fillColor: '#059669', // Emerald - Finish line
    strokeColor: '#ffffff',
    scale: 16,
    label: '🏁',
    emoji: '🏁',
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
  },
  'lunch': {
    fillColor: '#f97316', // Orange - Lunch
    strokeColor: '#ffffff',
    scale: 12,
    label: '🍽️',
    emoji: '🍽️',
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
  },
};

/**
 * Get icon configuration for a spectator spot based on its ID or name
 */
export function getSpectatorSpotIcon(spotId: string, spotName: string): SpotIconConfig {
  const id = spotId.toLowerCase();
  const name = spotName.toLowerCase();

  // Start line
  if (id.includes('start') || name.includes('start')) {
    return SPOT_ICONS.start;
  }

  // Finish line
  if (id.includes('finish') || name.includes('finish')) {
    return SPOT_ICONS.finish;
  }

  // Lunch spot
  if (id.includes('lunch') || name.includes('lunch') || name.includes('7th street')) {
    return SPOT_ICONS.lunch;
  }

  // Critical support (Mile 20 - The Wall)
  if (id.includes('wall') || name.includes('wall') || name.includes('mile 20')) {
    return SPOT_ICONS['critical-support'];
  }

  // Final push (Mile 22)
  if (name.includes('final push') || name.includes('mile 22')) {
    return SPOT_ICONS['final-push'];
  }

  // Coffee break (Mile 11.5 - Not Just Coffee)
  if (name.includes('not just coffee') || name.includes('coffee') || name.includes('mile 11')) {
    return SPOT_ICONS['coffee-break'];
  }

  // Scenic (Mile 6 - Queens Road)
  if (name.includes('queens road') || name.includes('scenic') || name.includes('mile 6')) {
    return SPOT_ICONS.scenic;
  }

  // Early race (Mile 2.1)
  if (name.includes('mile 2') || name.includes('fourth') || name.includes('hawthorne')) {
    return SPOT_ICONS['early-race'];
  }

  // Default
  return SPOT_ICONS['early-race'];
}

/**
 * Create a Google Maps icon object for a spectator spot (using URL-based icons like KML markers)
 */
export function createSpectatorSpotIcon(spotId: string, spotName: string, size: number = 40) {
  const config = getSpectatorSpotIcon(spotId, spotName);
  
  return {
    url: config.iconUrl,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size),
  };
}

/**
 * Get label for spectator spot marker
 */
export function getSpectatorSpotLabel(spotId: string, spotName: string): google.maps.MarkerLabel {
  const config = getSpectatorSpotIcon(spotId, spotName);
  
  return {
    text: config.label,
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
  };
}

