import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { GiOpenGate } from "react-icons/gi";
import { Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaDirections } from "react-icons/fa";
import Spinner from "@/components/ui/spinner";

interface Props {
  onDirectionClick?: (dest: [number, number]) => void;
  isDirectionLoading?: boolean;
}

export default function MainEntranceMarkers({ onDirectionClick, isDirectionLoading = false }: Props) {
  const CEMETERY_GATE = L.latLng(10.248107820799307, 123.797607547609545);

  return (
    <>
      {/* Cemetery Entrance Marker */}
      <Marker
        icon={L.divIcon({
          iconSize: [32, 32],
          className: "destination-marker",
          html: renderToStaticMarkup(
            <div className="marker-pop-in">
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
                  title="Main Entrance"
                  size={16}
                />
              </div>
            </div>,
          ),
        })}
        position={[CEMETERY_GATE.lat, CEMETERY_GATE.lng]}
      >
        <Popup>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="font-semibold text-orange-600">
              🚪 Fnisterre Main Entrance
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-1 text-xs text-gray-500">
              Entry point for Fnisterre visitors
            </motion.div>
            <div className="mt-2">
              <Button
                className="mt-1 mb-1 w-full rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onDirectionClick?.([CEMETERY_GATE.lat, CEMETERY_GATE.lng]);
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

      <Marker
        icon={L.divIcon({
          iconSize: [32, 32],
          className: "destination-marker",
          html: renderToStaticMarkup(
            <div className="marker-pop-in">
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
                  title="Main Entrance"
                  size={16}
                />
              </div>
            </div>,
          ),
        })}
        position={[10.248166481872728, 123.79754558858059]}
      >
        <Popup>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="font-semibold text-orange-600">
              🚪 Finisterre Main Entrance
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-1 text-xs text-gray-500">
              Entry point for Fnisterre visitors
            </motion.div>
            <div className="mt-2">
              <Button
                className="mt-1 mb-1 w-full rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onDirectionClick?.([CEMETERY_GATE.lat, CEMETERY_GATE.lng]);
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
    </>
  );
}
