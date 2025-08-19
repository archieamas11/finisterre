import { BsFillStopCircleFill } from "react-icons/bs";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createContext, useRef } from "react";
import { useState, Suspense, lazy } from "react";
import { MapContainer, useMapEvents, TileLayer, Marker, Popup } from "react-leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import WebMapNavs from "@/pages/webmap/WebMapNavs";
import ReactLeafletDriftMarker from "react-leaflet-drift-marker";
import { usePlots } from "@/hooks/plots-hooks/plot.hooks";
import { getCategoryBackgroundColor, convertPlotToMarker, getStatusColor } from "@/types/map.types";
import Spinner from "@/components/ui/spinner";
import RoutingMachine from "./RoutingMachine";
import ColumbariumPopup from "@/pages/admin/map4admin/ColumbariumPopup";
import PlotLocations from "@/pages/webmap/WebMapPopup";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Route as RouteIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
const PlaygroundMarkers = lazy(() => import("@/pages/webmap/PlaygroundMarkers"));
const ComfortRoomMarker = lazy(() => import("@/pages/webmap/ComfortRoomMarkers"));
const ParkingMarkers = lazy(() => import("@/pages/webmap/ParkingMarkers"));
const CenterSerenityMarkers = lazy(() => import("@/pages/webmap/CenterSerenityMarkers"));
const MainEntranceMarkers = lazy(() => import("@/pages/webmap/MainEntranceMarkers"));
const ChapelMarkers = lazy(() => import("@/pages/webmap/ChapelMarkers"));

