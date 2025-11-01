import { RaceInfo, SpectatorSpot } from '../types';

// Charlotte Marathon - Race data for Rachel's full marathon
export const raceInfo: RaceInfo = {
  name: "Novant Health Charlotte Marathon",
  date: "2025-11-15", // Update with actual date
  startTime: "07:20 AM", // Marathon starts at 7:20 AM
  distance: 26.2, // Full marathon distance
  location: "Charlotte, NC",
  route: [
    // This would be populated from the Google Maps data
    { lat: 35.2271, lng: -80.8431 },
    { lat: 35.2100, lng: -80.8400 },
    // Add more route coordinates
  ]
};

// Spectator spots along the route
export const spectatorSpots: SpectatorSpot[] = [
  {
    id: "spot-1",
    name: "Start Line - Romare Bearden Park",
    mileMarker: 0,
    coordinates: { lat: 35.2271, lng: -80.8431 },
    description: "The starting line! Get there early to see the excitement and wish your runner good luck. Great energy and photo opportunities.",
    parking: "Park at 7th Street Station parking deck (5-minute walk). Arrive by 7:00 AM for a good spot.",
    accessibility: "Fully accessible. Paved paths throughout the park.",
    amenities: ["Restrooms", "Coffee shops nearby", "Water fountains"],
    photoOps: ["Start line banner", "Runner corrals", "City skyline backdrop"],
    crowdLevel: "high",
    tips: [
      "Arrive by 7:00 AM to secure a good viewing spot",
      "Bring a sign with runner's name!",
      "Take a video of the start",
      "Dress in layers - early morning can be chilly"
    ],
    travelTimeFromPrevious: 0
  },
  {
    id: "spot-2",
    name: "Mile 3 - 4th Ward",
    mileMarker: 3,
    coordinates: { lat: 35.2350, lng: -80.8400 },
    description: "Runners are still fresh and picking up their pace. Great neighborhood atmosphere with local supporters.",
    parking: "Street parking on Pine Street or 10th Street. Limited spots - arrive early.",
    accessibility: "Sidewalks available, some curbs to navigate.",
    amenities: ["Nearby cafes", "Public restrooms at library"],
    photoOps: ["Tree-lined streets", "Historic homes"],
    crowdLevel: "medium",
    tips: [
      "After cheering here, you can drive to Mile 8",
      "Good spot for a quick hello as runners pass",
      "Bring noise makers or cow bells"
    ],
    travelTimeFromPrevious: 12
  },
  {
    id: "spot-3",
    name: "Mile 6 - Freedom Park",
    mileMarker: 6,
    coordinates: { lat: 35.1950, lng: -80.8300 },
    description: "Beautiful park setting. Runners are settling into their rhythm. One of the most scenic spots on the course.",
    parking: "Freedom Park parking lot on East Boulevard. Can get crowded.",
    accessibility: "Park paths are paved and accessible.",
    amenities: ["Restrooms in park", "Playground for kids", "Water fountains"],
    photoOps: ["Lake backdrop", "Park greenery", "Fountain"],
    crowdLevel: "high",
    tips: [
      "Great for families - kids can play while waiting",
      "Bring snacks and water",
      "This is a popular spectator spot",
      "Can see runners coming and going on loop"
    ],
    travelTimeFromPrevious: 8
  },
  {
    id: "spot-4",
    name: "Mile 9 - Myers Park",
    mileMarker: 9,
    coordinates: { lat: 35.1850, lng: -80.8250 },
    description: "Two-thirds through! Runners are working hard. Your encouragement means everything here.",
    parking: "Street parking on Queens Road or nearby residential streets.",
    accessibility: "Sidewalks available throughout.",
    amenities: ["Nearby shopping center", "Restaurants"],
    photoOps: ["Tree-canopied streets"],
    crowdLevel: "medium",
    tips: [
      "This is where mental toughness kicks in",
      "Extra loud cheering helps!",
      "Bring high-energy signs",
      "Can grab lunch nearby after"
    ],
    travelTimeFromPrevious: 10
  },
  {
    id: "spot-5",
    name: "Mile 11 - Dilworth",
    mileMarker: 11,
    coordinates: { lat: 35.2050, lng: -80.8350 },
    description: "The home stretch is in sight! Runners need all the encouragement they can get.",
    parking: "Limited street parking. Consider walking from Mile 6 spot if nearby.",
    accessibility: "Sidewalks available.",
    amenities: ["Coffee shops", "Restaurants"],
    photoOps: ["Neighborhood charm"],
    crowdLevel: "medium",
    tips: [
      "Almost there! Let them know!",
      "Tell them how strong they look",
      "Last chance for encouragement before finish"
    ],
    travelTimeFromPrevious: 7
  },
  {
    id: "spot-6",
    name: "Finish Line - Romare Bearden Park",
    mileMarker: 26.2,
    coordinates: { lat: 35.2271, lng: -80.8431 },
    description: "The triumphant finish! Be there to celebrate their achievement!",
    parking: "Same as start line. Get there 20-30 min before estimated finish.",
    accessibility: "Fully accessible.",
    amenities: ["Restrooms", "Post-race food/drinks", "Medical tent"],
    photoOps: ["Finish line", "Medal photos", "Celebration shots"],
    crowdLevel: "high",
    tips: [
      "Arrive before their estimated finish time",
      "Position yourself near the finish chute exit",
      "Have water and snacks ready",
      "Bring a warm jacket for them",
      "Phone charged for photos and videos!",
      "Know the meeting spot beforehand"
    ],
    travelTimeFromPrevious: 15
  }
];

// Helper function to get spot by ID
export const getSpotById = (id: string): SpectatorSpot | undefined => {
  return spectatorSpots.find(spot => spot.id === id);
};

// Helper function to get spots by mile range
export const getSpotsByMileRange = (minMile: number, maxMile: number): SpectatorSpot[] => {
  return spectatorSpots.filter(spot => 
    spot.mileMarker >= minMile && spot.mileMarker <= maxMile
  );
};

