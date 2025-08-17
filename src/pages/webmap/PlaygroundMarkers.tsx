import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";

export default function ParkingMarkers() {
  const PLAYGROUND_1 = L.latLng(10.248972753171127, 123.79755735707532);
  const PLAYGROUND_2 = L.latLng(10.249180343704229, 123.798238818160755);

  return (
    <>
      {/* PLAYGROUND_1 */}
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
              <img
                src="https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg"
                className="marker-pop-in"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                alt=""
              />
            </div>,
          ),
        })}
        position={[PLAYGROUND_1.lat, PLAYGROUND_1.lng]}
      >
        <Popup maxWidth={350} className="leaflet-theme-popup p-0">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-[220px]">
            <CardHeader className="p-0">
              <img src="https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg" alt="Playground 1" className="h-32 w-full rounded-md object-cover" />
            </CardHeader>
            <CardContent className="p-3">
              <CardTitle className="text-sm font-bold text-orange-600">Playground 1</CardTitle>
              <CardDescription className="mt-1 text-xs text-gray-500">Playground for visitors</CardDescription>
            </CardContent>
          </motion.div>
        </Popup>
      </Marker>

      <Marker
        icon={L.divIcon({
          iconSize: [32, 32],
          iconAnchor: [16, 16], // Center the icon
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
              <img
                src="https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg"
                className="marker-pop-in"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                alt=""
              />
            </div>,
          ),
        })}
        position={[PLAYGROUND_2.lat, PLAYGROUND_2.lng]}
      >
        <Popup maxWidth={350} className="leaflet-theme-popup p-0">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-[220px]">
            <CardHeader className="p-0">
              <img src="https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg" alt="Playground 2" className="h-32 w-full rounded-md object-cover" />
            </CardHeader>
            <CardContent className="p-3">
              <CardTitle className="text-sm font-bold text-orange-600">Playground 2</CardTitle>
              <CardDescription className="mt-1 text-xs text-gray-500">Playground for visitors</CardDescription>
            </CardContent>
          </motion.div>
        </Popup>
      </Marker>
    </>
  );
}
