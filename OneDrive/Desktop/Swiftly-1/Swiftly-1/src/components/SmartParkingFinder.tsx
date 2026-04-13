

// import { useState, useEffect } from 'react';
// import {
//   MapPin, Filter, Car, Bike, Truck, Clock,
//   DollarSign, Navigation, Calendar, Locate, Search, X
// } from 'lucide-react';

// // ============================================================
// // TYPES
// // ============================================================
// interface ParkingSpot {
//   _id: string;
//   name: string;
//   area: string;
//   lat: number;
//   lng: number;
//   type: string;
//   price: number;
//   hours: string;
//   vehicles: string[];
//   avail: number;
//   total: number;
//   rating: number;
//   features: string[];
//   dist?: number;
// }

// interface Booking {
//   spotName: string;
//   startTime: string;
//   endTime: string;
//   duration: number;
//   totalCost: number;
//   vehicle: string;
//   bookedAt: string;
// }

// // ============================================================
// // HAVERSINE — distance in km
// // ============================================================
// function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
//   const R = 6371;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLng = ((lng2 - lng1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLng / 2) ** 2;
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// }

// // ============================================================
// // HELPERS
// // ============================================================
// function getDurationHours(start: string, end: string): number {
//   if (!start || !end) return 0;
//   const [sh, sm] = start.split(':').map(Number);
//   const [eh, em] = end.split(':').map(Number);
//   const diff = eh * 60 + em - (sh * 60 + sm);
//   return diff > 0 ? parseFloat((diff / 60).toFixed(2)) : 0;
// }

// function formatTime(t: string): string {
//   if (!t) return '';
//   const [h, m] = t.split(':').map(Number);
//   const ampm = h >= 12 ? 'PM' : 'AM';
//   const hour = h % 12 || 12;
//   return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
// }

// // ============================================================
// // BOOKING MODAL
// // ============================================================
// interface BookingModalProps {
//   spot: ParkingSpot;
//   onClose: () => void;
//   onConfirm: (booking: {
//     startTime: string;
//     endTime: string;
//     vehicle: string;
//     userName: string;
//     duration: number;
//     totalCost: number;
//   }) => void;
// }

// const BookingModal = ({ spot, onClose, onConfirm }: BookingModalProps) => {
//   const now = new Date();
//   const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

//   const [startTime, setStartTime] = useState(currentTime);
//   const [endTime, setEndTime] = useState('');
//   const [vehicle, setVehicle] = useState(spot.vehicles[0]);
//   const [userName, setUserName] = useState('');
//   const [error, setError] = useState('');

//   const duration = getDurationHours(startTime, endTime);
//   const totalCost = parseFloat((duration * spot.price).toFixed(0));

//   const handleConfirm = () => {
//     if (!startTime || !endTime) return setError('Please select start and end time.');
//     if (duration <= 0) return setError('End time must be after start time.');
//     if (!userName.trim()) return setError('Please enter your name.');
//     setError('');
//     onConfirm({ startTime, endTime, vehicle, userName, duration, totalCost });
//   };

//   return (
//     <div
//       style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
//       onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
//         {/* Header */}
//         <div className="flex justify-between items-start">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">{spot.name}</h2>
//             <p className="text-sm text-gray-500">{spot.area} · ₹{spot.price}/hr</p>
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Name */}
//         <div>
//           <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Your name</label>
//           <input
//             type="text"
//             value={userName}
//             onChange={e => setUserName(e.target.value)}
//             placeholder="e.g. Rahul Sharma"
//             className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           />
//         </div>

//         {/* Vehicle */}
//         <div>
//           <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Vehicle type</label>
//           <div className="flex gap-2">
//             {spot.vehicles.map(v => (
//               <button
//                 key={v}
//                 onClick={() => setVehicle(v)}
//                 className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm capitalize transition-colors ${vehicle === v ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
//               >
//                 {v === 'car' && <Car className="h-3.5 w-3.5" />}
//                 {v === 'bike' && <Bike className="h-3.5 w-3.5" />}
//                 {v === 'truck' && <Truck className="h-3.5 w-3.5" />}
//                 {v}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Time pickers */}
//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Start time</label>
//             <input
//               type="time"
//               value={startTime}
//               onChange={e => setStartTime(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">End time</label>
//             <input
//               type="time"
//               value={endTime}
//               onChange={e => setEndTime(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//           </div>
//         </div>

