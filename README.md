# 🏃‍♀️ Half Marathon Spectator App

A beautiful, mobile-first web app to help spectators track and support their runner during a half marathon. Features interactive maps, timing calculations, and detailed viewing spot guides.

## ✨ Features

- **📍 Spectator Viewing Spots**: Detailed information about the best locations to cheer
- **⏱️ Timing Calculator**: Calculate when your runner will reach each spot based on their pace
- **🗺️ Interactive Map**: Visual display of the race route and spectator locations
- **ℹ️ Race Information**: Weather, parking, logistics, and checklists
- **📱 Mobile-First Design**: Optimized for use on race day
- **🎨 Beautiful UI**: Clean, modern interface with intuitive navigation

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to deploy.

## 🎯 Usage

### Customizing Race Data

Edit `src/data/raceData.ts` to customize:

1. **Race Information**: Update name, date, time, and location
2. **Spectator Spots**: Add/modify viewing locations with:
   - Mile markers
   - Coordinates (latitude/longitude)
   - Parking information
   - Amenities and tips
   - Travel times between spots

Example:
```typescript
{
  id: "spot-1",
  name: "Start Line",
  mileMarker: 0,
  coordinates: { lat: 35.2271, lng: -80.8431 },
  description: "The starting line!",
  parking: "Park at main lot",
  // ... more details
}
```

### Getting Coordinates from Google Maps

1. Open your Google Maps link
2. Right-click on a location
3. Select "What's here?"
4. Copy the coordinates (format: lat, lng)
5. Add to `raceData.ts`

### Updating the Route

Update the `route` array in `raceData.ts` with coordinates:
```typescript
route: [
  { lat: 35.2271, lng: -80.8431 },
  { lat: 35.2100, lng: -80.8400 },
  // Add more points along the route
]
```

## 📁 Project Structure

```
half-marathon-spectator-app/
├── src/
│   ├── components/        # React components
│   │   └── Navigation.tsx
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx
│   │   ├── MapPage.tsx
│   │   ├── SpectatorGuidePage.tsx
│   │   ├── TimingCalculatorPage.tsx
│   │   └── RaceInfoPage.tsx
│   ├── data/             # Race data
│   │   └── raceData.ts
│   ├── types.ts          # TypeScript types
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── index.html
├── package.json
└── vite.config.ts
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  primary: {
    500: '#6366f1',  // Main brand color
    600: '#4f46e5',
    // ...
  }
}
```

### Styling

The app uses Tailwind CSS. Update component classes or add custom styles in `src/index.css`.

## 🌐 Deployment

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

### Other Hosting

Any static hosting service works (GitHub Pages, Firebase Hosting, etc.). Just upload the `dist` folder contents.

## 📱 Mobile Features

- Responsive design works on all screen sizes
- Touch-friendly interface
- Can be installed as a Progressive Web App (PWA)
- Works offline after initial load

## 🤝 Tips for Race Day

1. **Test Before Race Day**: Make sure everything works on your phone
2. **Download Offline**: Visit all pages before the race for offline access
3. **Share with Family**: Send the link to other spectators
4. **Save to Home Screen**: For quick access
5. **Bring a Charger**: Keep your phone powered all day

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Leaflet** - Interactive maps
- **React Leaflet** - React bindings for Leaflet

## 📝 License

This project is open source and available for personal use.

## 🎉 Have a Great Race Day!

Made with ❤️ for spectators who make race day special.

---

## 🔧 Troubleshooting

### Map not displaying

Make sure `react-leaflet` is installed:
```bash
npm install leaflet react-leaflet @types/leaflet
```

### Build errors

Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Mobile issues

Test on real devices, not just browser dev tools, for best results.

