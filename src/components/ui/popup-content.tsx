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
import React, { cloneElement, isValidElement } from "react";

interface MarkerStyle {
  backgroundColor?: string;
  borderRadius?: string;
  transform?: string;
  padding?: string;
}

export interface CustomMarkerData {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  marker: {
    type: "image" | "icon";
    source: string | React.ReactElement;
    style?: MarkerStyle;
  };
  popupType?: "image" | "simple";
  popupImage?: string;
}

export type FinisterreMarkerData = CustomMarkerData;

function createMarkerIcon(marker: CustomMarkerData["marker"]) {
  const baseWrapperStyle: React.CSSProperties = {
    display: "inline-block",
    border: "2px solid #FFFF",
    boxShadow: "0 0 8px rgba(0,0,0,0.15)",
    width: "32px",
    height: "32px",
    boxSizing: "border-box",
    borderRadius: "6px",
    overflow: "hidden",
  };

  if (marker.type === "image" && typeof marker.source === "string") {
    const imageIconStyle: React.CSSProperties = {
      ...baseWrapperStyle,
    };
    return L.divIcon({
      iconSize: [32, 32],
      className: "destination-marker",
      html: renderToStaticMarkup(
        <div style={imageIconStyle}>
          <img src={marker.source} className="marker-pop-in" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} alt="Marker Image" />
        </div>,
      ),
    });
  }

  if (marker.type === "icon" && isValidElement(marker.source)) {
    const iconStyle = marker.style || {};
    const dynamicIconStyle: React.CSSProperties = {
      ...baseWrapperStyle,
      padding: iconStyle.padding || "4px",
      backgroundColor: iconStyle.backgroundColor || "#000",
      transform: iconStyle.transform || "rotate(-45deg)",
      borderRadius: iconStyle.borderRadius || "50% 50% 50% 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const clonedIcon = cloneElement(marker.source as React.ReactElement<any>, {
      size: 16,
      color: "white",
      style: {
        transform: "rotate(45deg)",
      },
    });

    return L.divIcon({
      iconSize: [32, 32],
      className: "destination-marker",
      html: renderToStaticMarkup(
        <div className="marker-pop-in">
          <div style={dynamicIconStyle}>{clonedIcon}</div>
        </div>,
      ),
    });
  }

  return new L.Icon.Default();
}

function ImagePopup({ title, description, imageSrc }: { title: string; description: string; imageSrc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mt-5 w-64"
    >
      <Dialog>
        <CardHeader className="relative p-0">
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={`Open ${title} image in lightbox`}
              className={cn("focus-visible:ring-primary/30 group block w-full rounded-xl focus-visible:ring-4 focus-visible:outline-none")}
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
        <DialogContent className="z-[9999] mx-auto w-full max-w-6xl border p-2 sm:p-2" onOpenAutoFocus={(e) => e.preventDefault()}>
          <div className="relative flex items-center justify-center">
            <img src={imageSrc} alt={title} className="max-h-[90vh] w-full rounded-lg object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
function SimplePopup({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-primary mt-5 mb-1.5 w-64 rounded-xl"
    >
      {/* 📝 Use larger, more prominent title and multiline description for clarity */}
      <div className="flex flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700">{description}</p>
      </div>
    </motion.div>
  );
}

interface CustomMarkersProps {
  items: CustomMarkerData[];
  onDirectionClick?: (dest: [number, number]) => void;
  isDirectionLoading?: boolean;
}

function FinisterreMarkers({ items, onDirectionClick, isDirectionLoading = false }: CustomMarkersProps) {
  return (
    <>
      {items.map((itemData) => (
        <Marker key={itemData.id} icon={createMarkerIcon(itemData.marker)} position={[itemData.lat, itemData.lng] as [number, number]}>
          <Popup className="leaflet-theme-popup p-0">
            {(() => {
              if (itemData.popupType === "image") {
                const imageSrc = itemData.popupImage || (typeof itemData.marker.source === "string" ? itemData.marker.source : undefined);
                if (imageSrc) {
                  return <ImagePopup title={itemData.title} description={itemData.description} imageSrc={imageSrc} />;
                }
              }
              return <SimplePopup title={itemData.title} description={itemData.description} />;
            })()}
            <Button
              className="mt-1 mb-1 w-full rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                onDirectionClick?.([itemData.lat, itemData.lng]);
              }}
              disabled={isDirectionLoading}
              aria-busy={isDirectionLoading}
              variant="default"
            >
              {isDirectionLoading ? <Spinner className="h-4 w-4" /> : <FaDirections />}
              Get Direction
            </Button>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function CustomMarkers({ items, onDirectionClick, isDirectionLoading = false }: CustomMarkersProps) {
  return <FinisterreMarkers items={items} onDirectionClick={onDirectionClick} isDirectionLoading={isDirectionLoading} />;
}
export { FinisterreMarkers };
