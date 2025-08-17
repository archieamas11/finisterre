import { FaDirections } from "react-icons/fa";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import { Button } from "./button";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Spinner from "./spinner";

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
    className: "destination-marker",
    html: renderToStaticMarkup(
      <div
        style={{
          display: "inline-block",
          border: "2px solid #FFFF",
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
          alt="Marker Image"
        />
      </div>,
    ),
  });
}

// Popup Component
function FinisterrePopup({ title, description, imageSrc }: Pick<FinisterreMarkersType, "title" | "description" | "imageSrc">) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-5 w-64">
      <Dialog>
        <CardHeader className="relative p-0">
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={`Open ${title} image in lightbox`}
              className={cn("focus-visible:ring-primary/30 group block w-full rounded-xl focus-visible:ring-4 focus-visible:outline-none")}
              // 🛡️ Prevent Leaflet map interactions like drag when pressing on the trigger
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <div className="bg-muted relative aspect-[4/3] overflow-hidden rounded-xl sm:aspect-[16/10]">
                <img src={imageSrc} alt={title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <CardTitle className="text-sm font-semibold text-white">{title}</CardTitle>
                  <CardDescription className="mt-1 text-xs text-white/90">{description}</CardDescription>
                </div>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Maximize2 className="text-white" aria-hidden="true" />
                  <span className="sr-only">Open image in lightbox</span>
                </div>
              </div>
            </button>
          </DialogTrigger>
        </CardHeader>

        {/* Lightbox */}
        <DialogContent className="z-9999 mx-auto w-full max-w-6xl border p-2 sm:p-2" onOpenAutoFocus={(e) => e.preventDefault()}>
          <div className="relative flex items-center justify-center">
            <img src={imageSrc} alt={title} className="max-h-[90vh] w-full rounded-lg object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

// Main Reusable Component
interface FinisterreMarkersProps {
  playgrounds: FinisterreMarkersType[];
  // Accept destination coordinates [lat, lng]
  onDirectionClick?: (dest: [number, number]) => void;
  isDirectionLoading?: boolean;
}

export default function FinisterreMarkers({ playgrounds, onDirectionClick, isDirectionLoading = false }: FinisterreMarkersProps) {
  return (
    <>
      {playgrounds.map((pg) => (
        <Marker key={pg.id} icon={createMarkerIcon(pg.imageSrc)} position={[pg.lat, pg.lng] as [number, number]}>
          <Popup className="leaflet-theme-popup p-0">
            <FinisterrePopup title={pg.title} description={pg.description} imageSrc={pg.imageSrc} />
            <Button
              className="mt-1 mb-1 w-full rounded-lg"
              onClick={(e) => {
                // Prevent Leaflet map from panning/dragging when clicking this button
                e.stopPropagation();
                e.nativeEvent?.stopImmediatePropagation?.();
                onDirectionClick?.([pg.lat, pg.lng]);
              }}
              disabled={isDirectionLoading}
              aria-busy={isDirectionLoading}
              variant="default"
              type="button"
            >
              {isDirectionLoading ? <Spinner className="h-4 w-4 text-white" /> : <FaDirections />}
              Get Direction
            </Button>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
