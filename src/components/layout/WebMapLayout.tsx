import { MdLocalParking } from "react-icons/md";
import { FaToilet } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createContext, useRef } from "react";
// Fix default icon paths so markers actually show up
import iconUrl from "leaflet/dist/images/marker-icon.png";
import { useEffect, useState, Suspense, lazy } from "react";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import { MapContainer, useMapEvents, TileLayer, Polyline, Marker, Popup } from "react-leaflet";

import WebMapNavs from "@/pages/webmap/WebMapNavs";
import { GiOpenGate } from "react-icons/gi";
import { BiSolidChurch } from "react-icons/bi";
import { XCircle, Route, Timer } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactLeafletDriftMarker from "react-leaflet-drift-marker";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardContent, Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { usePlots } from "@/hooks/plots-hooks/plot.hooks";
import { getCategoryBackgroundColor, convertPlotToMarker, getStatusColor } from "@/types/map.types";
import Spinner from "@/components/ui/spinner";
const ColumbariumPopup = lazy(() => import("@/pages/admin/map4admin/ColumbariumPopup"));
const PlotLocations = lazy(() => import("../../pages/webmap/WebMapPopup").then((mod) => ({ default: mod.PlotLocations })));

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconRetinaUrl,
});
L.Marker.prototype.options.icon = DefaultIcon;

// Context to signal a locate request from navs to map
export const LocateContext = createContext<{
  requestLocate: () => void;
} | null>(null);
// Route interface
interface RouteData {
  distance?: number;
  duration?: number;
  to: [number, number];
  from: [number, number];
  polyline: [number, number][];
}

