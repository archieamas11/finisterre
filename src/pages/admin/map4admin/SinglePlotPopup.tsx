import {
  Plus,
  // Edit,
  Eye,
  MapPin,
  Award,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { ConvertedMarker } from "@/types/map.types";
import { isAdmin } from "@/utils/auth.utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePlotDetails } from "@/hooks/plots-hooks/usePlotDetails";
import { DeceasedSection } from "@/components/DeceasedSection";

interface PlotLocationsProps {
  marker: ConvertedMarker;
  backgroundColor?: string;
}

export default function SinglePlotLocations({ marker }: PlotLocationsProps) {
  const { data: plotDetails, isLoading: isLoadingDetails } = usePlotDetails(marker.plot_id);

  const ownerData = plotDetails?.owner;
  const deceasedData = plotDetails?.deceased;

  // Auto-refresh when component mounts or plot_id changes
  // const handleEdit = () => {
  //   console.log("✏️ Edit plot:", marker.plot_id);
  //   setIsEditDialogOpen(true);
  // };

  const handleAdd = () => {
    console.log("➕ Add deceased record:", marker.plot_id);
    // TODO: Open add plot dialog/form
  };

  const handleView = () => {
    console.log("👁️ View plot details:", marker.plot_id);
    // TODO: Open detailed view modal
  };

  return (
    <div className="max-w-full">
      {/* Action Buttons - Compact Row */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        {/* <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-card border text-accent-foreground hover:bg-accent/90"
        >
          <Edit className="h-3 w-3" />
          Edit
        </Button> */}
        <Button variant="secondary" size="lg" onClick={handleAdd} className="bg-card text-accent-foreground hover:bg-accent/90 flex items-center gap-1 border px-2 py-1 text-xs">
          <Plus className="h-3 w-3" />
          Add
        </Button>
        <Button variant="secondary" size="lg" onClick={handleView} className="bg-card text-accent-foreground hover:bg-accent/90 flex items-center gap-1 border px-2 py-1 text-xs">
          <Eye className="h-3 w-3" />
          View
        </Button>
      </div>

      {/* Main Content Grid - Two Columns */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {/* Left Column - Plot Info */}
        <Card className="h-83">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MapPin className="text-primary h-4 w-4" />
              Plot Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {/* Location */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">Location</span>
              </div>
              <span className="font-semibold">{marker.location}</span>
            </div>
            <Separator />

            {/* Status and Category - Row layout */}
            <div className="grid grid-cols-2 gap-2 py-2">
              <div className="text-center">
                <p className="text-muted-foreground mb-1 text-xs">Status</p>
                <Badge variant={marker.plotStatus === "available" ? "default" : marker.plotStatus === "reserved" ? "secondary" : "destructive"} className="text-xs">
                  {marker.plotStatus === "available" && <CheckCircle className="h-2 w-2" />}
                  {marker.plotStatus === "reserved" && <Clock className="h-2 w-2" />}
                  {marker.plotStatus === "occupied" && <XCircle className="h-2 w-2" />}
                  {marker.plotStatus}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground mb-1 text-xs">Category</p>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    marker.category === "bronze"
                      ? "border-amber-400 text-amber-700"
                      : marker.category === "silver"
                        ? "border-gray-400 text-gray-700"
                        : marker.category === "platinum"
                          ? "border-yellow-400 text-yellow-700"
                          : marker.category === "diamond"
                            ? "border-pink-400 text-pink-700"
                            : "border-gray-300 text-gray-600"
                  }`}
                >
                  <Award className="h-2 w-2" />
                  {marker.category.charAt(0).toUpperCase() + marker.category.slice(1)}
                </Badge>
              </div>
            </div>
            <Separator />

            {/* Dimensions - Improved Design */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">Dimensions</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-xs font-semibold">
                  <span>{isNaN(marker.dimensions.length) || marker.dimensions.length === undefined || marker.dimensions.length === null ? "N/A" : marker.dimensions.length}m</span>
                  <span className="text-muted-foreground">×</span>
                  <span>{isNaN(marker.dimensions.width) || marker.dimensions.width === undefined || marker.dimensions.width === null ? "N/A" : marker.dimensions.width}m</span>
                  <span className="text-muted-foreground">×</span>
                  <span>
                    {isNaN(marker.dimensions.area) || marker.dimensions.area === undefined || marker.dimensions.area === null ? "N/A" : marker.dimensions.area.toLocaleString()}
                    m²
                  </span>
                </div>
                <div className="text-muted-foreground mt-1 text-[10px]">Length × Width × Area</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Combined Owner & Deceased */}
        <div className="space-y-3">
          <DeceasedSection owner={ownerData ?? null} fallbackOwner={marker.owner} deceased={deceasedData || []} isLoading={isLoadingDetails} />
        </div>
      </div>

      {/* Plot Images - Full Width if exists */}
      {(() => {
        const images = marker.file_names_array || marker.file_name || [];
        if (!isAdmin() && Array.isArray(images) && images.length > 0) {
          return (
            <Card className="mt-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {images.slice(0, 3).map((imageUrl, idx) => (
                    <div key={idx} className="aspect-square overflow-hidden rounded border">
                      <img className="h-full w-full object-cover transition-transform duration-200 hover:scale-105" alt={`Plot image ${idx + 1}`} src={imageUrl} />
                    </div>
                  ))}
                </div>
                {images.length > 3 && <p className="text-muted-foreground mt-1 text-center text-xs">+{images.length - 3} more images</p>}
              </CardContent>
            </Card>
          );
        } else if (!isAdmin()) {
          return (
            <div className="mt-3 text-center">
              <p className="text-muted-foreground text-xs">No images available</p>
            </div>
          );
        }
        return null;
      })()}

      {/* Edit Dialog */}
      {/* <EditMapDialog
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
      /> */}
    </div>
  );
}
