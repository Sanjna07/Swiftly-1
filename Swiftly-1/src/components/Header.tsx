import { MapPin, Menu, X, ChevronDown, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  
  // Mock user state - in real app this would come from context/state management
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isServicesActive = () => ['/parking', '/transport', '/swap'].includes(location.pathname);

  const services = [
    { name: 'Smart Parking', path: '/parking', description: 'Find and book parking spots' },
    { name: 'Public Transport', path: '/transport', description: 'Traffic-based suggestions' },
    { name: 'Parking Swap', path: '/swap', description: 'Real-time spot exchange' }
  ];

  const handleServiceClick = () => {
    setIsServicesOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover-lift">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              Swiftly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-all duration-300 ${
                isActive('/') ? 'text-blue-600 font-medium' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className={`flex items-center space-x-1 transition-all duration-300 ${
                  isServicesActive() ? 'text-blue-600 font-medium' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-blue-100 animate-slide-down">
                  {services.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      onClick={handleServiceClick}
                      className="block px-4 py-3 hover:bg-blue-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div className="font-medium text-slate-900">{service.name}</div>
                      <div className="text-sm text-slate-500">{service.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/about" 
              className={`transition-all duration-300 ${
                isActive('/about') ? 'text-blue-600 font-medium' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              About
            </Link>
            
            <Link 
              to="/contact" 
              className={`transition-all duration-300 ${
                isActive('/contact') ? 'text-blue-600 font-medium' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium hover-lift"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-blue-100 animate-slide-down">
                    <Link
                      to="/settings"
                      className="block px-4 py-3 hover:bg-blue-50 transition-colors duration-200 rounded-t-xl"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-200 rounded-b-xl text-red-600"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-blue-100">
              <Link 
                to="/" 
                className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive('/') ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {services.map((service) => (
                <Link
                  key={service.path}
                  to={service.path}
                  className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                    isActive(service.path) ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {service.name}
                </Link>
              ))}
              
              <Link 
                to="/about" 
                className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive('/about') ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              <Link 
                to="/contact" 
                className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive('/contact') ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>

              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="block mx-3 mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block mx-3 mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;