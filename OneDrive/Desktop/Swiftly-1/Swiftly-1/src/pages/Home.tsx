import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, Zap } from 'lucide-react';
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section - White */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 animate-text-reveal">
              Smart City Parking
              <span className="block bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent text-fade-in stagger-2">
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto text-fade-in stagger-3">
              Find parking spots, get transport suggestions, and swap parking spaces in real-time. 
              Swiftly solves common city problems with innovative solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up stagger-4">
              <Link
                to="/parking"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold hover-lift"
              >
                Find Parking Now
              </Link>
              <Link
                to="/transport"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold hover-lift"
              >
                Check Transport Options
              </Link>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Link to="/parking" className="group fade-in-on-scroll">
                <div className="flex flex-col items-center justify-between p-10 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover-lift group-hover:scale-105 h-[420px]">
                  <div className="flex flex-col items-center">
                    {/* Smart Parking Finder Icon */}
                    <div className="bg-blue-100 p-5 rounded-full mb-8 w-24 h-24 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                      <MapPin className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-4 text-center">Smart Parking Finder</h3>
                    <p className="text-slate-600 text-center mb-6 leading-relaxed">Find and book parking spots with advanced filters for vehicle type, duration, and budget. Get real-time availability updates and compare prices across multiple parking facilities.</p>
                  </div>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 mt-auto">
                    <span className="text-sm font-medium">Explore Feature</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Link>

              <Link to="/transport" className="group fade-in-on-scroll stagger-1">
                <div className="flex flex-col items-center justify-between p-10 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover-lift group-hover:scale-105 h-[420px]">
                  <div className="flex flex-col items-center">
                    {/* Traffic-Based Suggestions Icon */}
                    <div className="bg-blue-100 p-5 rounded-full mb-8 w-24 h-24 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                      <Clock className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-4 text-center">Traffic-Based Suggestions</h3>
                    <p className="text-slate-600 text-center mb-6 leading-relaxed">Get intelligent public transport alternatives when traffic gets heavy. Our system analyzes real-time traffic data to suggest the fastest routes and transportation modes.</p>
                  </div>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 mt-auto">
                    <span className="text-sm font-medium">Explore Feature</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Link>

              <Link to="/swap" className="group fade-in-on-scroll stagger-2">
                <div className="flex flex-col items-center justify-between p-10 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover-lift group-hover:scale-105 h-[420px]">
                  <div className="flex flex-col items-center">
                    {/* Parking Swap Icon */}
                    <div className="bg-blue-100 p-5 rounded-full mb-8 w-24 h-24 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                      <Zap className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-4 text-center">Parking Swap</h3>
                    <p className="text-slate-600 text-center mb-6 leading-relaxed">Real-time matching system to reserve spots from users who are leaving. Connect with other drivers and coordinate parking space exchanges seamlessly through our platform.</p>
                  </div>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 mt-auto">
                    <span className="text-sm font-medium">Explore Feature</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - White */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 text-fade-in">How Swiftly Works</h2>
            <p className="text-xl text-slate-600 text-fade-in stagger-1">Three simple steps to smarter parking</p>
          </div>
          
          {/* Step 1 - Text Left, Image Right */}
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-20 fade-in-on-scroll">
            <div className="flex-1 lg:pr-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mr-6">
                  1
                </div>
                <h3 className="text-3xl font-semibold text-slate-900">Search & Filter</h3>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Enter your location and apply advanced filters for vehicle type, duration, budget, and amenities to find the perfect parking spot that meets all your needs.
              </p>
              <ul className="text-slate-600 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Real-time availability updates
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Advanced filtering options
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Price comparison across locations
                </li>
              </ul>
            </div>
            <div className="flex-1 lg:pl-8">
              {/* Image placeholder - replace with your image */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl overflow-hidden h-80 flex items-center justify-center">
                <img src="https://res.cloudinary.com/dx0r0pbgb/image/upload/v1773556564/search-removebg-preview_lo4frj.png" alt="Search & Filter" className="w-full h-full object-cover rounded-2xl" /> 
              </div>
            </div>
          </div>

          {/* Step 2 - Image Left, Text Right */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-20 fade-in-on-scroll stagger-1">
            <div className="flex-1 lg:pl-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mr-6">
                  2
                </div>
                <h3 className="text-3xl font-semibold text-slate-900">Book or Swap</h3>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Reserve your spot instantly with secure payment, or join our innovative parking swap network to find spots from users who are leaving their current location.
              </p>
              <ul className="text-slate-600 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Instant booking confirmation
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Secure payment processing
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Real-time swap matching
                </li>
              </ul>
            </div>
            <div className="flex-1 lg:pr-8">
              {/* Image placeholder - replace with your image */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl overflow-hidden h-80 flex items-center justify-center">
                <img src="https://res.cloudinary.com/dx0r0pbgb/image/upload/v1773556842/swap-removebg-preview_orzspx.png" alt="Book or Swap" className="w-full h-full object-cover rounded-2xl" /> 
              </div>
            </div>
          </div>

          {/* Step 3 - Text Left, Image Right */}
          <div className="flex flex-col lg:flex-row items-center gap-12 fade-in-on-scroll stagger-2">
            <div className="flex-1 lg:pr-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mr-6">
                  3
                </div>
                <h3 className="text-3xl font-semibold text-slate-900">Navigate & Park</h3>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Get turn-by-turn GPS directions to your reserved spot, receive real-time updates, and enjoy completely hassle-free parking in the busy city.
              </p>
              <ul className="text-slate-600 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  GPS navigation to your spot
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Real-time parking updates
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Hassle-free parking experience
                </li>
              </ul>
            </div>
            <div className="flex-1 lg:pl-8">
              {/* Image placeholder - replace with your image */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl overflow-hidden h-80 flex items-center justify-center">
                <img src="https://res.cloudinary.com/dx0r0pbgb/image/upload/v1773557209/output-onlinepngtools__2_-removebg-preview_o57ljr.png" alt="Navigate & Park" className="w-full h-full object-cover rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Baby Blue */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in-on-scroll">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 text-fade-in">Ready to Transform Your Commute?</h2>
            <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto text-fade-in stagger-1">
              Join thousands of users who have already made their city travel smarter and more efficient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2">
              <Link
                to="/parking"
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold hover-lift"
              >
                Start Finding Parking
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold hover-lift"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;