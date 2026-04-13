import { useState } from 'react';
import { User, Mail, Phone, MapPin, Car, Clock, Bell, Shield, CreditCard } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      name: savedUser.name || '',
      email: savedUser.email || '',
      phone: savedUser.phone || '',
      address: 'Sector 18, Gurugram, Haryana'
    };
  });

  const [vehicleData, setVehicleData] = useState({
    vehicleType: 'car',
    licensePlate: 'DL 01 AB 1234',
    model: 'Honda City'
  });

  const parkingHistory = [
    {
      id: 1,
      location: 'Central Mall - Level 2',
      date: '2024-03-10',
      duration: '2 hours',
      cost: '₹60',
      status: 'completed'
    },
    {
      id: 2,
      location: 'Metro Station Parking',
      date: '2024-03-08',
      duration: '4 hours',
      cost: '₹80',
      status: 'completed'
    },
    {
      id: 3,
      location: 'Business District Hub',
      date: '2024-03-05',
      duration: '8 hours',
      cost: '₹360',
      status: 'completed'
    }
  ];

  const swapHistory = [
    {
      id: 1,
      type: 'received',
      location: 'Central Mall - Level 3',
      date: '2024-03-12',
      fromUser: 'Priya S.',
      status: 'completed'
    },
    {
      id: 2,
      type: 'given',
      location: 'Metro Station',
      date: '2024-03-09',
      toUser: 'Rahul K.',
      status: 'completed'
    }
  ];

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'vehicle', name: 'Vehicle', icon: Car },
    { id: 'history', name: 'History', icon: Clock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'payment', name: 'Payment', icon: CreditCard }
  ];

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setVehicleData({
      ...vehicleData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Account Settings</h1>
            <p className="text-xl text-slate-600">Manage your profile, preferences, and history</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600 font-medium'
                        : 'text-slate-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:w-3/4">
            {activeTab === 'profile' && (
              <div className="bg-white border border-gray-200 rounded-xl p-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'vehicle' && (
              <div className="bg-white border border-gray-200 rounded-xl p-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Vehicle Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Type</label>
                    <select
                      name="vehicleType"
                      value={vehicleData.vehicleType}
                      onChange={handleVehicleChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="car">Car</option>
                      <option value="bike">Bike</option>
                      <option value="truck">Truck</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">License Plate</label>
                      <input
                        type="text"
                        name="licensePlate"
                        value={vehicleData.licensePlate}
                        onChange={handleVehicleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Model</label>
                      <input
                        type="text"
                        name="model"
                        value={vehicleData.model}
                        onChange={handleVehicleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium">
                    Update Vehicle
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-8 animate-fade-in">
                {/* Parking History */}
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Parking History</h2>
                  <div className="space-y-4">
                    {parkingHistory.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-slate-900">{item.location}</h3>
                          <p className="text-sm text-slate-600">{item.date} • {item.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">{item.cost}</p>
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Swap History */}
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Parking Swap History</h2>
                  <div className="space-y-4">
                    {swapHistory.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-slate-900">{item.location}</h3>
                          <p className="text-sm text-slate-600">
                            {item.date} • {item.type === 'received' ? `From ${item.fromUser}` : `To ${item.toUser}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.type === 'received' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-800'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white border border-gray-200 rounded-xl p-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Parking Reminders</h3>
                      <p className="text-sm text-slate-600">Get notified before your parking expires</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Swap Notifications</h3>
                      <p className="text-sm text-slate-600">Get notified about nearby parking swaps</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Traffic Alerts</h3>
                      <p className="text-sm text-slate-600">Get traffic-based transport suggestions</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white border border-gray-200 rounded-xl p-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <h3 className="font-medium text-slate-900">Change Password</h3>
                    <p className="text-sm text-slate-600">Update your account password</p>
                  </button>
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <h3 className="font-medium text-slate-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-slate-600">Add an extra layer of security</p>
                  </button>
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <h3 className="font-medium text-slate-900">Login History</h3>
                    <p className="text-sm text-slate-600">View your recent login activity</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="bg-white border border-gray-200 rounded-xl p-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Methods</h2>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">•••• •••• •••• 1234</p>
                          <p className="text-sm text-slate-600">Expires 12/26</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Default
                      </span>
                    </div>
                  </div>
                  <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200">
                    + Add New Payment Method
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;