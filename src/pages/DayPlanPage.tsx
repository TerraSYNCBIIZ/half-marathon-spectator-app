import { useState, useEffect } from 'react';
import { spectatorSpots, raceInfo } from '../data/raceData';
import { SpotTiming } from '../types';
import Timeline from '../components/Timeline/Timeline';
import Card from '../components/ui/Card';
import { Calendar, Clock, MapPin, Car, Flag, Info, Radio } from 'lucide-react';

interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'pre-race' | 'race' | 'spectator' | 'post-race';
  location?: string;
  mileMarker?: number;
  spotId?: string;
  nearbyCoffee?: string;
  nearbyFood?: string;
  parking?: string;
  parkingLocations?: string;
}

const DayPlanPage = () => {
  const runnerName = 'Rachel';
  const [estimatedPace, setEstimatedPace] = useState<number>(10);
  const [spotTimings, setSpotTimings] = useState<SpotTiming[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

  const calculateTimings = () => {
    const [hours, minutes] = raceInfo.startTime.split(':');
    const startMinutes = parseInt(hours) * 60 + parseInt(minutes.split(' ')[0]);
    const isPM = raceInfo.startTime.includes('PM');
    const adjustedStartMinutes = isPM && parseInt(hours) !== 12 ? startMinutes + 720 : startMinutes;

    const timings: SpotTiming[] = spectatorSpots.map((spot) => {
      const minutesFromStart = spot.mileMarker * estimatedPace;
      const arrivalMinutes = adjustedStartMinutes + minutesFromStart;

      const arrivalHours = Math.floor(arrivalMinutes / 60) % 24;
      const arrivalMins = Math.floor(arrivalMinutes % 60);
      const period = arrivalHours >= 12 ? 'PM' : 'AM';
      const displayHours = arrivalHours > 12 ? arrivalHours - 12 : arrivalHours === 0 ? 12 : arrivalHours;

      return {
        spotId: spot.id,
        estimatedArrivalTime: `${displayHours}:${arrivalMins.toString().padStart(2, '0')} ${period}`,
        mileMarker: spot.mileMarker,
        minutesFromStart,
      };
    });

    setSpotTimings(timings);
  };

  useEffect(() => {
    calculateTimings();
  }, [estimatedPace]);

  useEffect(() => {
    const items: TimelineItem[] = [];

    items.push({
      id: 'pre-race-parking',
      time: '6:30 AM',
      title: 'Arrive & Park at Start Line',
      description: 'PARKING: 7th Street Station Parking Garage (224 E 7th St) - First 90 minutes FREE with validation. Alternative: free on-street parking on Saturdays. Park early to secure a close spot to Romare Bearden Park start line.',
      type: 'pre-race',
      location: '7th Street Station Parking, 224 E 7th St, Charlotte, NC',
      spotId: 'parking-start',
      parkingLocations: '7th Street Station Parking (224 E 7th St, Charlotte, NC, 0.33 mi / 7 min walk to start - First 90 min FREE)',
    });

    items.push({
      id: 'pre-race-prep',
      time: '7:00 AM',
      title: 'Walk to Start Line Viewing Area',
      description: 'WALK from parking (3 min walk) to Romare Bearden Park. Find your prime viewing spot near the start line, set up signs with Rachel\'s name, grab last-minute coffee at Not Just Coffee (222 S Church St), and get ready to cheer!',
      type: 'pre-race',
      location: 'Romare Bearden Park, 300 S Church St, Charlotte, NC',
      spotId: 'spot-1',
    });

    items.push({
      id: 'race-start',
      time: raceInfo.startTime,
      title: 'Race Start!',
      description: `${runnerName || 'Your runner'} starts their full marathon journey!`,
      type: 'race',
      location: 'Start Line',
    });

    spectatorSpots.forEach((spot, index) => {
      const timing = spotTimings.find((t) => t.spotId === spot.id);
      
      // Skip the first spot (start line) as we handle it separately above
      if (timing && spot.mileMarker > 0) {
        const nextSpot = spectatorSpots[index + 1];
        
        // Build enhanced description with travel info
        const descriptionParts = [];
        
        // Add travel info from previous spot
        if (spot.travelTimeFromPrevious && spot.travelTimeFromPrevious > 0) {
          const travelMode = spot.travelTimeFromPrevious >= 15 ? 'WALK' : 'DRIVE';
          const prevSpot = index > 0 ? spectatorSpots[index - 1] : null;
          
          if (prevSpot) {
            descriptionParts.push(`TRAVEL: ${travelMode} ${spot.travelTimeFromPrevious} min from ${prevSpot.name}`);
          }
        }
        
        // Add main description
        descriptionParts.push(spot.description);
        
        // Add next travel preview if not last spot
        if (nextSpot && nextSpot.travelTimeFromPrevious) {
          const nextTravelMode = nextSpot.travelTimeFromPrevious >= 15 ? 'Walk' : 'Drive';
          descriptionParts.push(`NEXT: ${nextTravelMode} ${nextSpot.travelTimeFromPrevious} min to ${nextSpot.name}`);
        }
        
        const enhancedDescription = descriptionParts.join('\n\n');
        
        items.push({
          id: `spot-${spot.id}`,
          time: timing.estimatedArrivalTime,
          title: spot.name,
          description: enhancedDescription,
          type: spot.mileMarker >= raceInfo.distance ? 'post-race' : 'spectator',
          location: spot.name,
          mileMarker: spot.mileMarker,
          spotId: spot.id,
          nearbyCoffee: spot.nearbyCoffee,
          nearbyFood: spot.nearbyFood,
          parking: spot.parking,
          parkingLocations: spot.parkingLocations,
        });
      }
    });

    // Finish and lunch are now included in spectatorSpots, so no need for separate logic

    items.sort((a, b) => {
      const timeA = convertTimeToMinutes(a.time);
      const timeB = convertTimeToMinutes(b.time);
      return timeA - timeB;
    });

    setTimelineItems(items);
  }, [spotTimings, runnerName, estimatedPace]);

  const convertTimeToMinutes = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    let totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    if (period === 'PM' && parseInt(hours) !== 12) {
      totalMinutes += 720;
    }
    if (period === 'AM' && parseInt(hours) === 12) {
      totalMinutes -= 720;
    }
    return totalMinutes;
  };

  const formatPace = (pace: number) => {
    const mins = Math.floor(pace);
    const secs = Math.round((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-4">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4 flex items-center space-x-3">
            <Calendar className="w-8 h-8 md:w-10 md:h-10 text-[#5e6ad2]" aria-hidden="true" />
            <span>Race Day Plan</span>
          </h1>
          <p className="text-lg md:text-xl text-[#6B7280]">
            Complete itinerary for supporting Rachel at the Novant Health Charlotte Marathon
          </p>
        </div>

        <Card className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="w-6 h-6 text-[#5e6ad2]" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937]">Customize Rachel's Pace</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Adjust the pace slider to match Rachel's expected running pace. This will automatically update all spectator spot timing estimates throughout your day.
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-lg font-bold text-[#1F2937]">
                  Estimated Pace
                </label>
                <span className="text-3xl font-bold text-[#5e6ad2]">
                  {formatPace(estimatedPace)}
                </span>
              </div>
              <input
                type="range"
                min="7"
                max="15"
                step="0.5"
                value={estimatedPace}
                onChange={(e) => setEstimatedPace(parseFloat(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-[0.5rem] appearance-none cursor-pointer accent-[#5e6ad2]"
                aria-label="Pace selector"
              />
              <div className="flex justify-between text-sm text-[#6B7280] mt-3">
                <div className="text-center">
                  <div className="font-semibold">7:00</div>
                  <div className="text-xs">Fast</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">11:00</div>
                  <div className="text-xs">Moderate</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">15:00</div>
                  <div className="text-xs">Easy</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Distance</div>
                <div className="text-2xl font-bold text-gray-900">26.2 mi</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Est. Race Time</div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.floor((26.2 * estimatedPace) / 60)}h {Math.round((26.2 * estimatedPace) % 60)}m
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Race Start</div>
                <div className="text-2xl font-bold text-gray-900">{raceInfo.startTime}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937]">
              Rachel's Race Day Timeline
            </h2>
            <span className="text-sm text-[#6B7280]">{timelineItems.length} events</span>
          </div>

          {timelineItems.length > 0 ? (
            <Timeline items={timelineItems} />
          ) : (
            <div className="text-center py-12 text-[#6B7280]">
              <p>Adjust pace settings above to generate your timeline</p>
            </div>
          )}

          <div className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50 p-4 md:p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-lg text-[#1F2937]">Race Day Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-[#1F2937]">
              <li className="flex items-start space-x-3">
                <Car className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Add 10-15 minutes buffer to travel times for parking and traffic</span>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Traffic is heavy near start/finish - arrive extra early</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Keep phone charged for photos, live tracking, and navigation</span>
              </li>
              <li className="flex items-start space-x-3">
                <Flag className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Arrange a clear meeting spot near finish line after the race</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
      
      {/* Sticky Live Tracking Button */}
      {raceInfo.liveTrackingUrl && (
        <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3 shadow-lg max-w-xs text-right">
            <p className="text-xs text-green-900 font-bold">
              Click "Follow" on her results page to enable live tracking!
            </p>
          </div>
          <a
            href={raceInfo.liveTrackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-200 animate-pulse"
          >
            <Radio className="w-5 h-5" />
            <span>Track Rachel Live</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default DayPlanPage;
