import { Users, Target, Lightbulb, Award, MapPin, Clock, Zap } from 'lucide-react';

const AboutPage = () => {
  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'CEO & Co-founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      bio: 'Former product manager at tech giants, passionate about solving urban mobility challenges with innovative technology solutions.'
    },
    {
      name: 'Priya Sharma',
      role: 'CTO & Co-founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      bio: 'AI/ML expert with 8+ years in building scalable transportation solutions and real-time data processing systems.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Revolutionizing Urban Mobility
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              We're on a mission to make city commuting smarter, faster, and more sustainable through innovative technology solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-50 rounded-xl shadow-sm hover-lift animate-slide-up">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600">
                To eliminate the frustration of finding parking and reduce traffic congestion in cities through smart technology solutions.
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-xl shadow-sm hover-lift animate-slide-up stagger-1">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Our Vision</h3>
              <p className="text-slate-600">
                A world where urban mobility is seamless, sustainable, and stress-free for everyone.
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-xl shadow-sm hover-lift animate-slide-up stagger-2">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Our Values</h3>
              <p className="text-slate-600">
                Innovation, sustainability, user-centricity, and making technology accessible to all urban commuters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Innovations */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Innovations</h2>
            <p className="text-xl text-slate-600">Three breakthrough solutions changing urban mobility</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover-lift animate-slide-up hover-glow">
              <div className="bg-blue-100 p-3 rounded-lg w-12 h-12 mb-6 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Smart Parking Finder</h3>
              <p className="text-slate-600 mb-4">
                Advanced filtering system with real-time availability, pricing transparency, and instant booking capabilities.
              </p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>• Vehicle-specific filtering</li>
                <li>• Budget-based search</li>
                <li>• Real-time availability</li>
                <li>• Instant booking</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover-lift animate-slide-up hover-glow stagger-1">
              <div className="bg-blue-100 p-3 rounded-lg w-12 h-12 mb-6 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Traffic-Based Suggestions</h3>
              <p className="text-slate-600 mb-4">
                AI-powered system that suggests optimal transport modes based on real-time traffic conditions.
              </p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>• Real-time traffic analysis</li>
                <li>• Multi-modal suggestions</li>
                <li>• Time & cost comparison</li>
                <li>• Route optimization</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover-lift animate-slide-up hover-glow stagger-2">
              <div className="bg-blue-100 p-3 rounded-lg w-12 h-12 mb-6 flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Parking Swap Network</h3>
              <p className="text-slate-600 mb-4">
                Revolutionary peer-to-peer system for real-time parking spot exchanges between users.
              </p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>• Real-time matching</li>
                <li>• Instant notifications</li>
                <li>• Peer-to-peer network</li>
                <li>• Zero infrastructure cost</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Mission</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Be part of the revolution that's making cities smarter and more livable for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold hover-lift">
                Join Our Team
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold hover-lift">
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;