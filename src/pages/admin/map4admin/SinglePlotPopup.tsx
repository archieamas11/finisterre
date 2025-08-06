import { useState } from "react";
import { Ruler, Plus, Edit, Eye } from "lucide-react";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import {
  FaHourglassStart,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaInfoCircle,
  FaAward,
  FaUser,
} from "react-icons/fa";

import type { ConvertedMarker } from "@/types/map.types";

import { isAdmin } from "@/utils/Auth.utils";
import { Button } from "@/components/ui/button";

import EditMapDialog from "./editMapDialog";

interface PlotLocationsProps {
  marker: ConvertedMarker;
  backgroundColor?: string;
}

export default function SinglePlotLocations({ marker }: PlotLocationsProps) {
  // 🔧 State for edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // 🔧 Handler functions for plot operations
  const handleEdit = () => {
    console.log("✏️ Edit plot:", marker.plot_id);
    setIsEditDialogOpen(true);
  };

  const handleAdd = () => {
    console.log("➕ Add deceased record:", marker.plot_id);
    // TODO: Open add plot dialog/form
  };

  const handleView = () => {
    console.log("👁️ View plot details:", marker.plot_id);
    // TODO: Open detailed view modal
  };

  return (
    <div className="mt-6">
      <div className="bg-card mb-3 rounded-lg p-3 shadow-lg">
        <div className="mb-2 flex items-stretch gap-3 rounded-lg">
          <Button
            className="bg-accent text-accent-foreground flex flex-1 items-center justify-center rounded-md"
            onClick={handleEdit}
          >
            <Edit />
          </Button>
          <Button
            className="bg-accent text-accent-foreground flex flex-1 items-center justify-center rounded-md"
            onClick={handleAdd}
          >
            <Plus />
          </Button>
          <Button
            className="bg-accent text-accent-foreground flex flex-1 items-center justify-center rounded-md"
            onClick={handleView}
          >
            <Eye />
          </Button>
        </div>
        <div className="bg-accent flex items-center justify-between gap-1 rounded-lg p-2 shadow-sm">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-accent-foreground" size={14} />
            <span className="text-accent-foreground text-xs font-medium">
              {marker.location}
            </span>
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
        <div className="bg-accent mt-2 flex items-center justify-between gap-2 rounded-lg p-2 shadow-sm">
          <div className="item-center flex gap-2">
            {/* ℹ️ Use react-icons for info */}
            <FaInfoCircle className="text-accent-foreground" size={14} />
            <span className="text-accent-foreground text-xs">
              Plot Category
            </span>
          </div>
          <span
            className={
              (marker.category === "bronze"
                ? "bg-amber-100 text-amber-800"
                : marker.category === "silver"
                  ? "bg-gray-200 text-gray-800"
                  : marker.category === "platinum"
                    ? "bg-yellow-200 text-yellow-900"
                    : marker.category === "diamond"
                      ? "bg-pink-200 text-pink-900"
                      : "bg-gray-100 text-gray-700") +
              " flex items-center justify-center rounded px-1.5 py-0.5 text-xs font-semibold"
            }
          >
            {/* 🏆 Use react-icons for award */}
            <FaAward className="inline" size={14} />
            <span className="ml-1">
              {marker.category.charAt(0).toUpperCase() +
                marker.category.slice(1)}
            </span>
          </span>
        </div>
        {/* 🧑‍💼 Customer Info */}
        <div className="bg-accent mt-2 flex items-center justify-between rounded-lg p-2 shadow-sm">
          <div className="flex items-center gap-2">
            <FaUser className="text-accent-foreground" size={14} />
            <span className="text-accent-foreground text-xs font-medium">
              Juan Dela Cruz
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-accent-foreground" size={14} />
            <span className="text-accent-foreground text-xs font-medium">
              2023-10-15
            </span>
          </div>
        </div>
      </div>
      {/* Plot Dimension */}
      <div className="mb-5 flex gap-2">
        <div className="bg-card flex-1 rounded-lg p-2 shadow-lg">
          <div className="mb-1 flex items-center gap-1">
            <Ruler className="text-blue-500" size={16} />
            <span className="text-accent-foreground text-xs font-semibold">
              Dimension
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-accent-foreground text-xs font-bold">
              {/* 🧮 Show N/A if length or width is missing or not a number */}
              {isNaN(marker.dimensions.length) ||
              marker.dimensions.length === undefined ||
              marker.dimensions.length === null
                ? "N/A"
                : marker.dimensions.length}{" "}
              m ×{" "}
              {isNaN(marker.dimensions.width) ||
              marker.dimensions.width === undefined ||
              marker.dimensions.width === null
                ? "N/A"
                : marker.dimensions.width}{" "}
              m<br />
            </div>
            <span className="text-accent-foreground text-xs">
              {/* 🧮 Show N/A if area is missing or not a number */}
              {isNaN(marker.dimensions.area) ||
              marker.dimensions.area === undefined ||
              marker.dimensions.area === null
                ? "N/A"
                : marker.dimensions.area.toLocaleString()}{" "}
              m²
            </span>
          </div>
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
            <div className="mt-5 text-center text-xs text-gray-400">
              No photos available
            </div>
          );
        }
      })()}

      {/* 🔧 Edit Dialog */}
      <EditMapDialog
        plots={{
          block: marker.block,
          plot_id: marker.plot_id,
          category: marker.category,
          status: marker.plotStatus,
          label: marker.label || "",
          area: marker.dimensions.area,
          coordinates: marker.position,
          width: marker.dimensions.width,
          length: marker.dimensions.length,
          file_name: marker.file_names_array || marker.file_name || [],
        }}
        onOpenChange={setIsEditDialogOpen}
        open={isEditDialogOpen}
      />
    </div>
  );
}
