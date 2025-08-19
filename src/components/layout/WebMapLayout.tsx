import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createContext, useRef, useEffect } from "react";
import { useState, Suspense, lazy } from "react";
import { MapContainer, useMapEvents, TileLayer, Popup } from "react-leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import WebMapNavs from "@/pages/webmap/WebMapNavs";
import ReactLeafletDriftMarker from "react-leaflet-drift-marker";
import { usePlots } from "@/hooks/plots-hooks/plot.hooks";
import { convertPlotToMarker } from "@/types/map.types";
import Spinner from "@/components/ui/spinner";
import RoutingMachine from "./RoutingMachine";
const PlotMarkers = lazy(() => import("@/pages/webmap/PlotMarkers"));
const DirectionsCard = lazy(() => import("@/components/map/DirectionsCard"));
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
  const [isRerouting, setIsRerouting] = useState(false);
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const pendingDestinationRef = useRef<[number, number] | null>(null);
  const bounds: [[number, number], [number, number]] = [
    [10.247883800064669, 123.79691285546676],
    [10.249302749341647, 123.7988598710129],
  ];

  // Initialize Leaflet default icon
  useEffect(() => {
    const DefaultIcon = L.icon({
      iconUrl,
      iconRetinaUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  const customIcon = L.divIcon({
    className: "custom-user-marker",
    html: '<div aria-label="Your location" role="img" style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:2px solid #fff;box-shadow:0 0 0 4px rgba(59,130,246,0.25)"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  // Location marker component - defined inside to use hooks properly
  const LocationMarker = () => {
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

    useEffect(() => {
      locateRef.current = () => {
        map.locate({ enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
      };
    }, [map]);

    return userPosition === null ? null : (
      <ReactLeafletDriftMarker position={userPosition} duration={800} icon={customIcon}>
        <Popup>You are here</Popup>
      </ReactLeafletDriftMarker>
    );
  };

  // Start/stop position tracking based on route status
  useEffect(() => {
    if (route) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition(L.latLng(latitude, longitude));
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 5000,
        },
      );
      setWatchId(id);
    } else if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [route]);

  // Calculate distance from user to route
  const calculateDistanceToRoute = (userPos: L.LatLng, coords: [number, number][]): number => {
    if (!coords || coords.length < 2) return Infinity;

    let minDistance = Infinity;
    const userPoint = L.latLng(userPos);

    for (let i = 0; i < coords.length - 1; i++) {
      const start = L.latLng(coords[i]);
      const end = L.latLng(coords[i + 1]);

      const distance = distanceToSegment(userPoint, start, end);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }

    return minDistance;
  };

  const distanceToSegment = (point: L.LatLng, start: L.LatLng, end: L.LatLng): number => {
    const segmentLength = start.distanceTo(end);
    if (segmentLength === 0) return point.distanceTo(start);

    // Calculate projection factor (0 to 1)
    const t = Math.max(0, Math.min(1, ((point.lat - start.lat) * (end.lat - start.lat) + (point.lng - start.lng) * (end.lng - start.lng)) / (segmentLength * segmentLength)));

    // Find the closest point on the segment
    const projection = L.latLng(start.lat + t * (end.lat - start.lat), start.lng + t * (end.lng - start.lng));

    return point.distanceTo(projection);
  };

  // Check for route deviation and trigger reroute
  useEffect(() => {
    if (!userPosition || !route || !routeCoords || isRerouting) return;

    const distance = calculateDistanceToRoute(userPosition, routeCoords);

    if (distance > 20) {
      setIsRerouting(true);
      setRoute({
        from: [userPosition.lat, userPosition.lng],
        to: route.to,
      });
    }
  }, [userPosition, routeCoords, route, isRerouting]);

  // Update route coordinates when route info changes
  useEffect(() => {
    if (routeInfo?.coordinates) {
      setRouteCoords(routeInfo.coordinates);
    } else {
      setRouteCoords(null);
    }
  }, [routeInfo]);

  const requestLocate = () => {
    if (locateRef.current) locateRef.current();
  };

  const clearRoute = () => {
    setRoute(null);
    setRouteInfo(null);
    setRouteCoords(null);
    setIsDirectionLoading(false);
    setIsDirectionsOpen(false);
    setIsRerouting(false);
    pendingDestinationRef.current = null;
  };

  const handleDirectionClick = (to: [number, number]) => {
    if (route && route.to[0] === to[0] && route.to[1] === to[1] && userPosition && route.from[0] === userPosition.lat && route.from[1] === userPosition.lng) {
      setIsDirectionsOpen(true);
      return;
    }

    clearRoute();

    setTimeout(() => {
      setIsDirectionLoading(true);
      if (userPosition) {
        setRoute({ from: [userPosition.lat, userPosition.lng], to });
        return;
      }
      pendingDestinationRef.current = to;
      if (locateRef.current) locateRef.current();
    }, 100);
  };

  const onRouteFound = (foundRoute?: any) => {
    setIsDirectionLoading(false);
    setIsRerouting(false);
    if (foundRoute) {
      setRouteInfo(foundRoute);
      setIsDirectionsOpen(true);
    }
  };

  const onRouteError = () => {
    setIsDirectionLoading(false);
    setIsRerouting(false);
  };

  // Early return for loading state must come after all hooks
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

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
          <Suspense fallback={null}>
            <ComfortRoomMarker onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <ParkingMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <PlaygroundMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <CenterSerenityMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <MainEntranceMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <ChapelMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <PlotMarkers markers={markers as any} isDirectionLoading={isDirectionLoading} onDirectionClick={(to) => handleDirectionClick(to)} />
            <DirectionsCard
              isOpen={isDirectionsOpen}
              onClose={() => {
                clearRoute();
                setIsDirectionsOpen(false);
              }}
              routeInfo={routeInfo}
            />
          </Suspense>
        </MapContainer>
      </div>
    </LocateContext.Provider>
  );
}
