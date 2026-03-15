import { Search, MapPin, Clock, Zap, Users, Shield, Smartphone } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart City Parking
            <span className="block text-blue-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find parking spots, get transport suggestions, and swap parking spaces in real-time. 
            Swiftly solves common city problems with innovative solutions.
          </p>
          
          {/* Quick Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for parking near you..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Search
              </button>
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            <div className="flex flex-col items-center justify-between p-10 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up hover-lift h-[380px]">
              <div className="flex flex-col items-center">
                {/* Icon placeholder - replace with your custom icon */}
                <div className="bg-blue-100 p-5 rounded-full mb-6 w-20 h-20 flex items-center justify-center">
                  {/* Your custom icon goes here */}
                  <div className="w-12 h-12 bg-blue-600 rounded"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Smart Parking Finder</h3>
                <p className="text-gray-600 text-center mb-4 leading-relaxed">Find and book parking spots with advanced filters for vehicle type, duration, and budget</p>
              </div>
              <ul className="text-sm text-gray-500 space-y-2 text-center mt-auto">
                <li>• Real-time availability</li>
                <li>• Price comparison</li>
                <li>• Distance optimization</li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-between p-10 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up hover-lift h-[380px]" style={{ animationDelay: '0.1s' }}>
              <div className="flex flex-col items-center">
                {/* Icon placeholder - replace with your custom icon */}
                <div className="bg-blue-100 p-5 rounded-full mb-6 w-20 h-20 flex items-center justify-center">
                  {/* Your custom icon goes here */}
                  <div className="w-12 h-12 bg-blue-600 rounded"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Traffic-Based Suggestions</h3>
                <p className="text-gray-600 text-center mb-4 leading-relaxed">Get intelligent public transport alternatives when traffic gets heavy</p>
              </div>
              <ul className="text-sm text-gray-500 space-y-2 text-center mt-auto">
                <li>• Live traffic analysis</li>
                <li>• Multi-modal routing</li>
                <li>• Time & cost savings</li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-between p-10 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up hover-lift h-[380px]" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col items-center">
                {/* Icon placeholder - replace with your custom icon */}
                <div className="bg-blue-100 p-5 rounded-full mb-6 w-20 h-20 flex items-center justify-center">
                  {/* Your custom icon goes here */}
                  <div className="w-12 h-12 bg-blue-600 rounded"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Parking Swap</h3>
                <p className="text-gray-600 text-center mb-4 leading-relaxed">Real-time matching system to reserve spots from users who are leaving</p>
              </div>
              <ul className="text-sm text-gray-500 space-y-2 text-center mt-auto">
                <li>• Instant notifications</li>
                <li>• Secure reservations</li>
                <li>• Community-driven</li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-between p-10 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up hover-lift h-[380px]" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col items-center">
                {/* Icon placeholder - replace with your custom icon */}
                <div className="bg-blue-100 p-5 rounded-full mb-6 w-20 h-20 flex items-center justify-center">
                  {/* Your custom icon goes here */}
                  <div className="w-12 h-12 bg-blue-600 rounded"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Community Network</h3>
                <p className="text-gray-600 text-center mb-4 leading-relaxed">Connect with other drivers to share parking tips and coordinate swaps</p>
              </div>
              <ul className="text-sm text-gray-500 space-y-2 text-center mt-auto">
                <li>• User ratings & reviews</li>
                <li>• Local parking insights</li>
                <li>• Social coordination</li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-between p-10 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up hover-lift h-[380px]" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col items-center">
                {/* Icon placeholder - replace with your custom icon */}
                <div className="bg-blue-100 p-5 rounded-full mb-6 w-20 h-20 flex items-center justify-center">
                  {/* Your custom icon goes here */}
                  <div className="w-12 h-12 bg-blue-600 rounded"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Secure Payments</h3>
                <p className="text-gray-600 text-center mb-4 leading-relaxed">Safe and seamless payment processing with multiple payment options</p>
              </div>
              <ul className="text-sm text-gray-500 space-y-2 text-center mt-auto">
                <li>• Encrypted transactions</li>
                <li>• Multiple payment methods</li>
                <li>• Instant receipts</li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-between p-10 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up hover-lift h-[380px]" style={{ animationDelay: '0.5s' }}>
              <div className="flex flex-col items-center">
                {/* Icon placeholder - replace with your custom icon */}
                <div className="bg-blue-100 p-5 rounded-full mb-6 w-20 h-20 flex items-center justify-center">
                  {/* Your custom icon goes here */}
                  <div className="w-12 h-12 bg-blue-600 rounded"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Mobile First</h3>
                <p className="text-gray-600 text-center mb-4 leading-relaxed">Optimized mobile experience with offline capabilities and GPS integration</p>
              </div>
              <ul className="text-sm text-gray-500 space-y-2 text-center mt-auto">
                <li>• Offline map access</li>
                <li>• GPS navigation</li>
                <li>• Push notifications</li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
              Get Started Free
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;