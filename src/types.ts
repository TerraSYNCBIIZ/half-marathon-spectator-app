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
}

export interface RaceInfo {
  name: string;
  date: string;
  startTime: string;
  distance: number; // in miles
  location: string;
  route: Coordinate[];
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

