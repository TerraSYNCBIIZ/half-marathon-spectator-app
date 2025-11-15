export interface Coordinate {
  lat: number;
  lng: number;
}

export interface SpectatorSpot {
  id: string;
  name: string;
  mileMarker: number;
  coordinates: Coordinate;
  description: string;
  parking: string;
  accessibility: string;
  amenities: string[];
  photoOps: string[];
  crowdLevel: 'low' | 'medium' | 'high';
  tips: string[];
  travelTimeFromPrevious?: number; // minutes
  nearbyCoffee?: string; // Nearby coffee shop information
  nearbyFood?: string; // Nearby food/restaurant information
  parkingLocations?: string; // Parking locations with addresses for navigation
}

export interface RaceInfo {
  name: string;
  date: string;
  startTime: string;
  distance: number; // in miles
  location: string;
  route: Coordinate[];
  liveTrackingUrl?: string;
  runnerName?: string;
}

export interface RunnerInfo {
  name: string;
  estimatedPace: number; // minutes per mile
  bibNumber?: string;
  startWave?: string;
}

export interface SpotTiming {
  spotId: string;
  estimatedArrivalTime: string;
  mileMarker: number;
  minutesFromStart: number;
}

