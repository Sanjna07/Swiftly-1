import PublicTransportSuggestions from '../components/PublicTransportSuggestions';

const TransportPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Public Transport Suggestions</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Smart recommendations based on real-time traffic conditions to save your time and fuel
            </p>
          </div>
        </div>
      </div>
      <PublicTransportSuggestions />
    </div>
  );
};

export default TransportPage;