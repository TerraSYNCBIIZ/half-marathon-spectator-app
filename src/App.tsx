import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLoadScript } from '@react-google-maps/api';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import DayPlanPage from './pages/DayPlanPage';
import BottomNavigation from './components/BottomNavigation';
import { PageTransition } from './components/PageTransition';
import { GOOGLE_MAPS_API_KEY } from './config/googleMaps';

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  if (loadError) {
    return (
      <div className="h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-6">
          <p className="text-red-600 font-bold mb-2">Error loading maps</p>
          <p className="text-sm text-gray-600">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#F9FAFB] pb-16">
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/plan" element={<DayPlanPage />} />
          </Routes>
        </PageTransition>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;