//         {/* Cost preview */}
//         {duration > 0 && (
//           <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
//             <div className="flex justify-between items-center text-sm text-gray-700 mb-1">
//               <span>Duration</span>
//               <span className="font-medium">{duration} hr{duration !== 1 ? 's' : ''}</span>
//             </div>
//             <div className="flex justify-between items-center text-sm text-gray-700 mb-1">
//               <span>Rate</span>
//               <span>₹{spot.price}/hr</span>
//             </div>
//             <div className="flex justify-between items-center text-base font-semibold text-blue-800 border-t border-blue-200 pt-2 mt-2">
//               <span>Total cost</span>
//               <span>₹{totalCost}</span>
//             </div>
//             <p className="text-xs text-gray-500 mt-1">{formatTime(startTime)} → {formatTime(endTime)}</p>
//           </div>
//         )}

//         {error && <p className="text-xs text-red-500">{error}</p>}

//         {/* Confirm */}
//         <button
//           onClick={handleConfirm}
//           disabled={duration <= 0}
//           className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
//         >
//           {duration > 0 ? `Confirm booking · ₹${totalCost}` : 'Select time to continue'}
//         </button>
//       </div>
//     </div>
//   );
// };

// // ============================================================
// // MAIN COMPONENT
// // ============================================================
// const SmartParkingFinder = () => {
//   const [spots, setSpots] = useState<ParkingSpot[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [bookingSpot, setBookingSpot] = useState<ParkingSpot | null>(null);

//   const [locationMode, setLocationMode] = useState<'detect' | 'manual'>('detect');
//   const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(null);
//   const [detectStatus, setDetectStatus] = useState('Location not set');
//   const [detectLoading, setDetectLoading] = useState(false);
//   const [manualQuery, setManualQuery] = useState('');

//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedVehicle, setSelectedVehicle] = useState('all');
//   const [maxPrice, setMaxPrice] = useState(60);

//   const [toast, setToast] = useState('');
//   const [toastVisible, setToastVisible] = useState(false);

//   // ----------------------------------------------------------
//   // Fetch spots from backend
//   // ----------------------------------------------------------
//   useEffect(() => {
//     fetch('http://localhost:5000/api/parking')
//       .then(res => res.json())
//       .then(data => { setSpots(data); setLoading(false); })
//       .catch(err => { console.error(err); setLoading(false); });
//   }, []);

//   // ----------------------------------------------------------
//   // Filtered + sorted spots
//   // ----------------------------------------------------------
//   const filteredSpots: ParkingSpot[] = (() => {
//     let result = spots.filter(s => {
//       if (selectedVehicle !== 'all' && !s.vehicles.includes(selectedVehicle)) return false;
//       if (s.price > maxPrice) return false;
//       if (locationMode === 'manual' && manualQuery.trim()) {
//         const q = manualQuery.toLowerCase();
//         if (!s.area.toLowerCase().includes(q) && !s.name.toLowerCase().includes(q)) return false;
//       }
//       return true;
//     });
//     if (detectedCoords && locationMode === 'detect') {
//       result = result
//         .map(s => ({ ...s, dist: haversine(detectedCoords.lat, detectedCoords.lng, s.lat, s.lng) }))
//         .sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0));
//     }
//     return result;
//   })();

//   // ----------------------------------------------------------
//   // GPS detect
//   // ----------------------------------------------------------
//   const detectLocation = () => {
//     if (!navigator.geolocation) return setDetectStatus('GPS not supported');
//     setDetectLoading(true);
//     setDetectStatus('Detecting...');
//     navigator.geolocation.getCurrentPosition(
//       pos => {
//         setDetectedCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
//         setDetectStatus('Location detected ✓');
//         setDetectLoading(false);
//       },
//       () => { setDetectStatus('Could not detect — try manual entry'); setDetectLoading(false); }
//     );
//   };

