import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import DayPlanPage from './pages/DayPlanPage';
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
            <Route path="/plan" element={<DayPlanPage />} />
          </Routes>
        </PageTransition>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;
