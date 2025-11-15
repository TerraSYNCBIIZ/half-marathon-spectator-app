import { useState, useCallback } from 'react';
import { Coordinate } from '../types';

export interface DirectionsResult {
  route: Coordinate[];
  distance: string;
  duration: string;
  error?: string;
}

/**
 * Hook to get directions between two points using Google Directions API
 */
export function useDirections() {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDirections = useCallback(
    async (
      origin: Coordinate,
      destination: Coordinate,
      travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
    ) => {
      if (!window.google?.maps?.DirectionsService) {
        setError('Google Maps Directions Service not available');
        return null;
      }

      setLoading(true);
      setError(null);

      const directionsService = new google.maps.DirectionsService();

      return new Promise<google.maps.DirectionsResult | null>((resolve) => {
        directionsService.route(
          {
            origin: { lat: origin.lat, lng: origin.lng },
            destination: { lat: destination.lat, lng: destination.lng },
            travelMode: travelMode,
          },
          (result, status) => {
            setLoading(false);
            if (status === google.maps.DirectionsStatus.OK && result) {
              setDirections(result);
              resolve(result);
            } else {
              const errorMsg = `Directions request failed: ${status}`;
              setError(errorMsg);
              resolve(null);
            }
          }
        );
      });
    },
    []
  );

  return { directions, loading, error, getDirections };
}

/**
 * Extract route coordinates from DirectionsResult
 */
export function extractRouteFromDirections(
  directionsResult: google.maps.DirectionsResult
): Coordinate[] {
  const route: Coordinate[] = [];
  const leg = directionsResult.routes[0]?.legs[0];
  
  if (leg) {
    leg.steps.forEach((step) => {
      const path = step.path;
      path.forEach((point) => {
        route.push({ lat: point.lat(), lng: point.lng() });
      });
    });
  }
  
  return route;
}

