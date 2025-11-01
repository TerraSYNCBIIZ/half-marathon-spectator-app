import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import SpectatorGuidePage from './pages/SpectatorGuidePage';
import RaceInfoPage from './pages/RaceInfoPage';
import TimingCalculatorPage from './pages/TimingCalculatorPage';
import DayPlanPage from './pages/DayPlanPage';
import KMZParserPage from './pages/KMZParserPage';
import BottomNavigation from './components/BottomNavigation';
import { PageTransition } from './components/PageTransition';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F9FAFB] pb-16">
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/guide" element={<SpectatorGuidePage />} />
            <Route path="/timing" element={<TimingCalculatorPage />} />
            <Route path="/info" element={<RaceInfoPage />} />
            <Route path="/plan" element={<DayPlanPage />} />
            <Route path="/parse-kmz" element={<KMZParserPage />} />
          </Routes>
        </PageTransition>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;
