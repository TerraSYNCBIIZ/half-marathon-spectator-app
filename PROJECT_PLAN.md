# Half Marathon Spectator App - Project Plan

## Overview
A micro web app to help spectators follow and support a runner during a half marathon. The app will display the race route, optimal viewing locations, timing predictions, and navigation assistance.

## Core Features

### 1. Interactive Race Map
- Display the half marathon route on an interactive map
- Show current runner location (if live tracking available)
- Highlight spectator viewing spots
- Integration with Google Maps data
- Mobile-responsive design

### 2. Spectator Viewing Spots
- Mark optimal viewing locations along the route
- Include details for each spot:
  - Mile marker
  - Parking information
  - Accessibility notes
  - Photo opportunities
  - Crowd level expectations
  - Restroom availability
  - Nearby amenities

### 3. Timing Calculator
- Input runner's expected pace or finish time
- Calculate estimated arrival times at each viewing spot
- Account for typical race slowdown
- Display countdown timers
- Send notifications when runner is approaching

### 4. Navigation & Logistics
- Turn-by-turn directions to each viewing spot
- Estimated travel time between spots
- Traffic considerations
- Recommended spectator route
- Public parking locations

### 5. Race Day Information
- Weather forecast
- Race start time
- Course map with elevation
- Corral/wave information
- Emergency contacts
- Post-race meeting location

## Technical Stack

### Frontend
- **React** with Vite (fast, modern)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Leaflet** or **Google Maps API** for mapping

### Features
- Progressive Web App (PWA) capabilities
- Offline functionality
- Mobile-first design
- Fast loading times
- Installable on mobile devices

## Project Structure
```
half-marathon-spectator-app/
├── public/
│   ├── icons/
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Map/
│   │   ├── SpectatorSpot/
│   │   ├── TimingCalculator/
│   │   └── Navigation/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Map.tsx
│   │   ├── SpectatorGuide.tsx
│   │   └── RaceInfo.tsx
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── App.tsx
├── package.json
└── vite.config.ts
```

## Development Phases

### Phase 1: Foundation (Current)
- [x] Project setup and planning
- [ ] Initialize React + Vite + TypeScript
- [ ] Set up Tailwind CSS
- [ ] Create basic layout and routing
- [ ] Design system and color scheme

### Phase 2: Core Features
- [ ] Implement interactive map
- [ ] Add spectator spot data
- [ ] Build timing calculator
- [ ] Create spot detail views

### Phase 3: Polish & Enhancement
- [ ] Add navigation features
- [ ] Implement PWA capabilities
- [ ] Add weather integration
- [ ] Create sharing features
- [ ] Mobile optimization

### Phase 4: Testing & Deployment
- [ ] Test on multiple devices
- [ ] Performance optimization
- [ ] Deploy to hosting (Vercel/Netlify)
- [ ] Generate QR code for easy access

## Data Structure

### Spectator Spot
```typescript
interface SpectatorSpot {
  id: string;
  name: string;
  mileMarker: number;
  coordinates: { lat: number; lng: number };
  description: string;
  parking: string;
  accessibility: string;
  amenities: string[];
  photoOps: string[];
  crowdLevel: 'low' | 'medium' | 'high';
  tips: string[];
}
```

### Race Information
```typescript
interface RaceInfo {
  name: string;
  date: string;
  startTime: string;
  distance: number; // in miles
  route: Coordinate[];
  elevation: ElevationPoint[];
}
```

## Design Inspiration
- Clean, modern UI similar to Honeymoon Handbook
- Card-based layout for viewing spots
- Prominent call-to-action buttons
- Easy-to-read typography
- Cheerful, supportive color scheme
- Race-day excitement theme

## Future Enhancements
- Live GPS tracking integration
- Multi-spectator coordination
- Photo sharing gallery
- Runner messaging system
- Post-race statistics
- Social media integration

