import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { BiSolidChurch } from "react-icons/bi";
import { Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";

export default function MainEntranceMarkers() {
  const CHAPEL = L.latLng(10.248435228156183, 123.79787795587316);

  return (
    <>
      {/* Cemetery Chapel Marker */}
      <Marker
        icon={L.divIcon({
          iconSize: [32, 32],
          className: "destination-marker",
          html: renderToStaticMarkup(
            <div
              style={{
                padding: "4px",
                background: "#FF9800",
                display: "inline-block",
                border: "2px solid #fff",
                transform: "rotate(-45deg)",
                borderRadius: "50% 50% 50% 0",
                boxShadow: "0 0 8px rgba(0,0,0,0.15)",
                animation: "marker-pop-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
              }}
            >
              <style>{`
                @keyframes marker-pop-in {
                  0% { transform: rotate(-45deg) scale(0); opacity: 0; }
                  70% { transform: rotate(-45deg) scale(1.1); opacity: 1; }
                  100% { transform: rotate(-45deg) scale(1); opacity: 1; }
                }
              `}</style>
              <BiSolidChurch
                style={{
                  transform: "rotate(45deg)",
                }}
                className="z-999 text-white"
                strokeWidth={2.5}
                size={16}
              />
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
          </motion.div>
        </Popup>
      </Marker>
    </>
  );
}