export default function MapPage() {
  const bounds: [[number, number], [number, number]] = [
    [10.247883800064669, 123.79691285546676],
    [10.249302749341647, 123.7988598710129],
  ];

  // 🎣 All hooks must be called at the top level before any early returns
  const { isLoading, data: plotsData } = usePlots();
  const locateRef = useRef<(() => void) | null>(null);
  const [userPosition, setUserPosition] = useState<L.LatLng | null>(null);
  const [publicRoute, setPublicRoute] = useState<RouteData | null>(null);
  const [privateRoute, setPrivateRoute] = useState<RouteData | null>(null);
  const pendingDestinationRef = useRef<[number, number] | null>(null);
  const lastUserPositionRef = useRef<L.LatLng | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // 📊 Process data after hooks
  const markers = plotsData?.map(convertPlotToMarker) || [];
  // Cemetery entrance constant for routing
  const CEMETERY_GATE = L.latLng(10.248107820799307, 123.797607547609545);
  const CENTER_MAP = L.latLng(10.249306880563585, 123.797848311330114);
  const CR_MARKER = L.latLng(10.24864620598991, 123.798102525943648);
  const PLAYGROUND_1 = L.latLng(10.248972753171127, 123.79755735707532);
  const PLAYGROUND_2 = L.latLng(10.249180343704229, 123.798238818160755);
  const PARKING_1 = L.latLng(10.248467771138005, 123.797668761148387);
  const PARKING_2 = L.latLng(10.248150553375426, 123.797848903904878);

  // 🎣 Start live GPS tracking when navigation is active
  useEffect(() => {
    if (publicRoute || privateRoute) {
      startLiveTracking();
    } else {
      stopLiveTracking();
    }

    return () => {
      stopLiveTracking();
    };
  }, [publicRoute, privateRoute]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  function startLiveTracking() {
    if (!navigator.geolocation) {
      console.log("❌ navigator.geolocation not available. Cannot start live GPS tracking.");
      return;
    }
    if (watchIdRef.current) {
      console.log("⚠️ Live GPS tracking already started.");
      return;
    }

    console.log("📡 Starting live GPS tracking...");

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
        setUserPosition(newLatLng);

        // Check for drift and recalculate route if needed
        if (lastUserPositionRef.current && (publicRoute || privateRoute)) {
          const drift = newLatLng.distanceTo(lastUserPositionRef.current);
          if (drift > 30 && !isRecalculating) {
            console.log("🚧 User drifted > 30m, recalculating route...");
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
        console.warn("Live tracking error:", error);
      },
      {
        timeout: 5000,
        maximumAge: 1000,
        enableHighAccuracy: true,
      },
    );

    if (watchIdRef.current !== null) {
      console.log("✅ Successfully started live GPS tracking.");
    } else {
      console.log("❌ Failed to start live GPS tracking.");
    }
  }

  function stopLiveTracking() {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log("🛑 Stopped live GPS tracking");
    }
  }

  // Live GPS tracking and drift detection
  // 🛰️ Use DriftMarker for smooth user position transitions
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

    if (userPosition === null) return null;

    return (
      <ReactLeafletDriftMarker
        icon={L.divIcon({
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          className: "custom-user-marker",
          html: '<div style="background: #4285f4; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
        })}
        position={userPosition}
        duration={800}
      >
        <Popup>You are here</Popup>
      </ReactLeafletDriftMarker>
    );
  }

  // Fetch route polyline from OSRM API
  async function fetchRoutePolyline(
    from: [number, number],
    to: [number, number],
    type: "private" | "public",
  ): Promise<{
    polyline: [number, number][];
    distance: number;
    duration: number;
  }> {
    const serviceUrl = type === "private" ? "https://finisterreosm-production.up.railway.app/route/v1/foot" : "https://router.project-osrm.org/route/v1/foot";

    const url = `${serviceUrl}/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Route API error");

      const data = await response.json();
      if (!data.routes?.[0]) throw new Error("No route found");

      const route = data.routes[0];
      // Convert [lng,lat] to [lat,lng]
      const polyline: [number, number][] = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);

      return {
        polyline,
        distance: route.distance || 0,
        duration: route.duration || 0,
      };
    } catch (err) {
      console.warn(`Route API failed for ${type} route, using fallback:`, err);
      // Fallback: straight line with estimated distance/duration
      const distance = calculateDistance(from, to);
      return {
        distance,
        polyline: [from, to],
        duration: type === "private" ? distance / 1.4 : distance / 13.89, // Walking ~1.4 m/s, driving ~50 km/h
      };
    }
  }

  // Calculate distance between two points
  function calculateDistance(from: [number, number], to: [number, number]): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = ((to[0] - from[0]) * Math.PI) / 180;
    const dLng = ((to[1] - from[1]) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((from[0] * Math.PI) / 180) * Math.cos((to[0] * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
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
      const [publicRouteData, privateRouteData] = await Promise.all([fetchRoutePolyline(publicFrom, publicTo, "public"), fetchRoutePolyline(privateFrom, privateTo, "private")]);

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
        to: publicTo,
        from: publicFrom,
        polyline: publicRouteData.polyline,
        distance: publicRouteData.distance,
        duration: publicRouteData.duration,
      });

      setPrivateRoute({
        to: privateTo,
        from: privateFrom,
        polyline: privateRouteData.polyline,
        distance: privateRouteData.distance,
        duration: privateRouteData.duration,
      });

      lastUserPositionRef.current = userLatLng;
      console.log("✅ Navigation routes calculated successfully");
    } catch (error) {
      console.error("Navigation error:", error);
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
      return Math.round(meters) + "m";
    } else {
      return (meters / 1000).toFixed(1) + "km";
    }
  };

  return (
    <LocateContext.Provider value={{ requestLocate }}>
      <div className="relative h-screen w-full">
        <WebMapNavs />

        {/* Navigation Control Panel */}
        {(publicRoute || privateRoute) && (
          <div className="absolute top-6 left-1/2 z-[9999] flex -translate-x-1/2 flex-col items-center gap-4 md:top-20 lg:top-20">
            {/* Route Info */}
            <Card className="flex min-w-[230px] rounded-xl border border-stone-200 bg-white/90 py-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-stone-700 dark:bg-stone-800/90">
              <CardContent className="flex w-full flex-col items-center px-4 py-2">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/30">
                      <Route className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{formatDistance(totalDistance)}</span>
                  </div>

                  <div className="h-5 w-px bg-stone-300 dark:bg-stone-600"></div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/30">
                      <Timer className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{Math.round(totalDuration / 60)} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stop Navigation Button */}
            <Button
              className="flex transform items-center gap-2 rounded-xl px-6 py-3 shadow-md transition-all duration-300 hover:scale-105 hover:bg-red-700"
              onClick={handleStopNavigation}
              aria-label="Stop Navigation"
              variant="destructive"
            >
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Stop Navigation</span>
            </Button>
          </div>
        )}

        {/* Recalculating Indicator */}
        {isRecalculating && (
          <div className="absolute top-28 left-1/2 z-[9999] -translate-x-1/2">
            <span className="rounded bg-yellow-200 px-4 py-2 text-yellow-900 shadow">🚧 Recalculating route...</span>
          </div>
        )}

        <MapContainer className="h-full w-full" scrollWheelZoom={true} zoomControl={false} bounds={bounds} maxZoom={25} zoom={18}>
          <TileLayer url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxNativeZoom={18} maxZoom={25} />
          <LocationMarker />
          {/* Show public route polyline (user to gate) - Blue */}
          {publicRoute && (
            <Polyline
              pathOptions={{
                weight: 8,
                opacity: 1,
                color: "#4285F4",
                lineCap: "round",
                lineJoin: "round",
              }}
              positions={publicRoute.polyline}
              className="animate-glow-pulse"
            />
          )}

          {/* Show private route polyline (gate to marker) - Green */}
          {privateRoute && (
            <Polyline
              pathOptions={{
                weight: 8,
                opacity: 1,
                color: "#34A853",
                lineCap: "round",
                lineJoin: "round",
                dashArray: "10, 10",
              }}
              className="animate-dash-flow z-99999"
              positions={privateRoute.polyline}
            />
          )}

          {/* Cemetery Entrance Marker */}
          <Marker
            icon={L.divIcon({
              iconSize: [32, 32],
              className: "destination-marker",
              html: renderToStaticMarkup(
                <div
                  style={{
                    padding: "4px",
                    background: "#000000",
                    display: "inline-block",
                    border: "2px solid #fff",
                    transform: "rotate(-45deg)",
                    borderRadius: "50% 50% 50% 0",
                    boxShadow: "0 0 8px rgba(0,0,0,0.15)",
                  }}
                >
                  <GiOpenGate
                    style={{
                      transform: "rotate(45deg)",
                    }}
                    className="z-999 text-white"
                    strokeWidth={2.5}
                    size={16}
                  />
                </div>,
              ),
            })}
            position={[CEMETERY_GATE.lat, CEMETERY_GATE.lng]}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-orange-600">🚪 Fnisterre Main Entrance</div>
                <div className="mt-1 text-xs text-gray-500">Entry point for Fnisterre visitors</div>
              </div>
            </Popup>
          </Marker>

          {/* PLAYGROUND_1 */}
          <Marker
            icon={L.divIcon({
              iconSize: [32, 32],
              className: "destination-marker",
              html: renderToStaticMarkup(
                <div
                  style={{
                    display: "inline-block",
                    border: "1px solid #000",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg"
                    style={{
                      display: "block",
                      width: "32px",
                      height: "32px",
                    }}
                  />
                </div>,
              ),
            })}
            position={[PLAYGROUND_1.lat, PLAYGROUND_1.lng]}
          >
            <Popup maxWidth={350} className="leaflet-theme-popup p-0">
              <div className="w-[220px]">
                <CardHeader className="p-0">
                  <img
                    src="https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg"
                    alt="Cemetery Gate"
                    className="h-32 w-full rounded-md object-cover"
                  />
                </CardHeader>
                <CardContent className="p-3">
                  <CardTitle className="text-sm font-bold text-orange-600">Playground 1</CardTitle>
                  <CardDescription className="mt-1 text-xs text-gray-500">Playground for visitors</CardDescription>
                </CardContent>
              </div>
            </Popup>
          </Marker>

          <Marker
            icon={L.divIcon({
              iconSize: [32, 32],
              className: "destination-marker",
              html: renderToStaticMarkup(
                <div
                  style={{
                    display: "inline-block",
                    border: "1px solid #000",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg"
                    style={{
                      display: "block",
                      width: "32px",
                      height: "32px",
                    }}
                  />
                </div>,
              ),
            })}
            position={[PLAYGROUND_2.lat, PLAYGROUND_2.lng]}
          >
            <Popup maxWidth={350} className="leaflet-theme-popup p-0">
              <div className="w-[220px]">
                <CardHeader className="p-0">
                  <img
                    src="https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg"
                    alt="Cemetery Gate"
                    className="h-32 w-full rounded-md object-cover"
                  />
                </CardHeader>
                <CardContent className="p-3">
                  <CardTitle className="text-sm font-bold text-orange-600">Playground 2</CardTitle>
                  <CardDescription className="mt-1 text-xs text-gray-500">Playground for visitors</CardDescription>
                </CardContent>
              </div>
            </Popup>
          </Marker>

          <Marker
            icon={L.divIcon({
              iconSize: [32, 32],
              className: "destination-marker",
              html: renderToStaticMarkup(
                <div
                  style={{
                    padding: "4px",
                    background: "#2563EB",
                    display: "inline-block",
                    border: "2px solid #fff",
                    transform: "rotate(-45deg)",
                    borderRadius: "50% 50% 50% 0",
                    boxShadow: "0 0 8px rgba(0,0,0,0.15)",
                  }}
                >
                  <MdLocalParking
                    style={{
                      transform: "rotate(45deg)",
                    }}
                    className="z-999 text-white"
                    size={16}
                  />
                </div>,
              ),
            })}
            position={[PARKING_1.lat, PARKING_1.lng]}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-orange-600">🚪 Parking 1</div>
                <div className="mt-1 text-xs text-gray-500">Parking 1 for finisterre visitors</div>
              </div>
            </Popup>
          </Marker>

          <Marker
            icon={L.divIcon({
              iconSize: [32, 32],
              className: "destination-marker",
              html: renderToStaticMarkup(
                <div
                  style={{
                    padding: "4px",
                    background: "#2563EB",
                    display: "inline-block",
                    border: "2px solid #fff",
                    transform: "rotate(-45deg)",
                    borderRadius: "50% 50% 50% 0",
                    boxShadow: "0 0 8px rgba(0,0,0,0.15)",
                  }}
                >
                  <MdLocalParking
                    style={{
                      transform: "rotate(45deg)",
                    }}
                    className="z-999 text-white"
                    size={16}
                  />
                </div>,
              ),
            })}
            position={[PARKING_2.lat, PARKING_2.lng]}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-orange-600">🚪 Parking 2</div>
                <div className="mt-1 text-xs text-gray-500">Parking 2 for finisterre visitors</div>
              </div>
            </Popup>
          </Marker>

          <Marker
            icon={L.divIcon({
              iconSize: [32, 32],
              className: "destination-marker",
              html: renderToStaticMarkup(
                <div
                  style={{
                    padding: "4px",
                    background: "#059669",
                    display: "inline-block",
                    border: "2px solid #fff",
                    transform: "rotate(-45deg)",
                    borderRadius: "50% 50% 50% 0",
                    boxShadow: "0 0 8px rgba(0,0,0,0.15)",
                  }}
                >
                  <FaToilet
                    style={{
                      transform: "rotate(45deg)",
                    }}
                    className="z-999 text-white"
                    strokeWidth={2.5}
                    size={16}
                  />
                </div>,
              ),
            })}
            position={[CR_MARKER.lat, CR_MARKER.lng]}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-orange-600">🚻 Comfort Room</div>
                <div className="mt-1 text-xs text-gray-500">Comfort room for boys and girls</div>
              </div>
            </Popup>
          </Marker>

          {/* Center Marker */}
          <Marker
            icon={L.divIcon({
              iconSize: [32, 32],
              className: "destination-marker",
              html: renderToStaticMarkup(
                <div
                  style={{
                    display: "inline-block",
                    border: "1px solid #000",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/djrkvgfvo/image/upload/v1755253760/Finisterre-Gardenz-columbarium_ewopci.png"
                    style={{
                      display: "block",
                      width: "32px",
                      height: "32px",
                    }}
                  />
                </div>,
              ),
            })}
            position={[CENTER_MAP.lat, CENTER_MAP.lng]}
          >
            <Popup maxWidth={350} className="leaflet-theme-popup p-0">
              <div className="w-[220px]">
                <CardHeader className="p-0">
                  <img
                    src="https://res.cloudinary.com/djrkvgfvo/image/upload/v1755253760/Finisterre-Gardenz-columbarium_ewopci.png"
                    alt="Cemetery Gate"
                    className="h-32 w-full rounded-md object-cover"
                  />
                </CardHeader>
                <CardContent className="p-3">
                  <CardTitle className="text-sm font-bold text-orange-600">Title</CardTitle>
                  <CardDescription className="mt-1 text-xs text-gray-500">Sample description </CardDescription>
                </CardContent>
              </div>
            </Popup>
          </Marker>

          {/* Cemetery Exit Marker */}
          <Marker
            icon={L.divIcon({
              iconSize: [32, 32],
              className: "destination-marker",
              html: renderToStaticMarkup(
                <div
                  style={{
                    padding: "4px",
                    background: "#000000",
                    display: "inline-block",
                    border: "2px solid #fff",
                    transform: "rotate(-45deg)",
                    borderRadius: "50% 50% 50% 0",
                    boxShadow: "0 0 8px rgba(0,0,0,0.15)",
                  }}
                >
                  <GiOpenGate
                    style={{
                      transform: "rotate(45deg)",
                    }}
                    className="z-999 text-white"
                    strokeWidth={2.5}
                    size={16}
                  />
                </div>,
              ),
            })}
            position={[10.248166481872728, 123.79754558858059]}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-orange-600">🚪 Finisterre Main Entrance</div>
                <div className="mt-1 text-xs text-gray-500">Entry point for Fnisterre visitors</div>
              </div>
            </Popup>
          </Marker>

          {/* Cemetery Chapel Marker */}
          <Marker
            icon={L.divIcon({
              iconSize: [32, 32],
              className: "destination-marker",
              html: renderToStaticMarkup(
                <div
                  style={{
                    padding: "4px",
                    background: "#FF9800",
                    display: "inline-block",
                    border: "2px solid #fff",
                    transform: "rotate(-45deg)",
                    borderRadius: "50% 50% 50% 0",
                    boxShadow: "0 0 8px rgba(0,0,0,0.15)",
                  }}
                >
                  <BiSolidChurch
                    style={{
                      transform: "rotate(45deg)",
                    }}
                    className="z-999 text-white"
                    strokeWidth={2.5}
                    size={16}
                  />
                </div>,
              ),
            })}
            position={[10.248435228156183, 123.79787795587316]}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-orange-600">🚪 Chapel</div>
                <div className="mt-1 text-xs text-gray-500">Entry point for chapel visitors</div>
              </div>
            </Popup>
          </Marker>

          {markers.map((markers: any) => {
            const statusColor = getStatusColor(markers.plotStatus);
            const circleIcon = L.divIcon({
              className: "",
              iconSize: [24, 24],
              html: `
              <div style="width: 20px; height: 20px; border-radius: 50%; background: ${statusColor}; border: 2px solid #fff;"></div>`,
            });

            // When direction is requested, start navigation with two-step route
            const handleDirectionClick = () => {
              if (userPosition) {
                handleStartNavigation(userPosition, markers.position as [number, number]);
              } else {
                pendingDestinationRef.current = markers.position as [number, number];
                if (locateRef.current) locateRef.current();
              }
            };

            return (
              <Marker key={`plot-${markers.plot_id}`} position={markers.position} icon={circleIcon}>
                {markers.rows && markers.columns ? (
                  // Memorial Chambers Popup
                  <Popup className="leaflet-theme-popup" offset={[-2, 5]} minWidth={450} closeButton={false}>
                    <div className="w-full py-2">
                      <Suspense
                        fallback={
                          <>
                            <Skeleton className="mb-2 h-[24px] w-full rounded" />
                            <Skeleton className="mb-2 h-[18px] w-full rounded" />
                            <Skeleton className="mb-3 h-[200px] w-full rounded" />
                            <Skeleton className="h-[36px] w-full rounded" />
                          </>
                        }
                      >
                        <ColumbariumPopup onDirectionClick={handleDirectionClick} marker={markers} />
                      </Suspense>
                    </div>
                  </Popup>
                ) : (
                  // Serenity Lawn Popup
                  <Popup className="leaflet-theme-popup" offset={[-2, 5]} minWidth={250} closeButton={false}>
                    <Suspense
                      fallback={
                        <>
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <Skeleton className="h-[40px] w-full rounded" />
                            <Skeleton className="h-[40px] w-full rounded" />
                            <Skeleton className="h-[40px] w-full rounded" />
                          </div>
                          <div className="mb-3">
                            <div className="mb-2 flex items-center">
                              <Skeleton className="h-[40px] w-full rounded" />
                            </div>
                            <div className="mb-2 flex items-center">
                              <Skeleton className="h-[40px] w-full rounded" />
                            </div>
                            <div className="mb-2 flex items-center">
                              <Skeleton className="h-[40px] w-full rounded" />
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="mb-2 flex items-center">
                              <Skeleton className="h-[60px] w-full rounded" />
                            </div>
                          </div>
                        </>
                      }
                    >
                      <PlotLocations backgroundColor={getCategoryBackgroundColor(markers.category)} onDirectionClick={handleDirectionClick} marker={markers} />
                    </Suspense>
                  </Popup>
                )}
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </LocateContext.Provider>
  );
}
