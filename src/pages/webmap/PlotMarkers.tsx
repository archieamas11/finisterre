import L from "leaflet";
import { memo, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import ColumbariumPopup from "@/pages/admin/map4admin/ColumbariumPopup";
import PlotLocations from "@/pages/webmap/WebMapPopup";
import type { ConvertedMarker } from "@/types/map.types";
import { getCategoryBackgroundColor, getStatusColor } from "@/types/map.types";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";

export interface PlotMarkersProps {
  markers: ConvertedMarker[];
  isDirectionLoading: boolean;
  onDirectionClick: (to: [number, number]) => void;
}

// Icon Caching to avoid re-creating icons on every render
const iconCache: Record<string, L.DivIcon> = {};
const getIcon = (color: string) => {
  if (!iconCache[color]) {
    iconCache[color] = L.divIcon({
      className: "plot-marker-icon",
      iconSize: [15, 15],
      html: `<div style="width: 15px; height: 15px; border-radius: 50%; background: ${color}; border: 2px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
    });
  }
  return iconCache[color];
};

function PlotMarkers({ markers, isDirectionLoading, onDirectionClick }: PlotMarkersProps) {
  // Drawer state for small screens (one open at a time by plot id)
  const [openDrawerPlotId, setOpenDrawerPlotId] = useState<string | number | null>(null);

  return (
    <>
      {markers.map((marker) => {
        const statusColor = getStatusColor(marker.plotStatus);
        const circleIcon = getIcon(statusColor);

        // Memoize the callback to avoid creating a new function on each render
        const onDir = () => onDirectionClick(marker.position as [number, number]);

        return (
          <Marker
            key={`plot-${marker.plot_id}`}
            position={marker.position}
            icon={circleIcon}
            eventHandlers={{
              click: () => {
                // Open Drawer for Columbarium markers (those with rows/columns)
                if (marker.rows && marker.columns) setOpenDrawerPlotId(marker.plot_id);
              },
            }}
          >
            {marker.rows && marker.columns ? (
              // Memorial Chambers Popup
              <Popup className="leaflet-theme-popup hidden md:block" minWidth={450} closeButton={false}>
                <div className="w-full py-2">
                  <ColumbariumPopup onDirectionClick={onDir} isDirectionLoading={isDirectionLoading} marker={marker} />
                </div>
              </Popup>
            ) : (
              // Serenity Lawn Popup
              <Popup className="leaflet-theme-popup" minWidth={250} closeButton={false}>
                <PlotLocations backgroundColor={getCategoryBackgroundColor(marker.category)} onDirectionClick={onDir} isDirectionLoading={isDirectionLoading} marker={marker} />
              </Popup>
            )}

            {/* Small screens Drawer for Columbarium (md:hidden keeps it mobile-only) */}
            {marker.rows && marker.columns ? (
              <Drawer open={openDrawerPlotId === marker.plot_id} onOpenChange={(open) => setOpenDrawerPlotId(open ? marker.plot_id : null)}>
                <DrawerContent className="z-9999 max-h-[85vh] overflow-hidden rounded-t-xl md:hidden" aria-describedby={`drawer-description-${marker.plot_id}`}>
                  <DrawerTitle>
                    <span className="sr-only" id={`drawer-title-${marker.plot_id}`}>
                      Columbarium plot details
                    </span>
                  </DrawerTitle>
                  <DrawerDescription>
                    <span id={`drawer-description-${marker.plot_id}`} className="sr-only">
                      Columbarium plot details and actions.
                    </span>
                  </DrawerDescription>
                  <div className="max-h-[85vh] touch-pan-y overflow-y-auto overscroll-contain px-2 pt-2 pb-4">
                    <ColumbariumPopup onDirectionClick={onDir} isDirectionLoading={isDirectionLoading} marker={marker} />
                  </div>
                </DrawerContent>
              </Drawer>
            ) : null}
          </Marker>
        );
      })}
    </>
  );
}

export default memo(PlotMarkers);
