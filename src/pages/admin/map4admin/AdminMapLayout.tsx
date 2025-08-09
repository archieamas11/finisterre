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
import SpinnerCircle4 from "@/components/ui/spinner-10";
import { ErrorMessage } from "@/components/ErrorMessage";
import MapStats from "./MapStats";
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

export const LocateContext = createContext<{
  requestLocate: () => void;
} | null>(null);

export default function AdminMapLayout() {
  const CEMETERY_GATE = L.latLng(10.248107820799307, 123.797607547609545);
  const { isError, refetch, isLoading, data: plotsData } = usePlots();
  const markers = plotsData?.map(convertPlotToMarker) || [];
  const bounds: [[number, number]] = [[10.24930711375518, 123.79784801248411]];
  const locateRef = useRef<(() => void) | null>(null);
  const requestLocate = () => {
    if (locateRef.current) locateRef.current();
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <SpinnerCircle4 />
      </div>
    );
  }

  if (isError || !plotsData) {
    return (
      <ErrorMessage
        message="Failed to load map data. Please check your connection and try again."
        onRetry={refetch}
        showRetryButton={true}
      />
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
            <MapStats />
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
                      // 🏢 Columbarium Popup
                      <Popup
                        className="leaflet-theme-popup"
                        closeButton={false}
                        offset={[-2, 5]}
                        minWidth={450}
                      >
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
                            <ColumbariumPopup marker={marker} />
                          </Suspense>
                        </div>
                      </Popup>
                    ) : (
                      // 🏠 Single Plot Popup
                      <Popup
                        className="leaflet-theme-popup"
                        closeButton={false}
                        offset={[-2, 5]}
                        minWidth={600}
                        maxWidth={600}
                      >
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
