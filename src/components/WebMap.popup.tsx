import { BiXCircle } from "react-icons/bi";
import { FaDirections } from "react-icons/fa";
import { BiCheckCircle } from "react-icons/bi";
import { FaHourglassStart } from "react-icons/fa";
import { MapPin, Award, Ruler, Info } from "lucide-react";

import { isAdmin } from "@/utils/auth.utils";
import { Button } from "@/components/ui/button";
import { type ConvertedMarker } from "@/types/map.types";
import { CardDescription, CardTitle } from "@/components/ui/card";

interface PlotLocationsProps {
  marker: ConvertedMarker;
  backgroundColor?: string;
  onDirectionClick?: () => void;
}

export function PlotLocations({ marker, backgroundColor, onDirectionClick }: PlotLocationsProps) {
  return (
    <div className="mt-5">
      <div className="bg-background dark:bg-muted rounded-t-lg p-3 transition-colors" style={backgroundColor ? { background: backgroundColor } : {}}>
        <CardDescription className="text-primary-background">Finisterre</CardDescription>
        <CardTitle className="text-primary-background">Plot Information</CardTitle>
      </div>
      <div className="bg-accent/60 dark:bg-accent/80 mb-3 rounded-b-lg p-2 transition-colors">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <MapPin className="text-primary/80 dark:text-primary" size={16} />
            <span className="text-foreground text-sm font-medium">{marker.location}</span>
          </div>
          <Button
            className="flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-colors"
            style={backgroundColor ? { background: backgroundColor } : {}}
            onClick={onDirectionClick}
            variant="secondary"
          >
            <FaDirections className="text-white" />
          </Button>
        </div>
      </div>
      {/* Plot Status */}
      <div className="bg-accent/40 dark:bg-accent/60 mb-3 flex items-center justify-between gap-2 rounded-lg p-2 shadow-sm transition-colors">
        <div className="flex items-center gap-1">
          <Info className="text-primary/80 dark:text-primary" size={16} />
          <span className="text-foreground text-sm">Plot Status</span>
        </div>
        <span
          className={
            marker.plotStatus === "reserved"
              ? "flex items-center gap-1 rounded bg-yellow-100 px-1.5 py-0.5 text-xs font-semibold text-yellow-800"
              : marker.plotStatus === "occupied"
                ? "flex items-center gap-1 rounded bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-800"
                : "flex items-center gap-1 rounded bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-800"
          }
        >
          {/* 🟢 Show only the relevant icon for each plotStatus */}
          {marker.plotStatus === "reserved" && <FaHourglassStart size={10} />}
          {marker.plotStatus === "occupied" && <BiXCircle size={14} />}
          {marker.plotStatus === "available" && <BiCheckCircle size={14} />}
          {!["reserved", "occupied", "available"].includes(marker.plotStatus)}
          <span className="text-xs capitalize">{marker.plotStatus}</span>
        </span>
      </div>
      {/* Plot Dimension */}
      <div className="mb-3 flex gap-2">
        <div className="bg-accent/40 dark:bg-accent/60 flex-1 rounded-lg p-2 shadow-sm transition-colors">
          <div className="mb-1 flex items-center gap-1">
            <Ruler className="text-blue-600 dark:text-blue-300" size={16} />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-200">Dimension</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-foreground text-xs font-bold">
              {marker.dimensions.length} m × {marker.dimensions.width} m<br />
            </div>
            <span className="text-muted-foreground text-xs">{marker.dimensions.area.toLocaleString()} m²</span>
          </div>
        </div>
        <div className="bg-accent/40 dark:bg-accent/60 flex-1 rounded-lg p-2 shadow-sm transition-colors">
          <div className="mb-1 flex items-center gap-1">
            <Info className="text-primary/80 dark:text-primary" size={16} />
            <span className="text-foreground text-xs font-semibold">Details</span>
          </div>
          <span
            className={
              (marker.category === "Bronze"
                ? "bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200"
                : marker.category === "Silver"
                  ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  : "bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-200") + " flex items-center justify-center rounded px-2 py-1 text-xs font-semibold shadow"
            }
          >
            <Award className="inline" size={14} />
            {marker.category}
          </span>
        </div>
      </div>
      {(() => {
        // 🖼️ Check both file_names_array and file_name properties
        const images = marker.file_names_array || marker.file_name || [];
        console.log("🖼️ Images to display:", images, "from marker:", marker);
        if (!isAdmin()) {
          return Array.isArray(images) && images.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-2">
              {images.map((imageUrl, idx) => (
                <img
                  onError={(e) => {
                    console.log("🖼️ Image failed to load:", imageUrl);
                    e.currentTarget.style.display = "none";
                  }}
                  onLoad={() => {
                    console.log("✅ Image loaded successfully:", imageUrl);
                  }}
                  className="h-30 w-full rounded object-cover transition-transform duration-200 hover:scale-105 hover:transform"
                  alt={`Plot media ${idx + 1}`}
                  src={imageUrl}
                  key={idx}
                />
              ))}
            </div>
          ) : (
            <div className="mt-2 text-center text-xs text-gray-400">No photos available</div>
          );
        }
      })()}
    </div>
  );
}