//   // ----------------------------------------------------------
//   // Confirm booking — calls backend
//   // ----------------------------------------------------------
//   const confirmBooking = async (
//     spot: ParkingSpot,
//     data: { startTime: string; endTime: string; vehicle: string; userName: string; duration: number; totalCost: number }
//   ) => {
//     try {
//       const res = await fetch('http://localhost:5000/api/parking/book', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           parkingId: spot._id,
//           startTime: data.startTime,
//           endTime: data.endTime,
//           vehicleType: data.vehicle,
//           userName: data.userName,
//           duration: data.duration,
//           totalCost: data.totalCost,
//         }),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         showToastMsg(err.message || 'Booking failed');
//         return;
//       }

//       // Update availability locally without refetching
//       setSpots(prev => prev.map(s => s._id === spot._id ? { ...s, avail: s.avail - 1 } : s));
//       setBookings(prev => [...prev, {
//         spotName: spot.name,
//         startTime: data.startTime,
//         endTime: data.endTime,
//         duration: data.duration,
//         totalCost: data.totalCost,
//         vehicle: data.vehicle,
//         bookedAt: new Date().toLocaleTimeString(),
//       }]);
//       setBookingSpot(null);
//       showToastMsg(`✓ Booked at ${spot.name} for ₹${data.totalCost}`);
//     } catch {
//       showToastMsg('Server error. Is the backend running?');
//     }
//   };

//   // ----------------------------------------------------------
//   // Navigate
//   // ----------------------------------------------------------
//   const navigate = (lat: number, lng: number) => {
//     const origin = detectedCoords ? `${detectedCoords.lat},${detectedCoords.lng}` : '';
//     window.open(`https://www.google.com/maps/dir/${origin}/${lat},${lng}`, '_blank');
//   };

//   // ----------------------------------------------------------
//   // Toast
//   // ----------------------------------------------------------
//   const showToastMsg = (msg: string) => {
//     setToast(msg);
//     setToastVisible(true);
//     setTimeout(() => setToastVisible(false), 3500);
//   };

//   const availBadge = (avail: number) => {
//     if (avail === 0) return { label: 'Full', color: 'bg-red-100 text-red-700' };
//     if (avail <= 4) return { label: 'Almost full', color: 'bg-amber-100 text-amber-700' };
//     if (avail <= 10) return { label: 'Limited', color: 'bg-yellow-100 text-yellow-700' };
//     return { label: 'Open', color: 'bg-green-100 text-green-700' };
//   };

//   const availColor = (avail: number) => {
//     if (avail === 0) return 'text-red-600';
//     if (avail <= 4) return 'text-red-500';
//     if (avail <= 10) return 'text-amber-600';
//     return 'text-green-600';
//   };

//   // ----------------------------------------------------------
//   // Render
//   // ----------------------------------------------------------
//   return (
//     <section className="py-8 bg-white min-h-screen">
//       {/* Toast */}
//       {toastVisible && (
//         <div style={{ position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}
//           className="bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-lg">
//           {toast}
//         </div>
//       )}

//       {/* Booking Modal */}
//       {bookingSpot && (
//         <BookingModal
//           spot={bookingSpot}
//           onClose={() => setBookingSpot(null)}
//           onConfirm={(data) => confirmBooking(bookingSpot, data)}
//         />
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-2xl font-semibold text-gray-900 mb-6">Find Parking in Delhi</h1>

//         {/* Search Panel */}
//         <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-200">
//           {/* Location Mode Tabs */}
//           <div className="flex mb-4 w-fit rounded-lg overflow-hidden border border-gray-200">
//             <button
//               onClick={() => setLocationMode('detect')}
//               className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${locationMode === 'detect' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
//             >
//               <Locate className="h-4 w-4" /> Detect location
//             </button>
//             <button
//               onClick={() => setLocationMode('manual')}
//               className={`flex items-center gap-2 px-4 py-2 text-sm border-l border-gray-200 transition-colors ${locationMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
//             >
//               <Search className="h-4 w-4" /> Enter manually
//             </button>
//           </div>

//           {locationMode === 'detect' ? (
//             <div className="flex items-center gap-3 mb-4">
//               <button
//                 onClick={detectLocation}
//                 disabled={detectLoading}
//                 className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
//               >
//                 <Locate className="h-4 w-4 text-blue-500" />
//                 {detectLoading ? 'Detecting...' : 'Use GPS'}
//               </button>
//               <span className="text-sm text-gray-500">{detectStatus}</span>
//             </div>
//           ) : (
//             <div className="relative mb-4">
//               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <input
//                 type="text"
//                 value={manualQuery}
//                 onChange={e => setManualQuery(e.target.value)}
//                 placeholder="e.g. Karol Bagh, Connaught Place, Saket..."
//                 className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white focus:outline-none"
//               />
//             </div>
//           )}

