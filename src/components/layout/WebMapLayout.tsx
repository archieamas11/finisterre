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
import { Route, Timer, XCircle, Navigation } from 'lucide-react';
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
  routeType: 'public' | 'private';
}

// Navigation state constants
const NavigationState = {
  IDLE: 'idle',
  TO_GATE: 'to_gate',
  IN_CEMETERY: 'in_cemetery',
  COMPLETED: 'completed'
} as const;

type NavigationState = typeof NavigationState[keyof typeof NavigationState];

export default function MapPage() {
  // Debug mode - set to true to see detailed logs
  const DEBUG_MODE = true;

  const bounds: [[number, number], [number, number]] = [
    [10.247883800064669, 123.79691285546676],
    [10.249302749341647, 123.7988598710129],
  ];
  const locateRef = useRef<(() => void) | null>(null);
  const [userPosition, setUserPosition] = useState<L.LatLng | null>(null);

  // Cemetery entrance constant for routing
  const CEMETERY_GATE = L.latLng(10.248107820799307, 123.797607547609545);
  const CEMETERY_BOUNDS = {
    north: 10.249302749341647,
    south: 10.247883800064669,
    east: 123.7988598710129,
    west: 123.79691285546676
  };

  // Navigation state management
  const [navigationState, setNavigationState] = useState<NavigationState>(NavigationState.IDLE);
  const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);

  // Store pending destination if user location is not yet available
  const pendingDestinationRef = useRef<[number, number] | null>(null);

  // Track last user position for drift detection
  const lastUserPositionRef = useRef<L.LatLng | null>(null);

  // Track if recalculating route
  const [isRecalculating, setIsRecalculating] = useState(false);

  // GPS watch ID for cleanup
  const watchIdRef = useRef<number | null>(null);

  // Debounce timer for route recalculation
  const recalculateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user is inside cemetery bounds (with a buffer for better detection)
  function isInsideCemetery(position: L.LatLng): boolean {
    const buffer = 0.0001; // Small buffer for boundary detection
    return position.lat >= (CEMETERY_BOUNDS.south - buffer) &&
      position.lat <= (CEMETERY_BOUNDS.north + buffer) &&
      position.lng >= (CEMETERY_BOUNDS.west - buffer) &&
      position.lng <= (CEMETERY_BOUNDS.east + buffer);
  }

  // Calculate distance to gate
  function distanceToGate(position: L.LatLng): number {
    return position.distanceTo(CEMETERY_GATE);
  }

  // Start live GPS tracking when navigation is active
  useEffect(() => {
    if (navigationState !== NavigationState.IDLE) {
      startLiveTracking();
    } else {
      stopLiveTracking();
    }

    return () => stopLiveTracking();
  }, [navigationState]);

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

        // Handle navigation state transitions and route updates
        handleLocationUpdate(newLatLng);
      },
      (error) => {
        console.warn('Live tracking error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 2000
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

  // Handle location updates and navigation state management
  function handleLocationUpdate(newPosition: L.LatLng) {
    if (navigationState === NavigationState.IDLE) return;

    const insideCemetery = isInsideCemetery(newPosition);
    const distToGate = distanceToGate(newPosition);

    // Check for drift and need to recalculate
    if (lastUserPositionRef.current && destination) {
      const drift = newPosition.distanceTo(lastUserPositionRef.current);

      // Only recalculate if user has moved significantly
      if (drift > 15) {
        // Clear existing debounce timer
        if (recalculateTimerRef.current) {
          clearTimeout(recalculateTimerRef.current);
        }

        // Debounce route recalculation to avoid too many API calls
        recalculateTimerRef.current = setTimeout(() => {
          handleNavigationStateTransition(newPosition, insideCemetery, distToGate);
        }, 1000);
      }
    }

    lastUserPositionRef.current = newPosition;
  }

  // Handle navigation state transitions and route recalculation
  async function handleNavigationStateTransition(
    userPos: L.LatLng,
    insideCemetery: boolean,
    distToGate: number
  ) {
    if (!destination || isRecalculating) return;

    console.log('🔄 Navigation state check:', {
      currentState: navigationState,
      insideCemetery,
      distToGate: Math.round(distToGate),
      userPos: [userPos.lat, userPos.lng]
    });

    setIsRecalculating(true);

    try {
      // State transition logic
      if (navigationState === NavigationState.TO_GATE) {
        if (insideCemetery || distToGate < 25) {
          // User reached the gate or is inside cemetery
          console.log('🚪 User reached cemetery gate, switching to private navigation');
          setNavigationState(NavigationState.IN_CEMETERY);
          await recalculateRoute(userPos, destination, 'private');
        } else {
          // Still on public roads, recalculate public route
          console.log('🚗 Updating public route to gate');
          await recalculateRoute(userPos, [CEMETERY_GATE.lat, CEMETERY_GATE.lng], 'public');
        }
      } else if (navigationState === NavigationState.IN_CEMETERY) {
        if (!insideCemetery && distToGate > 50) {
          // User left cemetery, switch back to public navigation to gate
          console.log('🚗 User left cemetery, switching to public navigation');
          setNavigationState(NavigationState.TO_GATE);
          await recalculateRoute(userPos, [CEMETERY_GATE.lat, CEMETERY_GATE.lng], 'public');
        } else {
          // Still in cemetery, update private route to final destination
          console.log('🏃 Updating private route to destination');
          await recalculateRoute(userPos, destination, 'private');
        }
      }
    } catch (error) {
      console.error('❌ Navigation state transition error:', error);
      // 🔄 Fallback: set a basic route on error
      setCurrentRoute({
        from: [userPos.lat, userPos.lng],
        to: destination,
        polyline: [[userPos.lat, userPos.lng], destination],
        distance: calculateDistance([userPos.lat, userPos.lng], destination),
        duration: calculateDistance([userPos.lat, userPos.lng], destination) / 1.4,
        routeType: insideCemetery ? 'private' : 'public'
      });
    } finally {
      setIsRecalculating(false);
    }
  }

  // Live GPS tracking and drift detection
  function LocationMarker() {
    const map = useMapEvents({
      locationfound(e) {
        setUserPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom(), { duration: 0.5 });

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
          html: `<div style="
            background: #4285f4; 
            border: 3px solid white; 
            border-radius: 50%; 
            width: 18px; 
            height: 18px; 
            box-shadow: 0 2px 8px rgba(66, 133, 244, 0.4);
            position: relative;
          ">
            <div style="
              position: absolute;
              top: -8px;
              left: -8px;
              width: 34px;
              height: 34px;
              border: 2px solid #4285f4;
              border-radius: 50%;
              background: rgba(66, 133, 244, 0.1);
              animation: pulse 2s infinite;
            "></div>
          </div>
          <style>
            @keyframes pulse {
              0% { transform: scale(1); opacity: 1; }
              100% { transform: scale(1.5); opacity: 0; }
            }
          </style>`,
          className: 'custom-user-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })}
      >
        <Popup>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span className="font-medium">You are here</span>
          </div>
        </Popup>
      </Marker>
    );
  }

  // Fetch route polyline from OSRM API with better error handling
  async function fetchRoutePolyline(
    from: [number, number],
    to: [number, number],
    type: 'public' | 'private'
  ): Promise<{ polyline: [number, number][]; distance: number; duration: number }> {
    const serviceUrl = type === 'private'
      ? 'https://finisterreosm-production.up.railway.app/route/v1/foot'
      : 'https://router.project-osrm.org/route/v1/driving';

    const url = `${serviceUrl}/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;

    console.log(`🛣️ Fetching ${type} route:`, {
      url,
      from: `[${from[0]}, ${from[1]}]`,
      to: `[${to[0]}, ${to[1]}]`
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), type === 'private' ? 30000 : 15000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      console.log(`📡 ${type} route response:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ ${type} route API error:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`📊 ${type} route API response:`, {
        routes: data.routes?.length || 0,
        code: data.code,
        hasGeometry: !!(data.routes?.[0]?.geometry)
      });

      if (!data.routes || !data.routes[0]) {
        console.warn(`⚠️ No route found in ${type} API response:`, data);
        throw new Error(`No route found: ${data.message || 'Unknown error'}`);
      }

      const route = data.routes[0];

      // Handle different geometry formats
      let coordinates = [];
      if (route.geometry && route.geometry.coordinates) {
        coordinates = route.geometry.coordinates;
        console.log(`✅ ${type} route geometry found:`, coordinates.length, 'points');
      } else if (route.geometry && typeof route.geometry === 'string') {
        // Handle encoded polyline if needed
        console.warn('⚠️ Encoded polyline detected, using fallback');
        coordinates = [[from[1], from[0]], [to[1], to[0]]];
      } else {
        console.warn('⚠️ No geometry in response, using direct line');
        coordinates = [[from[1], from[0]], [to[1], to[0]]];
      }

      // Convert [lng,lat] to [lat,lng] and validate coordinates
      const polyline: [number, number][] = coordinates
        .filter((c: any) => Array.isArray(c) && c.length >= 2)
        .map((c: number[]) => [c[1], c[0]]) // lng,lat -> lat,lng
        .filter((coord: [number, number]) => {
          const [lat, lng] = coord;
          const isValid = !isNaN(lat) && !isNaN(lng) &&
            Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
          if (!isValid) {
            console.warn('⚠️ Invalid coordinate filtered out:', coord);
          }
          return isValid;
        });

      console.log(`✅ ${type} route processed:`, {
        originalPoints: coordinates.length,
        validPoints: polyline.length,
        distance: route.distance || 'calculated',
        duration: route.duration || 'calculated'
      });

      // Ensure we have at least start and end points
      if (polyline.length === 0) {
        polyline.push(from, to);
      } else if (polyline.length === 1) {
        polyline.push(to);
      }

      return {
        polyline,
        distance: route.distance || calculateDistance(from, to),
        duration: route.duration || (type === 'private' ? calculateDistance(from, to) / 1.4 : calculateDistance(from, to) / 13.89)
      };
    } catch (err) {
      console.error(`❌ ${type} route fetch failed:`, err);

      // Always provide a fallback route
      const distance = calculateDistance(from, to);
      const walkingSpeed = 1.4; // m/s
      const drivingSpeed = 13.89; // m/s (~50 km/h)

      console.log(`🔄 Using fallback route for ${type} navigation:`, {
        distance: Math.round(distance),
        estimatedDuration: Math.round(distance / (type === 'private' ? walkingSpeed : drivingSpeed))
      });

      return {
        polyline: [from, to],
        distance,
        duration: type === 'private' ? distance / walkingSpeed : distance / drivingSpeed
      };
    }
  }

  // Calculate distance between two points using Haversine formula
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

  // Recalculate route based on current position and route type
  async function recalculateRoute(
    userPos: L.LatLng,
    dest: [number, number],
    routeType: 'public' | 'private'
  ) {
    const from: [number, number] = [userPos.lat, userPos.lng];

    console.log(`🔄 Recalculating ${routeType} route:`, {
      from: `[${from[0]}, ${from[1]}]`,
      to: `[${dest[0]}, ${dest[1]}]`,
      routeType,
      navigationState
    });

    try {
      const routeData = await fetchRoutePolyline(from, dest, routeType);

      // Ensure route starts from current user position
      if (routeData.polyline.length > 0) {
        routeData.polyline[0] = from;
      }

      // Ensure route ends at destination
      if (routeData.polyline.length > 1) {
        const lastIndex = routeData.polyline.length - 1;
        routeData.polyline[lastIndex] = dest;
      }

      const newRoute: RouteData = {
        from,
        to: dest,
        polyline: routeData.polyline,
        distance: routeData.distance,
        duration: routeData.duration,
        routeType
      };

      setCurrentRoute(newRoute);

      console.log(`✅ ${routeType} route calculated successfully:`, {
        points: routeData.polyline.length,
        distance: `${Math.round(routeData.distance)}m`,
        duration: `${Math.round(routeData.duration)}s`,
        routeType,
        polylinePreview: routeData.polyline.slice(0, 3).map(p => `[${p[0].toFixed(6)}, ${p[1].toFixed(6)}]`)
      });

      return newRoute;
    } catch (error) {
      console.error(`❌ Failed to recalculate ${routeType} route:`, error);

      // Force fallback route
      const fallbackDistance = calculateDistance(from, dest);
      const fallbackRoute: RouteData = {
        from,
        to: dest,
        polyline: [from, dest],
        distance: fallbackDistance,
        duration: routeType === 'private' ? fallbackDistance / 1.4 : fallbackDistance / 13.89,
        routeType
      };

      setCurrentRoute(fallbackRoute);

      console.log(`🔄 Fallback ${routeType} route set:`, {
        distance: `${Math.round(fallbackDistance)}m`,
        duration: `${Math.round(fallbackRoute.duration || 0)}s`
      });

      return fallbackRoute;
    }
  }

  // Start navigation with intelligent route selection
  async function handleStartNavigation(userLatLng: L.LatLng, dest: [number, number]) {
    try {
      console.log('🚀 Starting navigation to:', dest);
      setDestination(dest);
      setIsRecalculating(true);

      const insideCemetery = isInsideCemetery(userLatLng);
      const distToGate = distanceToGate(userLatLng);

      console.log('📍 Navigation context:', {
        userPosition: [userLatLng.lat, userLatLng.lng],
        destination: dest,
        insideCemetery,
        distanceToGate: Math.round(distToGate)
      });

      if (insideCemetery) {
        // User is already inside cemetery, start with private navigation directly to destination
        console.log('🏃 Starting private navigation (user inside cemetery)');
        setNavigationState(NavigationState.IN_CEMETERY);
        await recalculateRoute(userLatLng, dest, 'private');
      } else {
        // User is outside, need to route to gate first, then to destination
        console.log('🚗 Starting public navigation to cemetery gate');
        setNavigationState(NavigationState.TO_GATE);
        await recalculateRoute(userLatLng, [CEMETERY_GATE.lat, CEMETERY_GATE.lng], 'public');

        // 🌟 Important: After reaching gate, we'll need to route to final destination
        // This will be handled in the state transition when user reaches the gate
      }

      lastUserPositionRef.current = userLatLng;
      console.log('✅ Navigation started successfully');
    } catch (error) {
      console.error('❌ Navigation start error:', error);
      setNavigationState(NavigationState.IDLE);
      setCurrentRoute(null);
      setDestination(null);
    } finally {
      setIsRecalculating(false);
    }
  }

  // Stop navigation and cleanup
  function handleStopNavigation() {
    setCurrentRoute(null);
    setDestination(null);
    setNavigationState(NavigationState.IDLE);
    setIsRecalculating(false);
    pendingDestinationRef.current = null;
    lastUserPositionRef.current = null;

    // Clear any pending timers
    if (recalculateTimerRef.current) {
      clearTimeout(recalculateTimerRef.current);
      recalculateTimerRef.current = null;
    }

    stopLiveTracking();
    console.log('🛑 Navigation stopped');
  }

  // Provide context to navs
  const requestLocate = () => {
    if (locateRef.current) locateRef.current();
  };

  // Format distance helper
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return Math.round(meters) + 'm';
    } else {
      return (meters / 1000).toFixed(1) + 'km';
    }
  };

  // Get route color based on type and state
  const getRouteColor = (routeType: 'public' | 'private') => {
    return routeType === 'public' ? '#4285F4' : '#34A853';
  };

  // Get route style based on type
  const getRouteStyle = (routeType: 'public' | 'private') => {
    return {
      color: getRouteColor(routeType),
      weight: 8, // ⚡️ Made thicker for better visibility during testing
      opacity: 0.9, // ⚡️ Made more opaque for better visibility
      lineCap: 'round' as const,
      lineJoin: 'round' as const,
      ...(routeType === 'private' && { dashArray: '12, 8' }) // ⚡️ Improved dash pattern
    };
  };

  return (
    <LocateContext.Provider value={{ requestLocate }}>
      <div className="h-screen w-full relative">
        <WebMapNavs />

        {/* Navigation Control Panel */}
        {navigationState !== NavigationState.IDLE && currentRoute && (
          <div className="absolute top-6 md:top-20 lg:top-20 left-1/2 z-[9999] -translate-x-1/2 flex flex-col items-center gap-4">
            {/* Route Info */}
            <Card className="flex shadow-lg backdrop-blur-sm min-w-[280px] bg-white/95 border border-stone-200 dark:bg-stone-800/95 dark:border-stone-700 py-3 rounded-xl transition-all duration-300 hover:shadow-xl">
              <CardContent className="flex flex-col items-center w-full py-2 px-4">
                {/* Navigation State Indicator */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${navigationState === NavigationState.TO_GATE ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                  <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                    {navigationState === NavigationState.TO_GATE ? 'To Cemetery Gate' : 'Inside Cemetery'}
                  </span>
                </div>

                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                      <Route className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {formatDistance(currentRoute.distance || 0)}
                    </span>
                  </div>

                  <div className="h-5 w-px bg-stone-300 dark:bg-stone-600"></div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30">
                      <Timer className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {Math.round((currentRoute.duration || 0) / 60)} min
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
          <div className="absolute top-32 md:top-44 lg:top-44 left-1/2 z-[9999] -translate-x-1/2">
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
              <span className="font-medium">Recalculating route...</span>
            </div>
          </div>
        )}

        {/* Debug Panel - Remove in production */}
        {DEBUG_MODE && (
          <div className="absolute bottom-4 right-4 z-[9999] bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-w-sm">
            <div className="font-bold mb-2">🐛 Debug Info</div>
            <div>State: {navigationState}</div>
            <div>User Pos: {userPosition ? `${userPosition.lat.toFixed(6)}, ${userPosition.lng.toFixed(6)}` : 'None'}</div>
            <div>Inside Cemetery: {userPosition ? isInsideCemetery(userPosition).toString() : 'Unknown'}</div>
            <div>Dist to Gate: {userPosition ? Math.round(distanceToGate(userPosition)) + 'm' : 'Unknown'}</div>
            <div>Current Route: {currentRoute ? currentRoute.routeType : 'None'}</div>
            <div>Route Points: {currentRoute ? currentRoute.polyline.length : 0}</div>
            <div>Destination: {destination ? `[${destination[0].toFixed(6)}, ${destination[1].toFixed(6)}]` : 'None'}</div>
            <div>Recalculating: {isRecalculating.toString()}</div>
            {currentRoute && (
              <div className="mt-2 pt-2 border-t border-gray-600">
                <div>Distance: {Math.round(currentRoute.distance || 0)}m</div>
                <div>Duration: {Math.round((currentRoute.duration || 0) / 60)}min</div>
              </div>
            )}
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

          {/* Show current route polyline with debugging */}
          {currentRoute && currentRoute.polyline.length > 1 && (
            <>
              <Polyline
                positions={currentRoute.polyline}
                pathOptions={getRouteStyle(currentRoute.routeType)}
              />
              {/* 🐛 Route debugging markers for start and end points */}
              {DEBUG_MODE && (
                <>
                  <Marker
                    position={currentRoute.polyline[0]}
                    icon={L.divIcon({
                      html: `<div style="background: lime; color: black; padding: 2px 4px; border-radius: 3px; font-size: 10px; font-weight: bold;">START</div>`,
                      className: 'route-debug-marker',
                      iconSize: [40, 20],
                      iconAnchor: [20, 10]
                    })}
                  />
                  <Marker
                    position={currentRoute.polyline[currentRoute.polyline.length - 1]}
                    icon={L.divIcon({
                      html: `<div style="background: red; color: white; padding: 2px 4px; border-radius: 3px; font-size: 10px; font-weight: bold;">${currentRoute.routeType.toUpperCase()}</div>`,
                      className: 'route-debug-marker',
                      iconSize: [40, 20],
                      iconAnchor: [20, 10]
                    })}
                  />
                </>
              )}
            </>
          )}

          {/* Cemetery Entrance Marker */}
          <Marker
            position={[CEMETERY_GATE.lat, CEMETERY_GATE.lng]}
            icon={L.divIcon({
              html: renderToStaticMarkup(
                <div
                  style={{
                    background: '#FF6B35',
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
                <div className="text-xs text-gray-500 mt-1">Main entrance for visitors</div>
              </div>
            </Popup>
          </Marker>

          {/* Cemetery Exit Marker */}
          <Marker position={[10.248166481872728, 123.79754558858059]}
            icon={L.divIcon({
              html: renderToStaticMarkup(
                <div
                  style={{
                    background: '#FF6B35',
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
                <div className="font-semibold text-orange-600">🚪 Cemetery Exit</div>
                <div className="text-xs text-gray-500 mt-1">Alternative exit point</div>
              </div>
            </Popup>
          </Marker>

          {/* Cemetery Chapel Marker */}
          <Marker position={[10.248435228156183, 123.79787795587316]}
            icon={L.divIcon({
              html: renderToStaticMarkup(
                <div
                  style={{
                    background: '#8B5CF6',
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
                <div className="font-semibold text-purple-600">⛪ Chapel</div>
                <div className="text-xs text-gray-500 mt-1">Prayer and ceremony location</div>
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

            // When direction is requested, start navigation
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