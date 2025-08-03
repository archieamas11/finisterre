import { lazy, Suspense } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
// Fix default icon paths so markers actually show up
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { createContext, useRef } from 'react';
import { BiSolidChurch } from 'react-icons/bi';
import { renderToStaticMarkup } from 'react-dom/server';
import { GiOpenGate } from 'react-icons/gi';
import { usePlots } from '@/hooks/plots-hooks/plot.hooks';
import type { ConvertedMarker } from '@/types/map.types';
import { convertPlotToMarker, getCategoryBackgroundColor, getStatusColor } from '@/types/map.types';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
const ColumbariumPopup = lazy(() => import("@/pages/admin/map4admin/columbariumPopup"));
const SinglePlotLocations = lazy(() => import("@/pages/admin/map4admin/SinglePlotPopup"));


const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});
L.Marker.prototype.options.icon = DefaultIcon;

// Context to signal a locate request from navs to map
export const LocateContext = createContext<{ requestLocate: () => void } | null>(null);
export default function AdminMapLayout() {
  // 🎣 Fetch real plot data from backend
  const { data: plotsData, isLoading, error } = usePlots();

  const bounds: [[number, number]] = [
    [10.24930711375518, 123.79784801248411],
  ];

  const locateRef = useRef<(() => void) | null>(null);

  // Cemetery entrance constant for routing
  const CEMETERY_GATE = L.latLng(10.248107820799307, 123.797607547609545);

  // Provide context to navs
  const requestLocate = () => {
    if (locateRef.current) locateRef.current();
  };

  // 🔄 Convert database plots to marker format
  const markers = plotsData?.map(convertPlotToMarker) || [];

  console.log('🗺️ Plots data loaded:', { plotsCount: markers.length, isLoading, error });

  // 🔄 Show loading state while fetching plots
  if (isLoading || isLoading) {
    return (
      <div className="h-screen w-full relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plot data...</p>
        </div>
      </div>
    );
  }

  // ❌ Show error state if plots failed to load
  if (error || error) {
    console.error('🚨 Error loading plots:', { error });
    return (
      <div className="h-screen w-full relative flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading plot data</p>
          <p className="text-gray-600 text-sm">{error?.message || error?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 z-1 w-full" aria-label="Admin Map Page" style={{ maxHeight: '100vh', overflow: 'hidden' }}>
      <Card className="p-2 shadow-lg w-full" style={{ height: 'calc(97vh - 55px)', maxHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <LocateContext.Provider value={{ requestLocate }}>
          <div className="relative w-full" style={{ maxHeight: '100%', height: '100%' }}>
            <MapContainer
              bounds={bounds}
              zoom={18}
              maxZoom={20}
              scrollWheelZoom={true}
              zoomAnimation={true}
              zoomControl={false}
              markerZoomAnimation={true}
              fadeAnimation={false}
              className="h-full w-full rounded-lg"
            >
              <TileLayer
                url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxNativeZoom={18}
                maxZoom={25}
              />

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
                        display: 'inline-block',
                      }}
                    >
                      <GiOpenGate
                        className="z-999 text-white"
                        size={16}
                        strokeWidth={2.5}
                        style={{
                          transform: 'rotate(45deg)',
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
              <Marker
                position={[10.248166481872728, 123.79754558858059]}
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
                        display: 'inline-block',
                      }}
                    >
                      <GiOpenGate
                        className="z-999 text-white"
                        size={16}
                        strokeWidth={2.5}
                        style={{
                          transform: 'rotate(45deg)',
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
              <Marker
                position={[10.248435228156183, 123.79787795587316]}
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
                        display: 'inline-block',
                      }}
                    >
                      <BiSolidChurch
                        className="z-999 text-white"
                        size={16}
                        strokeWidth={2.5}
                        style={{
                          transform: 'rotate(45deg)',
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

              {markers.map((marker: ConvertedMarker) => {
                const statusColor = getStatusColor(marker.plotStatus);

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

                // 🎨 Category-based background colors for popup headers
                const backgroundColor = getCategoryBackgroundColor(marker.category);

                return (
                  <Marker key={`plot-${marker.plot_id}`} position={marker.position} icon={circleIcon}>
                    {marker.rows && marker.columns ? (
                      <Popup className="w-120 leaflet-theme-popup">
                        <Suspense
                          fallback={
                            <>
                              {/* Title skeleton */}
                              <Skeleton className="w-110 h-[24px] rounded mb-2" />
                              {/* Subtitle skeleton */}
                              <Skeleton className="w-110 h-[18px] rounded mb-2" />
                              {/* Grid skeleton */}
                              <Skeleton className="w-110 h-[200px] rounded mb-3" />
                              {/* Legend skeleton */}
                              <Skeleton className="w-110 h-[36px] rounded" />
                            </>
                          }
                        >
                          <ColumbariumPopup marker={marker} />
                        </Suspense>
                      </Popup>
                    ) : (
                      <Popup className="w-75 leaflet-theme-popup">
                        <Suspense
                          fallback={
                            <>
                              {/* Header Section */}
                              <div className="flex items-center justify-between mb-4">
                                <Skeleton className="w-48 h-[20px] rounded" /> {/* Block A + Plot 10 */}
                                <Skeleton className="w-24 h-[20px] rounded bg-yellow-500 text-white" /> {/* Reserved */}
                              </div>

                              {/* Content Section */}
                              <div className="mb-4">
                                <div className="flex items-center mb-2">
                                  <Skeleton className="w-6 h-6 rounded-full bg-gray-500 mr-2" /> {/* Icon */}
                                  <Skeleton className="w-75 h-[16px] rounded ml-2" /> {/* Plot Category */}
                                </div>
                                <div className="flex items-center mb-2">
                                  <Skeleton className="w-6 h-6 rounded-full bg-gray-500 mr-2" /> {/* Icon */}
                                  <Skeleton className="w-75 h-[16px] rounded ml-2" /> {/* Juan Dela Cruz */}
                                </div>
                                <div className="flex items-center">
                                  <Skeleton className="w-6 h-6 rounded-full bg-gray-500 mr-2" /> {/* Icon */}
                                  <Skeleton className="w-75 h-[16px] rounded ml-2" /> {/* Date */}
                                </div>
                              </div>

                              {/* Dimension Section */}
                              <div className="mt-4">
                                <div className="flex items-center mb-2">
                                  <Skeleton className="w-6 h-6 rounded-full bg-blue-500 mr-2" /> {/* Icon */}
                                  <Skeleton className="w-75 h-[16px] rounded ml-2" /> {/* Label */}
                                </div>
                                <div className="text-center">
                                  <Skeleton className="w-32 h-[20px] rounded mb-2" /> {/* N/A m × N/A m */}
                                  <Skeleton className="w-60 h-[16px] rounded" /> {/* N/A m² */}
                                </div>
                              </div>
                            </>
                          }
                        >
                          <SinglePlotLocations marker={marker} backgroundColor={backgroundColor} />
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