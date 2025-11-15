import { Clock, Zap, Smartphone, MessageSquare, AlarmClock, Backpack, Navigation as NavIcon, Volume2, Radio } from 'lucide-react';
import { raceInfo } from '../data/raceData';
import Card from '../components/ui/Card';

const HomePage = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const daysUntilRace = () => {
    const today = new Date();
    const raceDate = new Date(raceInfo.date);
    const diffTime = raceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const days = daysUntilRace();

  const tips = [
    {
      icon: Smartphone,
      title: 'Keep Your Phone Charged',
      description: 'Bring a portable charger for photos, videos, and tracking',
      color: 'text-blue-600'
    },
    {
      icon: MessageSquare,
      title: 'Make a Sign',
      description: 'Personalized signs boost morale and make great photos',
      color: 'text-green-600'
    },
    {
      icon: AlarmClock,
      title: 'Arrive Early',
      description: 'Popular spots fill up fast - get there 30+ min early',
      color: 'text-purple-600'
    },
    {
      icon: Backpack,
      title: 'Pack Essentials',
      description: 'Water, snacks, sunscreen, layers, and a warm jacket for after',
      color: 'text-orange-600'
    },
    {
      icon: NavIcon,
      title: 'Plan Your Route',
      description: 'Use the timing calculator to hit multiple spots efficiently',
      color: 'text-red-600'
    },
    {
      icon: Volume2,
      title: 'Be Loud & Positive',
      description: 'Your encouragement makes a HUGE difference, especially in later miles',
      color: 'text-pink-600'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-4">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#5e6ad2] rounded-full mb-6 shadow-lg">
            <Zap className="w-8 h-8 md:w-10 md:h-10 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-4 leading-tight">
            Rachel's Marathon Spectator Guide
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-[#6B7280] mb-6 font-medium">
            Your personalized guide to cheering Rachel on race day
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center bg-[#5e6ad2] text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg shadow-md">
              {formatDate(raceInfo.date)} • {raceInfo.startTime}
            </div>
            {days > 0 && (
              <div className="inline-flex items-center space-x-2 text-base md:text-lg text-[#5e6ad2] font-bold bg-[#f3f4f6] px-6 py-3 rounded-full">
                <Clock className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
                <span>{days} days to go!</span>
              </div>
            )}
          </div>
          
          {raceInfo.liveTrackingUrl && (
            <div className="flex flex-col items-center gap-4">
              <a
                href={raceInfo.liveTrackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 animate-pulse"
              >
                <Radio className="w-6 h-6" />
                <span>Track Rachel Live</span>
              </a>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 max-w-md text-center">
                <p className="text-sm text-green-900 font-semibold mb-1">
                  Important: Click "Follow" on Rachel's results page!
                </p>
                <p className="text-xs text-green-700">
                  After clicking the link above, you'll see a <span className="font-bold">"Follow"</span> button on her results page. Click it to enable live tracking with real-time location, pace, and predicted finish time!
                </p>
              </div>
            </div>
          )}
        </div>

        <Card className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-[0.5rem]">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937]">
              Race Day Spectator Tips
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-[0.5rem] hover:bg-gray-50 transition-colors">
                  <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 ${tip.color} bg-opacity-10 rounded-[0.5rem] flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${tip.color}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1F2937] text-base md:text-lg mb-1">{tip.title}</h3>
                    <p className="text-sm md:text-base text-[#6B7280] leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
