import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Suspense, lazy } from "react";
import { createContext, useRef, useState, useEffect } from "react";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import { MapContainer, TileLayer, Popup, GeoJSON } from "react-leaflet";
import { useQueryClient } from "@tanstack/react-query";
import type { ConvertedMarker } from "@/types/map.types";
import WebMapNavs from "@/pages/webmap/WebMapNavs";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlots } from "@/hooks/plots-hooks/plot.hooks";
import { getCategoryBackgroundColor, convertPlotToMarker, getStatusColor } from "@/types/map.types";
import Spinner from "@/components/ui/spinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import MapStats from "./MapStats";
import MapClickHandler from "@/components/map/MapClickHandler";
import guide4BlockCUrl from "./guide-4-block-b.geojson?url";
import AddPlotMarkerDialog from "@/components/map/AddPlotMarkerDialog";
import AddMarkerInstructions from "@/components/map/AddMarkerInstructions";
import EditMarkerInstructions from "@/components/map/EditMarkerInstructions";
import EditableMarker from "@/components/map/EditableMarker";
import MainEntranceMarkers from "@/pages/webmap/MainEntranceMarkers";
import ChapelMarkers from "@/pages/webmap/ChapelMarkers";
const ColumbariumPopup = lazy(() => import("@/pages/admin/map4admin/ColumbariumPopup"));
const SinglePlotLocations = lazy(() => import("@/pages/admin/map4admin/SinglePlotPopup"));

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconRetinaUrl,
});
L.Marker.prototype.options.icon = DefaultIcon;

export const LocateContext = createContext<{
  requestLocate: () => void;
  isAddingMarker: boolean;
  toggleAddMarker: () => void;
  isEditingMarker: boolean;
  toggleEditMarker: () => void;
} | null>(null);

