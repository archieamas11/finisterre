import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Suspense, lazy } from "react";
import { GiOpenGate } from "react-icons/gi";
import { createContext, useRef } from "react";
import { BiSolidChurch } from "react-icons/bi";
import { renderToStaticMarkup } from "react-dom/server";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import type { ConvertedMarker } from "@/types/map.types";

import { Card } from "@/components/ui/card";
import WebMapNavs from "@/pages/webmap/WebMapNavs";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlots } from "@/hooks/plots-hooks/plot.hooks";
import {
  getCategoryBackgroundColor,
  convertPlotToMarker,
  getStatusColor,
} from "@/types/map.types";
const ColumbariumPopup = lazy(
  () => import("@/pages/admin/map4admin/ColumbariumPopup"),
);
const SinglePlotLocations = lazy(
  () => import("@/pages/admin/map4admin/SinglePlotPopup"),
);

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
export default function AdminMapLayout() {
  // 🎣 Fetch real plot data from backend
  const { error, isLoading, data: plotsData } = usePlots();

  const bounds: [[number, number]] = [[10.24930711375518, 123.79784801248411]];

  const locateRef = useRef<(() => void) | null>(null);
  // Cemetery entrance constant for routing
  const CEMETERY_GATE = L.latLng(10.248107820799307, 123.797607547609545);
  // Provide context to navs
  const requestLocate = () => {
    if (locateRef.current) locateRef.current();
  };

  // 🔄 Convert database plots to marker format
  const markers = plotsData?.map(convertPlotToMarker) || [];
  console.log("🗺️ Plots data loaded:", {
    error,
    isLoading,
    plotsCount: markers.length,
  });
  // 🔄 Show loading state while fetching plots
  if (isLoading || isLoading) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-gray-600">Loading plot data...</p>
        </div>
      </div>
    );
  }

  // ❌ Show error state if plots failed to load
  if (error || error) {
    console.error("🚨 Error loading plots:", { error });
    return (
      <div className="relative flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-red-600">Error loading plot data</p>
          <p className="text-sm text-gray-600">
            {error?.message || error?.message || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="z-1 flex w-full flex-col gap-4 py-4 md:gap-6 md:py-6"
      style={{ maxHeight: "100vh", overflow: "hidden" }}
      aria-label="Admin Map Page"
    >
      <Card
        style={{
          overflow: "hidden",
          height: "calc(97vh - 55px)",
          maxHeight: "calc(100vh - 64px)",
        }}
        className="w-full p-2 shadow-lg"
      >
        <LocateContext.Provider value={{ requestLocate }}>
          <div
            style={{ height: "100%", maxHeight: "100%" }}
            className="relative w-full"
          >
            <WebMapNavs />
            <MapContainer
              className="h-full w-full rounded-lg"
              markerZoomAnimation={true}
              scrollWheelZoom={true}
              fadeAnimation={false}
              zoomAnimation={true}
              zoomControl={false}
              bounds={bounds}
              maxZoom={20}
              zoom={18}
            >
              <TileLayer
                url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxNativeZoom={18}
                maxZoom={25}
              />

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
                    <div className="font-semibold text-orange-600">
                      🚪 Cemetery Gate
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Entry point for cemetery visitors
                    </div>
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
                    <div className="font-semibold text-orange-600">
                      🚪 Cemetery Gate
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Entry point for cemetery visitors
                    </div>
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
                    <div className="font-semibold text-orange-600">
                      🚪 Chapel
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Entry point for chapel visitors
                    </div>
                  </div>
                </Popup>
              </Marker>

              {markers.map((marker: ConvertedMarker) => {
                const statusColor = getStatusColor(marker.plotStatus);

                const circleIcon = L.divIcon({
                  className: "",
                  iconSize: [24, 24],
                  html: `<div style="
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: ${statusColor};
                border: 2px solid #fff;
                box-shadow: 0 0 4px rgba(0,0,0,0.15);
                "></div>`,
                });

                // 🎨 Category-based background colors for popup headers
                const backgroundColor = getCategoryBackgroundColor(
                  marker.category,
                );

                return (
                  <Marker
                    key={`plot-${marker.plot_id}`}
                    position={marker.position}
                    icon={circleIcon}
                  >
                    {marker.rows && marker.columns ? (
                      <Popup className="leaflet-theme-popup w-120">
                        <Suspense
                          fallback={
                            <>
                              {/* Title skeleton */}
                              <Skeleton className="mb-2 h-[24px] w-110 rounded" />
                              {/* Subtitle skeleton */}
                              <Skeleton className="mb-2 h-[18px] w-110 rounded" />
                              {/* Grid skeleton */}
                              <Skeleton className="mb-3 h-[200px] w-110 rounded" />
                              {/* Legend skeleton */}
                              <Skeleton className="h-[36px] w-110 rounded" />
                            </>
                          }
                        >
                          <ColumbariumPopup marker={marker} />
                        </Suspense>
                      </Popup>
                    ) : (
                      <Popup className="leaflet-theme-popup w-75">
                        <Suspense
                          fallback={
                            <>
                              {/* Header Section */}
                              <div className="mb-4 flex items-center justify-between">
                                <Skeleton className="h-[20px] w-48 rounded" />{" "}
                                {/* Block A + Plot 10 */}
                                <Skeleton className="h-[20px] w-24 rounded bg-yellow-500 text-white" />{" "}
                                {/* Reserved */}
                              </div>

                              {/* Content Section */}
                              <div className="mb-4">
                                <div className="mb-2 flex items-center">
                                  <Skeleton className="mr-2 h-6 w-6 rounded-full bg-gray-500" />{" "}
                                  {/* Icon */}
                                  <Skeleton className="ml-2 h-[16px] w-75 rounded" />{" "}
                                  {/* Plot Category */}
                                </div>
                                <div className="mb-2 flex items-center">
                                  <Skeleton className="mr-2 h-6 w-6 rounded-full bg-gray-500" />{" "}
                                  {/* Icon */}
                                  <Skeleton className="ml-2 h-[16px] w-75 rounded" />{" "}
                                  {/* Juan Dela Cruz */}
                                </div>
                                <div className="flex items-center">
                                  <Skeleton className="mr-2 h-6 w-6 rounded-full bg-gray-500" />{" "}
                                  {/* Icon */}
                                  <Skeleton className="ml-2 h-[16px] w-75 rounded" />{" "}
                                  {/* Date */}
                                </div>
                              </div>

                              {/* Dimension Section */}
                              <div className="mt-4">
                                <div className="mb-2 flex items-center">
                                  <Skeleton className="mr-2 h-6 w-6 rounded-full bg-blue-500" />{" "}
                                  {/* Icon */}
                                  <Skeleton className="ml-2 h-[16px] w-75 rounded" />{" "}
                                  {/* Label */}
                                </div>
                                <div className="text-center">
                                  <Skeleton className="mb-2 h-[20px] w-32 rounded" />{" "}
                                  {/* N/A m × N/A m */}
                                  <Skeleton className="h-[16px] w-60 rounded" />{" "}
                                  {/* N/A m² */}
                                </div>
                              </div>
                            </>
                          }
                        >
                          <SinglePlotLocations
                            backgroundColor={backgroundColor}
                            marker={marker}
                          />
                        </Suspense>
                      </Popup>
                    )}
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </LocateContext.Provider>
      </Card>
    </div>
  );
}
