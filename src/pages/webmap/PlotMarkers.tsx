import L from "leaflet";
import { memo } from "react";
import { Marker, Popup } from "react-leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import ColumbariumPopup from "@/pages/admin/map4admin/ColumbariumPopup";
import PlotLocations from "@/pages/webmap/WebMapPopup";
import type { ConvertedMarker } from "@/types/map.types";
import { getCategoryBackgroundColor, getStatusColor } from "@/types/map.types";

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
  return (
    <>
      {markers.map((marker) => {
        const statusColor = getStatusColor(marker.plotStatus);
        const circleIcon = getIcon(statusColor);

        // Memoize the callback to avoid creating a new function on each render
        const onDir = () => onDirectionClick(marker.position as [number, number]);

        return (
          <Marker key={`plot-${marker.plot_id}`} position={marker.position} icon={circleIcon}>
            {marker.rows && marker.columns ? (
              // Memorial Chambers Popup
              <Popup className="leaflet-theme-popup" minWidth={450} closeButton={false}>
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
          </Marker>
        );
      })}
    </>
  );
}

export default memo(PlotMarkers);
