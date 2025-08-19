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
    pendingDestinationRef.current = null;
    setIsDirectionLoading(false);
  };

  // [lat, lng]
  function handleDirectionClick(to: [number, number]) {
    clearRoute();
    setIsDirectionLoading(true); // ⚡ Start loading immediately

    if (userPosition) {
      setRoute({ from: [userPosition.lat, userPosition.lng], to });
      return;
    }

    // Store destination and trigger location request
    pendingDestinationRef.current = to;
    if (locateRef.current) locateRef.current();
  }

  const onRouteFound = () => {
    setIsDirectionLoading(false);
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
      </div>
    </LocateContext.Provider>
  );
}
