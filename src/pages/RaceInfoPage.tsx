import { Link } from 'react-router-dom';
import { raceInfo } from '../data/raceData';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const RaceInfoPage = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-4">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4">
            Race Information
          </h1>
          <p className="text-lg md:text-xl text-[#6B7280]">
            Everything you need to know about the marathon
          </p>
        </div>

        <div className="space-y-6 md:space-y-8">
          <Card>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-6">
              {raceInfo.name}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Badge variant="primary">Date</Badge>
                <span className="text-base text-[#1F2937]">{formatDate(raceInfo.date)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="primary">Start Time</Badge>
                <span className="text-base text-[#1F2937]">{raceInfo.startTime}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="primary">Distance</Badge>
                <span className="text-base text-[#1F2937]">{raceInfo.distance} miles</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="primary">Location</Badge>
                <span className="text-base text-[#1F2937]">{raceInfo.location}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-4 ">
              What to Expect
            </h2>
            <p className="text-base text-[#6B7280] mb-4">
              The {raceInfo.name} is a full marathon (26.2 miles) that takes runners through the beautiful streets of Charlotte, NC. 
              As a spectator, you'll have the opportunity to cheer on runners at multiple locations along the course.
            </p>
            <p className="text-base text-[#6B7280]">
              Use the timing calculator to plan your day and determine when your runner will pass each spectator spot. 
              Arrive early at popular locations to secure a good viewing position.
            </p>
          </Card>

          <Card>
            <h2 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-4 ">
              Getting Started
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#5e6ad2] text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-[#1F2937] mb-1 ">View the Map</h3>
                  <p className="text-base text-[#6B7280]">
                    Explore the interactive map to see the race route and all spectator spots.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#5e6ad2] text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-[#1F2937] mb-1 ">Calculate Timing</h3>
                  <p className="text-base text-[#6B7280]">
                    Enter your runner's expected pace to see when they'll pass each spot.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#5e6ad2] text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-[#1F2937] mb-1 ">Plan Your Day</h3>
                  <p className="text-base text-[#6B7280]">
                    Create your personalized day plan with timing for each spectator spot.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/map" className="flex-1">
              <Button variant="primary" className="w-full">
                View Map
              </Button>
            </Link>
            <Link to="/timing" className="flex-1">
              <Button variant="secondary" className="w-full">
                Calculate Timing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceInfoPage;
