import { useQueryClient } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { useRef, useState, useEffect, Suspense, lazy, useCallback } from "react";
import { MapContainer, TileLayer, Popup, GeoJSON } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

import type { ConvertedMarker } from "@/types/map.types";

import { ErrorMessage } from "@/components/ErrorMessage";
import AddMarkerInstructions from "@/components/map/AddMarkerInstructions";
import AddPlotMarkerDialog from "@/components/map/AddPlotMarkerDialog";
import EditableMarker from "@/components/map/EditableMarker";
import EditMarkerInstructions from "@/components/map/EditMarkerInstructions";
import MapClickHandler from "@/components/map/MapClickHandler";
import Spinner from "@/components/ui/spinner";
import { usePlots } from "@/hooks/plots-hooks/plot.hooks";
import ColumbariumPopup from "@/pages/admin/map4admin/ColumbariumPopup";
import SinglePlotLocations from "@/pages/admin/map4admin/SinglePlotPopup";
import WebMapNavs from "@/pages/webmap/WebMapNavs";
import { getCategoryBackgroundColor, convertPlotToMarker, getStatusColor } from "@/types/map.types";

import guide4BlockCUrl from "./guide-4-block-b.geojson?url";
import { LocateContext } from "./LocateContext";
import MapStats from "./MapStats";

