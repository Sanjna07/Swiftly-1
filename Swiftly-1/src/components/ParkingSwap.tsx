import { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Clock, Zap, Bell, CheckCircle, AlertCircle, X, Navigation } from 'lucide-react';
import { io } from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

const socket = io('http://localhost:5000');

interface SwapRequest {
  id: string;
  userName: string;
  location: string;
  distance: string;
  leavingIn: string;
  spotType: string;
  price: string;
  status: 'available' | 'reserved' | 'completed';
  lat?: number;
  lng?: number;
}

interface UserSwapStatus {
  isLeavingSoon: boolean;
  spotDetails?: {
    location: string;
    type: string;
    price: string;
  };
}

interface MapModalProps {
  swap: SwapRequest;
  userCoords: { lat: number; lng: number } | null;
  onClose: () => void;
}

const MapModal = ({ swap, userCoords, onClose }: MapModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [routeInfo, setRouteInfo] = useState<{dist: string, time: string} | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const timer = setTimeout(() => {
      if (mapInstance.current) return;
      const targetLat = swap.lat || 28.6139 + Math.random() * 0.05;
      const targetLng = swap.lng || 77.2090 + Math.random() * 0.05;

      const map = L.map(mapRef.current!).setView([targetLat, targetLng], 14);
      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      const parkingIcon = L.divIcon({
        html: `<div style="background:#2563eb;color:#fff;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;box-shadow:0 2px 10px rgba(37,99,235,0.45);border:2px solid #fff;">P</div>`,
        className: '',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      L.marker([targetLat, targetLng], { icon: parkingIcon })
        .addTo(map)
        .bindPopup(`<b>${swap.location}</b><br>${swap.price}`)
        .openPopup();

      if (userCoords) {
        const userIcon = L.divIcon({
          html: `<div style="background:#16a34a;border-radius:50%;width:14px;height:14px;border:3px solid #fff;box-shadow:0 0 0 3px rgba(22,163,74,0.35);"></div>`,
          className: '',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        L.marker([userCoords.lat, userCoords.lng], { icon: userIcon }).addTo(map).bindPopup('Your location');

        fetch(`https://router.project-osrm.org/route/v1/driving/${userCoords.lng},${userCoords.lat};${targetLng},${targetLat}?overview=full&geometries=geojson`)
          .then(r => r.json())
          .then(data => {
            if (data.routes?.length) {
              const route = data.routes[0];
              L.geoJSON(route.geometry, { style: { color: '#2563eb', weight: 4, opacity: 0.85 } }).addTo(map);
              map.fitBounds(L.geoJSON(route.geometry).getBounds(), { padding: [50, 50] });
              
              const distKm = (route.distance / 1000).toFixed(1);
              const timeMin = Math.round(route.duration / 60);
              setRouteInfo({ dist: `${distKm} km`, time: `${timeMin} min` });
            } else {
              L.polyline([[userCoords.lat, userCoords.lng], [targetLat, targetLng]], { color: '#2563eb', weight: 2, dashArray: '6 6', opacity: 0.65 }).addTo(map);
              map.fitBounds([[userCoords.lat, userCoords.lng], [targetLat, targetLng]], { padding: [50, 50] });
            }
          })
          .catch(() => {
            L.polyline([[userCoords.lat, userCoords.lng], [targetLat, targetLng]], { color: '#2563eb', weight: 2, dashArray: '6 6', opacity: 0.65 }).addTo(map);
            map.fitBounds([[userCoords.lat, userCoords.lng], [targetLat, targetLng]], { padding: [50, 50] });
          });
      }
    }, 120);

    return () => {
      clearTimeout(timer);
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="flex items-start justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{swap.location}</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {swap.spotType} spot
            </p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600 ml-4 flex-shrink-0 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div ref={mapRef} style={{ height: '380px', width: '100%', flexShrink: 0 }} />

        <div className="p-4 flex items-center justify-between border-t border-gray-100 bg-slate-50">
          <div className="flex gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1 font-medium text-gray-900">
              {swap.price}
            </span>
          </div>
          {routeInfo ? (
            <div className="flex items-center gap-1.5 text-sm text-blue-600 font-medium">
              <Navigation className="h-4 w-4" /> 
              {routeInfo.dist} · {routeInfo.time} drive
            </div>
          ) : userCoords ? (
            <span className="text-sm text-gray-400">Locating route...</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ParkingSwap = () => {
  const [activeSwaps, setActiveSwaps] = useState<SwapRequest[]>([
    {
      id: '1',
      userName: 'Rahul K.',
      location: 'Central Mall - Level 2',
      distance: '0.3 km',
      leavingIn: '5 min',
      spotType: 'Covered',
      price: '₹30/hr',
      status: 'available'
    },
    {
      id: '2',
      userName: 'Priya S.',
      location: 'Metro Station Parking',
      distance: '0.7 km',
      leavingIn: '12 min',
      spotType: 'Open',
      price: '₹20/hr',
      status: 'available'
    },
    {
      id: '3',
      userName: 'Amit R.',
      location: 'Business District',
      distance: '1.2 km',
      leavingIn: '8 min',
      spotType: 'Premium',
      price: '₹45/hr',
      status: 'reserved'
    }
  ]);

  const [userSwapStatus, setUserSwapStatus] = useState<UserSwapStatus>({
    isLeavingSoon: false
  });

  const [notifications, setNotifications] = useState<string[]>([]);
  const [mapSpot, setMapSpot] = useState<SwapRequest | null>(null);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('userCoords') || 'null');
      return saved || { lat: 28.6139, lng: 77.2090 };
    } catch {
      return { lat: 28.6139, lng: 77.2090 };
    }
  });

  // Handle real-time updates and logic
  useEffect(() => {
    socket.on('new_spot_available', (newSwap) => {
      setActiveSwaps(prev => [newSwap, ...prev]);
      setNotifications(prev => [...prev, `New spot available at ${newSwap.location}!`]);
    });

    socket.on('spot_reserved', (reservedSwapId) => {
      setActiveSwaps(prev => prev.map(swap => 
        swap.id === reservedSwapId ? { ...swap, status: 'reserved' } : swap
      ));
    });

    const interval = setInterval(() => {
      setActiveSwaps(prev => prev.map(swap => {
        const currentMinutes = parseInt(swap.leavingIn);
        if (currentMinutes > 1 && swap.leavingIn.includes('min')) {
          return { ...swap, leavingIn: `${currentMinutes - 1} min` };
        }
        return swap;
      }));
    }, 60000); // Update every minute

    return () => {
      socket.off('new_spot_available');
      socket.off('spot_reserved');
      clearInterval(interval);
    };
  }, []);

  const handleReserveSpot = (swapId: string) => {
    socket.emit('reserve_spot', swapId);
    
    setActiveSwaps(prev => prev.map(swap => 
      swap.id === swapId ? { ...swap, status: 'reserved' } : swap
    ));
    
    const swap = activeSwaps.find(s => s.id === swapId);
    if (swap) {
      setNotifications(prev => [...prev, `Reserved spot at ${swap.location}! Head there now.`]);
    }
  };

  const handleMarkLeavingSoon = () => {
    const spotDetails = {
      location: 'Central Mall - Level 3',
      type: 'Covered',
      price: '₹30/hr'
    };

    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const newSwap = {
      id: Math.random().toString(36).substr(2, 9),
      userName: savedUser.name || 'Current User', 
      location: spotDetails.location,
      distance: '0.1 km',
      leavingIn: '5 min',
      spotType: spotDetails.type,
      price: spotDetails.price,
      status: 'available'
    };

    socket.emit('mark_leaving_soon', newSwap);

    setUserSwapStatus({
      isLeavingSoon: true,
      spotDetails
    });
    setNotifications(prev => [...prev, 'Your parking spot is now marked as "Leaving Soon" - nearby users will be notified!']);
  };

  const handleCancelLeavingSoon = () => {
    setUserSwapStatus({ isLeavingSoon: false });
    setNotifications(prev => [...prev, 'Cancelled "Leaving Soon" status']);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'reserved': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <section className="py-8 bg-white">
      {mapSpot && <MapModal swap={mapSpot} userCoords={userCoords} onClose={() => setMapSpot(null)} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Status Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 animate-slide-up">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Your Status</span>
              </h3>

              {!userSwapStatus.isLeavingSoon ? (
                <div className="text-center py-8">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-gray-600 mb-4">
                    Help others find parking by marking when you're leaving
                  </p>
                  <button
                    onClick={handleMarkLeavingSoon}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Mark as "Leaving Soon"
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Marked as Leaving Soon</span>
                  </div>
                  
                  {userSwapStatus.spotDetails && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{userSwapStatus.spotDetails.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">{userSwapStatus.spotDetails.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium">{userSwapStatus.spotDetails.price}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-blue-600 animate-bounce-subtle">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">Nearby users are being notified</span>
                  </div>

                  <button
                    onClick={handleCancelLeavingSoon}
                    className="w-full px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            {notifications.length > 0 && (
              <div className="mt-6 bg-blue-50 rounded-xl p-4 animate-slide-up">
                <h4 className="font-medium text-blue-600 mb-2 flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </h4>
                <div className="space-y-2">
                  {notifications.slice(-3).map((notification, index) => (
                    <div key={index} className="text-sm text-blue-700 bg-white p-2 rounded border-l-2 border-blue-400">
                      {notification}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Available Swaps */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Available Swaps Nearby</span>
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live updates</span>
              </div>
            </div>

            <div className="space-y-4">
              {activeSwaps.map((swap, index) => (
                <div
                  key={swap.id}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-200 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{swap.userName}</h4>
                        <p className="text-sm text-gray-600">{swap.location}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(swap.status)}`}>
                      {swap.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{swap.distance}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Leaving in {swap.leavingIn}</span>
                    </div>

                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{swap.spotType}</span> spot
                    </div>

                    <div className="text-sm font-medium text-gray-900">
                      {swap.price}
                    </div>
                  </div>

                  <div className="flex justify-start space-x-3 mt-4">
                    {swap.status === 'available' ? (
                      <>
                        <button
                          onClick={() => handleReserveSpot(swap.id)}
                          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm font-medium"
                        >
                          <Zap className="h-4 w-4" />
                          <span>Reserve Spot</span>
                        </button>
                        <button
                          onClick={() => setMapSpot(swap)}
                          className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center shadow-sm"
                          title="View on Map"
                        >
                          <MapPin className="h-5 w-5" />
                        </button>
                      </>
                    ) : swap.status === 'reserved' ? (
                      <div className="px-5 py-2 bg-yellow-100 text-yellow-700 rounded-lg flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>Reserved by someone else</span>
                      </div>
                    ) : (
                      <div className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>

                  {/* Progress indicator for leaving time */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Time remaining</span>
                      <span>{swap.leavingIn}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-blue-600 h-1 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${Math.max(10, (parseInt(swap.leavingIn) / 15) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 animate-slide-up">
              <h4 className="font-semibold text-gray-900 mb-4">How Parking Swap Works</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mark as Leaving</p>
                    <p className="text-gray-600">Users mark their spot when they're about to leave</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Get Notified</p>
                    <p className="text-gray-600">Nearby users receive instant notifications</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Reserve & Navigate</p>
                    <p className="text-gray-600">Reserve the spot and navigate directly to it</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParkingSwap;


