import { useState, useEffect } from 'react';

export interface KMLPlacemark {
  id: string;
  name: string;
  description?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'marker' | 'route';
  styleUrl?: string;
  icon?: string;
  color?: string;
}

export interface KMLRoute {
  id: string;
  name: string;
  coordinates: Array<{ lat: number; lng: number }>;
  color?: string;
  width?: number;
  styleUrl?: string;
}

export interface ParsedKMLData {
  placemarks: KMLPlacemark[];
  routes: KMLRoute[];
  styles: Map<string, { color?: string; icon?: string; width?: number }>;
}

export function useKMLData(kmlUrl: string) {
  const [data, setData] = useState<ParsedKMLData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadKML() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(kmlUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch KML: ${response.status}`);
        }

        const kmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlText, 'text/xml');

        // Parse styles first
        const styles = new Map<string, { color?: string; icon?: string; width?: number }>();
        const styleElements = xmlDoc.getElementsByTagName('Style');
        
        for (let i = 0; i < styleElements.length; i++) {
          const styleEl = styleElements[i];
          const id = styleEl.getAttribute('id');
          if (!id) continue;

          const iconStyle = styleEl.getElementsByTagName('IconStyle')[0];
          const lineStyle = styleEl.getElementsByTagName('LineStyle')[0];
          const polyStyle = styleEl.getElementsByTagName('PolyStyle')[0];

          const style: { color?: string; icon?: string; width?: number } = {};

          if (iconStyle) {
            const icon = iconStyle.getElementsByTagName('Icon')[0];
            if (icon) {
              const href = icon.getElementsByTagName('href')[0];
              if (href && href.textContent) {
                style.icon = href.textContent.trim();
              }
            }
            // Also check for color in IconStyle
            const colorEl = iconStyle.getElementsByTagName('color')[0];
            if (colorEl && colorEl.textContent) {
              const kmlColor = colorEl.textContent.trim();
              if (kmlColor.length === 8) {
                const rr = kmlColor.substring(6, 8);
                const gg = kmlColor.substring(4, 6);
                const bb = kmlColor.substring(2, 4);
                style.color = `#${rr}${gg}${bb}`;
              }
            }
          }

          if (lineStyle) {
            const color = lineStyle.getElementsByTagName('color')[0];
            const width = lineStyle.getElementsByTagName('width')[0];
            if (color) {
              // KML colors are in AABBGGRR format, convert to #RRGGBB
              const kmlColor = color.textContent || '';
              if (kmlColor.length === 8) {
                const rr = kmlColor.substring(6, 8);
                const gg = kmlColor.substring(4, 6);
                const bb = kmlColor.substring(2, 4);
                style.color = `#${rr}${gg}${bb}`;
              }
            }
            if (width) {
              style.width = parseFloat(width.textContent || '2');
            }
          }

          if (polyStyle) {
            const color = polyStyle.getElementsByTagName('color')[0];
            if (color) {
              const kmlColor = color.textContent || '';
              if (kmlColor.length === 8) {
                const rr = kmlColor.substring(6, 8);
                const gg = kmlColor.substring(4, 6);
                const bb = kmlColor.substring(2, 4);
                style.color = `#${rr}${gg}${bb}`;
              }
            }
          }

          styles.set(`#${id}`, style);
        }

        // Parse placemarks (markers)
        const placemarks: KMLPlacemark[] = [];
        const placemarkElements = xmlDoc.getElementsByTagName('Placemark');

        for (let i = 0; i < placemarkElements.length; i++) {
          const placemark = placemarkElements[i];
          const name = placemark.getElementsByTagName('name')[0]?.textContent || `Placemark ${i}`;
          const description = placemark.getElementsByTagName('description')[0]?.textContent;
          const styleUrl = placemark.getElementsByTagName('styleUrl')[0]?.textContent?.trim();

          // Check if it's a point (marker) or linestring (route)
          const point = placemark.getElementsByTagName('Point')[0];

          if (point) {
            const coordsText = point.getElementsByTagName('coordinates')[0]?.textContent?.trim();
            if (coordsText) {
              const [lng, lat] = coordsText.split(',').map(parseFloat);
              if (!isNaN(lat) && !isNaN(lng)) {
                // Look up style - check both with and without #
                let style = styleUrl ? styles.get(styleUrl) : undefined;
                if (!style && styleUrl && !styleUrl.startsWith('#')) {
                  style = styles.get(`#${styleUrl}`);
                }
                
                placemarks.push({
                  id: `marker-${i}`,
                  name: name.trim(),
                  description: description?.trim(),
                  coordinates: { lat, lng },
                  type: 'marker',
                  styleUrl,
                  icon: style?.icon,
                  color: style?.color,
                });
              }
            }
          }
        }

        // Parse routes (LineStrings)
        const routes: KMLRoute[] = [];
        for (let i = 0; i < placemarkElements.length; i++) {
          const placemark = placemarkElements[i];
          const lineString = placemark.getElementsByTagName('LineString')[0];

          if (lineString) {
            const name = placemark.getElementsByTagName('name')[0]?.textContent || `Route ${i}`;
            const styleUrl = placemark.getElementsByTagName('styleUrl')[0]?.textContent;
            const coordsText = lineString.getElementsByTagName('coordinates')[0]?.textContent?.trim();

            if (coordsText) {
              const coordinates: Array<{ lat: number; lng: number }> = [];
              const coordPairs = coordsText.split(/\s+/);

              for (const pair of coordPairs) {
                const [lng, lat] = pair.split(',').map(parseFloat);
                if (!isNaN(lat) && !isNaN(lng)) {
                  coordinates.push({ lat, lng });
                }
              }

              if (coordinates.length > 0) {
                const style = styleUrl ? styles.get(styleUrl) : undefined;
                routes.push({
                  id: `route-${i}`,
                  name,
                  coordinates,
                  styleUrl,
                  color: style?.color || '#4f46e5',
                  width: style?.width || 3,
                });
              }
            }
          }
        }

        setData({ placemarks, routes, styles });
        console.log('KML parsed successfully:', {
          placemarks: placemarks.length,
          routes: routes.length,
          styles: styles.size,
        });
      } catch (err) {
        console.error('Error parsing KML:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadKML();
  }, [kmlUrl]);

  return { data, loading, error };
}

