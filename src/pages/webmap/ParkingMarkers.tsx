import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MdLocalParking } from "react-icons/md";
import { Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaDirections } from "react-icons/fa";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  onDirectionClick?: (dest: [number, number]) => void;
  isDirectionLoading?: boolean;
}

export default function ParkingMarkers({ onDirectionClick, isDirectionLoading = false }: Props) {
  const PARKING_1 = L.latLng(10.248467771138005, 123.797668761148387);
  const PARKING_2 = L.latLng(10.248150553375426, 123.797848903904878);
  return (
    <>
      <Marker
        icon={L.divIcon({
          iconSize: [32, 32],
          className: "destination-marker",
          html: renderToStaticMarkup(
            <div className="marker-pop-in">
              <div
                style={{
                  padding: "4px",
                  background: "#2563EB",
                  display: "inline-block",
                  border: "2px solid #fff",
                  transform: "rotate(-45deg)",
                  borderRadius: "50% 50% 50% 0",
                  boxShadow: "0 0 8px rgba(0,0,0,0.15)",
                }}
              >
                <MdLocalParking
                  style={{
                    transform: "rotate(45deg)",
                  }}
                  className="z-999 text-white"
                  title="Parking"
                  size={16}
                />
              </div>
            </div>,
          ),
        })}
        position={[PARKING_1.lat, PARKING_1.lng]}
      >
        <Popup>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="font-semibold text-orange-600">
              🚗 Parking 1
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-1 text-xs text-gray-500">
              Parking 1 for finisterre visitors
            </motion.div>
            <div className="mt-2">
              <Button
                className="mt-1 mb-1 w-full rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onDirectionClick?.([PARKING_1.lat, PARKING_1.lng]);
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
                  background: "#2563EB",
                  display: "inline-block",
                  border: "2px solid #fff",
                  transform: "rotate(-45deg)",
                  borderRadius: "50% 50% 50% 0",
                  boxShadow: "0 0 8px rgba(0,0,0,0.15)",
                }}
              >
                <MdLocalParking
                  style={{
                    transform: "rotate(45deg)",
                  }}
                  className="z-999 text-white"
                  title="Parking"
                  size={16}
                />
              </div>
            </div>,
          ),
        })}
        position={[PARKING_2.lat, PARKING_2.lng]}
      >
        <Popup>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="font-semibold text-orange-600">
              🚗 Parking 2
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-1 text-xs text-gray-500">
              Parking 2 for finisterre visitors
            </motion.div>
            <div className="mt-2">
              <Button
                className="mt-1 mb-1 w-full rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onDirectionClick?.([PARKING_2.lat, PARKING_2.lng]);
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
