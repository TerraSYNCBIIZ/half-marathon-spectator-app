// Web scraper utility for Charlotte Marathon website
// Note: Due to CORS restrictions, this may need to be run server-side
// For now, we'll create a manual data extraction utility

export interface CharlotteMarathonData {
  raceInfo: {
    name: string;
    date: string;
    startTime: string;
    distance: number;
    location: string;
  };
  events: Array<{
    name: string;
    startTime: string;
    distance: number;
    description?: string;
  }>;
  spectatorGuide: {
    tips: string[];
    viewingSpots: Array<{
      name: string;
      description: string;
      mileMarker?: number;
    }>;
    parking: string[];
    accessibility: string[];
  };
  logistics: {
    expo: {
      date: string;
      location: string;
      hours: string;
    };
    packetPickup: {
      date: string;
      location: string;
      hours: string;
    };
    parking: Array<{
      location: string;
      description: string;
      cost?: string;
    }>;
  };
}

/**
 * Fetch and parse Charlotte Marathon website data
 * Note: This is a placeholder - actual scraping requires server-side or CORS proxy
 */
export async function fetchCharlotteMarathonData(): Promise<CharlotteMarathonData> {
  // Manual data based on website content
  // In production, you'd fetch from thecharlottemarathon.com and parse HTML
  
  return {
    raceInfo: {
      name: "Novant Health Charlotte Marathon",
      date: "2025-11-15",
      startTime: "07:20 AM", // Marathon start time
      distance: 26.2, // Full marathon distance
      location: "Charlotte, NC",
    },
    events: [
      {
        name: "Marathon",
        startTime: "07:20 AM",
        distance: 26.2,
      },
      {
        name: "Half Marathon",
        startTime: "07:30 AM",
        distance: 13.1,
      },
      {
        name: "Chick-fil-A 5K",
        startTime: "07:35 AM",
        distance: 3.1,
      },
    ],
    spectatorGuide: {
      tips: [
        "Arrive early to secure parking and viewing spots",
        "Bring signs with runner's name for encouragement",
        "Dress in layers - early morning can be chilly",
        "Plan your route between viewing spots",
        "Stay hydrated and bring snacks",
        "Know your runner's estimated pace",
        "Have a meeting spot arranged after the race",
      ],
      viewingSpots: [
        {
          name: "Start Line - Romare Bearden Park",
          description: "See the excitement at the start! Arrive early for best viewing.",
          mileMarker: 0,
        },
        {
          name: "Freedom Park",
          description: "Beautiful park setting with great spectator viewing areas.",
          mileMarker: 6,
        },
        {
          name: "Finish Line - Romare Bearden Park",
          description: "Celebrate your runner's achievement! Arrive before estimated finish time.",
          mileMarker: 26.2,
        },
      ],
      parking: [
        "7th Street Station parking deck",
        "Street parking available in surrounding areas",
        "Arrive early as parking fills up quickly",
        "Consider using ride-sharing services",
      ],
      accessibility: [
        "Most viewing areas are accessible",
        "Paved paths throughout parks",
        "Sidewalks available at most locations",
      ],
    },
    logistics: {
      expo: {
        date: "2025-11-14",
        location: "Charlotte Convention Center",
        hours: "TBD - Check website for updates",
      },
      packetPickup: {
        date: "2025-11-14",
        location: "Charlotte Convention Center",
        hours: "TBD - Check website for updates",
      },
      parking: [
        {
          location: "7th Street Station",
          description: "Main parking deck near start/finish line",
          cost: "Pay per hour",
        },
        {
          location: "Street Parking",
          description: "Available in surrounding neighborhoods",
          cost: "Free on weekends",
        },
      ],
    },
  };
}

/**
 * Helper function to extract data from HTML (for future use)
 */
export function parseHTML(html: string): Partial<CharlotteMarathonData> {
  // Placeholder for HTML parsing logic
  // Would use cheerio or similar in a Node.js environment
  return {};
}

