import { useState } from 'react';
import { Bus, Train, Clock, MapPin, TrendingUp, AlertTriangle, Navigation } from 'lucide-react';

interface TransportOption {
  id: string;
  type: 'metro' | 'bus';
  route: string;
  duration: string;
  cost: string;
  crowdLevel: 'low' | 'medium' | 'high';
  nextArrival: string;
  stops: number;
  walkingDistance: string;
}

const PublicTransportSuggestions = () => {
  const [currentTraffic, setCurrentTraffic] = useState('heavy');
  const [destination, setDestination] = useState('');

  const transportOptions: TransportOption[] = [
    {
      id: '1',
      type: 'metro',
      route: 'Blue Line → Red Line',
      duration: '25 min',
      cost: '₹35',
      crowdLevel: 'medium',
      nextArrival: '3 min',
      stops: 8,
      walkingDistance: '400m'
    },
    {
      id: '2',
      type: 'bus',
      route: 'Route 45A',
      duration: '35 min',
      cost: '₹15',
      crowdLevel: 'low',
      nextArrival: '7 min',
      stops: 12,
      walkingDistance: '200m'
    },
    {
      id: '3',
      type: 'metro',
      route: 'Green Line',
      duration: '30 min',
      cost: '₹40',
      crowdLevel: 'high',
      nextArrival: '5 min',
      stops: 10,
      walkingDistance: '600m'
    }
  ];

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrafficStatus = () => {
    switch (currentTraffic) {
      case 'light': return { color: 'text-green-600', icon: '🟢', message: 'Traffic is light - driving might be faster' };
      case 'moderate': return { color: 'text-yellow-600', icon: '🟡', message: 'Moderate traffic - consider alternatives' };
      case 'heavy': return { color: 'text-red-600', icon: '🔴', message: 'Heavy traffic detected - public transport recommended' };
      default: return { color: 'text-gray-600', icon: '⚪', message: 'Checking traffic conditions...' };
    }
  };

  const trafficStatus = getTrafficStatus();

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Traffic Status Alert */}
        <div className="bg-white rounded-xl p-6 mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className={`h-6 w-6 ${trafficStatus.color}`} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Current Traffic Status</h3>
                <p className={`text-sm ${trafficStatus.color}`}>{trafficStatus.message}</p>
              </div>
            </div>
            <span className="text-2xl">{trafficStatus.icon}</span>
          </div>

          {/* Destination Input */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Get Suggestions
            </button>
          </div>
        </div>

        {/* Transport Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {transportOptions.map((option, index) => (
            <div
              key={option.id}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {option.type === 'metro' ? (
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Train className="h-6 w-6 text-blue-600" />
                    </div>
                  ) : (
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Bus className="h-6 w-6 text-green-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">{option.type}</h3>
                    <p className="text-sm text-gray-600">{option.route}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCrowdColor(option.crowdLevel)}`}>
                  {option.crowdLevel} crowd
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <span className="font-medium text-gray-900">{option.duration}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-sm">Cost</span>
                  </div>
                  <span className="font-medium text-gray-900">{option.cost}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-sm">Next arrival</span>
                  </div>
                  <span className="font-medium text-green-600">{option.nextArrival}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-sm">Walking distance</span>
                  </div>
                  <span className="font-medium text-gray-900">{option.walkingDistance}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-sm">Stops</span>
                  </div>
                  <span className="font-medium text-gray-900">{option.stops}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Navigation className="h-4 w-4" />
                  <span>Navigate</span>
                </button>
                <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <TrendingUp className="h-4 w-4" />
                </button>
              </div>

              {/* Time Comparison */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">vs. Driving in traffic:</span>
                  <span className="font-medium text-red-600">~45-60 min</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">Time saved:</span>
                  <span className="font-medium text-green-600">~20-35 min</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Traffic Simulation Controls (for demo) */}
        <div className="mt-8 bg-white rounded-xl p-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Simulation (Demo)</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentTraffic('light')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                currentTraffic === 'light' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Light Traffic
            </button>
            <button
              onClick={() => setCurrentTraffic('moderate')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                currentTraffic === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Moderate Traffic
            </button>
            <button
              onClick={() => setCurrentTraffic('heavy')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                currentTraffic === 'heavy' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Heavy Traffic
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicTransportSuggestions;