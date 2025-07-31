import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
// Fix default icon paths so markers actually show up
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import WebMapNavs from '@/pages/webmap/WebMapNavs';
import { markerData } from '@/data/geojson/markerData';
import type { MarkerData } from '@/data/geojson/markerData';
import { createContext, useRef } from 'react';
import { useState, useEffect } from 'react';
import { PlotLocations } from './../WebMap.popup';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Route, Timer, XCircle } from 'lucide-react';
import { BiSolidChurch } from 'react-icons/bi';
import { renderToStaticMarkup } from 'react-dom/server';
import { GiOpenGate } from 'react-icons/gi';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Context to signal a locate request from navs to map
export const LocateContext = createContext<{ requestLocate: () => void } | null>(null);

// Route interface
interface RouteData {
  from: [number, number];
  to: [number, number];
  polyline: [number, number][];
  distance?: number;
  duration?: number;
}

export default function MapPage() {
  const bounds: [[number, number], [number, number]] = [
    [10.247883800064669, 123.79691285546676],
    [10.249302749341647, 123.7988598710129],
  ];
  const locateRef = useRef<(() => void) | null>(null);
  const [userPosition, setUserPosition] = useState<L.LatLng | null>(null);

  // Cemetery entrance constant for routing
  const CEMETERY_GATE = L.latLng(10.248107820799307, 123.797607547609545);

  // Two-step route state
  const [publicRoute, setPublicRoute] = useState<RouteData | null>(null);
  const [privateRoute, setPrivateRoute] = useState<RouteData | null>(null);

  // Store pending destination if user location is not yet available
  const pendingDestinationRef = useRef<[number, number] | null>(null);

  // Track last user position for drift detection
  const lastUserPositionRef = useRef<L.LatLng | null>(null);

  // Track if recalculating route
  const [isRecalculating, setIsRecalculating] = useState(false);

  // GPS watch ID for cleanup
  const watchIdRef = useRef<number | null>(null);

  // Start live GPS tracking when navigation is active
  useEffect(() => {
    if (publicRoute || privateRoute) {
      startLiveTracking();
    } else {
      stopLiveTracking();
    }

    return () => stopLiveTracking();
  }, [publicRoute, privateRoute]);

  function startLiveTracking() {
    if (!navigator.geolocation) {
      console.log('❌ navigator.geolocation not available. Cannot start live GPS tracking.');
      return;
    }
    if (watchIdRef.current) {
      console.log('⚠️ Live GPS tracking already started.');
      return;
    }

    console.log('📡 Starting live GPS tracking...');

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
        setUserPosition(newLatLng);

        // Check for drift and recalculate route if needed
        if (lastUserPositionRef.current && (publicRoute || privateRoute)) {
          const drift = newLatLng.distanceTo(lastUserPositionRef.current);
          if (drift > 30 && !isRecalculating) {
            console.log('🚧 User drifted > 30m, recalculating route...');
            setIsRecalculating(true);
            // Recalculate route from new position
            if (privateRoute) {
              handleStartNavigation(newLatLng, privateRoute.to);
            }
          }
        }
        lastUserPositionRef.current = newLatLng;
      },
      (error) => {
        console.warn('Live tracking error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000
      }
    );

    if (watchIdRef.current !== null) {
      console.log('✅ Successfully started live GPS tracking.');
    } else {
      console.log('❌ Failed to start live GPS tracking.');
    }
  }

  function stopLiveTracking() {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log('🛑 Stopped live GPS tracking');
    }
  }

  // Live GPS tracking and drift detection
  function LocationMarker() {
    const map = useMapEvents({
      locationfound(e) {
        setUserPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        // If a direction was requested before location was available, start navigation
        if (pendingDestinationRef.current) {
          handleStartNavigation(e.latlng, pendingDestinationRef.current);
          pendingDestinationRef.current = null;
        }
        lastUserPositionRef.current = e.latlng;
      },
    });

    locateRef.current = () => map.locate();

    return userPosition === null ? null : (
      <Marker
        position={userPosition}
        icon={L.divIcon({
          html: '<div style="background: #4285f4; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
          className: 'custom-user-marker',
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        })}
      >
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  // Fetch route polyline from OSRM API
  async function fetchRoutePolyline(
    from: [number, number],
    to: [number, number],
    type: 'public' | 'private'
  ): Promise<{ polyline: [number, number][]; distance: number; duration: number }> {
    const serviceUrl = type === 'private'
      ? 'https://finisterreosm-production.up.railway.app/route/v1/foot'
      : 'https://router.project-osrm.org/route/v1/driving';

    const url = `${serviceUrl}/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Route API error');

      const data = await response.json();
      if (!data.routes || !data.routes[0]) throw new Error('No route found');

      const route = data.routes[0];
      // Convert [lng,lat] to [lat,lng]
      const polyline: [number, number][] = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);

      return {
        polyline,
        distance: route.distance || 0,
        duration: route.duration || 0
      };
    } catch (err) {
      console.warn(`Route API failed for ${type} route, using fallback:`, err);
      // Fallback: straight line with estimated distance/duration
      const distance = calculateDistance(from, to);
      return {
        polyline: [from, to],
        distance,
        duration: type === 'private' ? distance / 1.4 : distance / 13.89 // Walking ~1.4 m/s, driving ~50 km/h
      };
    }
  }

  // Calculate distance between two points
  function calculateDistance(from: [number, number], to: [number, number]): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (to[0] - from[0]) * Math.PI / 180;
    const dLng = (to[1] - from[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(from[0] * Math.PI / 180) * Math.cos(to[0] * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Start navigation: set public/private routes and fetch polylines
  async function handleStartNavigation(userLatLng: L.LatLng, dest: [number, number]) {
    try {
      setIsRecalculating(false);

      // Step 1: public route (user to gate)
      const publicFrom: [number, number] = [userLatLng.lat, userLatLng.lng];
      const publicTo: [number, number] = [CEMETERY_GATE.lat, CEMETERY_GATE.lng];

      // Step 2: private route (gate to marker)
      const privateFrom: [number, number] = [CEMETERY_GATE.lat, CEMETERY_GATE.lng];
      const privateTo: [number, number] = dest;

      // Fetch polylines
      const [publicRouteData, privateRouteData] = await Promise.all([
        fetchRoutePolyline(publicFrom, publicTo, 'public'),
        fetchRoutePolyline(privateFrom, privateTo, 'private'),
      ]);

      // Ensure route continuity - force gate connection
      if (publicRouteData.polyline.length > 0) {
        publicRouteData.polyline[publicRouteData.polyline.length - 1] = publicTo;
      }
      if (privateRouteData.polyline.length > 0) {
        privateRouteData.polyline[0] = privateFrom;
      }

      if (privateRouteData.polyline.length > 0) {
        privateRouteData.polyline[0] = publicTo;
        const lastIdx = privateRouteData.polyline.length - 1;
        const lastPoint = privateRouteData.polyline[lastIdx];
        // Only snap to destination if distance > 2 meters
        const snapDistance = calculateDistance(lastPoint, privateTo);
        if (snapDistance > 2) {
          privateRouteData.polyline.push(privateTo);
        }
      }

      setPublicRoute({
        from: publicFrom,
        to: publicTo,
        polyline: publicRouteData.polyline,
        distance: publicRouteData.distance,
        duration: publicRouteData.duration
      });

      setPrivateRoute({
        from: privateFrom,
        to: privateTo,
        polyline: privateRouteData.polyline,
        distance: privateRouteData.distance,
        duration: privateRouteData.duration
      });

      lastUserPositionRef.current = userLatLng;
      console.log('✅ Navigation routes calculated successfully');
    } catch (error) {
      console.error('Navigation error:', error);
      setIsRecalculating(false);
    }
  }

  // Stop navigation and cleanup
  function handleStopNavigation() {
    setPublicRoute(null);
    setPrivateRoute(null);
    setIsRecalculating(false);
    pendingDestinationRef.current = null;
    lastUserPositionRef.current = null;
    stopLiveTracking();
  }

  // Provide context to navs
  const requestLocate = () => {
    if (locateRef.current) locateRef.current();
  };

  // Calculate total distance and duration
  const totalDistance = (publicRoute?.distance || 0) + (privateRoute?.distance || 0);
  const totalDuration = (publicRoute?.duration || 0) + (privateRoute?.duration || 0);

  // Format distance helper
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return Math.round(meters) + 'm';
    } else {
      return (meters / 1000).toFixed(1) + 'km';
    }
  };

  return (
    <LocateContext.Provider value={{ requestLocate }}>
      <div className="h-screen w-full relative">
        <WebMapNavs />

        {/* Navigation Control Panel */}
        {(publicRoute || privateRoute) && (
          <div className="absolute top-6 md:top-20 lg:top-20 left-1/2 z-[9999] -translate-x-1/2 flex flex-col items-center gap-4">
            {/* Route Info */}
            <Card className="flex shadow-lg backdrop-blur-sm min-w-[250px] bg-white/90 border border-stone-200 dark:bg-stone-800/90 dark:border-stone-700 py-3 rounded-xl transition-all duration-300 hover:shadow-xl">
              <CardContent className="flex flex-col items-center w-full py-2 px-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                      <Route className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {formatDistance(totalDistance)}
                    </span>
                  </div>

                  <div className="h-5 w-px bg-stone-300 dark:bg-stone-600"></div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30">
                      <Timer className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {Math.round(totalDuration / 60)} min
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stop Navigation Button */}
            <Button
              variant="destructive"
              className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-md hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
              aria-label="Stop Navigation"
              onClick={handleStopNavigation}
            >
              <XCircle className="w-5 h-5" />
              <span className="font-medium">Stop Navigation</span>
            </Button>
          </div>
        )}

        {/* Recalculating Indicator */}
        {isRecalculating && (
          <div className="absolute top-28 left-1/2 z-[9999] -translate-x-1/2">
            <span className="bg-yellow-200 text-yellow-900 px-4 py-2 rounded shadow">
              🚧 Recalculating route...
            </span>
          </div>
        )}

        <MapContainer
          bounds={bounds}
          zoom={18}
          maxZoom={25}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxNativeZoom={18}
            maxZoom={25}
          />

          <LocationMarker />

          {/* Show public route polyline (user to gate) - Blue */}
          {publicRoute && (
            <Polyline
              positions={publicRoute.polyline}
              pathOptions={{
                color: '#4285F4',
                weight: 8,
                opacity: 1,
                lineCap: 'round',
                lineJoin: 'round'
              }}
              className="animate-glow-pulse"
            />
          )}

          {/* Show private route polyline (gate to marker) - Green */}
          {privateRoute && (
            <Polyline
              positions={privateRoute.polyline}
              pathOptions={{
                color: '#34A853',
                weight: 8,
                opacity: 1,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: '10, 10'
              }}
              className="animate-dash-flow"
            />
          )}

          {/* Cemetery Entrance Marker */}
          <Marker
            position={[CEMETERY_GATE.lat, CEMETERY_GATE.lng]}
            icon={L.divIcon({
              html: renderToStaticMarkup(
                <div
                  style={{
                    background: '#000000',
                    borderRadius: '50% 50% 50% 0',
                    boxShadow: '0 0 8px rgba(0,0,0,0.15)',
                    padding: '4px',
                    border: '2px solid #fff',
                    transform: 'rotate(-45deg)',
                    display: 'inline-block'
                  }}
                >
                  <GiOpenGate
                    className='z-999 text-white'
                    size={16}
                    strokeWidth={2.5}
                    style={{
                      transform: 'rotate(45deg)'
                    }}
                  />
                </div>
              ),
              className: 'destination-marker',
              iconSize: [32, 32],
            })}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-orange-600">🚪 Cemetery Gate</div>
                <div className="text-xs text-gray-500 mt-1">Entry point for cemetery visitors</div>
              </div>
            </Popup>
          </Marker>

          {/* Cemetery Exit Marker */}
          <Marker position={[10.248166481872728, 123.79754558858059]}
            icon={L.divIcon({
              html: renderToStaticMarkup(
                <div
                  style={{
                    background: '#000000',
                    borderRadius: '50% 50% 50% 0',
                    boxShadow: '0 0 8px rgba(0,0,0,0.15)',
                    padding: '4px',
                    border: '2px solid #fff',
                    transform: 'rotate(-45deg)',
                    display: 'inline-block'
                  }}
                >
                  <GiOpenGate
                    className='z-999 text-white'
                    size={16}
                    strokeWidth={2.5}
                    style={{
                      transform: 'rotate(45deg)'
                    }}
                  />
                </div>
              ),
              className: 'destination-marker',
              iconSize: [32, 32],
            })}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-orange-600">🚪 Cemetery Gate</div>
                <div className="text-xs text-gray-500 mt-1">Entry point for cemetery visitors</div>
              </div>
            </Popup>
          </Marker>

          {/* Cemetery Chapel Marker */}
          <Marker position={[10.248435228156183, 123.79787795587316]}
            icon={L.divIcon({
              html: renderToStaticMarkup(
                <div
                  style={{
                    background: '#FF9800',
                    borderRadius: '50% 50% 50% 0',
                    boxShadow: '0 0 8px rgba(0,0,0,0.15)',
                    padding: '4px',
                    border: '2px solid #fff',
                    transform: 'rotate(-45deg)',
                    display: 'inline-block'
                  }}
                >
                  <BiSolidChurch
                    className='z-999 text-white'
                    size={16}
                    strokeWidth={2.5}
                    style={{
                      transform: 'rotate(45deg)'
                    }}
                  />
                </div>
              ),
              className: 'destination-marker',
              iconSize: [32, 32],
            })}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-orange-600">🚪 Chapel</div>
                <div className="text-xs text-gray-500 mt-1">Entry point for chapel visitors</div>
              </div>
            </Popup>
          </Marker>

          {markerData.map((marker: MarkerData, idx: number) => {
            const statusColor =
              marker.plotStatus === 'Available'
                ? '#22c55e'
                : marker.plotStatus === 'Occupied'
                  ? '#ef4444'
                  : marker.plotStatus === 'Reserved'
                    ? '#facc15'
                    : '#a3a3a3';

            const circleIcon = L.divIcon({
              html: `<div style="
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: ${statusColor};
                border: 2px solid #fff;
                box-shadow: 0 0 4px rgba(0,0,0,0.15);
                "></div>`,
              className: '',
              iconSize: [24, 24],
            });

            // Type-safe background color assignment
            const backgroundColor: string | undefined =
              marker.category === 'Bronze' ? '#7d7d7d' :
                marker.category === 'Silver' ? '#b00020' :
                  marker.category === 'Platinum' ? '#d4af37' :
                    marker.category === 'Diamond' ? '#cc6688' :
                      undefined;

            // When direction is requested, start navigation with two-step route
            const handleDirectionClick = () => {
              if (userPosition) {
                handleStartNavigation(userPosition, marker.position as [number, number]);
              } else {
                // Store destination and trigger location request
                pendingDestinationRef.current = marker.position as [number, number];
                if (locateRef.current) locateRef.current();
              }
            };

            return (
              <Marker key={idx} position={marker.position} icon={circleIcon}>
                <Popup>
                  <PlotLocations
                    marker={marker}
                    backgroundColor={backgroundColor}
                    onDirectionClick={handleDirectionClick}
                  />
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </LocateContext.Provider>
  );
}