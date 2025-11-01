import { useState, useEffect } from 'react';
import { spectatorSpots, raceInfo } from '../data/raceData';
import { SpotTiming } from '../types';
import Card from '../components/ui/Card';
import { Clock } from 'lucide-react';

const TimingCalculatorPage = () => {
  const [estimatedPace, setEstimatedPace] = useState<number>(10);
  const [startTime] = useState(raceInfo.startTime);
  const [spotTimings, setSpotTimings] = useState<SpotTiming[]>([]);

  const calculateTimings = () => {
    const [hours, minutes] = startTime.split(':');
    const startMinutes = parseInt(hours) * 60 + parseInt(minutes.split(' ')[0]);
    const isPM = startTime.includes('PM');
    const adjustedStartMinutes = isPM && parseInt(hours) !== 12 ? startMinutes + 720 : startMinutes;

    const timings: SpotTiming[] = spectatorSpots.map(spot => {
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
        minutesFromStart
      };
    });

    setSpotTimings(timings);
  };

  useEffect(() => {
    calculateTimings();
  }, [estimatedPace]);

  const formatPace = (pace: number) => {
    const mins = Math.floor(pace);
    const secs = Math.round((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFinishTime = () => {
    const totalMinutes = raceInfo.distance * estimatedPace;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const pacePresets = [
    { label: 'Fast (8:00/mi)', value: 8 },
    { label: 'Moderate (9:30/mi)', value: 9.5 },
    { label: 'Steady (10:30/mi)', value: 10.5 },
    { label: 'Comfortable (12:00/mi)', value: 12 },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-4">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4 ">
            Timing Calculator
          </h1>
          <p className="text-lg md:text-xl text-[#6B7280]">
            Calculate when your runner will reach each spectator spot
          </p>
        </div>

        <Card className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-6 ">Runner Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Estimated Pace: {formatPace(estimatedPace)} per mile
              </label>
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
              <div className="flex justify-between text-sm text-[#6B7280] mt-2">
                <span>Fast (7:00)</span>
                <span>Moderate (11:00)</span>
                <span>Easy (15:00)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Quick Select Pace
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {pacePresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setEstimatedPace(preset.value)}
                    className={`px-4 py-2 rounded-[0.5rem] font-semibold transition-all text-sm ${
                      estimatedPace === preset.value
                        ? 'bg-[#5e6ad2] text-white shadow-md'
                        : 'bg-gray-100 text-[#1F2937] hover:bg-gray-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#f3f4f6] p-4 md:p-6 rounded-[0.5rem]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Estimated Finish Time</p>
                  <p className="text-2xl md:text-3xl font-bold text-[#5e6ad2] ">{formatFinishTime()}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-[#6B7280] mb-1">Start Time</p>
                  <p className="text-xl md:text-2xl font-semibold text-[#1F2937] ">{startTime}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-6">
            Rachel's Timeline
          </h2>
          
          <div className="space-y-4">
            {spectatorSpots.map((spot, index) => {
              const timing = spotTimings.find(t => t.spotId === spot.id);
              
              return (
                <div key={spot.id} className="relative">
                  {index < spectatorSpots.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-1 bg-[#f3f4f6]" />
                  )}
                  
                  <div className="flex items-start space-x-4 relative bg-white p-4 md:p-6 rounded-[0.5rem] border-2 border-gray-100 hover:border-[#5e6ad2] transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#5e6ad2] text-white rounded-full flex items-center justify-center font-bold text-lg z-10">
                      {spot.mileMarker}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-[#1F2937]  truncate">{spot.name}</h3>
                          <p className="text-sm text-[#6B7280]">Mile {spot.mileMarker}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-2xl md:text-3xl font-bold text-[#5e6ad2] ">
                            {timing?.estimatedArrivalTime}
                          </p>
                          <p className="text-sm text-[#6B7280]">
                            {Math.floor(timing?.minutesFromStart || 0)} min from start
                          </p>
                        </div>
                      </div>
                      
                      {spot.travelTimeFromPrevious && spot.travelTimeFromPrevious > 0 && (
                        <div className="mt-2 text-sm text-orange-600 font-semibold flex items-center space-x-1">
                          <span>🚗</span>
                          <span>Drive ~{spot.travelTimeFromPrevious} minutes from previous spot</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-yellow-50 p-4 md:p-6 rounded-[0.5rem]">
            <h3 className="font-bold text-lg text-[#1F2937] mb-3  flex items-center space-x-2">
              <Clock className="w-5 h-5" aria-hidden="true" />
              <span>Timing Tips</span>
            </h3>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start">
                <span className="mr-2 text-[#5e6ad2]">▸</span>
                <span>Add 5-10 minutes buffer for parking and positioning</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-[#5e6ad2]">▸</span>
                <span>Runners often slow down in later miles - adjust expectations</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-[#5e6ad2]">▸</span>
                <span>Traffic can be heavy near start/finish - leave extra early</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-[#5e6ad2]">▸</span>
                <span>Check travel times between spots to see if you can hit multiple</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TimingCalculatorPage;
