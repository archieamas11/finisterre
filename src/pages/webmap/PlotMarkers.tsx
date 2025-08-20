import L from "leaflet";
import { memo, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import ColumbariumPopup from "@/pages/admin/map4admin/ColumbariumPopup";
import PlotLocations from "@/pages/webmap/WebMapPopup";
import type { ConvertedMarker } from "@/types/map.types";
import { getCategoryBackgroundColor, getStatusColor } from "@/types/map.types";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

export interface PlotMarkersProps {
  markers: ConvertedMarker[];
  isDirectionLoading: boolean;
  onDirectionClick: (to: [number, number]) => void;
}

// Icon Caching
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
  const [openDrawerMarker, setOpenDrawerMarker] = useState<ConvertedMarker | null>(null);

  return (
    <>
      {/* Render all markers */}
      {markers.map((marker) => {
        const statusColor = getStatusColor(marker.plotStatus);
        const circleIcon = getIcon(statusColor);

        const onDir = () => onDirectionClick(marker.position as [number, number]);

        return (
          <Marker
            key={`plot-${marker.plot_id}`}
            position={marker.position}
            icon={circleIcon}
            eventHandlers={{
              click: () => {
                if (marker.rows && marker.columns) {
                  // Open drawer instead of popup on mobile
                  setOpenDrawerMarker(marker);
                }
              },
            }}
          >
            {/* Only show popup for non-Columbarium plots OR on desktop */}
            {!marker.rows || !marker.columns ? (
              <Popup className="leaflet-theme-popup" minWidth={250} closeButton={false}>
                <PlotLocations backgroundColor={getCategoryBackgroundColor(marker.category)} onDirectionClick={onDir} isDirectionLoading={isDirectionLoading} marker={marker} />
              </Popup>
            ) : null}
          </Marker>
        );
      })}

      {openDrawerMarker && (
        <Drawer
          open={true}
          onOpenChange={(open) => {
            if (!open) setOpenDrawerMarker(null);
          }}
        >
          <DrawerContent className="z-999 max-h-[85vh] overflow-hidden rounded-t-xl md:hidden">
            <DrawerTitle className="sr-only">Columbarium Plot Details</DrawerTitle>
            <DrawerDescription className="sr-only">Details and actions for columbarium plot {openDrawerMarker.plot_id}.</DrawerDescription>
            <div className="max-h-[85vh] touch-pan-y overflow-y-auto overscroll-contain px-2 pt-2 pb-4">
              <ColumbariumPopup
                onDirectionClick={() => onDirectionClick(openDrawerMarker.position as [number, number])}
                isDirectionLoading={isDirectionLoading}
                marker={openDrawerMarker}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

export default memo(PlotMarkers);