//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setShowFilters(f => !f)}
//               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               <Filter className="h-4 w-4" /> {showFilters ? 'Hide filters' : 'Filters'}
//             </button>
//             <span className="text-sm text-gray-400">{filteredSpots.length} spot{filteredSpots.length !== 1 ? 's' : ''} found</span>
//           </div>

//           {showFilters && (
//             <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Vehicle type</label>
//                 <div className="flex flex-wrap gap-2">
//                   {(['all', 'car', 'bike', 'truck'] as const).map(v => (
//                     <button
//                       key={v}
//                       onClick={() => setSelectedVehicle(v)}
//                       className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm capitalize transition-colors ${selectedVehicle === v ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
//                     >
//                       {v === 'car' && <Car className="h-3.5 w-3.5" />}
//                       {v === 'bike' && <Bike className="h-3.5 w-3.5" />}
//                       {v === 'truck' && <Truck className="h-3.5 w-3.5" />}
//                       {v}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
//                   Max price: ₹{maxPrice}/hr
//                 </label>
//                 <input
//                   type="range" min="15" max="100" step="5" value={maxPrice}
//                   onChange={e => setMaxPrice(Number(e.target.value))}
//                   className="w-full"
//                 />
//                 <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹15</span><span>₹100</span></div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Bookings Summary */}
//         {bookings.length > 0 && (
//           <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
//             <h2 className="text-sm font-medium text-green-800 mb-2">Your bookings this session ({bookings.length})</h2>
//             <div className="flex flex-col gap-2">
//               {bookings.map((b, i) => (
//                 <div key={i} className="flex flex-wrap items-center gap-2 text-xs bg-white border border-green-100 rounded-lg px-3 py-2">
//                   <span className="font-medium text-gray-800">{b.spotName}</span>
//                   <span className="text-gray-400">·</span>
//                   <span className="text-gray-600">{formatTime(b.startTime)} → {formatTime(b.endTime)}</span>
//                   <span className="text-gray-400">·</span>
//                   <span className="capitalize text-gray-600">{b.vehicle}</span>
//                   <span className="text-gray-400">·</span>
//                   <span className="font-semibold text-green-700">₹{b.totalCost}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Loading */}
//         {loading && (
//           <div className="text-center py-16 text-gray-400">
//             <div className="inline-block w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mb-3" />
//             <p className="text-sm">Loading parking spots...</p>
//           </div>
//         )}

//         {/* Spots Grid */}
//         {!loading && filteredSpots.length === 0 && (
//           <div className="text-center py-16 text-gray-400">
//             <MapPin className="h-10 w-10 mx-auto mb-3 opacity-30" />
//             <p className="text-sm">No spots match your filters. Try adjusting them.</p>
//           </div>
//         )}

//         {!loading && filteredSpots.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {filteredSpots.map(spot => {
//               const badge = availBadge(spot.avail);
//               return (
//                 <div key={spot._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
//                   <div className="flex justify-between items-start gap-2">
//                     <h3 className="text-base font-semibold text-gray-900 leading-tight">{spot.name}</h3>
//                     <span className="text-xs text-amber-500 whitespace-nowrap">★ {spot.rating}</span>
//                   </div>

//                   <div className="flex items-center gap-1.5 text-xs text-gray-500">
//                     <MapPin className="h-3.5 w-3.5" />
//                     <span>{spot.dist != null ? `${spot.dist.toFixed(1)} km away` : spot.area} · {spot.type}</span>
//                   </div>

//                   <div className="flex items-center gap-3 text-sm text-gray-600">
//                     <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />₹{spot.price}/hr</span>
//                     <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{spot.hours}</span>
//                   </div>

//                   <div className="flex items-center gap-2 text-sm">
//                     <span className="text-gray-500">Available:</span>
//                     <span className={`font-semibold ${availColor(spot.avail)}`}>{spot.avail} / {spot.total}</span>
//                     <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>{badge.label}</span>
//                   </div>

