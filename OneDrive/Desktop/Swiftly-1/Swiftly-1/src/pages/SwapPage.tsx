import ParkingSwap from '../components/ParkingSwap';

const SwapPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Parking Swap Network</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Real-time matching system to reserve spots from users who are leaving
            </p>
          </div>
        </div>
      </div>
      <ParkingSwap />
    </div>
  );
};

export default SwapPage;