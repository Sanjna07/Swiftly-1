import { MapPin, Mail, Phone, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Swiftly</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              Solving common city problems with smart parking solutions, traffic-based transport suggestions, 
              and innovative parking swap features.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/parking" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Smart Parking Finder
                </Link>
              </li>
              <li>
                <Link to="/transport" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Public Transport
                </Link>
              </li>
              <li>
                <Link to="/swap" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Parking Swap
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-200">
                <Mail className="h-4 w-4" />
                <span className="text-sm">hello@swiftly.app</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-200">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Swiftly. All rights reserved. Making city commuting smarter and more efficient.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;