export const LocateContext = createContext<{ requestLocate: () => void; clearRoute: () => void } | null>(null);
export default function MapPage() {
  const { isLoading, data: plotsData } = usePlots();
  const markers = plotsData?.map(convertPlotToMarker) || [];
  const locateRef = useRef<(() => void) | null>(null);
  const [userPosition, setUserPosition] = useState<L.LatLng | null>(null);
  const [route, setRoute] = useState<{ from: [number, number]; to: [number, number] } | null>(null);
  const [isDirectionLoading, setIsDirectionLoading] = useState(false);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const [routeInfo, setRouteInfo] = useState<any | null>(null);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const pendingDestinationRef = useRef<[number, number] | null>(null);
  const bounds: [[number, number], [number, number]] = [
    [10.247883800064669, 123.79691285546676],
    [10.249302749341647, 123.7988598710129],
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  const customIcon = L.divIcon({
    className: "custom-user-marker",
    html: '<div aria-label="Your location" role="img" style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:2px solid #fff;box-shadow:0 0 0 4px rgba(59,130,246,0.25)"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  // 🎯 Icon color should be per-marker; compute inside the map loop below

  function LocationMarker() {
    const map = useMapEvents({
      locationfound(e) {
        setUserPosition(e.latlng);
        if (pendingDestinationRef.current) {
          setRoute({
            from: [e.latlng.lat, e.latlng.lng],
            to: pendingDestinationRef.current,
          });
          pendingDestinationRef.current = null;
          setIsDirectionLoading(false);
        }
      },
      locationerror() {
        pendingDestinationRef.current = null;
        setIsDirectionLoading(false);
      },
    });
    locateRef.current = () => {
      map.locate({ enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
    };
    return userPosition === null ? null : (
      <ReactLeafletDriftMarker position={userPosition} duration={800} icon={customIcon}>
        <Popup>You are here</Popup>
      </ReactLeafletDriftMarker>
    );
  }

  const requestLocate = () => {
    if (locateRef.current) locateRef.current();
  };

  const clearRoute = () => {
    setRoute(null);
    setRouteInfo(null);
    setIsDirectionLoading(false);
    setIsDirectionsOpen(false);
    pendingDestinationRef.current = null;
  };

  // [lat, lng]
  function handleDirectionClick(to: [number, number]) {
    // 🚦 Guard: If requesting directions to the same destination from the same origin, just reopen the drawer
    if (route && route.to[0] === to[0] && route.to[1] === to[1] && userPosition && route.from[0] === userPosition.lat && route.from[1] === userPosition.lng) {
      setIsDirectionsOpen(true);
      return;
    }

    // 🧹 Always clear any existing route state first
    clearRoute();

    // ⏱️ Small delay to allow previous routing machine to cleanup properly
    setTimeout(() => {
      setIsDirectionLoading(true);

      if (userPosition) {
        setRoute({ from: [userPosition.lat, userPosition.lng], to });
        return;
      }

      // Store destination and trigger location request
      pendingDestinationRef.current = to;
      if (locateRef.current) locateRef.current();
    }, 100);
  }

  const onRouteFound = (foundRoute?: any) => {
    setIsDirectionLoading(false);
    if (foundRoute) {
      setRouteInfo(foundRoute);
      setIsDirectionsOpen(true);
      setShowAllSteps(false);
    }
  };

  const onRouteError = () => {
    setIsDirectionLoading(false);
    // ⚠️ Could show error message to user here
  };

  return (
    <LocateContext.Provider value={{ requestLocate, clearRoute }}>
      <div className="relative h-screen w-full">
        <WebMapNavs />
        <MapContainer className="h-full w-full" scrollWheelZoom={true} zoomControl={false} bounds={bounds} maxZoom={25} zoom={18}>
          <TileLayer url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxNativeZoom={18} maxZoom={25} />
          <LocationMarker />
          {route && (
            <RoutingMachine key={`${route.from.join(",")}-${route.to.join(",")}`} from={route.from} to={route.to} onRouteFound={onRouteFound} onRouteError={onRouteError} />
          )}
          {/* Markers */}
          <Suspense fallback={null}>
            <ComfortRoomMarker onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <ParkingMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <PlaygroundMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <CenterSerenityMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <MainEntranceMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <ChapelMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            {/* Plot Markers | Serinity Lawn, Columbarium and Memorial Chambers*/}
            {markers.map((markers: any) => {
              const statusColor = getStatusColor(markers.plotStatus);
              const circleIcon = L.divIcon({
                className: "",
                iconSize: [24, 24],
                html: `<div style="width: 15px; height: 15px; border-radius: 50%; background: ${statusColor}; border: 1px solid #fff;"></div>`,
              });
              const onDirectionClick = () => handleDirectionClick(markers.position as [number, number]);
              return (
                <Marker key={`plot-${markers.plot_id}`} position={markers.position} icon={circleIcon}>
                  {markers.rows && markers.columns ? (
                    // Memorial Chambers Popup
                    <Popup className="leaflet-theme-popup" offset={[-2, 5]} minWidth={450} closeButton={false}>
                      <div className="w-full py-2">
                        <ColumbariumPopup onDirectionClick={onDirectionClick} isDirectionLoading={isDirectionLoading} marker={markers} />
                      </div>
                    </Popup>
                  ) : (
                    // Serenity Lawn Popup
                    <Popup className="leaflet-theme-popup" offset={[-2, 5]} minWidth={250} closeButton={false}>
                      <PlotLocations
                        backgroundColor={getCategoryBackgroundColor(markers.category)}
                        onDirectionClick={onDirectionClick}
                        isDirectionLoading={isDirectionLoading}
                        marker={markers}
                      />
                    </Popup>
                  )}
                </Marker>
              );
            })}
          </Suspense>
        </MapContainer>

        {/* Directions Card (mobile) */}
        {isDirectionsOpen && (
          <Card className="rounded-t-5xl fixed right-0 bottom-0 left-0 z-[9999] max-h-[75vh] overflow-auto rounded-br-none rounded-bl-none shadow-lg md:hidden">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                <div className="flex items-center gap-2">
                  <RouteIcon className="size-4" /> Directions
                </div>
                <Button
                  variant="destructive"
                  size={"icon"}
                  onClick={() => {
                    clearRoute();
                    setIsDirectionsOpen(false);
                  }}
                >
                  <BsFillStopCircleFill />
                </Button>
              </CardTitle>
              {routeInfo?.summary ? (
                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-4" />
                    <span className="sr-only">Distance:</span>
                    {formatDistance(routeInfo.summary.totalDistance)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-4" />
                    <span className="sr-only">Duration:</span>
                    {formatDuration(routeInfo.summary.totalTime)}
                  </span>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Turn-by-turn navigation</p>
              )}
            </CardHeader>
            <CardContent className="pt-2">
              <ol className="max-h-[50vh] space-y-2 overflow-y-auto pr-1" aria-label="Route instructions">
                {(showAllSteps ? (routeInfo?.instructions ?? []) : (routeInfo?.instructions?.slice(0, 2) ?? [])).map((ins: any, idx: number) => (
                  <li key={`m-step-${idx}`} className="flex gap-3 rounded-md border p-3">
                    <div className="text-muted-foreground mt-0.5 min-w-6 text-right tabular-nums">{idx + 1}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{ins?.text ?? "Follow the route"}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatDistance(ins?.distance)} • {formatDuration(ins?.time)}
                      </p>
                    </div>
                  </li>
                ))}
                {(!routeInfo?.instructions || routeInfo.instructions.length === 0) && <li className="text-muted-foreground text-sm">No instructions available for this route.</li>}
              </ol>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {routeInfo?.instructions && routeInfo.instructions.length > 2 && (
                  <Button variant="outline" onClick={() => setShowAllSteps((v) => !v)}>
                    {showAllSteps ? "Show first 2" : `Show all (${routeInfo.instructions.length})`}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        )}

        {/* Directions Card (desktop/tablet) */}
        {isDirectionsOpen && (
          <div className="pointer-events-auto absolute top-8 left-8 z-[9999] hidden w-[min(420px,92vw)] md:block">
            <Card className="shadow-lg">
              <CardHeader className="space-y-1 pb-2">
                <CardTitle className="flex items-center justify-between gap-2 text-base">
                  <div className="flex items-center gap-2">
                    <RouteIcon className="size-4" /> Directions
                  </div>
                  <Button
                    variant="destructive"
                    size={"icon"}
                    onClick={() => {
                      clearRoute();
                      setIsDirectionsOpen(false);
                    }}
                  >
                    <BsFillStopCircleFill />
                  </Button>
                </CardTitle>
                {routeInfo?.summary ? (
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-5" />
                      <span className="sr-only">Distance:</span>
                      {formatDistance(routeInfo.summary.totalDistance)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-5" />
                      <span className="sr-only">Duration:</span>
                      {formatDuration(routeInfo.summary.totalTime)}
                    </span>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs">Turn-by-turn navigation</p>
                )}
              </CardHeader>
              <ol className="max-h-[50vh] space-y-2 overflow-y-auto px-5" aria-label="Route instructions">
                {(routeInfo?.instructions ?? []).map((ins: any, idx: number) => (
                  <li key={`d-step-${idx}`} className="flex gap-3 rounded-md border p-3">
                    <div className="text-muted-foreground mt-0.5 min-w-6 text-right tabular-nums">{idx + 1}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{ins?.text ?? "Follow the route"}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatDistance(ins?.distance)} • {formatDuration(ins?.time)}
                      </p>
                    </div>
                  </li>
                ))}
                {(!routeInfo?.instructions || routeInfo.instructions.length === 0) && <li className="text-muted-foreground text-sm">No instructions available for this route.</li>}
              </ol>
            </Card>
          </div>
        )}
      </div>
    </LocateContext.Provider>
  );
}

function formatDistance(meters?: number): string {
  // 📏 Prefer km for long distances
  if (!Number.isFinite(meters)) return "-";
  if ((meters ?? 0) >= 1000) return `${(meters! / 1000).toFixed(1)} km`;
  return `${Math.round(meters!)} m`;
}

function formatDuration(seconds?: number): string {
  // ⏱️ Human readable mm:ss or h:mm
  if (!Number.isFinite(seconds)) return "-";
  const s = Math.round(seconds!);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
