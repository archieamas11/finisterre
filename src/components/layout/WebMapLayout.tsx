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
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useValhalla } from "@/hooks/useValhalla";
import { ValhallaRoute } from "@/components/map/ValhallaRoute";
import { NavigationInstructions } from "@/components/map/NavigationInstructions";
const PlotMarkers = lazy(() => import("@/pages/webmap/PlotMarkers"));
const ComfortRoomMarker = lazy(() => import("@/pages/webmap/ComfortRoomMarkers"));
const ParkingMarkers = lazy(() => import("@/pages/webmap/ParkingMarkers"));
const CenterSerenityMarkers = lazy(() => import("@/pages/webmap/CenterSerenityMarkers"));
const MainEntranceMarkers = lazy(() => import("@/pages/webmap/MainEntranceMarkers"));
const ChapelMarkers = lazy(() => import("@/pages/webmap/ChapelMarkers"));
const PlaygroundMarkers = lazy(() => import("@/pages/webmap/PlaygroundMarkers"));

export const LocateContext = createContext<{ requestLocate: () => void; clearRoute: () => void } | null>(null);

export default function MapPage() {
  const { isLoading, data: plotsData } = usePlots();
  const markers = plotsData?.map(convertPlotToMarker) || [];

  // 🧭 Location tracking
  const {
    currentLocation,
    startTracking,
    stopTracking,
    getCurrentLocation,
    isTracking,
    error: locationError,
  } = useLocationTracking({
    enableHighAccuracy: true,
    distanceFilter: 5, // 📏 5 meters minimum distance
  });

  // 🗺️ Valhalla routing
  const {
    route,
    routeCoordinates,
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
    costingType: "pedestrian", // 🚶 Default to walking
    enableAutoReroute: true,
    offRouteThreshold: 25, // 📏 25 meters off-route threshold
  });

  const [isNavigationInstructionsOpen, setIsNavigationInstructionsOpen] = useState(false);
  const [isDirectionLoading, setIsDirectionLoading] = useState(false);
  const locateRef = useRef<(() => void) | null>(null);

  const bounds: [[number, number], [number, number]] = [
    [10.247883800064669, 123.79691285546676],
    [10.249302749341647, 123.7988598710129],
  ];

  // 📍 Handle location updates for navigation
  useEffect(() => {
    if (currentLocation && isNavigating) {
      handleLocationUpdate(currentLocation);
    }
  }, [currentLocation, isNavigating, handleLocationUpdate]);

  // 🧹 Cleanup tracking on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

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

  const requestLocate = () => {
    if (locateRef.current) locateRef.current();
  };

  const clearRoute = () => {
    stopNavigation();
    setIsNavigationInstructionsOpen(false);
    setIsDirectionLoading(false);
  };

  // 🎯 Handle direction requests from markers
  async function handleDirectionClick(to: [number, number]) {
    try {
      setIsDirectionLoading(true);
      setIsNavigationInstructionsOpen(false);

      let userLocation = currentLocation;

      // 📍 Get current location if not available
      if (!userLocation) {
        try {
          userLocation = await getCurrentLocation();
        } catch (error) {
          console.error("🚫 Failed to get location:", error);
          // 🚨 Fall back to tracking
          if (!isTracking) {
            startTracking();
          }
          setIsDirectionLoading(false);
          return;
        }
      }

      // � Start navigation
      await startNavigation({ latitude: userLocation.latitude, longitude: userLocation.longitude }, { latitude: to[0], longitude: to[1] });

      setIsNavigationInstructionsOpen(true);
      setIsDirectionLoading(false);
    } catch (error) {
      console.error("🚫 Failed to start navigation:", error);
      setIsDirectionLoading(false);
    }
  }

  return (
    <LocateContext.Provider value={{ requestLocate, clearRoute }}>
      <div className="relative h-screen w-full">
        <WebMapNavs />

        {/* 🧭 Navigation Instructions */}
        <NavigationInstructions
          isOpen={isNavigationInstructionsOpen}
          onClose={() => {
            clearRoute();
            setIsNavigationInstructionsOpen(false);
          }}
          navigationState={navigation}
          allManeuvers={route?.trip.legs[0]?.maneuvers || []}
          isNavigating={isNavigating}
          isRerouting={isRerouting}
          totalDistance={totalDistance || undefined}
          totalTime={totalTime || undefined}
          rerouteCount={rerouteCount}
        />

        {/* 🚨 Error notifications */}
        {(locationError || routingError) && (
          <div className="absolute top-4 right-4 z-[999] max-w-sm">
            <div className="rounded-md border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">{locationError?.message || routingError || "Unknown error"}</p>
            </div>
          </div>
        )}

        <MapContainer className="h-full w-full" scrollWheelZoom={true} zoomControl={false} bounds={bounds} maxZoom={25} zoom={18}>
          <TileLayer url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxNativeZoom={18} maxZoom={25} />
          {/* 🎯 All the markers */}
          <Suspense fallback={null}>
            {/* 🗺️ Valhalla route */}
            {route && routeCoordinates.length > 0 && (
              <ValhallaRoute
                route={route}
                routeCoordinates={routeCoordinates}
                originalStart={originalStart || undefined}
                originalEnd={originalEnd || undefined}
                isNavigating={isNavigating}
                showMarkers={true}
                fitBounds={!isNavigating} // 🎯 Only auto-fit when not actively navigating
              />
            )}
            <ComfortRoomMarker onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <ParkingMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <PlaygroundMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <CenterSerenityMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <MainEntranceMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <ChapelMarkers onDirectionClick={handleDirectionClick} isDirectionLoading={isDirectionLoading} />
            <PlotMarkers markers={markers as any} isDirectionLoading={isDirectionLoading} onDirectionClick={handleDirectionClick} />
          </Suspense>
        </MapContainer>
      </div>
    </LocateContext.Provider>
  );
}
