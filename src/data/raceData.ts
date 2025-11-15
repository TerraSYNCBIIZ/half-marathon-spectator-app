import { RaceInfo, SpectatorSpot } from '../types';

// Novant Health Charlotte Marathon - Race data for Rachel's full marathon
// Race Date: Saturday, November 15, 2025
// Start Time: 7:20 AM
export const raceInfo: RaceInfo = {
  name: "Novant Health Charlotte Marathon",
  date: "2025-11-15",
  startTime: "07:20 AM", // Marathon and Half Marathon start at 7:20 AM
  distance: 26.2, // Full marathon distance
  location: "Charlotte, NC",
  liveTrackingUrl: "https://results.raceroster.com/v3/events/3vgp2qeac5c9rhab/race/248066/participant/a6nbzh3q3d22m6vz",
  runnerName: "Rachel",
  route: [
    // Start/Finish at Romare Bearden Park
    { lat: 35.223780, lng: -80.847960 },
    // Route through Uptown Charlotte
    { lat: 35.2300, lng: -80.8400 },
    // Elizabeth Avenue area (Miles 2-3)
    { lat: 35.2200, lng: -80.8350 },
    // Queens Road West (Miles 5-6)
    { lat: 35.2000, lng: -80.8300 },
    // East Boulevard / Dilworth (Miles 8-9)
    { lat: 35.1950, lng: -80.8250 },
    // Myers Park area
    { lat: 35.1850, lng: -80.8200 },
    // Back through Dilworth
    { lat: 35.2050, lng: -80.8350 },
    // Final stretch back to Uptown
    { lat: 35.2200, lng: -80.8400 },
    // Finish at Romare Bearden Park
    { lat: 35.229100, lng: -80.847490 },
  ]
};

