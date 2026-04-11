import SmartParkingFinder from '../components/SmartParkingFinder';

const ParkingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Smart Parking Finder</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Find the perfect parking spot with advanced filters, real-time availability, and instant booking
            </p>
          </div>
        </div>
      </div>
      <SmartParkingFinder />
    </div>
  );
};

export default ParkingPage;