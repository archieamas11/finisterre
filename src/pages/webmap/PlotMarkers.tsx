import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import ColumbariumPopup from "@/pages/admin/map4admin/ColumbariumPopup";
import PlotLocations from "@/pages/webmap/WebMapPopup";
import type { ConvertedMarker } from "@/types/map.types";
import { getCategoryBackgroundColor, getStatusColor } from "@/types/map.types";

export interface PlotMarkersProps {
  markers: ConvertedMarker[];
  isDirectionLoading: boolean;
  onDirectionClick: (to: [number, number]) => void;
}

export default function PlotMarkers({ markers, isDirectionLoading, onDirectionClick }: PlotMarkersProps) {
  return (
    <>
      {markers.map((marker) => {
        const statusColor = getStatusColor(marker.plotStatus);
        const circleIcon = L.divIcon({
          className: "",
          iconSize: [24, 24],
          html: `<div style="width: 15px; height: 15px; border-radius: 50%; background: ${statusColor}; border: 1px solid #fff;"></div>`,
        });
        const onDir = () => onDirectionClick(marker.position as [number, number]);

        return (
          <Marker key={`plot-${marker.plot_id}`} position={marker.position} icon={circleIcon}>
            {marker.rows && marker.columns ? (
              // Memorial Chambers Popup
              <Popup className="leaflet-theme-popup" offset={[-2, 5]} minWidth={450} closeButton={false}>
                <div className="w-full py-2">
                  <ColumbariumPopup onDirectionClick={onDir} isDirectionLoading={isDirectionLoading} marker={marker} />
                </div>
              </Popup>
            ) : (
              // Serenity Lawn Popup
              <Popup className="leaflet-theme-popup" offset={[-2, 5]} minWidth={250} closeButton={false}>
                <PlotLocations backgroundColor={getCategoryBackgroundColor(marker.category)} onDirectionClick={onDir} isDirectionLoading={isDirectionLoading} marker={marker} />
              </Popup>
            )}
          </Marker>
        );
      })}
    </>
  );
}