//                   <div className="w-full bg-gray-100 rounded-full h-1.5">
//                     <div
//                       className={`h-1.5 rounded-full transition-all ${spot.avail === 0 ? 'bg-red-400' : spot.avail <= 4 ? 'bg-amber-400' : 'bg-green-400'}`}
//                       style={{ width: `${Math.round((spot.avail / spot.total) * 100)}%` }}
//                     />
//                   </div>

//                   <div className="flex flex-wrap gap-1">
//                     {spot.features.map(f => (
//                       <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
//                     ))}
//                   </div>

//                   <div className="flex gap-1">
//                     {spot.vehicles.map(v => (
//                       <span key={v} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full capitalize">{v}</span>
//                     ))}
//                   </div>

//                   <div className="flex gap-2 mt-auto pt-1">
//                     <button
//                       onClick={() => setBookingSpot(spot)}
//                       disabled={spot.avail === 0}
//                       className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
//                     >
//                       <Calendar className="h-4 w-4" />
//                       {spot.avail === 0 ? 'Full' : 'Book now'}
//                     </button>
//                     <button
//                       onClick={() => navigate(spot.lat, spot.lng)}
//                       className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
//                     >
//                       <Navigation className="h-4 w-4" /> Directions
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default SmartParkingFinder;


import { useState, useEffect, useRef } from 'react';
import {
  MapPin, Filter, Car, Bike, Truck, Clock,
  IndianRupee, Navigation, Calendar, Locate, Search, X, Map
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons (Leaflet + Vite issue)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

// ============================================================
// TYPES
// ============================================================
interface ParkingSpot {
  _id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  type: string;
  price: number;
  hours: string;
  vehicles: string[];
  avail: number;
  total: number;
  rating: number;
  features: string[];
  dist?: number;
}

interface BookingRecord {
  spotName: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalCost: number;
  vehicle: string;
}

// ============================================================
// HAVERSINE
// ============================================================
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDurationHours(start: string, end: string): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const diff = eh * 60 + em - (sh * 60 + sm);
  return diff > 0 ? parseFloat((diff / 60).toFixed(2)) : 0;
}

