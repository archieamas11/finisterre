import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaToilet } from "react-icons/fa";
import { Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaDirections } from "react-icons/fa";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  onDirectionClick?: (dest: [number, number]) => void;
  isDirectionLoading?: boolean;
}

export default function ComfortRoomMarker({ onDirectionClick, isDirectionLoading = false }: Props) {
  const CR_MARKER = L.latLng(10.24864620598991, 123.798102525943648);

  return (
    <Marker
      icon={L.divIcon({
        iconSize: [32, 32],
        className: "destination-marker",
        html: renderToStaticMarkup(
          <div className="marker-pop-in">
            <div
              style={{
                padding: "4px",
                background: "#059669",
                display: "inline-block",
                border: "2px solid #fff",
                transform: "rotate(-45deg)",
                borderRadius: "50% 50% 50% 0",
                boxShadow: "0 0 8px rgba(0,0,0,0.15)",
              }}
            >
              <FaToilet
                style={{
                  transform: "rotate(45deg)",
                }}
                className="z-999 text-white"
                strokeWidth={2.5}
                title="Comfort Room"
                size={16}
              />
            </div>
          </div>,
        ),
      })}
      position={[CR_MARKER.lat, CR_MARKER.lng]}
    >
      <Popup>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="font-semibold text-orange-600">
            🚻 Comfort Room
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-1 text-xs text-gray-500">
            Comfort room for boys and girls
          </motion.div>
          <div className="mt-2">
            <Button
              className="mt-1 mb-1 w-full rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                onDirectionClick?.([CR_MARKER.lat, CR_MARKER.lng]);
              }}
              disabled={isDirectionLoading}
              aria-busy={isDirectionLoading}
              variant="default"
            >
              {isDirectionLoading ? <Spinner className="h-4 w-4" /> : <FaDirections />}
              Get Direction
            </Button>
          </div>
        </motion.div>
      </Popup>
    </Marker>
  );
}
