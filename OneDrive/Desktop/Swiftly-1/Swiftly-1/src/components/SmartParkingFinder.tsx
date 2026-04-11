import { useState } from 'react';
import { MapPin, Filter, Car, Bike, Truck, Clock, DollarSign, Navigation, Calendar } from 'lucide-react';

interface ParkingSpot {
  id: string;
  name: string;
  distance: string;
  price: string;
  duration: string;
  vehicleTypes: string[];
  availability: number;
  rating: number;
  features: string[];
}

const SmartParkingFinder = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const [selectedDuration, setSelectedDuration] = useState('2h');
  const [maxPrice, setMaxPrice] = useState(50);

  const parkingSpots: ParkingSpot[] = [
    {
      id: '1',
      name: 'Central Mall Parking',
      distance: '0.2 km',
      price: '₹30/hr',
      duration: '24/7',
      vehicleTypes: ['car', 'bike'],
      availability: 15,
      rating: 4.5,
      features: ['Covered', 'Security', 'EV Charging']
    },
    {
      id: '2',
      name: 'Metro Station Parking',
      distance: '0.5 km',
      price: '₹20/hr',
      duration: '6 AM - 11 PM',
      vehicleTypes: ['car', 'bike', 'truck'],
      availability: 8,
      rating: 4.2,
      features: ['Open', 'CCTV', 'Washroom']
    },
    {
      id: '3',
      name: 'Business District Hub',
      distance: '0.8 km',
      price: '₹45/hr',
      duration: '24/7',
      vehicleTypes: ['car'],
      availability: 3,
      rating: 4.8,
      features: ['Valet', 'Covered', 'Premium']
    }
  ];

  const vehicleIcons = {
    car: Car,
    bike: Bike,
    truck: Truck
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 animate-slide-up">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Enter your location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Filters</span>
            </button>

            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Search Nearby
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                  <div className="flex space-x-2">
                    {Object.entries(vehicleIcons).map(([type, Icon]) => (
                      <button
                        key={type}
                        onClick={() => setSelectedVehicle(type)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors duration-200 ${
                          selectedVehicle === type
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="capitalize">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1h">1 Hour</option>
                    <option value="2h">2 Hours</option>
                    <option value="4h">4 Hours</option>
                    <option value="8h">8 Hours</option>
                    <option value="24h">Full Day</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price: ₹{maxPrice}/hr
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Parking Spots Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkingSpots.map((spot, index) => (
            <div
              key={spot.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{spot.name}</h3>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm text-gray-600">{spot.rating}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{spot.distance} away</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">{spot.price}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{spot.duration}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Available:</span>
                  <span className={`text-sm font-medium ${
                    spot.availability > 10 ? 'text-green-600' : 
                    spot.availability > 5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {spot.availability} spots
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {spot.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Book Now</span>
                </button>
                <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Navigation className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartParkingFinder;


