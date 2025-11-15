/**
 * Pre-planned routes between spectator spots
 * These routes show the optimal travel paths between viewing locations
 */

import { Coordinate, SpectatorSpot } from '../types';

export interface SpectatorRoute {
  fromSpotId: string;
  toSpotId: string;
  route: Coordinate[];
  travelMode: 'walking' | 'driving';
  estimatedTime: number; // minutes
  distance: number; // miles
  description: string;
  color: string;
}

/**
 * Calculate route between two spectator spots
 * For now, we'll create a simple straight-line route
 * In production, you'd use Google Directions API for actual driving routes
 */
function calculateRoute(from: Coordinate, to: Coordinate, waypoints?: Coordinate[]): Coordinate[] {
  const route: Coordinate[] = [from];
  
  // Add waypoints if provided
  if (waypoints && waypoints.length > 0) {
    route.push(...waypoints);
  }
  
  route.push(to);
  
  return route;
}

/**
 * Get all spectator routes in order
 */
export function getSpectatorRoutes(spots: SpectatorSpot[]): SpectatorRoute[] {
  const routes: SpectatorRoute[] = [];
  
  // Sort spots by mile marker
  const sortedSpots = [...spots].sort((a, b) => a.mileMarker - b.mileMarker);
  
  for (let i = 0; i < sortedSpots.length - 1; i++) {
    const fromSpot = sortedSpots[i];
    const toSpot = sortedSpots[i + 1];
    
    // Determine travel mode and route based on spots
    let travelMode: 'walking' | 'driving' = 'driving';
    let waypoints: Coordinate[] | undefined;
    let color = '#5e6ad2'; // Default blue
    let description = '';
    
    // Start to Mile 2.1 - WALKING
    if (fromSpot.mileMarker === 0 && toSpot.mileMarker === 2.1) {
      travelMode = 'walking';
      color = '#10b981'; // Green for walking
      description = 'Walk 20 minutes (1.3 miles) - avoids road closures';
    }
    // Mile 2.1 to Mile 6 - DRIVING via Park Road
    else if (fromSpot.mileMarker === 2.1 && toSpot.mileMarker === 6) {
      travelMode = 'driving';
      color = '#3b82f6'; // Blue for driving
      description = 'Drive 11-14 min via Park Road (avoid closed Queens Road)';
      // Add waypoints to show Park Road route (parallel to closed Queens Road)
      waypoints = [
        { lat: 35.2050, lng: -80.8300 }, // Park Road area - intermediate point
        { lat: 35.1950, lng: -80.8310 }, // Approaching Queens Road area
      ];
    }
    // Mile 6 to Mile 11.5 - DRIVING via Park Road → South Boulevard
    else if (fromSpot.mileMarker === 6 && toSpot.mileMarker === 11.5) {
      travelMode = 'driving';
      color = '#3b82f6';
      description = 'Drive 13-16 min via Park Road → South Boulevard';
      waypoints = [
        { lat: 35.1950, lng: -80.8350 }, // Park Road continuation
        { lat: 35.2050, lng: -80.8450 }, // Transition to South Boulevard
        { lat: 35.2150, lng: -80.8550 }, // South Boulevard area
      ];
    }
    // Mile 11.5 to Mile 20 - DRIVING (straight to Mile 20)
    else if (fromSpot.mileMarker === 11.5 && toSpot.mileMarker === 20) {
      travelMode = 'driving';
      color = '#3b82f6';
      description = 'Drive 10-15 min (straight to Mile 20, no intermediate stop)';
      // Add waypoints for realistic route
      waypoints = [
        { lat: 35.2150, lng: -80.8450 }, // South Boulevard → Independence area
        { lat: 35.2200, lng: -80.8200 }, // Approaching Mile 20 area
      ];
    }
    // Mile 20 to Mile 22 - DRIVING (short drive)
    else if (fromSpot.mileMarker === 20 && toSpot.mileMarker === 22) {
      travelMode = 'driving';
      color = '#8b5cf6'; // Purple for final push route
      description = 'Drive 6 min (1.55 miles - EASY!)';
      // Short route - minimal waypoints
      waypoints = [
        { lat: 35.2300, lng: -80.8050 }, // Intermediate point
      ];
    }
    // Mile 22 to Finish - DRIVING
    else if (fromSpot.mileMarker === 22 && toSpot.mileMarker === 26.2) {
      travelMode = 'driving';
      color = '#059669'; // Emerald for finish route
      description = 'Drive 8-10 min, PARK EARLY (0.5 mi away, walk in)';
      // Route back to Uptown
      waypoints = [
        { lat: 35.2350, lng: -80.8150 }, // Heading back towards Uptown
        { lat: 35.2250, lng: -80.8350 }, // Approaching Uptown
      ];
    }
    // Finish to Lunch - WALKING
    else if (fromSpot.mileMarker === 26.2 && toSpot.mileMarker === 26.3) {
      travelMode = 'walking';
      color = '#f97316'; // Orange for lunch route
      description = 'Walk 5 minutes (0.2 mi) - 7th Street Public Market';
    }
    // Mile 20 to Mile 22 - DRIVING (short drive)
    else if (fromSpot.mileMarker === 20 && toSpot.mileMarker === 22) {
      travelMode = 'driving';
      color = '#8b5cf6'; // Purple for final push route
      description = 'Drive 6 min (1.55 miles - EASY!)';
    }
    // Mile 22 to Finish - DRIVING
    else if (fromSpot.mileMarker === 22 && toSpot.mileMarker === 26.2) {
      travelMode = 'driving';
      color = '#059669'; // Emerald for finish route
      description = 'Drive 8-10 min, PARK EARLY (0.5 mi away, walk in)';
    }
    // Finish to Lunch - WALKING
    else if (fromSpot.mileMarker === 26.2 && toSpot.mileMarker === 26.3) {
      travelMode = 'walking';
      color = '#f97316'; // Orange for lunch route
      description = 'Walk 5 minutes (0.2 mi) - 7th Street Public Market';
    }
    
    const route = calculateRoute(fromSpot.coordinates, toSpot.coordinates, waypoints);
    
    // Calculate distance (straight-line for now)
    const distance = calculateDistance(fromSpot.coordinates, toSpot.coordinates);
    
    routes.push({
      fromSpotId: fromSpot.id,
      toSpotId: toSpot.id,
      route,
      travelMode,
      estimatedTime: toSpot.travelTimeFromPrevious || 10,
      distance,
      description,
      color,
    });
  }
  
  return routes;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
  const R = 3959; // Earth radius in miles
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

