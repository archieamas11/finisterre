import { useMapEvents } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";

interface MapClickHandlerProps {
  isAddingMarker: boolean;
  onMapClick: (coordinates: [number, number]) => void;
}

export default function MapClickHandler({ isAddingMarker, onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      if (isAddingMarker) {
        const { lat, lng } = e.latlng;
        onMapClick([lat, lng]);
      }
    },
  });

  return null;
}
