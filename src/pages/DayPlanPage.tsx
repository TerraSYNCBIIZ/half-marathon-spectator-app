import { useState, useEffect } from 'react';
import { spectatorSpots, raceInfo } from '../data/raceData';
import { SpotTiming } from '../types';
import Timeline from '../components/Timeline/Timeline';
import Card from '../components/ui/Card';
import { Calendar } from 'lucide-react';

interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'pre-race' | 'race' | 'spectator' | 'post-race';
  location?: string;
  mileMarker?: number;
  spotId?: string;
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
      title: 'Arrive & Park',
      description: 'Arrive early to secure parking near the start line. Find your viewing spot.',
      type: 'pre-race',
      location: 'Start Line Area',
    });

    items.push({
      id: 'pre-race-prep',
      time: '7:00 AM',
      title: 'Final Preparations',
      description: 'Find your viewing spot, set up signs, and get ready to cheer!',
      type: 'pre-race',
      location: 'Start Line',
    });

    items.push({
      id: 'race-start',
      time: raceInfo.startTime,
      title: 'Race Start!',
      description: `${runnerName || 'Your runner'} starts their full marathon journey!`,
      type: 'race',
      location: 'Start Line',
    });

    spectatorSpots.forEach((spot) => {
      const timing = spotTimings.find((t) => t.spotId === spot.id);
      if (timing && spot.mileMarker > 0 && spot.mileMarker < raceInfo.distance) {
        items.push({
          id: `spot-${spot.id}`,
          time: timing.estimatedArrivalTime,
          title: spot.name,
          description: spot.description,
          type: 'spectator',
          location: spot.name,
          mileMarker: spot.mileMarker,
          spotId: spot.id,
        });

        if (spot.travelTimeFromPrevious && spot.travelTimeFromPrevious > 0) {
          const [hours, mins] = timing.estimatedArrivalTime.split(':');
          const [minsOnly, period] = mins.split(' ');
          const currentMinutes = parseInt(hours) * 60 + parseInt(minsOnly);
          const isPM = period === 'PM';
          const adjustedMinutes = isPM && parseInt(hours) !== 12 ? currentMinutes + 720 : currentMinutes;
          const travelMinutes = adjustedMinutes + spot.travelTimeFromPrevious + 10;
          const travelHours = Math.floor(travelMinutes / 60) % 24;
          const travelMins = Math.floor(travelMinutes % 60);
          const travelPeriod = travelHours >= 12 ? 'PM' : 'AM';
          const displayTravelHours = travelHours > 12 ? travelHours - 12 : travelHours === 0 ? 12 : travelHours;

          items.push({
            id: `travel-${spot.id}`,
            time: `${displayTravelHours}:${travelMins.toString().padStart(2, '0')} ${travelPeriod}`,
            title: `Travel to Next Spot`,
            description: `Drive ~${spot.travelTimeFromPrevious} minutes to your next viewing location.`,
            type: 'pre-race',
            location: 'In Transit',
          });
        }
      }
    });

    const finishTiming = spotTimings.find((t) => t.spotId === spectatorSpots[spectatorSpots.length - 1]?.id);
    if (finishTiming) {
      items.push({
        id: 'finish-line',
        time: finishTiming.estimatedArrivalTime,
        title: 'Finish Line! 🎉',
        description: `${runnerName || 'Your runner'} crosses the finish line! Be there to celebrate!`,
        type: 'spectator',
        location: 'Finish Line',
        mileMarker: raceInfo.distance,
      });

      const [finishHours, finishMins] = finishTiming.estimatedArrivalTime.split(':');
      const [finishMinsOnly, finishPeriod] = finishMins.split(' ');
      const finishMinutes = parseInt(finishHours) * 60 + parseInt(finishMinsOnly);
      const isFinishPM = finishPeriod === 'PM';
      const adjustedFinishMinutes = isFinishPM && parseInt(finishHours) !== 12 ? finishMinutes + 720 : finishMinutes;
      const postRaceMinutes = adjustedFinishMinutes + 15;

      const postRaceHours = Math.floor(postRaceMinutes / 60) % 24;
      const postRaceMins = Math.floor(postRaceMinutes % 60);
      const postRacePeriod = postRaceHours >= 12 ? 'PM' : 'AM';
      const displayPostRaceHours = postRaceHours > 12 ? postRaceHours - 12 : postRaceHours === 0 ? 12 : postRaceHours;

      items.push({
        id: 'post-race-meetup',
        time: `${displayPostRaceHours}:${postRaceMins.toString().padStart(2, '0')} ${postRacePeriod}`,
        title: 'Post-Race Meetup',
        description: 'Meet your runner, celebrate, and enjoy the post-race festivities!',
        type: 'post-race',
        location: 'Finish Area',
      });
    }

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
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4  flex items-center space-x-3">
            <Calendar className="w-8 h-8 md:w-10 md:h-10 text-[#5e6ad2]" aria-hidden="true" />
            <span>Your Race Day Plan</span>
          </h1>
          <p className="text-lg md:text-xl text-[#6B7280]">
            Personalized timeline for spectating the race
          </p>
        </div>

        <Card className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-6 ">Customize Your Plan</h2>

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

          <div className="mt-8 bg-yellow-50 p-4 md:p-6 rounded-[0.5rem]">
            <h3 className="font-bold text-lg text-[#1F2937] mb-3 ">Planning Tips</h3>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start">
                <span className="mr-2 text-[#5e6ad2]">▸</span>
                <span>Add 10-15 minutes buffer to travel times for parking</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-[#5e6ad2]">▸</span>
                <span>Traffic can be heavy near start/finish - leave extra early</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-[#5e6ad2]">▸</span>
                <span>Keep your phone charged for photos and updates</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-[#5e6ad2]">▸</span>
                <span>Have a meeting spot arranged after the race</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DayPlanPage;
