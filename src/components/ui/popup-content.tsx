import { FaDirections } from "react-icons/fa"; 
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import { Button } from "./button";

// Define the FinisterreMarkers type
export interface FinisterreMarkersType {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  imageSrc: string;
}

// Create a custom marker icon
function createMarkerIcon(imageSrc: string) {
  return L.divIcon({
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
          src={imageSrc}
          className="marker-pop-in"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt=""
        />
      </div>
    ),
  });
}

// Popup Component
function FinisterrePopup({ title, description, imageSrc }: Pick<FinisterreMarkersType, "title" | "description" | "imageSrc">) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-4 w-64">
      <Dialog>
        <CardHeader className="relative p-0">
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={`View ${title} image in full size`}
              className="group relative block h-36 w-full cursor-zoom-in overflow-hidden rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                }
              }}
            >
              <img
                src={imageSrc}
                alt={title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-3 text-left text-white">
                <CardTitle className="text-sm font-semibold text-orange-400">{title}</CardTitle>
                <CardDescription className="mt-1 text-xs text-white/90">{description}</CardDescription>
              </div>
              <span className="pointer-events-none absolute top-2 right-2 rounded bg-black/50 px-2 py-1 text-[10px] font-medium tracking-wide text-white uppercase">
                View
              </span>
            </button>
          </DialogTrigger>
        </CardHeader>

        {/* Lightbox */}
        <DialogContent className="max-w-none rounded-none border-0 bg-transparent p-0 shadow-none" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <img
              src={imageSrc}
              alt={title}
              className="border-card bg-card max-h-[90vh] max-w-[95vw] rounded-lg border-[10px] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

// Main Reusable Component
interface FinisterreMarkersProps {
  playgrounds: FinisterreMarkersType[];
}

export default function FinisterreMarkers({ playgrounds }: FinisterreMarkersProps) {
  return (
    <>
      {playgrounds.map((pg) => (
        <Marker
          key={pg.id}
          icon={createMarkerIcon(pg.imageSrc)}
          position={[pg.lat, pg.lng] as [number, number]}
        >
          <Popup maxWidth={360} className="leaflet-theme-popup p-0">
            <FinisterrePopup
              title={pg.title}
              description={pg.description}
              imageSrc={pg.imageSrc}
            />
            <Button variant="default" className="w-full mt-2"><FaDirections />Get Direction</Button>
          </Popup>
        </Marker>
      ))}
    </>
  );
}