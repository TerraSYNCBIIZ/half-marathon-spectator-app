import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import DayPlanPage from './pages/DayPlanPage';
import BottomNavigation from './components/BottomNavigation';
import { PageTransition } from './components/PageTransition';
import { GOOGLE_MAPS_API_KEY } from './config/googleMaps';

function App() {
  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY || ''}
      loadingElement={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}
      preventGoogleFontsLoading
    >
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
    </LoadScript>
  );
}

export default App;