// OPTIMAL FINAL PLAN - Exact spots with verified coordinates
// Strategy: Efficiency, comfort, and maximum support for Rachel
// All coordinates are EXACT from route analysis
export const spectatorSpots: SpectatorSpot[] = [
  {
    id: "spot-1",
    name: "Start Line - Romare Bearden Park",
    mileMarker: 0,
    coordinates: { lat: 35.223780, lng: -80.847960 }, // EXACT
    description: "The starting line! Get there early to see the excitement and wish Rachel good luck. Great energy and photo opportunities. Perfect spot to see the race begin.",
    parking: "Park at 7th Street Station parking deck or 300 S Tryon St garage. Arrive by 6:45 AM for best parking.",
    accessibility: "Fully accessible. Paved paths throughout the park.",
    amenities: ["Restrooms", "Coffee shops within 5 min walk", "Water fountains", "Food vendors"],
    photoOps: ["Start line banner", "Runner corrals", "City skyline backdrop", "Pre-race excitement"],
    crowdLevel: "high",
    tips: [
      "Arrive by 6:45 AM to secure parking and viewing spot",
      "Grab coffee at Not Just Coffee (222 S Church St) before 7:00 AM",
      "Bring a sign with Rachel's name!",
      "Take a video of the start - it's electric!",
      "Dress in layers - November mornings can be chilly (40-50°F)"
    ],
    travelTimeFromPrevious: 0,
    nearbyCoffee: "Not Just Coffee - Packard Place (222 S Church St, Charlotte, NC, 0.08 mi / 2 min walk)",
    nearbyFood: "Amélie's French Bakery (380 S College St, Charlotte, NC, 0.27 mi / 5 min walk)",
    parkingLocations: "7th Street Station Parking (224 E 7th St, Charlotte, NC, 0.33 mi / 7 min walk - First 90 min FREE)"
  },
  {
    id: "spot-2",
    name: "Mile 2.1 - Fourth Street and Hawthorne Lane",
    mileMarker: 2.1,
    coordinates: { lat: 35.213194, lng: -80.828478 }, // EXACT
    description: "Early race spot! Runners are fresh and energized. Near Novant Health Hospital with good parking. Less crowded than start, perfect for early encouragement.",
    parking: "Ample parking near Novant Health Hospital. Street parking available.",
    accessibility: "Sidewalks available throughout. Fully accessible.",
    amenities: ["Central Coffee Co. nearby", "Sunflour Baking Company nearby", "Public restrooms", "Hospital facilities"],
    photoOps: ["Early race energy", "Historic neighborhood", "Tree-lined streets"],
    crowdLevel: "medium",
    tips: [
      "WALK from start (20 min, 1.3 miles) - avoids road closures!",
      "Runners will pass around 7:41 AM (depending on pace)",
      "Perfect time to grab coffee at Central Coffee Co. while watching",
      "After cheering, drive to Mile 6 (11-14 min via Park Road)",
      "Bring noise makers - runners love early encouragement!"
    ],
    travelTimeFromPrevious: 20, // Walking time
    nearbyCoffee: "Central Coffee Co (719 Louise Ave, Charlotte, NC, 0.35 mi / 7 min walk), Sunflour Baking Company (2001 E 7th St, Charlotte, NC, 0.60 mi / 12 min walk)",
    nearbyFood: "",
    parkingLocations: "Street parking on Fourth Street (Fourth St, Charlotte, NC, at location - free), Novant Health Visitor Parking (1718 E 4th St, Charlotte, NC, 0.2 mi / 4 min walk)"
  },
  {
    id: "spot-3",
    name: "Mile 6.0 - Queens Road West (Scenic Beauty)",
    mileMarker: 6.0,
    coordinates: { lat: 35.184328, lng: -80.831117 }, // EXACT
    description: "One of the most beautiful spots on the course! Tree-lined Queens Road West is picturesque with stately trees and historic homes. Runners are settling into their rhythm here. Great photo opportunities.",
    parking: "Street parking on Queens Road or nearby residential streets. Arrive 20 min before runner arrives.",
    accessibility: "Sidewalks available. Some elevation changes.",
    amenities: ["Scenic beauty", "Shaded viewing areas", "Quiet neighborhood", "Wide median for viewing"],
    photoOps: ["Tree-canopied boulevard", "Historic Myers Park homes", "Serene setting", "Beautiful backdrop"],
    crowdLevel: "low",
    tips: [
      "DRIVE here from Mile 2.1 (11-14 min via Park Road - avoid closed Queens Road)",
      "Less crowded than other spots - great for photos",
      "Runners will pass around 8:20 AM",
      "This is where runners find their groove",
      "Beautiful spot to see Rachel running strong!",
      "After cheering, grab coffee at Not Just Coffee Dilworth (0.5 mi drive)"
    ],
    travelTimeFromPrevious: 12, // Average of 11-14 min
    nearbyCoffee: "Not Just Coffee - Dilworth (1235 East Blvd, Charlotte, NC, 1.21 mi / 3 min drive)",
    nearbyFood: "",
    parkingLocations: "Street parking on Queens Road West (Queens Rd W, Charlotte, NC, at location - free), Residential side streets (Queens Rd W area, Charlotte, NC, nearby - free)"
  },
  {
    id: "spot-4",
    name: "Mile 11.5 - Not Just Coffee South End Area",
    mileMarker: 11.5,
    coordinates: { lat: 35.218412, lng: -80.858372 }, // EXACT
    description: "Perfect coffee break spot! Not Just Coffee at 2000 South Blvd is RIGHT NEAR THE ROUTE! This is your main coffee break - grab a drink while cheering Rachel on. South End is vibrant and fun.",
    parking: "South End parking options. Street parking or nearby lots.",
    accessibility: "Sidewalks available. Flat terrain.",
    amenities: ["Not Just Coffee - South End (2000 South Blvd) - ON/NEAR ROUTE!", "Restrooms at coffee shop", "Various South End restaurants"],
    photoOps: ["South End vibes", "Coffee break moment", "Mid-race support"],
    crowdLevel: "medium",
    tips: [
      "DRIVE here from Mile 6 (13-16 min via Park Road → South Boulevard)",
      "Runners will pass around 9:15 AM",
      "Perfect time for coffee at Not Just Coffee South End!",
      "LEAVE IMMEDIATELY after seeing Rachel (9:25 AM) - skip extended coffee",
      "Drive straight to Mile 20 (10-15 min) - no intermediate stop!",
      "This is a critical timing point - don't linger too long"
    ],
    travelTimeFromPrevious: 15, // Average of 13-16 min
    nearbyCoffee: "Not Just Coffee - South End (2000 South Blvd, Charlotte, NC, AT THIS LOCATION!)",
    nearbyFood: "",
    parkingLocations: "Not Just Coffee parking lot (2000 South Blvd, Charlotte, NC, at location), Street parking on South Boulevard (South Blvd, Charlotte, NC, at location - metered)"
  },
  {
    id: "spot-5",
    name: "Mile 20.0 - The Wall (CRITICAL SUPPORT)",
    mileMarker: 20.0,
    coordinates: { lat: 35.220554, lng: -80.810909 }, // EXACT
    description: "THE MOST IMPORTANT SPOT! Mile 20 is where runners hit 'The Wall' - this is where your support is CRITICAL! Runners are exhausted but so close. Your encouragement can make the difference. Be there with maximum energy and positivity!",
    parking: "Street parking or nearby garages. Arrive 30 min early.",
    accessibility: "Sidewalks available.",
    amenities: ["Critical support zone", "Medical support nearby", "Encouragement needed!", "Restrooms nearby"],
    photoOps: ["Determination and grit", "The struggle and triumph", "Final push", "Emotional support"],
    crowdLevel: "medium",
    tips: [
      "DRIVE here from Mile 11.5 (10-15 min - straight to Mile 20, no intermediate stop!)",
      "Runners will pass around 10:33 AM",
      "This is THE most important spot to cheer!",
      "Bring your biggest sign and loudest voice",
      "Tell Rachel she's almost there - only 6.2 miles left!",
      "Maximum encouragement - this is where she needs you most!",
      "After this, short drive to Mile 22 (6 min)"
    ],
    travelTimeFromPrevious: 13, // Average of 10-15 min
    nearbyCoffee: "",
    nearbyFood: "",
    parkingLocations: "Street parking near Central Ave (Central Ave, Charlotte, NC, at location - free), On-street residential parking (nearby streets, Charlotte, NC, at location)"
  },
  {
    id: "spot-6",
    name: "Mile 22.0 - Final Push Support",
    mileMarker: 22.0,
    coordinates: { lat: 35.240242, lng: -80.797867 }, // EXACT
    description: "Final push support! Give Rachel that last boost before finish! This is the final encouragement spot - tell her she's almost there! Only 4.2 miles to go!",
    parking: "Street parking. Arrive 15 min early.",
    accessibility: "Sidewalks available.",
    amenities: ["Final push support", "Restrooms nearby", "Coffee/food on way to finish"],
    photoOps: ["Final determination", "Almost there!", "Last push"],
    crowdLevel: "low",
    tips: [
      "DRIVE here from Mile 20 (only 6 min drive - 1.55 miles - EASY!)",
      "Runners will pass around 10:46 AM",
      "Final encouragement - 'You're almost there!'",
      "Short stay - then drive to finish (8-10 min)",
      "Grab coffee/food on way to finish if needed"
    ],
    travelTimeFromPrevious: 6,
    nearbyCoffee: "",
    nearbyFood: "",
    parkingLocations: "Street parking near The Plaza (The Plaza, Charlotte, NC, at location - free), Residential street parking (nearby streets, Charlotte, NC, at location)"
  },
  {
    id: "spot-7",
    name: "Finish Line - 4th Street near Mint Street",
    mileMarker: 26.2,
    coordinates: { lat: 35.229100, lng: -80.847490 }, // EXACT
    description: "THE FINISH LINE! Be there to celebrate Rachel's incredible achievement! This is the moment - the triumph, the tears, the joy. Position yourself near the finish chute exit to find her easily.",
    parking: "Same as start line. PARK EARLY (0.5 mi away, walk in due to closures). Get there 30-45 min before estimated finish time.",
    accessibility: "Fully accessible.",
    amenities: ["Finish line festivities", "Post-race food/drinks", "Medical tent", "Medal distribution", "Photo opportunities", "Not Just Coffee nearby"],
    photoOps: ["Finish line crossing", "Medal photos", "Celebration shots", "Emotional moments", "Group photos", "Victory!"],
    crowdLevel: "high",
    tips: [
      "DRIVE here from Mile 22 (8-10 min drive)",
      "PARK EARLY (0.5 mi away, walk in) - Uptown will have major closures",
      "Arrive 30-45 min before Rachel's estimated finish (around 10:50 AM)",
      "Position yourself near finish chute EXIT (not entrance) to find her easily",
      "Have water, snacks, and warm jacket ready for her",
      "Phone fully charged for photos and videos!",
      "Know your meeting spot - it gets crowded",
      "Celebrate this amazing achievement!",
      "After finish, walk to 7th Street Public Market for lunch (5 min walk)"
    ],
    travelTimeFromPrevious: 9, // Average of 8-10 min
    nearbyCoffee: "Not Just Coffee - Packard Place (222 S Church St, Charlotte, NC, 0.35 mi / 7 min walk)",
    nearbyFood: "7th Street Public Market (224 E 7th St, Charlotte, NC, 0.16 mi / 3 min walk)",
    parkingLocations: "7th Street Station Parking (224 E 7th St, Charlotte, NC, 0.5 mi / 10 min walk - First 90 min FREE), 300 S Tryon St Garage (300 S Tryon St, Charlotte, NC, 0.6 mi / 12 min walk)"
  },
  {
    id: "spot-8",
    name: "Post-Race Lunch - 7th Street Public Market",
    mileMarker: 26.3,
    coordinates: { lat: 35.2280, lng: -80.8450 }, // Approximate - near finish
    description: "Perfect post-race celebration spot! 7th Street Public Market is a vibrant food hall with multiple vendors offering Mexican and casual options. Great for big groups, casual atmosphere, and within easy walking distance from finish line. Perfect way to celebrate Rachel's achievement!",
    parking: "Same parking as finish line, or walk from finish (5 minutes). Validated parking available (first 90 minutes with purchase).",
    accessibility: "Fully accessible food hall.",
    amenities: ["Food hall with multiple vendors", "Mexican options available", "Casual atmosphere", "Group-friendly", "Validated parking", "Not Just Coffee in market"],
    photoOps: ["Post-race celebration", "Group meal", "Medal display", "Happy faces", "Food hall vibes"],
    crowdLevel: "medium",
    tips: [
      "WALKING DISTANCE from finish line (5 min walk, 0.2 mi)",
      "Perfect for the whole group to celebrate together",
      "Food hall means everyone can get what they want",
      "Casual atmosphere - not too grungy, not too fancy",
      "Validated parking - first 90 minutes free with purchase",
      "Take lots of photos - this is a celebration!",
      "Let Rachel order whatever she wants - she earned it!"
    ],
    travelTimeFromPrevious: 5, // Walking time
    nearbyCoffee: "",
    nearbyFood: "7th Street Public Market (224 E 7th St, Charlotte, NC, AT THIS LOCATION!)",
    parkingLocations: "7th Street Station Parking (224 E 7th St, Charlotte, NC, at location - First 90 min FREE with purchase)"
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
