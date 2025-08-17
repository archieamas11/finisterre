import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { BiSolidChurch } from "react-icons/bi";
import { Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaDirections } from "react-icons/fa";

interface Props {
  onDirectionClick?: (dest: [number, number]) => void;
  isDirectionLoading?: boolean;
}

export default function MainEntranceMarkers({ onDirectionClick, isDirectionLoading = false }: Props) {
  const CHAPEL = L.latLng(10.248435228156183, 123.79787795587316);

  return (
    <>
      {/* Cemetery Chapel Marker */}
      <Marker
        icon={L.divIcon({
          iconSize: [32, 32],
          className: "destination-marker",
          html: renderToStaticMarkup(
            <div className="marker-pop-in">
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
                  title="Chapel"
                  size={16}
                />
              </div>
            </div>,
          ),
        })}
        position={[CHAPEL.lat, CHAPEL.lng]}
      >
        <Popup>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="font-semibold text-orange-600">
              🕍 Chapel
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-1 text-xs text-gray-500">
              Entry point for chapel visitors
            </motion.div>
            <div className="mt-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDirectionClick?.([CHAPEL.lat, CHAPEL.lng]);
                }}
                disabled={isDirectionLoading}
                type="button"
                variant="default"
              >
                {isDirectionLoading ? "Loading..." : <FaDirections />}
                <span className="ml-2">Get Directions</span>
              </Button>
            </div>
          </motion.div>
        </Popup>
      </Marker>
    </>
  );
}