function fmt(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

// ============================================================
// MAP MODAL — OpenStreetMap via Leaflet (no Google Maps)
// ============================================================
interface MapModalProps {
  spot: ParkingSpot;
  userCoords: { lat: number; lng: number } | null;
  onClose: () => void;
}

const MapModal = ({ spot, userCoords, onClose }: MapModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    // slight delay so modal is fully rendered before Leaflet measures container
    const timer = setTimeout(() => {
      if (mapInstance.current) return;

      const map = L.map(mapRef.current!).setView([spot.lat, spot.lng], 15);
      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Blue "P" marker for parking spot
      const parkingIcon = L.divIcon({
        html: `<div style="background:#2563eb;color:#fff;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;box-shadow:0 2px 10px rgba(37,99,235,0.45);border:2px solid #fff;">P</div>`,
        className: '',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      L.marker([spot.lat, spot.lng], { icon: parkingIcon })
        .addTo(map)
        .bindPopup(`<b>${spot.name}</b><br>₹${spot.price}/hr &nbsp;·&nbsp; ${spot.avail} spots left`)
        .openPopup();

      // Green dot for user location
      if (userCoords) {
        const userIcon = L.divIcon({
          html: `<div style="background:#16a34a;border-radius:50%;width:14px;height:14px;border:3px solid #fff;box-shadow:0 0 0 3px rgba(22,163,74,0.35);"></div>`,
          className: '',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup('Your location');

        // Dashed line between user and parking
        L.polyline(
          [[userCoords.lat, userCoords.lng], [spot.lat, spot.lng]],
          { color: '#2563eb', weight: 2, dashArray: '6 6', opacity: 0.65 }
        ).addTo(map);

        map.fitBounds([[userCoords.lat, userCoords.lng], [spot.lat, spot.lng]], { padding: [50, 50] });
      }
    }, 120);

    return () => {
      clearTimeout(timer);
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  const dist = userCoords ? haversine(userCoords.lat, userCoords.lng, spot.lat, spot.lng).toFixed(1) : null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{spot.name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {spot.area} · {spot.type}
              {dist && <span className="ml-2 text-blue-600 font-semibold">{dist} km from you</span>}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600 ml-4 flex-shrink-0 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Map fills the modal */}
        <div ref={mapRef} style={{ height: '380px', width: '100%', flexShrink: 0 }} />

        {/* Footer */}
        <div className="p-4 flex items-center justify-between border-t border-gray-100 bg-slate-50">
          <div className="flex gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <IndianRupee className="h-3.5 w-3.5" />₹{spot.price}/hr
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />{spot.hours}
            </span>
            <span className={spot.avail === 0 ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'}>
              {spot.avail} spots left
            </span>
          </div>
          {/* OSM directions link — opens in OSM, not Google */}
          <a
            href={`https://www.openstreetmap.org/directions?from=${userCoords?.lat ?? ''},${userCoords?.lng ?? ''}&to=${spot.lat},${spot.lng}&engine=graphhopper_car`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <Navigation className="h-4 w-4" /> Get directions
          </a>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// BOOKING MODAL
// ============================================================
interface BookingModalProps {
  spot: ParkingSpot;
  onClose: () => void;
  onConfirm: (data: { startTime: string; endTime: string; vehicle: string; userName: string; duration: number; totalCost: number }) => void;
}

const BookingModal = ({ spot, onClose, onConfirm }: BookingModalProps) => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const [startTime, setStartTime] = useState(currentTime);
  const [endTime, setEndTime] = useState('');
  const [vehicle, setVehicle] = useState(spot.vehicles[0]);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const duration = getDurationHours(startTime, endTime);
  const totalCost = Math.round(duration * spot.price);

  const handleConfirm = () => {
    if (!startTime || !endTime) return setError('Please select start and end time.');
    if (duration <= 0) return setError('End time must be after start time.');
    if (!userName.trim()) return setError('Please enter your name.');
    setError('');
    onConfirm({ startTime, endTime, vehicle, userName, duration, totalCost });
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{spot.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{spot.area} · ₹{spot.price}/hr</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors"><X className="h-5 w-5" /></button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Your name</label>
          <input
            type="text" value={userName} onChange={e => setUserName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Vehicle</label>
          <div className="flex gap-2">
            {spot.vehicles.map(v => (
              <button
                key={v}
                onClick={() => setVehicle(v)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm capitalize font-medium transition-all ${vehicle === v ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
              >
                {v === 'car' && <Car className="h-3.5 w-3.5" />}
                {v === 'bike' && <Bike className="h-3.5 w-3.5" />}
                {v === 'truck' && <Truck className="h-3.5 w-3.5" />}
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Start time</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">End time</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
        </div>

        {duration > 0 && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Duration</span>
              <span className="text-gray-800 font-medium">{duration} hr{duration !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Rate</span>
              <span className="text-gray-700">₹{spot.price}/hr</span>
            </div>
            <div className="flex justify-between text-base font-bold text-blue-800 pt-2 border-t border-blue-200">
              <span>Total</span><span>₹{totalCost}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{fmt(startTime)} → {fmt(endTime)}</p>
          </div>
        )}

        {error && <p className="text-xs text-red-500 -mt-1">{error}</p>}

        <button
          onClick={handleConfirm}
          disabled={duration <= 0}
          className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {duration > 0 ? `Confirm booking · ₹${totalCost}` : 'Select time to continue'}
        </button>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const SmartParkingFinder = () => {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [bookingSpot, setBookingSpot] = useState<ParkingSpot | null>(null);
  const [mapSpot, setMapSpot] = useState<ParkingSpot | null>(null);

  const [locationMode, setLocationMode] = useState<'detect' | 'manual'>('detect');
  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectStatus, setDetectStatus] = useState('Not set');
  const [detectLoading, setDetectLoading] = useState(false);
  const [manualQuery, setManualQuery] = useState('');

  const [showFilters, setShowFilters] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [maxPrice, setMaxPrice] = useState(60);

  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/parking')
      .then(res => res.json())
      .then(data => { setSpots(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredSpots: ParkingSpot[] = (() => {
    let result = spots.filter(s => {
      if (selectedVehicle !== 'all' && !s.vehicles.includes(selectedVehicle)) return false;
      if (s.price > maxPrice) return false;
      if (locationMode === 'manual' && manualQuery.trim()) {
        const q = manualQuery.toLowerCase();
        if (!s.area.toLowerCase().includes(q) && !s.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    if (detectedCoords && locationMode === 'detect') {
      result = result
        .map(s => ({ ...s, dist: haversine(detectedCoords.lat, detectedCoords.lng, s.lat, s.lng) }))
        .sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0));
    }
    return result;
  })();

  const detectLocation = () => {
    if (!navigator.geolocation) return setDetectStatus('GPS not supported');
    setDetectLoading(true);
    setDetectStatus('Detecting...');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setDetectedCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setDetectStatus('Location detected ✓');
        setDetectLoading(false);
      },
      () => { setDetectStatus('Could not detect — try manual'); setDetectLoading(false); }
    );
  };

  const confirmBooking = async (
    spot: ParkingSpot,
    data: { startTime: string; endTime: string; vehicle: string; userName: string; duration: number; totalCost: number }
  ) => {
    try {
      const res = await fetch('http://localhost:5000/api/parking/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parkingId: spot._id, vehicleType: data.vehicle, ...data }),
      });
      if (!res.ok) { const e = await res.json(); showToast(e.message || 'Booking failed'); return; }
      setSpots(prev => prev.map(s => s._id === spot._id ? { ...s, avail: s.avail - 1 } : s));
      setBookings(prev => [...prev, { spotName: spot.name, ...data }]);
      setBookingSpot(null);
      showToast(`✓ Booked at ${spot.name} · ₹${data.totalCost}`);
    } catch {
      showToast('Server error — is the backend running?');
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  const availBadge = (avail: number) => {
    if (avail === 0) return { label: 'Full', cls: 'bg-red-100 text-red-600' };
    if (avail <= 4) return { label: 'Almost full', cls: 'bg-orange-100 text-orange-600' };
    if (avail <= 10) return { label: 'Limited', cls: 'bg-amber-100 text-amber-600' };
    return { label: 'Open', cls: 'bg-green-100 text-green-600' };
  };

  const availColor = (avail: number) =>
    avail === 0 ? 'text-red-500' : avail <= 4 ? 'text-orange-500' : avail <= 10 ? 'text-amber-500' : 'text-green-600';

  const typeColor: Record<string, string> = {
    Metro: 'bg-blue-50 text-blue-600',
    Market: 'bg-orange-50 text-orange-600',
    Mall: 'bg-purple-50 text-purple-600',
    'Mall/CP': 'bg-purple-50 text-purple-600',
    'Multi-level': 'bg-teal-50 text-teal-600',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toastVisible && (
        <div style={{ position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}
          className="bg-gray-900 text-white text-sm px-5 py-3 rounded-2xl shadow-xl whitespace-nowrap">
          {toast}
        </div>
      )}

      {mapSpot && <MapModal spot={mapSpot} userCoords={detectedCoords} onClose={() => setMapSpot(null)} />}
      {bookingSpot && (
        <BookingModal spot={bookingSpot} onClose={() => setBookingSpot(null)}
          onConfirm={data => confirmBooking(bookingSpot, data)} />
      )}

      {/* Hero header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 pt-10 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white/20 rounded-xl p-2">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-blue-200 text-sm font-medium uppercase tracking-widest">Delhi Parking</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Find & Book Parking</h1>
          <p className="text-blue-200 text-sm">Real-time availability · OpenStreetMap directions</p>
        </div>
      </div>

      {/* Search card — overlaps hero */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
          {/* Location tabs */}
          <div className="flex gap-2 mb-4">
            {(['detect', 'manual'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setLocationMode(mode)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${locationMode === mode ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {mode === 'detect' ? <><Locate className="h-4 w-4" /> Detect location</> : <><Search className="h-4 w-4" /> Enter area</>}
              </button>
            ))}
          </div>

          {locationMode === 'detect' ? (
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={detectLocation}
                disabled={detectLoading}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 font-medium hover:bg-blue-100 disabled:opacity-50 transition-colors"
              >
                <Locate className="h-4 w-4" />
                {detectLoading ? 'Detecting...' : 'Use GPS'}
              </button>
              <span className={`text-sm ${detectStatus.includes('✓') ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                {detectStatus}
              </span>
            </div>
          ) : (
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 h-4 w-4" />
              <input
                type="text"
                value={manualQuery}
                onChange={e => setManualQuery(e.target.value)}
                placeholder="Search — Karol Bagh, Saket, CP, Nehru Place..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-gray-50"
              />
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowFilters(f => !f)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
            >
              <Filter className="h-4 w-4" /> Filters {showFilters ? '↑' : '↓'}
            </button>
            <span className="text-sm text-gray-400 ml-auto">
              {loading ? 'Loading...' : `${filteredSpots.length} spot${filteredSpots.length !== 1 ? 's' : ''} found`}
            </span>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Vehicle type</label>
                <div className="flex gap-2 flex-wrap">
                  {(['all', 'car', 'bike', 'truck'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setSelectedVehicle(v)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm capitalize font-medium transition-all ${selectedVehicle === v ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      {v === 'car' && <Car className="h-3.5 w-3.5" />}
                      {v === 'bike' && <Bike className="h-3.5 w-3.5" />}
                      {v === 'truck' && <Truck className="h-3.5 w-3.5" />}
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Max price: <span className="text-blue-600">₹{maxPrice}/hr</span>
                </label>
                <input
                  type="range" min="15" max="100" step="5" value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-300 mt-1"><span>₹15</span><span>₹100</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active bookings */}
      {bookings.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <h2 className="text-sm font-semibold text-emerald-800 mb-3">✓ Active bookings ({bookings.length})</h2>
            <div className="flex flex-col gap-2">
              {bookings.map((b, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-emerald-100 text-sm">
                  <span className="font-medium text-gray-800">{b.spotName}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500">{fmt(b.startTime)} → {fmt(b.endTime)}</span>
                  <span className="text-gray-300">·</span>
                  <span className="capitalize text-gray-500">{b.vehicle}</span>
                  <span className="ml-auto font-semibold text-emerald-700">₹{b.totalCost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spots grid */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {loading && (
          <div className="text-center py-20 text-gray-300">
            <div className="inline-block w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-sm">Fetching parking spots...</p>
          </div>
        )}

        {!loading && filteredSpots.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-7 w-7 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">No spots found. Try a different area or adjust filters.</p>
          </div>
        )}

        {!loading && filteredSpots.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSpots.map(spot => {
              const badge = availBadge(spot.avail);
              const tColor = typeColor[spot.type] ?? 'bg-gray-100 text-gray-500';
              return (
                <div key={spot._id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">

                  {/* Availability color bar at top */}
                  <div className={`h-1 w-full ${spot.avail === 0 ? 'bg-red-400' : spot.avail <= 4 ? 'bg-orange-400' : 'bg-green-400'}`} />

                  <div className="p-4 flex flex-col gap-3 flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tColor}`}>{spot.type}</span>
                          <span className="text-xs text-amber-400 font-medium">★ {spot.rating}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug">{spot.name}</h3>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-bold text-blue-600">₹{spot.price}</p>
                        <p className="text-xs text-gray-400">/hr</p>
                      </div>
                    </div>

                    {/* Location + hours */}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {spot.dist != null ? `${spot.dist.toFixed(1)} km away` : spot.area}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{spot.hours}
                      </span>
                    </div>

                    {/* Availability bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-semibold ${availColor(spot.avail)}`}>
                          {spot.avail} / {spot.total} spots
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>{badge.label}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${spot.avail === 0 ? 'bg-red-400' : spot.avail <= 4 ? 'bg-orange-400' : 'bg-green-400'}`}
                          style={{ width: `${Math.round((spot.avail / spot.total) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {spot.features.map(f => (
                        <span key={f} className="text-xs bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-lg">{f}</span>
                      ))}
                      {spot.vehicles.map(v => (
                        <span key={v} className="text-xs bg-blue-50 text-blue-500 border border-blue-100 px-2 py-0.5 rounded-lg capitalize">{v}</span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-auto pt-1">
                      <button
                        onClick={() => setBookingSpot(spot)}
                        disabled={spot.avail === 0}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        <Calendar className="h-4 w-4" />
                        {spot.avail === 0 ? 'Full' : 'Book'}
                      </button>
                      <button
                        onClick={() => setMapSpot(spot)}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors"
                      >
                        <Map className="h-4 w-4" /> Map
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartParkingFinder;