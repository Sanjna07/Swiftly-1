// // import { useState, useEffect, useRef } from 'react';
// // import { Bus, Train, MapPin, Car, AlertTriangle, Navigation, ParkingCircle, Locate, Pencil, Footprints } from 'lucide-react';

// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Bus, Train, MapPin, Car, AlertTriangle, Navigation, ParkingCircle, Locate, Pencil, Footprints } from 'lucide-react';

// // ── Types ─────────────────────────────────────────────────────────────────────
// type LatLng = [number, number];
// type TrafficLevel = 'low' | 'medium' | 'high';
// type TransportType = 'metro' | 'bus' | 'auto' | 'car';

// interface Suggestion {
//   type: TransportType;
//   title: string;
//   cost: string;
//   duration: string;
//   remark: string;
// }

// interface MetroInfo {
//   coords: LatLng;
//   name: string;
// }

// interface JourneyDetails {
//   boardStation: MetroInfo;
//   alightStation: MetroInfo;
//   walkKm: number;
//   walkMin: number;
//   autoFareMin: number;
//   autoFareMax: number;
//   metroFare: number;
//   metroStops: number;
//   metroMin: number;
//   useAuto: boolean; // true if walk > 800m
// }

// interface LeafletMap {
//   remove: () => void;
//   fitBounds: (bounds: LatLng[], options?: object) => void;
// }

// interface LeafletStatic {
//   map: (el: HTMLDivElement, options?: object) => LeafletMap & {
//     setView: (center: LatLng, zoom: number) => LeafletMap;
//   };
//   tileLayer: (url: string, options?: object) => { addTo: (map: LeafletMap) => void };
//   divIcon: (options: object) => object;
//   marker: (latlng: LatLng, options?: object) => {
//     addTo: (map: LeafletMap) => {
//       bindPopup: (html: string) => { openPopup: () => void };
//     };
//   };
//   geoJSON: (geojson: object, options?: object) => { addTo: (map: LeafletMap) => void };
//   polyline: (latlngs: LatLng[], options?: object) => { addTo: (map: LeafletMap) => void };
// }

// declare global {
//   interface Window { L: LeafletStatic; }
// }

// // ── OSMMap ────────────────────────────────────────────────────────────────────
// interface OSMMapProps {
//   currentLocation: LatLng;
//   destination: LatLng;
//   metroStation?: LatLng | null;
//   metroName?: string;
//   mode?: 'route' | 'metro';
// }

// const OSMMap = ({ currentLocation, destination, metroStation, metroName, mode = 'route' }: OSMMapProps) => {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapInstanceRef = useRef<LeafletMap | null>(null);

//   useEffect(() => {
//     if (!mapRef.current) return;

//     if (!document.getElementById('leaflet-css')) {
//       const link = document.createElement('link');
//       link.id = 'leaflet-css';
//       link.rel = 'stylesheet';
//       link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//       document.head.appendChild(link);
//     }

//     const initMap = () => {
//       const L = window.L;
//       if (!L || !mapRef.current) return;

//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }

//       const map = L.map(mapRef.current).setView(currentLocation, 13);
//       mapInstanceRef.current = map;

//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
//       }).addTo(map);

//       const makeIcon = (color: string, emoji: string) =>
//         L.divIcon({
//           className: '',
//           html: `<div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.35);font-size:13px">${emoji}</div>`,
//           iconAnchor: [14, 14],
//         });

//       if (mode === 'metro' && metroStation) {
//         L.marker(currentLocation, { icon: makeIcon('#3b82f6', '📍') })
//           .addTo(map).bindPopup('<b>Your Location</b>').openPopup();
//         L.marker(metroStation, { icon: makeIcon('#a855f7', '🚇') })
//           .addTo(map).bindPopup(`<b>${metroName ?? 'Nearest Metro'}</b>`);
//         L.marker(destination, { icon: makeIcon('#ef4444', '🏁') })
//           .addTo(map).bindPopup('<b>Your Destination</b>');

//         const [lat1, lon1] = currentLocation;
//         const [lat2, lon2] = metroStation;
//         fetch(`https://router.project-osrm.org/route/v1/walking/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`)
//           .then(r => r.json())
//           .then((data: { routes?: { geometry: { coordinates: [number, number][] } }[] }) => {
//             if (data.routes?.length) {
//               L.geoJSON(data.routes[0].geometry, {
//                 style: { color: '#a855f7', weight: 4, opacity: 0.85 },
//               }).addTo(map);
//               const coords: LatLng[] = data.routes[0].geometry.coordinates.map(
//                 ([lng, lat]: [number, number]) => [lat, lng] as LatLng
//               );
//               map.fitBounds([...coords, destination], { padding: [40, 40] });
//             }
//           })
//           .catch(() => {
//             L.polyline([currentLocation, metroStation], { color: '#a855f7', weight: 3, dashArray: '6 6' }).addTo(map);
//             map.fitBounds([currentLocation, metroStation, destination], { padding: [40, 40] });
//           });

//       } else {
//         L.marker(currentLocation, { icon: makeIcon('#3b82f6', '📍') })
//           .addTo(map).bindPopup('<b>Your Location</b>').openPopup();
//         L.marker(destination, { icon: makeIcon('#ef4444', '🏁') })
//           .addTo(map).bindPopup('<b>Destination</b>');

//         const [lat1, lon1] = currentLocation;
//         const [lat2, lon2] = destination;
//         fetch(`https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`)
//           .then(r => r.json())
//           .then((data: { routes?: { geometry: { coordinates: [number, number][] } }[] }) => {
//             if (data.routes?.length) {
//               L.geoJSON(data.routes[0].geometry, {
//                 style: { color: '#3b82f6', weight: 4, opacity: 0.85 },
//               }).addTo(map);
//               const coords: LatLng[] = data.routes[0].geometry.coordinates.map(
//                 ([lng, lat]: [number, number]) => [lat, lng] as LatLng
//               );
//               map.fitBounds(coords, { padding: [40, 40] });
//             }
//           })
//           .catch(() => {
//             L.polyline([currentLocation, destination], { color: '#3b82f6', weight: 3, dashArray: '6 6' }).addTo(map);
//             map.fitBounds([currentLocation, destination], { padding: [40, 40] });
//           });
//       }
//     };

//     if (window.L) {
//       initMap();
//     } else {
//       const script = document.createElement('script');
//       script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//       script.onload = initMap;
//       document.head.appendChild(script);
//     }

//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//     };
//   }, [currentLocation, destination, metroStation, mode]);

//   return (
//     <div ref={mapRef} style={{ height: '400px', width: '100%', borderRadius: '12px', zIndex: 0 }} />
//   );
// };

// // ── Fetch nearest metro via Overpass API ──────────────────────────────────────
// const fetchNearestMetro = async (loc: LatLng): Promise<MetroInfo | null> => {
//   try {
//     const query = `[out:json][timeout:10];node["station"="subway"](around:3000,${loc[0]},${loc[1]});out 1;`;
//     const res = await fetch('https://overpass-api.de/api/interpreter', {
//       method: 'POST',
//       body: query,
//     });
//     const data = await res.json();
//     if (data.elements?.length) {
//       const el = data.elements[0];
//       return {
//         coords: [el.lat as number, el.lon as number],
//         name: (el.tags?.name as string) ?? 'Nearest Metro Station',
//       };
//     }
//     return null;
//   } catch {
//     return null;
//   }
// };

// // ── haversine ─────────────────────────────────────────────────────────────────
// const haversine = (a: LatLng, b: LatLng): number => {
//   const R = 6371;
//   const dLat = ((b[0] - a[0]) * Math.PI) / 180;
//   const dLon = ((b[1] - a[1]) * Math.PI) / 180;
//   const x =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
//   return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
// };

// // ── Metro fare slab (DMRC) ────────────────────────────────────────────────────
// const getApproxMetroFare = (km: number): number => {
//   if (km <= 2) return 10;
//   if (km <= 5) return 20;
//   if (km <= 12) return 30;
//   if (km <= 21) return 40;
//   if (km <= 32) return 50;
//   return 60;
// };

// // ── Metro Journey Card ────────────────────────────────────────────────────────
// interface MetroJourneyCardProps {
//   journey: JourneyDetails;
//   onShowMap: () => void;
//   onFindParking: () => void;
// }

// const MetroJourneyCard = ({ journey, onShowMap, onFindParking }: MetroJourneyCardProps) => {
//   const {
//     boardStation, alightStation,
//     walkKm, walkMin,
//     autoFareMin, autoFareMax,
//     metroFare, metroStops, metroMin,
//     useAuto,
//   } = journey;

//   const totalMin = useAuto ? autoFareMin : 0;
//   const totalMax = useAuto ? autoFareMax : 0;

//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
//       {/* Header */}
//       <div className="px-5 pt-5 pb-3 border-b border-gray-100">
//         <div className="flex items-center gap-2">
//           <Train className="h-4 w-4 text-purple-600" />
//           <h3 className="text-sm font-semibold text-gray-800">Metro Journey Breakdown</h3>
//         </div>
//         <p className="text-xs text-gray-400 mt-0.5">Step-by-step route with cost estimate</p>
//       </div>

//       {/* Steps */}
//       <div className="px-5 py-4 space-y-0">

//         {/* Step 1: Current location */}
//         <div className="flex gap-3">
//           <div className="flex flex-col items-center">
//             <div className="w-7 h-7 rounded-full bg-blue-50 border-2 border-blue-300 flex items-center justify-center text-xs">📍</div>
//             <div className="w-0.5 h-8 bg-gray-200 mt-1" style={{ borderLeft: '2px dashed #d1d5db', width: 0, marginLeft: '13px' }}></div>
//           </div>
//           <div className="pb-5 flex-1">
//             <p className="text-sm font-medium text-gray-800">Your location</p>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {/* Walk badge */}
//               <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-800 text-xs font-medium border border-green-200">
//                 🚶 Walk · {walkKm < 1 ? `${Math.round(walkKm * 1000)}m` : `${walkKm.toFixed(1)}km`} · ~{walkMin} min
//               </span>
//               {/* Auto badge */}
//               {useAuto && (
//                 <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
//                   🛺 Auto · ₹{autoFareMin}–₹{autoFareMax} · ~5 min
//                 </span>
//               )}
//               {!useAuto && (
//                 <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
//                   🛺 Auto also available · ₹{autoFareMin}–₹{autoFareMax}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Step 2: Board station */}
//         <div className="flex gap-3">
//           <div className="flex flex-col items-center">
//             <div className="w-7 h-7 rounded-full bg-purple-50 border-2 border-purple-400 flex items-center justify-center text-xs">🚇</div>
//             <div className="w-0 h-8 mt-1" style={{ borderLeft: '2px solid #d1d5db', marginLeft: '13px' }}></div>
//           </div>
//           <div className="pb-5 flex-1">
//             <p className="text-sm font-medium text-gray-800">
//               Board at <span className="text-purple-700 font-semibold">{boardStation.name}</span>
//             </p>
//             <div className="flex flex-wrap gap-2 mt-2">
//               <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-medium border border-purple-200">
//                 🚇 ~{metroStops} stops · {metroMin} min
//               </span>
//               <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-medium border border-purple-200">
//                 Metro fare · ₹{metroFare}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Step 3: Alight station */}
//         <div className="flex gap-3">
//           <div className="flex flex-col items-center">
//             <div className="w-7 h-7 rounded-full bg-red-50 border-2 border-red-300 flex items-center justify-center text-xs">🏁</div>
//           </div>
//           <div className="pb-2 flex-1">
//             <p className="text-sm font-medium text-gray-800">
//               Alight at <span className="text-red-600 font-semibold">{alightStation.name}</span>
//             </p>
//             <p className="text-xs text-gray-400 mt-0.5">Walk to your destination from exit</p>
//           </div>
//         </div>
//       </div>

//       {/* Fare Summary */}
//       <div className="mx-5 mb-4 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
//         <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
//           <span className="text-xs text-gray-500">Last-mile ({useAuto ? 'auto' : 'walk'})</span>
//           <span className="text-xs font-medium text-gray-700">{useAuto ? `₹${autoFareMin}–₹${autoFareMax}` : 'Free'}</span>
//         </div>
//         <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
//           <span className="text-xs text-gray-500">Metro fare</span>
//           <span className="text-xs font-medium text-gray-700">₹{metroFare}</span>
//         </div>
//         <div className="px-4 py-2.5 flex justify-between items-center">
//           <span className="text-xs font-semibold text-gray-700">Total estimate</span>
//           <span className="text-sm font-semibold text-blue-700">
//             {useAuto ? `₹${metroFare + totalMin}–₹${metroFare + totalMax}` : `₹${metroFare}`}
//           </span>
//         </div>
//       </div>

//       {/* CTA Buttons */}
//       <div className="px-5 pb-5 flex flex-col gap-2">
//         <button
//           onClick={onShowMap}
//           className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition"
//         >
//           <Train className="h-4 w-4" /> Show metro walking map
//         </button>
//         <button
//           onClick={onFindParking}
//           className="w-full py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition"
//         >
//           <ParkingCircle className="h-4 w-4" /> Find parking near destination
//         </button>
//       </div>
//     </div>
//   );
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// const PublicTransportSuggestions = () => {
//   const navigate = useNavigate();
//   const [currentTraffic, setCurrentTraffic] = useState<TrafficLevel | null>(null);
//   const [destination, setDestination] = useState('');
//   const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
//   const [currentLocationText, setCurrentLocationText] = useState('');
//   const [destinationCoords, setDestinationCoords] = useState<LatLng | null>(null);
//   const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
//   const [locationMode, setLocationMode] = useState<'auto' | 'manual'>('auto');
//   const [locating, setLocating] = useState(false);
//   const [locError, setLocError] = useState('');

//   const [mapMode, setMapMode] = useState<'route' | 'metro'>('route');
//   const [nearestMetro, setNearestMetro] = useState<MetroInfo | null>(null);
//   const [loadingMetro, setLoadingMetro] = useState(false);
//   const [showMap, setShowMap] = useState(false);

//   // Journey card state
//   const [journeyDetails, setJourneyDetails] = useState<JourneyDetails | null>(null);

//   const mapSectionRef = useRef<HTMLDivElement>(null);

//   // ── Location ────────────────────────────────────────────────────────────────
//   const detectLocation = () => {
//     setLocating(true);
//     setLocError('');
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const coords: LatLng = [pos.coords.latitude, pos.coords.longitude];
//         setCurrentLocation(coords);
//         try {
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`
//           );
//           const data = await res.json();
//           setCurrentLocationText(
//             (data.display_name as string)?.split(',').slice(0, 2).join(', ') || 'Current Location'
//           );
//         } catch {
//           setCurrentLocationText('Current Location');
//         }
//         setLocating(false);
//       },
//       () => {
//         setLocError('Could not detect location. Try manual entry.');
//         setLocating(false);
//       }
//     );
//   };

//   const geocodeManualLocation = async (query: string): Promise<LatLng | null> => {
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
//       );
//       const data = await res.json();
//       if (!data.length) return null;
//       return [parseFloat(data[0].lat as string), parseFloat(data[0].lon as string)];
//     } catch {
//       return null;
//     }
//   };

//   useEffect(() => {
//     if (locationMode === 'auto') detectLocation();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [locationMode]);

//   // ── Traffic ─────────────────────────────────────────────────────────────────
//   const predictTraffic = (): TrafficLevel => {
//     const h = new Date().getHours();
//     if (h >= 16 && h <= 22) return 'high';
//     if (h >= 10 && h < 16) return 'medium';
//     return 'low';
//   };

//   // ── Search ──────────────────────────────────────────────────────────────────
//   const handleSearch = async () => {
//     if (!destination.trim()) return alert('Please enter a destination.');

//     let loc: LatLng | null = currentLocation;
//     if (locationMode === 'manual') {
//       if (!currentLocationText.trim()) return alert('Please enter your current location.');
//       loc = await geocodeManualLocation(currentLocationText);
//       if (!loc) return alert('Could not find your entered location. Try a more specific address.');
//       setCurrentLocation(loc);
//     }
//     if (!loc) return alert('Current location not available. Please detect or enter it.');

//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`
//     );
//     const data = await res.json();
//     if (!data.length) return alert('Destination not found.');

//     const destCoords: LatLng = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
//     setDestinationCoords(destCoords);
//     setShowMap(false);
//     setNearestMetro(null);
//     setJourneyDetails(null);

//     const distance = haversine(loc, destCoords);
//     const traffic = predictTraffic();
//     setCurrentTraffic(traffic);

//     const s: Suggestion[] = [];
//     if (traffic === 'high') {
//       if (distance <= 2) {
//         s.push({ type: 'auto', title: 'Auto to Metro Station', cost: 'Approx ₹30–₹60', duration: '5–10 min', remark: 'Short ride to nearest metro station.' });
//       } else if (distance <= 7) {
//         s.push({ type: 'auto', title: 'Auto to Metro', cost: `Approx ₹${Math.round(30 * distance)}`, duration: `${Math.round(distance * 4)} min`, remark: 'Due to high traffic, fare might be slightly higher.' });
//       } else {
//         s.push({ type: 'metro', title: 'Metro Recommended', cost: `₹${getApproxMetroFare(distance)}`, duration: `${Math.round(distance * 3)} min`, remark: 'Avoid roads. Metro best option during peak hours.' });
//       }
//       s.push({ type: 'bus', title: 'Bus (not preferred)', cost: '₹15–₹30', duration: `${Math.round(distance * 4.5)} min`, remark: 'High traffic may cause significant delays.' });
//     }
//     if (traffic === 'medium') {
//       s.push({ type: 'metro', title: 'Metro', cost: `₹${getApproxMetroFare(distance)}`, duration: `${Math.round(distance * 3)} min`, remark: 'Metro moderately crowded.' });
//       s.push({ type: 'bus', title: 'Bus Option', cost: '₹15–₹25', duration: `${Math.round(distance * 4)} min`, remark: 'Traffic manageable, comfortable ride possible.' });
//     }
//     if (traffic === 'low') {
//       s.push({ type: 'car', title: 'Take your own vehicle', cost: 'Fuel as per usage', duration: `${Math.round(distance * 2.5)} min`, remark: 'Perfect day for a drive! Low congestion.' });
//       s.push({ type: 'metro', title: 'Metro (Alternative)', cost: `₹${getApproxMetroFare(distance)}`, duration: `${Math.round(distance * 3)} min`, remark: 'Metro running smoothly too.' });
//     }
//     setSuggestions(s);
//   };

//   // ── Explore Metro: fetch both board + alight stations ───────────────────────
//   const handleExplore = async () => {
//     if (!currentLocation || !destinationCoords) return;
//     setLoadingMetro(true);
//     setShowMap(false);
//     setJourneyDetails(null);
//     setMapMode('metro');

//     // Fetch board station (near user) and alight station (near destination) in parallel
//     const [boardMetro, alightMetro] = await Promise.all([
//       fetchNearestMetro(currentLocation),
//       fetchNearestMetro(destinationCoords),
//     ]);

//     setNearestMetro(boardMetro);

//     if (boardMetro) {
//       const walkKm = haversine(currentLocation, boardMetro.coords);
//       const walkMin = Math.round(walkKm * 12); // ~12 min/km walking
//       const useAuto = walkKm > 0.8;
//       const autoBase = Math.max(30, Math.round(walkKm * 25));
//       const autoFareMin = autoBase;
//       const autoFareMax = autoBase + 30;

//       // Metro distance between board & alight stations for fare
//       const metroDistKm = alightMetro
//         ? haversine(boardMetro.coords, alightMetro.coords)
//         : haversine(currentLocation, destinationCoords);

//       const metroFare = getApproxMetroFare(metroDistKm);
//       const metroStops = Math.max(2, Math.round(metroDistKm / 1.2));
//       const metroMin = Math.round(metroDistKm * 3);

//       setJourneyDetails({
//         boardStation: boardMetro,
//         alightStation: alightMetro ?? { coords: destinationCoords, name: 'Nearest Metro to Destination' },
//         walkKm,
//         walkMin,
//         autoFareMin,
//         autoFareMax,
//         metroFare,
//         metroStops,
//         metroMin,
//         useAuto,
//       });
//     }

//     setLoadingMetro(false);
//     setTimeout(() => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
//   };

//   const handleShowMetroMap = () => {
//     setShowMap(true);
//     setTimeout(() => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
//   };

//   const handleBestRoute = () => {
//     setMapMode('route');
//     setShowMap(true);
//     setJourneyDetails(null);
//     setTimeout(() => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
//   };

//   // ── Parking: just navigate — wire this to your router ──────────────────────
//   const handleFindParking = () => {
//   navigate('/parking');
// };

//   // ── Traffic badge ────────────────────────────────────────────────────────────
//   const trafficMap: Record<string, { color: string; icon: string; message: string }> = {
//     low:    { color: 'text-green-600',  icon: '🟢', message: 'Low traffic — smooth travel expected' },
//     medium: { color: 'text-yellow-600', icon: '🟡', message: 'Moderate traffic — plan accordingly' },
//     high:   { color: 'text-red-600',    icon: '🔴', message: 'Heavy traffic — Metro highly recommended' },
//   };
//   const trafficInfo = currentTraffic
//     ? trafficMap[currentTraffic]
//     : { color: 'text-gray-500', icon: '⚪', message: 'Enter destination to predict traffic' };

//   const typeIcon: Record<TransportType, JSX.Element> = {
//     metro: <Train className="h-5 w-5 text-blue-600" />,
//     bus:   <Bus   className="h-5 w-5 text-green-600" />,
//     auto:  <Car   className="h-5 w-5 text-yellow-500" />,
//     car:   <Car   className="h-5 w-5 text-gray-500" />,
//   };

//   return (
//     <section className="py-8 bg-gray-50 min-h-screen">
//       <div className="max-w-4xl mx-auto px-4">

//         <div className="mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Delhi Transit Planner</h2>
//           <p className="text-sm text-gray-500 mt-1">Real-time traffic prediction + transport suggestions</p>
//         </div>

//         <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">

//           {/* Traffic indicator */}
//           <div className="flex items-center justify-between mb-5 p-3 bg-gray-50 rounded-xl">
//             <div className="flex items-center gap-3">
//               <AlertTriangle className={`h-5 w-5 ${trafficInfo.color}`} />
//               <span className={`text-sm font-medium ${trafficInfo.color}`}>{trafficInfo.message}</span>
//             </div>
//             <span className="text-xl">{trafficInfo.icon}</span>
//           </div>

//           {/* Current Location */}
//           <div className="mb-4">
//             <div className="flex items-center justify-between mb-2">
//               <label className="text-sm font-semibold text-gray-700">Your Current Location</label>
//               <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
//                 <button
//                   onClick={() => { setLocationMode('auto'); setCurrentLocation(null); setCurrentLocationText(''); }}
//                   className={`px-3 py-1.5 flex items-center gap-1 transition ${locationMode === 'auto' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
//                 >
//                   <Locate className="h-3 w-3" /> Auto Detect
//                 </button>
//                 <button
//                   onClick={() => { setLocationMode('manual'); setCurrentLocation(null); }}
//                   className={`px-3 py-1.5 flex items-center gap-1 transition ${locationMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
//                 >
//                   <Pencil className="h-3 w-3" /> Enter Manually
//                 </button>
//               </div>
//             </div>

//             {locationMode === 'auto' ? (
//               <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
//                 {locating ? (
//                   <span className="text-sm text-gray-400 animate-pulse">Detecting your location…</span>
//                 ) : currentLocation ? (
//                   <>
//                     <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
//                     <span className="text-sm text-gray-700 truncate">
//                       {currentLocationText || `${currentLocation[0].toFixed(4)}, ${currentLocation[1].toFixed(4)}`}
//                     </span>
//                     <button onClick={detectLocation} className="ml-auto text-xs text-blue-600 hover:underline shrink-0">Re-detect</button>
//                   </>
//                 ) : (
//                   <>
//                     <span className="text-sm text-red-500">{locError || 'Location not detected'}</span>
//                     <button onClick={detectLocation} className="ml-auto text-xs text-blue-600 hover:underline shrink-0">Try Again</button>
//                   </>
//                 )}
//               </div>
//             ) : (
//               <div className="relative">
//                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <input
//                   className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
//                   placeholder="e.g. Connaught Place, Delhi"
//                   value={currentLocationText}
//                   onChange={(e) => setCurrentLocationText(e.target.value)}
//                 />
//               </div>
//             )}
//           </div>

//           {/* Destination */}
//           <div className="mb-5">
//             <label className="text-sm font-semibold text-gray-700 mb-2 block">Destination</label>
//             <div className="relative">
//               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 h-4 w-4" />
//               <input
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
//                 placeholder="e.g. India Gate, Lajpat Nagar, Noida Sector 18…"
//                 value={destination}
//                 onChange={(e) => setDestination(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//               />
//             </div>
//           </div>

//           <button
//             onClick={handleSearch}
//             className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
//           >
//             Predict Traffic & Get Suggestions
//           </button>
//         </div>

//         {/* Suggestion cards */}
//         {suggestions.length > 0 && (
//           <div className="grid sm:grid-cols-2 gap-4 mb-6">
//             {suggestions.map((s, i) => (
//               <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
//                 <div className="flex items-center gap-2 mb-2">
//                   {typeIcon[s.type]}
//                   <h4 className="font-semibold text-gray-800 text-sm">{s.title}</h4>
//                 </div>
//                 <p className="text-xs text-gray-500 mb-3">{s.remark}</p>
//                 <div className="flex justify-between text-xs text-gray-700 mb-1">
//                   <span className="font-medium">Cost</span><span>{s.cost}</span>
//                 </div>
//                 <div className="flex justify-between text-xs text-gray-700 mb-4">
//                   <span className="font-medium">Est. Duration</span><span>{s.duration}</span>
//                 </div>

//                 {s.type === 'car' ? (
//                   <div className="flex gap-2">
//                     <button
//                       onClick={handleBestRoute}
//                       className="flex-1 py-2 bg-blue-600 text-white text-xs rounded-lg flex items-center justify-center gap-1 hover:bg-blue-700 transition"
//                     >
//                       <Navigation className="h-3 w-3" /> Best Route
//                     </button>
//                     <button
//                       onClick={handleFindParking}
//                       className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs rounded-lg flex items-center justify-center gap-1 hover:bg-gray-50 transition"
//                     >
//                       <ParkingCircle className="h-3 w-3" /> Find Parking
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={handleExplore}
//                     disabled={loadingMetro}
//                     className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs rounded-lg flex items-center justify-center gap-1 transition"
//                   >
//                     <Train className="h-3 w-3" />
//                     {loadingMetro ? 'Finding Metro…' : 'Explore Nearest Metro'}
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ── Metro Journey Card (shown before map) ── */}
//         {journeyDetails && !showMap && (
//           <MetroJourneyCard
//             journey={journeyDetails}
//             onShowMap={handleShowMetroMap}
//             onFindParking={handleFindParking}
//           />
//         )}

//         {/* Map / Parking section */}
//         <div ref={mapSectionRef}>

//           {/* Metro walking map */}
//           {showMap && currentLocation && destinationCoords && mapMode === 'metro' && (
//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
//               {/* Journey summary above map */}
//               {journeyDetails && (
//                 <div className="mb-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
//                   <div className="flex items-start gap-2">
//                     <Train className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
//                     <div className="text-xs text-purple-800 space-y-0.5">
//                       <p>
//                         <span className="font-semibold">
//                           {journeyDetails.useAuto
//                             ? `Take auto (₹${journeyDetails.autoFareMin}–₹${journeyDetails.autoFareMax})`
//                             : `Walk ${journeyDetails.walkKm < 1 ? Math.round(journeyDetails.walkKm * 1000) + 'm' : journeyDetails.walkKm.toFixed(1) + 'km'} (~${journeyDetails.walkMin} min)`}
//                         </span>{' '}
//                         → Board at <span className="font-semibold">{journeyDetails.boardStation.name}</span>
//                       </p>
//                       <p>
//                         Ride <span className="font-semibold">{journeyDetails.metroStops} stops ({journeyDetails.metroMin} min)</span> →
//                         Alight at <span className="font-semibold">{journeyDetails.alightStation.name}</span>
//                       </p>
//                       <p className="text-purple-600">Metro fare: ₹{journeyDetails.metroFare} · Purple line shows walking route to metro</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="flex items-center gap-2 mb-3">
//                 <Train className="h-4 w-4 text-purple-600" />
//                 <h3 className="text-sm font-semibold text-gray-700">Walk to Metro Station</h3>
//               </div>
//               {!nearestMetro && (
//                 <p className="text-xs text-gray-400 mb-3">No metro found within 3 km. Showing approximate route.</p>
//               )}
//               <OSMMap
//                 currentLocation={currentLocation}
//                 destination={destinationCoords}
//                 metroStation={nearestMetro?.coords ?? null}
//                 metroName={nearestMetro?.name}
//                 mode="metro"
//               />

//               {/* Find parking button below map */}
//               <button
//                 onClick={handleFindParking}
//                 className="mt-4 w-full py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition"
//               >
//                 <ParkingCircle className="h-4 w-4" /> Find parking near destination
//               </button>
//             </div>
//           )}

//           {/* Driving route map */}
//           {showMap && currentLocation && destinationCoords && mapMode === 'route' && (
//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
//               <div className="flex items-center gap-2 mb-3">
//                 <Navigation className="h-4 w-4 text-blue-600" />
//                 <h3 className="text-sm font-semibold text-gray-700">Best Driving Route</h3>
//               </div>
//               <OSMMap
//                 currentLocation={currentLocation}
//                 destination={destinationCoords}
//                 mode="route"
//               />

//               {/* Find parking button below driving map too */}
//               <button
//                 onClick={handleFindParking}
//                 className="mt-4 w-full py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition"
//               >
//                 <ParkingCircle className="h-4 w-4" /> Find parking near destination
//               </button>
//             </div>
//           )}

//         </div>
//       </div>
//     </section>
//   );
// };

// export default PublicTransportSuggestions;


import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Train, MapPin, Car, AlertTriangle, Navigation, ParkingCircle, Locate, Pencil } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type LatLng = [number, number];
type TrafficLevel = 'low' | 'medium' | 'high';
type TransportType = 'metro' | 'bus' | 'auto' | 'car';

interface Suggestion {
  type: TransportType;
  title: string;
  cost: string;
  duration: string;
  remark: string;
  priority: 'most' | 'preferred' | 'least';
}

interface MetroInfo {
  coords: LatLng;
  name: string;
}

interface JourneyDetails {
  boardStation: MetroInfo;
  alightStation: MetroInfo;
  walkKm: number;
  walkMin: number;
  autoFareMin: number;
  autoFareMax: number;
  metroFare: number;
  metroStops: number;
  metroMin: number;
  useAuto: boolean;
}

interface BusJourneyDetails {
  busStand: MetroInfo;
  walkKm: number;
  walkMin: number;
  autoFareMin: number;
  autoFareMax: number;
  busFareMin: number;
  busFareMax: number;
  busMin: number;
  useAuto: boolean;
}

interface LeafletMap {
  remove: () => void;
  fitBounds: (bounds: LatLng[], options?: object) => void;
}

interface LeafletStatic {
  map: (el: HTMLDivElement, options?: object) => LeafletMap & {
    setView: (center: LatLng, zoom: number) => LeafletMap;
  };
  tileLayer: (url: string, options?: object) => { addTo: (map: LeafletMap) => void };
  divIcon: (options: object) => object;
  marker: (latlng: LatLng, options?: object) => {
    addTo: (map: LeafletMap) => {
      bindPopup: (html: string) => { openPopup: () => void };
    };
  };
  geoJSON: (geojson: object, options?: object) => { addTo: (map: LeafletMap) => void };
  polyline: (latlngs: LatLng[], options?: object) => { addTo: (map: LeafletMap) => void };
}

declare global {
  interface Window { L: LeafletStatic; }
}

// ── OSMMap ────────────────────────────────────────────────────────────────────
interface OSMMapProps {
  currentLocation: LatLng;
  destination: LatLng;
  stopStation?: LatLng | null;
  stopName?: string;
  stopColor?: string;
  stopEmoji?: string;
  mode?: 'route' | 'transit';
}

const OSMMap = ({
  currentLocation, destination,
  stopStation, stopName,
  stopColor = '#a855f7', stopEmoji = '🚇',
  mode = 'route',
}: OSMMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      const L = window.L;
      if (!L || !mapRef.current) return;
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }

      const map = L.map(mapRef.current).setView(currentLocation, 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(map);

      const makeIcon = (color: string, emoji: string) =>
        L.divIcon({
          className: '',
          html: `<div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.35);font-size:13px">${emoji}</div>`,
          iconAnchor: [14, 14],
        });

      if (mode === 'transit' && stopStation) {
        L.marker(currentLocation, { icon: makeIcon('#3b82f6', '📍') })
          .addTo(map).bindPopup('<b>Your Location</b>').openPopup();
        L.marker(stopStation, { icon: makeIcon(stopColor, stopEmoji) })
          .addTo(map).bindPopup(`<b>${stopName ?? 'Stop'}</b>`);
        L.marker(destination, { icon: makeIcon('#ef4444', '🏁') })
          .addTo(map).bindPopup('<b>Your Destination</b>');

        const [lat1, lon1] = currentLocation;
        const [lat2, lon2] = stopStation;
        fetch(`https://router.project-osrm.org/route/v1/walking/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`)
          .then(r => r.json())
          .then((data: { routes?: { geometry: { coordinates: [number, number][] } }[] }) => {
            if (data.routes?.length) {
              L.geoJSON(data.routes[0].geometry, { style: { color: stopColor, weight: 4, opacity: 0.85 } }).addTo(map);
              const coords: LatLng[] = data.routes[0].geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as LatLng);
              map.fitBounds([...coords, destination], { padding: [40, 40] });
            }
          })
          .catch(() => {
            L.polyline([currentLocation, stopStation], { color: stopColor, weight: 3, dashArray: '6 6' }).addTo(map);
            map.fitBounds([currentLocation, stopStation, destination], { padding: [40, 40] });
          });
      } else {
        L.marker(currentLocation, { icon: makeIcon('#3b82f6', '📍') })
          .addTo(map).bindPopup('<b>Your Location</b>').openPopup();
        L.marker(destination, { icon: makeIcon('#ef4444', '🏁') })
          .addTo(map).bindPopup('<b>Destination</b>');

        const [lat1, lon1] = currentLocation;
        const [lat2, lon2] = destination;
        fetch(`https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`)
          .then(r => r.json())
          .then((data: { routes?: { geometry: { coordinates: [number, number][] } }[] }) => {
            if (data.routes?.length) {
              L.geoJSON(data.routes[0].geometry, { style: { color: '#3b82f6', weight: 4, opacity: 0.85 } }).addTo(map);
              const coords: LatLng[] = data.routes[0].geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as LatLng);
              map.fitBounds(coords, { padding: [40, 40] });
            }
          })
          .catch(() => {
            L.polyline([currentLocation, destination], { color: '#3b82f6', weight: 3, dashArray: '6 6' }).addTo(map);
            map.fitBounds([currentLocation, destination], { padding: [40, 40] });
          });
      }
    };

    if (window.L) { initMap(); }
    else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [currentLocation, destination, stopStation, mode]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%', borderRadius: '12px', zIndex: 0 }} />;
};

// ── API helpers ───────────────────────────────────────────────────────────────
const fetchNearestMetro = async (loc: LatLng): Promise<MetroInfo | null> => {
  try {
    const query = `[out:json][timeout:10];node["station"="subway"](around:3000,${loc[0]},${loc[1]});out 1;`;
    const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query });
    const data = await res.json();
    if (data.elements?.length) {
      const el = data.elements[0];
      return { coords: [el.lat as number, el.lon as number], name: (el.tags?.name as string) ?? 'Nearest Metro Station' };
    }
    return null;
  } catch { return null; }
};

const fetchNearestBusStop = async (loc: LatLng): Promise<MetroInfo | null> => {
  try {
    // try bus_stop first
    const query = `[out:json][timeout:10];node["highway"="bus_stop"](around:1000,${loc[0]},${loc[1]});out 1;`;
    const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query });
    const data = await res.json();
    if (data.elements?.length) {
      const el = data.elements[0];
      return { coords: [el.lat as number, el.lon as number], name: (el.tags?.name as string) ?? 'Nearest Bus Stop' };
    }
    // fallback: bus_station
    const query2 = `[out:json][timeout:10];node["amenity"="bus_station"](around:2000,${loc[0]},${loc[1]});out 1;`;
    const res2 = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query2 });
    const data2 = await res2.json();
    if (data2.elements?.length) {
      const el = data2.elements[0];
      return { coords: [el.lat as number, el.lon as number], name: (el.tags?.name as string) ?? 'Nearest Bus Stand' };
    }
    return null;
  } catch { return null; }
};

// ── Haversine ─────────────────────────────────────────────────────────────────
const haversine = (a: LatLng, b: LatLng): number => {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

// ── Fare helpers ──────────────────────────────────────────────────────────────
const getApproxMetroFare = (km: number): number => {
  if (km <= 2) return 10; if (km <= 5) return 20; if (km <= 12) return 30;
  if (km <= 21) return 40; if (km <= 32) return 50; return 60;
};

const getApproxBusFare = (km: number): { min: number; max: number } => {
  if (km <= 4)  return { min: 10, max: 15 };
  if (km <= 10) return { min: 15, max: 25 };
  if (km <= 20) return { min: 25, max: 35 };
  return { min: 35, max: 50 };
};

// ── Priority Badge ────────────────────────────────────────────────────────────
const PriorityBadge = ({ priority }: { priority: 'most' | 'preferred' | 'least' }) => {
  const map = {
    most:      { label: 'Most Recommended', cls: 'bg-green-50 text-green-700 border border-green-200' },
    preferred: { label: 'Preferred',        cls: 'bg-blue-50 text-blue-700 border border-blue-200' },
    least:     { label: 'Least Preferred',  cls: 'bg-gray-100 text-gray-500 border border-gray-200' },
  };
  const { label, cls } = map[priority];
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
};

// ── Metro Journey Card ────────────────────────────────────────────────────────
const MetroJourneyCard = ({ journey, onShowMap, onFindParking }: { journey: JourneyDetails; onShowMap: () => void; onFindParking: () => void }) => {
  const { boardStation, alightStation, walkKm, walkMin, autoFareMin, autoFareMax, metroFare, metroStops, metroMin, useAuto } = journey;
  const totalMin = useAuto ? autoFareMin : 0;
  const totalMax = useAuto ? autoFareMax : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-5 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Train className="h-4 w-4 text-purple-600" />
          <h3 className="text-sm font-semibold text-gray-800">Metro Journey Breakdown</h3>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">Step-by-step route with cost estimate</p>
      </div>

      <div className="px-5 py-4">
        {/* Step 1 */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-blue-50 border-2 border-blue-300 flex items-center justify-center text-xs">📍</div>
            <div style={{ borderLeft: '2px dashed #d1d5db', height: '32px', marginLeft: '13px' }} />
          </div>
          <div className="pb-5 flex-1">
            <p className="text-sm font-medium text-gray-800">Your location</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-800 text-xs font-medium border border-green-200">
                🚶 Walk · {walkKm < 1 ? `${Math.round(walkKm * 1000)}m` : `${walkKm.toFixed(1)}km`} · ~{walkMin} min
              </span>
              {useAuto ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
                  🛺 Auto · ₹{autoFareMin}–₹{autoFareMax} · ~5 min
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                  🛺 Auto also available · ₹{autoFareMin}–₹{autoFareMax}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-purple-50 border-2 border-purple-400 flex items-center justify-center text-xs">🚇</div>
            <div style={{ borderLeft: '2px solid #d1d5db', height: '32px', marginLeft: '13px' }} />
          </div>
          <div className="pb-5 flex-1">
            <p className="text-sm font-medium text-gray-800">Board at <span className="text-purple-700 font-semibold">{boardStation.name}</span></p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-medium border border-purple-200">
                🚇 ~{metroStops} stops · {metroMin} min
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-medium border border-purple-200">
                Fare · ₹{metroFare}
              </span>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-red-50 border-2 border-red-300 flex items-center justify-center text-xs shrink-0">🏁</div>
          <div className="pb-2 flex-1">
            <p className="text-sm font-medium text-gray-800">Alight at <span className="text-red-600 font-semibold">{alightStation.name}</span></p>
            <p className="text-xs text-gray-400 mt-0.5">Walk to your destination from exit</p>
          </div>
        </div>
      </div>

      {/* Fare summary */}
      <div className="mx-5 mb-4 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-100 flex justify-between">
          <span className="text-xs text-gray-500">Last-mile ({useAuto ? 'auto' : 'walk'})</span>
          <span className="text-xs font-medium text-gray-700">{useAuto ? `₹${autoFareMin}–₹${autoFareMax}` : 'Free'}</span>
        </div>
        <div className="px-4 py-2 border-b border-gray-100 flex justify-between">
          <span className="text-xs text-gray-500">Metro fare</span>
          <span className="text-xs font-medium text-gray-700">₹{metroFare}</span>
        </div>
        <div className="px-4 py-2.5 flex justify-between">
          <span className="text-xs font-semibold text-gray-700">Total estimate</span>
          <span className="text-sm font-semibold text-purple-700">
            {useAuto ? `₹${metroFare + totalMin}–₹${metroFare + totalMax}` : `₹${metroFare}`}
          </span>
        </div>
      </div>

      <div className="px-5 pb-5 flex flex-col gap-2">
        <button onClick={onShowMap} className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition">
          <Train className="h-4 w-4" /> Show metro walking map
        </button>
        <button onClick={onFindParking} className="w-full py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition">
          <ParkingCircle className="h-4 w-4" /> Find parking near destination
        </button>
      </div>
    </div>
  );
};

// ── Bus Journey Card ──────────────────────────────────────────────────────────
const BusJourneyCard = ({ journey, onShowMap, onFindParking }: { journey: BusJourneyDetails; onShowMap: () => void; onFindParking: () => void }) => {
  const { busStand, walkKm, walkMin, autoFareMin, autoFareMax, busFareMin, busFareMax, busMin, useAuto } = journey;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-5 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bus className="h-4 w-4 text-green-600" />
          <h3 className="text-sm font-semibold text-gray-800">Bus Journey Breakdown</h3>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">Step-by-step route with cost estimate</p>
      </div>

      <div className="px-5 py-4">
        {/* Step 1 */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-blue-50 border-2 border-blue-300 flex items-center justify-center text-xs">📍</div>
            <div style={{ borderLeft: '2px dashed #d1d5db', height: '32px', marginLeft: '13px' }} />
          </div>
          <div className="pb-5 flex-1">
            <p className="text-sm font-medium text-gray-800">Your location</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-800 text-xs font-medium border border-green-200">
                🚶 Walk · {walkKm < 1 ? `${Math.round(walkKm * 1000)}m` : `${walkKm.toFixed(1)}km`} · ~{walkMin} min
              </span>
              {useAuto ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
                  🛺 Auto · ₹{autoFareMin}–₹{autoFareMax} · ~5 min
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                  🛺 Auto also available · ₹{autoFareMin}–₹{autoFareMax}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center text-xs">🚌</div>
            <div style={{ borderLeft: '2px solid #d1d5db', height: '32px', marginLeft: '13px' }} />
          </div>
          <div className="pb-5 flex-1">
            <p className="text-sm font-medium text-gray-800">Board at <span className="text-green-700 font-semibold">{busStand.name}</span></p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-800 text-xs font-medium border border-green-200">
                🚌 ~{busMin} min ride
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-800 text-xs font-medium border border-green-200">
                Fare · ₹{busFareMin}–₹{busFareMax}
              </span>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-red-50 border-2 border-red-300 flex items-center justify-center text-xs shrink-0">🏁</div>
          <div className="pb-2 flex-1">
            <p className="text-sm font-medium text-gray-800">Alight near your destination</p>
            <p className="text-xs text-gray-400 mt-0.5">Short walk from bus stop to destination</p>
          </div>
        </div>
      </div>

      {/* Fare summary */}
      <div className="mx-5 mb-4 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-100 flex justify-between">
          <span className="text-xs text-gray-500">To bus stop ({useAuto ? 'auto' : 'walk'})</span>
          <span className="text-xs font-medium text-gray-700">{useAuto ? `₹${autoFareMin}–₹${autoFareMax}` : 'Free'}</span>
        </div>
        <div className="px-4 py-2 border-b border-gray-100 flex justify-between">
          <span className="text-xs text-gray-500">Bus fare (approx)</span>
          <span className="text-xs font-medium text-gray-700">₹{busFareMin}–₹{busFareMax}</span>
        </div>
        <div className="px-4 py-2.5 flex justify-between">
          <span className="text-xs font-semibold text-gray-700">Total estimate</span>
          <span className="text-sm font-semibold text-green-700">
            {useAuto
              ? `₹${busFareMin + autoFareMin}–₹${busFareMax + autoFareMax}`
              : `₹${busFareMin}–₹${busFareMax}`}
          </span>
        </div>
      </div>

      <div className="px-5 pb-5 flex flex-col gap-2">
        <button onClick={onShowMap} className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition">
          <Bus className="h-4 w-4" /> Show bus stop on map
        </button>
        <button onClick={onFindParking} className="w-full py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition">
          <ParkingCircle className="h-4 w-4" /> Find parking near destination
        </button>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const PublicTransportSuggestions = () => {
  const navigate = useNavigate();

  const [currentTraffic, setCurrentTraffic] = useState<TrafficLevel | null>(null);
  const [destination, setDestination] = useState('');
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [currentLocationText, setCurrentLocationText] = useState('');
  const [destinationCoords, setDestinationCoords] = useState<LatLng | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [locationMode, setLocationMode] = useState<'auto' | 'manual'>('auto');
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');

  const [activeMode, setActiveMode] = useState<'metro' | 'bus' | 'route' | null>(null);
  const [showMap, setShowMap] = useState(false);

  const [nearestMetro, setNearestMetro] = useState<MetroInfo | null>(null);
  const [nearestBusStop, setNearestBusStop] = useState<MetroInfo | null>(null);
  const [loadingMetro, setLoadingMetro] = useState(false);
  const [loadingBus, setLoadingBus] = useState(false);

  const [journeyDetails, setJourneyDetails] = useState<JourneyDetails | null>(null);
  const [busJourneyDetails, setBusJourneyDetails] = useState<BusJourneyDetails | null>(null);

  const mapSectionRef = useRef<HTMLDivElement>(null);

  // ── Location ────────────────────────────────────────────────────────────────
  const detectLocation = () => {
    setLocating(true); setLocError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords: LatLng = [pos.coords.latitude, pos.coords.longitude];
        setCurrentLocation(coords);
        
        // Save to localStorage for ParkingSwap and SmartParkingFinder interoperability
        localStorage.setItem('userCoords', JSON.stringify({ lat: coords[0], lng: coords[1] }));
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`);
          const data = await res.json();
          setCurrentLocationText((data.display_name as string)?.split(',').slice(0, 2).join(', ') || 'Current Location');
        } catch { setCurrentLocationText('Current Location'); }
        setLocating(false);
      },
      () => { setLocError('Could not detect location. Try manual entry.'); setLocating(false); }
    );
  };

  const geocodeManualLocation = async (query: string): Promise<LatLng | null> => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      if (!data.length) return null;
      return [parseFloat(data[0].lat as string), parseFloat(data[0].lon as string)];
    } catch { return null; }
  };

  useEffect(() => {
    if (locationMode === 'auto') detectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationMode]);

  // ── Traffic ─────────────────────────────────────────────────────────────────
  const predictTraffic = (): TrafficLevel => {
    const h = new Date().getHours();
    if (h >= 16 && h <= 22) return 'high';
    if (h >= 10 && h < 16) return 'medium';
    return 'low';
  };

  // ── Search ──────────────────────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!destination.trim()) return alert('Please enter a destination.');
    let loc: LatLng | null = currentLocation;
    if (locationMode === 'manual') {
      if (!currentLocationText.trim()) return alert('Please enter your current location.');
      loc = await geocodeManualLocation(currentLocationText);
      if (!loc) return alert('Could not find your entered location. Try a more specific address.');
      setCurrentLocation(loc);
    }
    if (!loc) return alert('Current location not available. Please detect or enter it.');

    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`);
    const data = await res.json();
    if (!data.length) return alert('Destination not found.');

    const destCoords: LatLng = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    setDestinationCoords(destCoords);
    setShowMap(false);
    setActiveMode(null);
    setNearestMetro(null);
    setNearestBusStop(null);
    setJourneyDetails(null);
    setBusJourneyDetails(null);

    const distance = haversine(loc, destCoords);
    const traffic = predictTraffic();
    setCurrentTraffic(traffic);

    const busFare = getApproxBusFare(distance);
    const s: Suggestion[] = [];

    // HIGH traffic: metro (most) → bus (preferred) → car (least)
    if (traffic === 'high') {
      s.push({ type: 'metro', title: 'Metro', cost: `₹${getApproxMetroFare(distance)}`, duration: `${Math.round(distance * 3)} min`, remark: 'Best option during peak hours. Bypass road traffic completely.', priority: 'most' });
      s.push({ type: 'bus',   title: 'Bus',   cost: `₹${busFare.min}–₹${busFare.max}`, duration: `${Math.round(distance * 4.5)} min`, remark: 'May face delays but still reasonable. Budget-friendly.', priority: 'preferred' });
      s.push({ type: 'car',   title: 'Own Vehicle', cost: 'Fuel as per usage', duration: `${Math.round(distance * 5)} min`, remark: 'Heavy congestion expected. Not recommended during peak hours.', priority: 'least' });
    }

    // MEDIUM traffic: metro (most) → bus (preferred) → car (least)
    if (traffic === 'medium') {
      s.push({ type: 'metro', title: 'Metro', cost: `₹${getApproxMetroFare(distance)}`, duration: `${Math.round(distance * 3)} min`, remark: 'Moderately crowded but reliable and fast.', priority: 'most' });
      s.push({ type: 'bus',   title: 'Bus',   cost: `₹${busFare.min}–₹${busFare.max}`, duration: `${Math.round(distance * 4)} min`, remark: 'Traffic manageable. Comfortable and affordable ride.', priority: 'preferred' });
      s.push({ type: 'car',   title: 'Own Vehicle', cost: 'Fuel as per usage', duration: `${Math.round(distance * 3.5)} min`, remark: 'Moderate traffic. Use only if necessary.', priority: 'least' });
    }

    // LOW traffic: car (most) → bus (preferred) → metro (preferred)
    if (traffic === 'low') {
      s.push({ type: 'car',   title: 'Own Vehicle', cost: 'Fuel as per usage', duration: `${Math.round(distance * 2.5)} min`, remark: 'Perfect day for a drive! Roads clear and smooth.', priority: 'most' });
      s.push({ type: 'bus',   title: 'Bus',   cost: `₹${busFare.min}–₹${busFare.max}`, duration: `${Math.round(distance * 3.5)} min`, remark: 'Running smoothly. Great budget-friendly option.', priority: 'preferred' });
      s.push({ type: 'metro', title: 'Metro', cost: `₹${getApproxMetroFare(distance)}`, duration: `${Math.round(distance * 3)} min`, remark: 'Metro running smoothly too. Reliable alternative.', priority: 'preferred' });
    }

    setSuggestions(s);
  };

  // ── Explore Metro ────────────────────────────────────────────────────────────
  const handleExploreMetro = async () => {
    if (!currentLocation || !destinationCoords) return;
    setLoadingMetro(true);
    setShowMap(false);
    setJourneyDetails(null);
    setBusJourneyDetails(null);
    setActiveMode('metro');

    const [boardMetro, alightMetro] = await Promise.all([
      fetchNearestMetro(currentLocation),
      fetchNearestMetro(destinationCoords),
    ]);
    setNearestMetro(boardMetro);

    if (boardMetro) {
      const walkKm = haversine(currentLocation, boardMetro.coords);
      const walkMin = Math.round(walkKm * 12);
      const useAuto = walkKm > 0.8;
      const autoBase = Math.max(30, Math.round(walkKm * 25));
      const metroDistKm = alightMetro
        ? haversine(boardMetro.coords, alightMetro.coords)
        : haversine(currentLocation, destinationCoords);

      setJourneyDetails({
        boardStation: boardMetro,
        alightStation: alightMetro ?? { coords: destinationCoords, name: 'Nearest Metro to Destination' },
        walkKm,
        walkMin,
        autoFareMin: autoBase,
        autoFareMax: autoBase + 30,
        metroFare: getApproxMetroFare(metroDistKm),
        metroStops: Math.max(2, Math.round(metroDistKm / 1.2)),
        metroMin: Math.round(metroDistKm * 3),
        useAuto,
      });
    }

    setLoadingMetro(false);
    setTimeout(() => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  // ── Explore Bus ──────────────────────────────────────────────────────────────
  const handleExploreBus = async () => {
    if (!currentLocation || !destinationCoords) return;
    setLoadingBus(true);
    setShowMap(false);
    setJourneyDetails(null);
    setBusJourneyDetails(null);
    setActiveMode('bus');

    const busStop = await fetchNearestBusStop(currentLocation);
    setNearestBusStop(busStop);

    const walkKm = busStop ? haversine(currentLocation, busStop.coords) : 0.3;
    const walkMin = Math.round(walkKm * 12);
    const useAuto = walkKm > 0.8;
    const autoBase = Math.max(30, Math.round(walkKm * 25));
    const distance = haversine(currentLocation, destinationCoords);
    const busFare = getApproxBusFare(distance);

    setBusJourneyDetails({
      busStand: busStop ?? { coords: currentLocation, name: 'Nearby Bus Stop' },
      walkKm,
      walkMin,
      autoFareMin: autoBase,
      autoFareMax: autoBase + 30,
      busFareMin: busFare.min,
      busFareMax: busFare.max,
      busMin: Math.round(distance * 4),
      useAuto,
    });

    setLoadingBus(false);
    setTimeout(() => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleShowMetroMap = () => {
    setShowMap(true);
    setTimeout(() => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleShowBusMap = () => {
    setShowMap(true);
    setTimeout(() => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleBestRoute = () => {
    setActiveMode('route');
    setShowMap(true);
    setJourneyDetails(null);
    setBusJourneyDetails(null);
    setTimeout(() => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleFindParking = () => {
    navigate('/parking');
  };

  // ── UI helpers ────────────────────────────────────────────────────────────────
  const trafficMap: Record<string, { color: string; icon: string; message: string }> = {
    low:    { color: 'text-green-600',  icon: '🟢', message: 'Low traffic — smooth travel expected' },
    medium: { color: 'text-yellow-600', icon: '🟡', message: 'Moderate traffic — plan accordingly' },
    high:   { color: 'text-red-600',    icon: '🔴', message: 'Heavy traffic — Metro highly recommended' },
  };
  const trafficInfo = currentTraffic
    ? trafficMap[currentTraffic]
    : { color: 'text-gray-500', icon: '⚪', message: 'Enter destination to predict traffic' };

  const typeIcon: Record<TransportType, JSX.Element> = {
    metro: <Train className="h-5 w-5 text-purple-600" />,
    bus:   <Bus   className="h-5 w-5 text-green-600" />,
    auto:  <Car   className="h-5 w-5 text-yellow-500" />,
    car:   <Car   className="h-5 w-5 text-gray-500" />,
  };

  const priorityRing: Record<'most' | 'preferred' | 'least', string> = {
    most:      'ring-2 ring-green-400',
    preferred: 'ring-1 ring-blue-200',
    least:     '',
  };

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Delhi Transit Planner</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time traffic prediction + transport suggestions</p>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          {/* Traffic indicator */}
          <div className="flex items-center justify-between mb-5 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`h-5 w-5 ${trafficInfo.color}`} />
              <span className={`text-sm font-medium ${trafficInfo.color}`}>{trafficInfo.message}</span>
            </div>
            <span className="text-xl">{trafficInfo.icon}</span>
          </div>

          {/* Current Location */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Your Current Location</label>
              <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
                <button
                  onClick={() => { setLocationMode('auto'); setCurrentLocation(null); setCurrentLocationText(''); }}
                  className={`px-3 py-1.5 flex items-center gap-1 transition ${locationMode === 'auto' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Locate className="h-3 w-3" /> Auto Detect
                </button>
                <button
                  onClick={() => { setLocationMode('manual'); setCurrentLocation(null); }}
                  className={`px-3 py-1.5 flex items-center gap-1 transition ${locationMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Pencil className="h-3 w-3" /> Enter Manually
                </button>
              </div>
            </div>

            {locationMode === 'auto' ? (
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
                {locating ? (
                  <span className="text-sm text-gray-400 animate-pulse">Detecting your location…</span>
                ) : currentLocation ? (
                  <>
                    <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="text-sm text-gray-700 truncate">
                      {currentLocationText || `${currentLocation[0].toFixed(4)}, ${currentLocation[1].toFixed(4)}`}
                    </span>
                    <button onClick={detectLocation} className="ml-auto text-xs text-blue-600 hover:underline shrink-0">Re-detect</button>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-red-500">{locError || 'Location not detected'}</span>
                    <button onClick={detectLocation} className="ml-auto text-xs text-blue-600 hover:underline shrink-0">Try Again</button>
                  </>
                )}
              </div>
            ) : (
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="e.g. Connaught Place, Delhi"
                  value={currentLocationText}
                  onChange={(e) => setCurrentLocationText(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="mb-5">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 h-4 w-4" />
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="e.g. India Gate, Lajpat Nagar, Noida Sector 18…"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          <button onClick={handleSearch} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition">
            Predict Traffic & Get Suggestions
          </button>
        </div>

        {/* Suggestion cards */}
        {suggestions.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {suggestions.map((s, i) => (
              <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition ${priorityRing[s.priority]}`}>
                <div className="flex items-center gap-2 mb-2">
                  {typeIcon[s.type]}
                  <h4 className="font-semibold text-gray-800 text-sm">{s.title}</h4>
                </div>
                <div className="mb-3">
                  <PriorityBadge priority={s.priority} />
                </div>
                <p className="text-xs text-gray-500 mb-3">{s.remark}</p>
                <div className="flex justify-between text-xs text-gray-700 mb-1">
                  <span className="font-medium">Cost</span><span>{s.cost}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-700 mb-4">
                  <span className="font-medium">Est. Time</span><span>{s.duration}</span>
                </div>

                {s.type === 'car' && (
                  <div className="flex gap-2">
                    <button onClick={handleBestRoute} className="flex-1 py-2 bg-blue-600 text-white text-xs rounded-lg flex items-center justify-center gap-1 hover:bg-blue-700 transition">
                      <Navigation className="h-3 w-3" /> Best Route
                    </button>
                    <button onClick={handleFindParking} className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs rounded-lg flex items-center justify-center gap-1 hover:bg-gray-50 transition">
                      <ParkingCircle className="h-3 w-3" /> Parking
                    </button>
                  </div>
                )}

                {s.type === 'metro' && (
                  <button
                    onClick={handleExploreMetro}
                    disabled={loadingMetro}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-xs rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    <Train className="h-3 w-3" />
                    {loadingMetro ? 'Finding Metro…' : 'Explore Metro Route'}
                  </button>
                )}

                {s.type === 'bus' && (
                  <button
                    onClick={handleExploreBus}
                    disabled={loadingBus}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    <Bus className="h-3 w-3" />
                    {loadingBus ? 'Finding Bus Stop…' : 'Explore Bus Route'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Metro Journey Card */}
        {activeMode === 'metro' && journeyDetails && !showMap && (
          <MetroJourneyCard journey={journeyDetails} onShowMap={handleShowMetroMap} onFindParking={handleFindParking} />
        )}

        {/* Bus Journey Card */}
        {activeMode === 'bus' && busJourneyDetails && !showMap && (
          <BusJourneyCard journey={busJourneyDetails} onShowMap={handleShowBusMap} onFindParking={handleFindParking} />
        )}

        {/* Map section */}
        <div ref={mapSectionRef}>

          {/* Metro map */}
          {showMap && activeMode === 'metro' && currentLocation && destinationCoords && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
              {journeyDetails && (
                <div className="mb-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-start gap-2">
                    <Train className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                    <div className="text-xs text-purple-800 space-y-0.5">
                      <p>
                        <span className="font-semibold">
                          {journeyDetails.useAuto
                            ? `Take auto (₹${journeyDetails.autoFareMin}–₹${journeyDetails.autoFareMax})`
                            : `Walk ${journeyDetails.walkKm < 1 ? Math.round(journeyDetails.walkKm * 1000) + 'm' : journeyDetails.walkKm.toFixed(1) + 'km'} (~${journeyDetails.walkMin} min)`}
                        </span>{' '}→ Board at <span className="font-semibold">{journeyDetails.boardStation.name}</span>
                      </p>
                      <p>
                        Ride <span className="font-semibold">{journeyDetails.metroStops} stops ({journeyDetails.metroMin} min)</span> → Alight at <span className="font-semibold">{journeyDetails.alightStation.name}</span>
                      </p>
                      <p className="text-purple-600">Metro fare: ₹{journeyDetails.metroFare} · Purple line = walking route to metro</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <Train className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-semibold text-gray-700">Walk to Metro Station</h3>
              </div>
              {!nearestMetro && <p className="text-xs text-gray-400 mb-3">No metro found within 3 km. Showing approximate route.</p>}
              <OSMMap
                currentLocation={currentLocation}
                destination={destinationCoords}
                stopStation={nearestMetro?.coords ?? null}
                stopName={nearestMetro?.name}
                stopColor="#a855f7"
                stopEmoji="🚇"
                mode="transit"
              />
              <button onClick={handleFindParking} className="mt-4 w-full py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition">
                <ParkingCircle className="h-4 w-4" /> Find parking near destination
              </button>
            </div>
          )}

          {/* Bus map */}
          {showMap && activeMode === 'bus' && currentLocation && destinationCoords && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
              {busJourneyDetails && (
                <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-start gap-2">
                    <Bus className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <div className="text-xs text-green-800 space-y-0.5">
                      <p>
                        <span className="font-semibold">
                          {busJourneyDetails.useAuto
                            ? `Take auto (₹${busJourneyDetails.autoFareMin}–₹${busJourneyDetails.autoFareMax})`
                            : `Walk ${busJourneyDetails.walkKm < 1 ? Math.round(busJourneyDetails.walkKm * 1000) + 'm' : busJourneyDetails.walkKm.toFixed(1) + 'km'} (~${busJourneyDetails.walkMin} min)`}
                        </span>{' '}→ Board at <span className="font-semibold">{busJourneyDetails.busStand.name}</span>
                      </p>
                      <p className="text-green-700">Bus fare: ₹{busJourneyDetails.busFareMin}–₹{busJourneyDetails.busFareMax} · ~{busJourneyDetails.busMin} min · Green line = walk to stop</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <Bus className="h-4 w-4 text-green-600" />
                <h3 className="text-sm font-semibold text-gray-700">Walk to Bus Stop</h3>
              </div>
              {!nearestBusStop && <p className="text-xs text-gray-400 mb-3">No bus stop found nearby. Showing approximate location.</p>}
              <OSMMap
                currentLocation={currentLocation}
                destination={destinationCoords}
                stopStation={nearestBusStop?.coords ?? null}
                stopName={nearestBusStop?.name}
                stopColor="#16a34a"
                stopEmoji="🚌"
                mode="transit"
              />
              <button onClick={handleFindParking} className="mt-4 w-full py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition">
                <ParkingCircle className="h-4 w-4" /> Find parking near destination
              </button>
            </div>
          )}

          {/* Driving route map */}
          {showMap && activeMode === 'route' && currentLocation && destinationCoords && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Navigation className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-700">Best Driving Route</h3>
              </div>
              <OSMMap currentLocation={currentLocation} destination={destinationCoords} mode="route" />
              <button onClick={handleFindParking} className="mt-4 w-full py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition">
                <ParkingCircle className="h-4 w-4" /> Find parking near destination
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default PublicTransportSuggestions;