export default function AdminMapLayout() {
  const showGuide4 = true;
  const { isError, refetch, isLoading, data: plotsData } = usePlots();
  const queryClient = useQueryClient();
  const markers = plotsData?.map(convertPlotToMarker) || [];
  const [guide4Data, setGuide4Data] = useState<GeoJSON.GeoJSON | null>(null);
  const bounds: [[number, number], [number, number]] = [
    [10.248073279164613, 123.79742173990627],
    [10.249898252065757, 123.79838766292835],
  ];
  const locateRef = useRef<(() => void) | null>(null);
  const requestLocate = () => {
    if (locateRef.current) locateRef.current();
  };

  // 🎯 Add marker state
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // ✏️ Edit marker state
  const [isEditingMarker, setIsEditingMarker] = useState(false);
  const [selectedPlotForEdit, setSelectedPlotForEdit] = useState<string | null>(null);

  const toggleAddMarker = () => {
    setIsAddingMarker(!isAddingMarker);
    // ✨ Toggle CSS class for cursor style
    if (!isAddingMarker) {
      document.body.classList.add("add-marker-mode");
    } else {
      document.body.classList.remove("add-marker-mode");
    }
  };

  const toggleEditMarker = () => {
    setIsEditingMarker(!isEditingMarker);
    // 🔄 Reset selected plot when toggling off
    if (isEditingMarker) {
      setSelectedPlotForEdit(null);
    }
    // ✨ Toggle CSS class for cursor style
    if (!isEditingMarker) {
      document.body.classList.add("edit-marker-mode");
    } else {
      document.body.classList.remove("edit-marker-mode");
    }
  };

  // ✏️ Handle marker selection for editing
  const onMarkerClickForEdit = (plotId: string) => {
    if (isEditingMarker) {
      setSelectedPlotForEdit(plotId);
    }
  };

  // ✅ Handle edit completion (save or cancel)
  const onEditComplete = () => {
    setSelectedPlotForEdit(null);
    setIsEditingMarker(false);
    document.body.classList.remove("edit-marker-mode");
  };

  // 📍 Handle map click when adding marker
  const onMapClick = (coordinates: [number, number]) => {
    setSelectedCoordinates(coordinates);
    setShowAddDialog(true);
    // Pause add mode while dialog is open to prevent accidental clicks
    setIsAddingMarker(false);
    document.body.classList.remove("add-marker-mode");
  };

  // 🚫 Handle dialog close
  const onDialogClose = (open: boolean) => {
    setShowAddDialog(open);
    if (!open) {
      setSelectedCoordinates(null);
    }
  };

  // ✅ After a successful add, immediately return to add mode for rapid entry
  const onAddDone = () => {
    setSelectedCoordinates(null);
    setShowAddDialog(false);
    setIsAddingMarker(true);
    document.body.classList.add("add-marker-mode");
  };

  // 🧹 Cleanup effect to remove cursor class on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove("add-marker-mode");
      document.body.classList.remove("edit-marker-mode");
    };
  }, []);

  // ⎋ Allow Escape to cancel add-marker mode when dialog is not open
  useEffect(() => {
    if (!isAddingMarker || showAddDialog) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAddingMarker, showAddDialog]);

  // ⎋ Allow Escape to cancel the "Select marker to edit" step
  useEffect(() => {
    if (!isEditingMarker || selectedPlotForEdit) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setSelectedPlotForEdit(null);
        setIsEditingMarker(false);
        document.body.classList.remove("edit-marker-mode");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isEditingMarker, selectedPlotForEdit]);

  // 📦 Load local GeoJSON asset at runtime (avoids bundler parsing issues)
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(guide4BlockCUrl);
        if (!res.ok) return;
        const json = (await res.json()) as GeoJSON.GeoJSON;
        if (mounted) setGuide4Data(json);
      } catch {
        // 🧯 Ignore optional layer load failure
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Track popup close events to reset child UI (like comboboxes)
  const [popupCloseTick, setPopupCloseTick] = useState(0);

  // Function to handle popup opening - invalidate cache for fresh data
  const handlePopupOpen = (plot_id: string) => {
    // Invalidate the specific plot details cache when popup opens
    queryClient.invalidateQueries({
      queryKey: ["plotDetails", plot_id],
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !plotsData) {
    return <ErrorMessage message="Failed to load map data. Please check your connection and try again." onRetry={refetch} showRetryButton={true} />;
  }

  return (
    <div className="h-full w-full rounded-lg border p-2">
      <LocateContext.Provider value={{ requestLocate, isAddingMarker, toggleAddMarker, isEditingMarker, toggleEditMarker }}>
        <div className="relative z-1 h-full w-full">
          <WebMapNavs />
          <MapStats />

          {/* 🎯 Instructions for add marker mode */}
          <AddMarkerInstructions isVisible={isAddingMarker} />

          {/* ✏️ Instructions for edit marker mode */}
          <EditMarkerInstructions isVisible={isEditingMarker} step={selectedPlotForEdit ? "edit" : "select"} />

          <MapContainer
            className="h-full w-full rounded-lg"
            markerZoomAnimation={true}
            scrollWheelZoom={true}
            fadeAnimation={false}
            zoomControl={false}
            bounds={bounds}
            maxZoom={25}
            zoom={18}
          >
            <TileLayer url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxNativeZoom={18} maxZoom={25} />

            {/* GeoJSON overlay: Guide 4 Block C */}
            {showGuide4 && guide4Data && (
              <GeoJSON
                data={guide4Data}
                style={() => ({
                  color: "#00E5FF",
                  weight: 3,
                  opacity: 0.9,
                })}
                onEachFeature={(feature, layer) => {
                  const id = (feature.properties as { id?: string | number | null } | undefined)?.id ?? "Guide Path";
                  layer.bindTooltip(String(id), { sticky: true });
                }}
              />
            )}

            {/* 🎯 Map click handler for adding markers */}
            <MapClickHandler isAddingMarker={isAddingMarker} onMapClick={onMapClick} />
            <MainEntranceMarkers />
            <ChapelMarkers />
            {/* Plot Markers */}
            {markers.map((marker: ConvertedMarker) => {
              const statusColor = getStatusColor(marker.plotStatus);
              const circleIcon = L.divIcon({
                className: "",
                html: `<div style="
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background: ${statusColor};
                border: 1px solid #fff;
                box-shadow: 0 0 4px rgba(0,0,0,0.15);
                "></div>`,
              });
              const backgroundColor = getCategoryBackgroundColor(marker.category);

              return (
                <EditableMarker
                  key={`plot-${marker.plot_id}`}
                  plotId={marker.plot_id}
                  position={marker.position}
                  icon={circleIcon}
                  isEditable={isEditingMarker}
                  isSelected={selectedPlotForEdit === marker.plot_id}
                  onMarkerClick={onMarkerClickForEdit}
                  onEditComplete={onEditComplete}
                  onSaveSuccess={() => setSelectedPlotForEdit(null)}
                  onPopupOpen={() => handlePopupOpen(marker.plot_id)}
                  onPopupClose={() => setPopupCloseTick((t) => t + 1)}
                >
                  {marker.rows && marker.columns ? (
                    // 🏢 Columbarium Popup
                    <Popup className="leaflet-theme-popup" closeButton={false} offset={[2, 10]} minWidth={450}>
                      <div className="w-full py-2">
                        <Suspense
                          fallback={
                            <>
                              <Skeleton className="mb-2 h-[24px] w-full rounded" />
                              <Skeleton className="mb-2 h-[18px] w-full rounded" />
                              <Skeleton className="mb-3 h-[200px] w-full rounded" />
                              <Skeleton className="h-[36px] w-full rounded" />
                            </>
                          }
                        >
                          <ColumbariumPopup marker={marker} />
                        </Suspense>
                      </div>
                    </Popup>
                  ) : (
                    // 🏠 Single Plot Popup
                    <Popup className="leaflet-theme-popup" closeButton={false} offset={[2, 10]} minWidth={600} maxWidth={600}>
                      <Suspense
                        fallback={
                          <>
                            <div className="mb-3 flex items-center justify-between gap-2">
                              <Skeleton className="h-[40px] w-full rounded" />
                              <Skeleton className="h-[40px] w-full rounded" />
                              <Skeleton className="h-[40px] w-full rounded" />
                            </div>
                            <div className="mb-3">
                              <div className="mb-2 flex items-center">
                                <Skeleton className="h-[40px] w-full rounded" />
                              </div>
                              <div className="mb-2 flex items-center">
                                <Skeleton className="h-[40px] w-full rounded" />
                              </div>
                              <div className="mb-2 flex items-center">
                                <Skeleton className="h-[40px] w-full rounded" />
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="mb-2 flex items-center">
                                <Skeleton className="h-[60px] w-full rounded" />
                              </div>
                            </div>
                          </>
                        }
                      >
                        <SinglePlotLocations backgroundColor={backgroundColor} marker={marker} popupCloseTick={popupCloseTick} />
                      </Suspense>
                    </Popup>
                  )}
                </EditableMarker>
              );
            })}
          </MapContainer>
        </div>
        {/* 📝 Add Plot Dialog */}
        <AddPlotMarkerDialog open={showAddDialog} onOpenChange={onDialogClose} coordinates={selectedCoordinates} onDoneAdd={onAddDone} />
      </LocateContext.Provider>
    </div>
  );
}
