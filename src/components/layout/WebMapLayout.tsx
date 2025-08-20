import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createContext, useEffect, useMemo, useCallback, memo, useState, Suspense, lazy } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import WebMapNavs from "@/pages/webmap/WebMapNavs";
import { usePlots } from "@/hooks/plots-hooks/plot.hooks";
import { convertPlotToMarker } from "@/types/map.types";
import Spinner from "@/components/ui/spinner";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useValhalla } from "@/hooks/useValhalla";
import { ValhallaRoute } from "@/components/map/ValhallaRoute";
import { UserLocationMarker } from "@/components/map/UserLocationMarker";
import { NavigationInstructions } from "@/components/map/NavigationInstructions";
import MarkerClusterGroup from "react-leaflet-markercluster";

// Lazy load all marker components
const PlotMarkers = lazy(() => import("@/pages/webmap/PlotMarkers"));
const ComfortRoomMarker = lazy(() => import("@/pages/webmap/ComfortRoomMarkers"));
const ParkingMarkers = lazy(() => import("@/pages/webmap/ParkingMarkers"));
const CenterSerenityMarkers = lazy(() => import("@/pages/webmap/CenterSerenityMarkers"));
const MainEntranceMarkers = lazy(() => import("@/pages/webmap/MainEntranceMarkers"));
const ChapelMarkers = lazy(() => import("@/pages/webmap/ChapelMarkers"));
const PlaygroundMarkers = lazy(() => import("@/pages/webmap/PlaygroundMarkers"));

// 1. Set default icon for all markers once outside the component render cycle.
const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// 2. Memoize static marker components to prevent re-renders.
const MemoizedComfortRoomMarker = memo(ComfortRoomMarker);
const MemoizedParkingMarkers = memo(ParkingMarkers);
const MemoizedCenterSerenityMarkers = memo(CenterSerenityMarkers);
const MemoizedMainEntranceMarkers = memo(MainEntranceMarkers);
const MemoizedChapelMarkers = memo(ChapelMarkers);
const MemoizedPlaygroundMarkers = memo(PlaygroundMarkers);
const MemoizedPlotMarkers = memo(PlotMarkers);

export const LocateContext = createContext<{ requestLocate: () => void; clearRoute: () => void } | null>(null);

export default function MapPage() {
  const { isLoading, data: plotsData } = usePlots();
  // Memoize the markers array to prevent re-calculation on every render.
  const markers = useMemo(() => plotsData?.map(convertPlotToMarker) || [], [plotsData]);

  const {
    currentLocation,
    startTracking,
    stopTracking,
    getCurrentLocation,
    isTracking,
    error: locationError,
  } = useLocationTracking({
    enableHighAccuracy: true,
    distanceFilter: 5,
  });

  const {
    route,
    routeCoordinates,
    remainingCoordinates,
    originalStart,
    originalEnd,
    navigation,
    isNavigating,
    isRerouting,
    startNavigation,
    stopNavigation,
    handleLocationUpdate,
    totalDistance,
    totalTime,
    rerouteCount,
    error: routingError,
  } = useValhalla({
    costingType: "pedestrian",
    enableAutoReroute: true,
    offRouteThreshold: 25,
  });

  const [isNavigationInstructionsOpen, setIsNavigationInstructionsOpen] = useState(false);
  const [isDirectionLoading, setIsDirectionLoading] = useState(false);
  const [shouldCenterOnUser, setShouldCenterOnUser] = useState(false);

  const bounds: [[number, number], [number, number]] = [
    [10.247883800064669, 123.79691285546676],
    [10.249302749341647, 123.7988598710129],
  ];

  useEffect(() => {
    if (currentLocation && isNavigating) {
      handleLocationUpdate(currentLocation);
    }
  }, [currentLocation, isNavigating, handleLocationUpdate]);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  useEffect(() => {
    if (shouldCenterOnUser && currentLocation) {
      const timeoutId = setTimeout(() => setShouldCenterOnUser(false), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [shouldCenterOnUser, currentLocation]);

  // 4. Memoize callback functions to prevent them from being recreated on every render.
  const requestLocate = useCallback(() => {
    if (!isTracking) {
      startTracking();
    }
    setShouldCenterOnUser(true);
  }, [isTracking, startTracking]);

  const clearRoute = useCallback(() => {
    stopNavigation();
    setIsNavigationInstructionsOpen(false);
    setIsDirectionLoading(false);
  }, [stopNavigation]);

  const handleDirectionClick = useCallback(
    async (to: [number, number]) => {
      setIsDirectionLoading(true);
      setIsNavigationInstructionsOpen(false);
      try {
        let userLocation = currentLocation;
        if (!userLocation) {
          userLocation = await getCurrentLocation();
        }
        if (userLocation) {
          await startNavigation({ latitude: userLocation.latitude, longitude: userLocation.longitude }, { latitude: to[0], longitude: to[1] });
          requestLocate();
          setIsNavigationInstructionsOpen(true);
        }
      } catch (error) {
        console.error("🚫 Failed to start navigation:", error);
        if (!isTracking) startTracking();
      } finally {
        setIsDirectionLoading(false);
      }
    },
    [currentLocation, getCurrentLocation, isTracking, startNavigation, startTracking, requestLocate],
  );

  // 5. Memoize the context value to prevent consumers from re-rendering unnecessarily.
  const contextValue = useMemo(() => ({ requestLocate, clearRoute }), [requestLocate, clearRoute]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <LocateContext.Provider value={contextValue}>
      <div className="relative h-screen w-full">
        <WebMapNavs />

        <NavigationInstructions
          isOpen={isNavigationInstructionsOpen}
          onClose={clearRoute}
          navigationState={navigation}
          allManeuvers={route?.trip.legs[0]?.maneuvers || []}
          isNavigating={isNavigating}
          isRerouting={isRerouting}
          totalDistance={totalDistance || undefined}
          totalTime={totalTime || undefined}
          rerouteCount={rerouteCount}
        />

        {(locationError || routingError) && (
          <div className="absolute top-4 right-4 z-[999] max-w-sm">
            <div className="rounded-md border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">{locationError?.message || routingError || "Unknown error"}</p>
            </div>
          </div>
        )}

        <MapContainer className="h-full w-full" scrollWheelZoom={true} zoomControl={false} bounds={bounds} maxZoom={25} zoom={18}>
          <TileLayer url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxNativeZoom={18} maxZoom={25} />

          {!(route && routeCoordinates.length > 0) && (
            <UserLocationMarker userLocation={currentLocation} centerOnFirst={shouldCenterOnUser} enableAnimation={true} showAccuracyCircle={true} />
          )}

          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            {route && routeCoordinates.length > 0 && (
              <ValhallaRoute
                key={route.trip.summary.length}
                route={route}
                routeCoordinates={routeCoordinates}
                remainingCoordinates={remainingCoordinates}
                originalStart={originalStart || undefined}
                originalEnd={originalEnd || undefined}
                userLocation={currentLocation}
                isNavigating={isNavigating}
                showMarkers={true}
                fitBounds={!isNavigating}
              />
            )}
            <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={20}>
              <MemoizedComfortRoomMarker onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
              <MemoizedParkingMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
              <MemoizedPlaygroundMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
              <MemoizedCenterSerenityMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
              <MemoizedMainEntranceMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
              <MemoizedChapelMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
              <MemoizedPlotMarkers markers={markers as any} isDirectionLoading={isDirectionLoading} onDirectionClick={handleDirectionClick} />
            </MarkerClusterGroup>
          </Suspense>
        </MapContainer>
      </div>
    </LocateContext.Provider>
  );
}
