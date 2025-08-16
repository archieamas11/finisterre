import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";

export default function CenterSerenityMarkers() {
  const CENTER_MAP = L.latLng(10.249306880563585, 123.797848311330114);
  return (
    <>
      <Marker
        icon={L.divIcon({
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          className: "destination-marker",
          html: renderToStaticMarkup(
            <div
              style={{
                display: "inline-block",
                border: "1px solid #000",
                borderRadius: "6px",
                overflow: "hidden",
                boxShadow: "0 0 8px rgba(0,0,0,0.15)",
                width: "32px",
                height: "32px",
              }}
            >
              <style>{`
                @keyframes marker-pop-in {
                  0% { transform: scale(0); opacity: 0; }
                  70% { transform: scale(1.1); opacity: 1; }
                  100% { transform: scale(1); opacity: 1; }
                }
                .animated-marker {
                  animation: marker-pop-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                  transform-origin: center center;
                }
              `}</style>
              <img
                src="https://res.cloudinary.com/djrkvgfvo/image/upload/v1755253760/Finisterre-Gardenz-columbarium_ewopci.png"
                className="animated-marker"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>,
          ),
        })}
        position={[CENTER_MAP.lat, CENTER_MAP.lng]}
      >
        <Popup maxWidth={350} className="leaflet-theme-popup p-0">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-[220px]">
            <CardHeader className="p-0">
              <img
                src="https://res.cloudinary.com/djrkvgfvo/image/upload/v1755253760/Finisterre-Gardenz-columbarium_ewopci.png"
                alt="Cemetery Gate"
                className="h-32 w-full rounded-md object-cover"
              />
            </CardHeader>
            <CardContent className="p-3">
              <CardTitle className="text-sm font-bold text-orange-600">Title</CardTitle>
              <CardDescription className="mt-1 text-xs text-gray-500">Sample description</CardDescription>
            </CardContent>
          </motion.div>
        </Popup>
      </Marker>
    </>
  );
}