const ComfortRoomMarker = lazy(() => import("@/pages/webmap/ComfortRoomMarkers"));
const ParkingMarkers = lazy(() => import("@/pages/webmap/ParkingMarkers"));
const CenterSerenityMarkers = lazy(() => import("@/pages/webmap/CenterSerenityMarkers"));
const MainEntranceMarkers = lazy(() => import("@/pages/webmap/MainEntranceMarkers"));
const ChapelMarkers = lazy(() => import("@/pages/webmap/ChapelMarkers"));
const PlaygroundMarkers = lazy(() => import("@/pages/webmap/PlaygroundMarkers"));

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconRetinaUrl,
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function AdminMapLayout() {
  const showGuide4 = false;
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
  const onEditComplete = useCallback(() => {
    setSelectedPlotForEdit(null);
    setIsEditingMarker(false);
    document.body.classList.remove("edit-marker-mode");
  }, []);

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

  // ⎋ Unified Escape handler: cancel add/edit flows and close dialog reliably
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      e.preventDefault();

      // If add dialog is open, close it and reset coordinates
      if (showAddDialog) {
        setShowAddDialog(false);
        setSelectedCoordinates(null);
        setIsAddingMarker(false);
        document.body.classList.remove("add-marker-mode");
        return;
      }

      // If currently in add-marker mode (and dialog not open), cancel it
      if (isAddingMarker) {
        setIsAddingMarker(false);
        setSelectedCoordinates(null);
        document.body.classList.remove("add-marker-mode");
        return;
      }

      // If editing and a specific plot is selected, cancel that edit
      if (isEditingMarker && selectedPlotForEdit) {
        onEditComplete();
        return;
      }

      // If editing mode is active but no plot selected, exit editing mode
      if (isEditingMarker) {
        setIsEditingMarker(false);
        setSelectedPlotForEdit(null);
        document.body.classList.remove("edit-marker-mode");
        return;
      }
    }

    // Attach listener only when relevant states are active to avoid global interception
    if (!(isAddingMarker || isEditingMarker || showAddDialog || selectedPlotForEdit)) return;

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAddingMarker, isEditingMarker, showAddDialog, selectedPlotForEdit, onEditComplete]);

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
      <LocateContext.Provider
        value={{
          requestLocate,
          isAddingMarker,
          toggleAddMarker,
          isEditingMarker,
          toggleEditMarker,
        }}
      >
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
                  color: "#FFDE21",
                  weight: 1,
                  opacity: 1,
                })}
                onEachFeature={(feature, layer) => {
                  const id = (feature.properties as { id?: string | number | null } | undefined)?.id ?? "Guide Path";
                  layer.bindTooltip(String(id), { sticky: true });
                }}
              />
            )}

            {/* 🎯 Map click handler for adding markers */}
            <MapClickHandler isAddingMarker={isAddingMarker} onMapClick={onMapClick} />
            <Suspense fallback={null}>
              <MainEntranceMarkers />
              <ChapelMarkers />
              <PlaygroundMarkers />
              <ParkingMarkers />
              <CenterSerenityMarkers />
              <ComfortRoomMarker />
            </Suspense>
            {/* Plot Markers grouped into clusters by block or category */}
            {(() => {
              const markersByGroup: Record<string, ConvertedMarker[]> = {};
              markers.forEach((marker: ConvertedMarker) => {
                const groupKey = marker.block && String(marker.block).trim() !== "" ? `block:${marker.block}` : `category:${marker.category || "Uncategorized"}`;
                if (!markersByGroup[groupKey]) markersByGroup[groupKey] = [];
                markersByGroup[groupKey].push(marker);
              });

              const getLabel = (groupKey: string): string => {
                if (groupKey.startsWith("block:")) {
                  const block = groupKey.split("block:")[1];
                  return `Block ${block}`;
                } else {
                  const category = groupKey
                    .split("category:")[1]
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
                  return category;
                }
              };

              const createClusterIcon = (groupKey: string) => (cluster: { getChildCount: () => number }) => {
                const count = cluster.getChildCount();
                const label = getLabel(groupKey);

                return L.divIcon({
                  html: `
                  <div class="relative flex flex-col items-center justify-center">
                    <div
                      class="border-2 border-white text-white bg-black/50 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
                    >
                      ${count}
                    </div>
                    <span class="shadow-md mt-1 text-xs font-bold text-gray-200">${label}</span>
                  </div>
                `,
                  className: "custom-marker-cluster",
                  iconSize: [50, 60],
                  iconAnchor: [25, 30],
                });
              };

              return Object.entries(markersByGroup).map(([groupKey, groupMarkers]) => {
                // When editing markers, disable clustering so markers are individually clickable/draggable
                if (isEditingMarker) {
                  return (
                    <div key={`cluster-${groupKey}`}>
                      {groupMarkers.map((marker: ConvertedMarker) => {
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
                              <Popup className="leaflet-theme-popup" closeButton={false} offset={[2, 10]} minWidth={450}>
                                <div className="w-full py-2">
                                  <ColumbariumPopup marker={marker} />
                                </div>
                              </Popup>
                            ) : (
                              <Popup className="leaflet-theme-popup" closeButton={false} offset={[2, 10]} minWidth={600} maxWidth={600}>
                                <SinglePlotLocations backgroundColor={backgroundColor} marker={marker} popupCloseTick={popupCloseTick} />
                              </Popup>
                            )}
                          </EditableMarker>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <MarkerClusterGroup
                    key={`cluster-${groupKey}`}
                    iconCreateFunction={createClusterIcon(groupKey)}
                    chunkedLoading
                    maxClusterRadius={Infinity}
                    disableClusteringAtZoom={20}
                  >
                    {groupMarkers.map((marker: ConvertedMarker) => {
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
                            <Popup className="leaflet-theme-popup" closeButton={false} offset={[2, 10]} minWidth={450}>
                              <div className="w-full py-2">
                                <ColumbariumPopup marker={marker} />
                              </div>
                            </Popup>
                          ) : (
                            <Popup className="leaflet-theme-popup" closeButton={false} offset={[2, 10]} minWidth={600} maxWidth={600}>
                              <SinglePlotLocations backgroundColor={backgroundColor} marker={marker} popupCloseTick={popupCloseTick} />
                            </Popup>
                          )}
                        </EditableMarker>
                      );
                    })}
                  </MarkerClusterGroup>
                );
              });
            })()}
          </MapContainer>
        </div>
        {/* 📝 Add Plot Dialog */}
        <AddPlotMarkerDialog open={showAddDialog} onOpenChange={onDialogClose} coordinates={selectedCoordinates} onDoneAdd={onAddDone} />
      </LocateContext.Provider>
    </div>
  );
}
