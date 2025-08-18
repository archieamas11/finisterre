import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Marker } from "react-leaflet";
import { useMapEvents } from "react-leaflet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import L from "leaflet";
import { updatePlotCoordinates } from "@/api/plots.api";
import { toast } from "sonner";

interface EditableMarkerProps {
  plotId: string;
  position: [number, number];
  icon: L.DivIcon;
  children: React.ReactNode;
  isEditable: boolean;
  isSelected: boolean;
  onMarkerClick: (plotId: string) => void;
  onEditComplete: () => void;
  onSaveSuccess?: () => void;
  onPopupOpen?: () => void;
  onPopupClose?: () => void;
}

export default function EditableMarker({
  plotId,
  position,
  icon,
  children,
  isEditable,
  isSelected,
  onMarkerClick,
  onEditComplete,
  onSaveSuccess,
  onPopupOpen,
  onPopupClose,
}: EditableMarkerProps) {
  const markerRef = useRef<L.Marker | null>(null);
  const isDraggingRef = useRef(false);
  const currentPositionRef = useRef<[number, number]>(position);
  const [localPosition, setLocalPosition] = useState<[number, number]>(position);
  const queryClient = useQueryClient();

  // Update local position when prop changes, but only if it's different
  useEffect(() => {
    const [currentLat, currentLng] = localPosition;
    const [newLat, newLng] = position;

    if (currentLat !== newLat || currentLng !== newLng) {
      setLocalPosition(position);
    }
  }, [position, localPosition]);

  // Update marker position when local position changes
  useEffect(() => {
    if (markerRef.current) {
      const currentLatLng = markerRef.current.getLatLng();
      const [newLat, newLng] = localPosition;

      // Only update if the position has actually changed
      if (currentLatLng.lat !== newLat || currentLatLng.lng !== newLng) {
        markerRef.current.setLatLng(localPosition);
        currentPositionRef.current = localPosition;
      }
    }
  }, [localPosition]);

  // Selected plot marker style to edit
  useEffect(() => {
    let style = document.getElementById("selected-marker-styles");
    if (style) return;
    style = document.createElement("style");
    style.id = "selected-marker-styles";
    style.innerHTML = `
      @keyframes markerPulse {
        0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
      }
      
      .marker-selected {
        animation: markerPulse 1.5s infinite;
        filter: drop-shadow(0 0 8px #3b82f6) brightness(1.2);
        z-index: 1000 !important;
        transition: all 0.3s ease;
      }
      
      .marker-editing-indicator {
        position: absolute;
        top: 45%;
        left: 49%;
        transform: translate(-50%, -50%);
        width: 150%;
        height: 150%;
        border: 3px dashed #3b82f6;
        border-radius: 50%;
        animation: rotate 10s linear infinite;
        z-index: -1;
        pointer-events: none;
      }
      
      @keyframes rotate {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
      
      .leaflet-marker-draggable {
        cursor: move !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const markerIcon = useMemo(() => {
    if (!isSelected || !isEditable) {
      return icon;
    }
    let originalHtml = "";
    if (typeof icon.options.html === "string") {
      originalHtml = icon.options.html;
    } else if (icon.options.html && typeof icon.options.html === "object" && "outerHTML" in icon.options.html) {
      originalHtml = (icon.options.html as HTMLElement).outerHTML;
    }
    const enhancedHtml = `
      <div style="position: relative; display: inline-block;">
        ${originalHtml}
        <div class="marker-editing-indicator"></div>
      </div>
    `;
    return L.divIcon({
      ...icon.options,
      html: enhancedHtml,
      className: `${icon.options.className || ""} marker-selected`.trim(),
    });
  }, [icon, isSelected, isEditable]);

  // Mutation for updating coordinates with optimistic updates
  const updateCoordinatesMutation = useMutation({
    mutationFn: async ({ plot_id, coordinates }: { plot_id: string; coordinates: string }) => {
      return updatePlotCoordinates(plot_id, coordinates);
    },
    onMutate: async ({ plot_id, coordinates }) => {
      await queryClient.cancelQueries({ queryKey: ["plots"] });
      await queryClient.cancelQueries({ queryKey: ["plotDetails", plot_id] });

      const previousPlots = queryClient.getQueryData<any[]>(["plots"]);
      const previousPlotsClone = previousPlots ? JSON.parse(JSON.stringify(previousPlots)) : undefined;

      // parse "lng, lat" safely
      const parts = String(coordinates)
        .split(",")
        .map((s) => parseFloat(s.trim()));
      const [lng, lat] = parts.length >= 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1]) ? [parts[0], parts[1]] : [undefined, undefined];

      if (lat !== undefined && lng !== undefined) {
        // set local marker position so UI moves right away
        setLocalPosition([lat, lng]);
        currentPositionRef.current = [lat, lng];
      }

      // update cache fields that your UI may read
      if (previousPlots) {
        queryClient.setQueryData(["plots"], (old: any) => {
          if (!old) return old;
          return old.map((plot: any) =>
            plot.plot_id === plot_id
              ? {
                  ...plot,
                  // change the exact field your UI reads. keep the string too if needed.
                  coordinates: `${lng}, ${lat}`,
                  position: lat !== undefined && lng !== undefined ? [lat, lng] : plot.position,
                }
              : plot,
          );
        });
      }

      return { previousPlots: previousPlotsClone };
    },

    onError: (_err, _variables, context) => {
      // Roll back cache if we saved a snapshot in onMutate
      if (context?.previousPlots) {
        queryClient.setQueryData(["plots"], context.previousPlots);
      }
      // Reset marker position on error
      setLocalPosition(position);
      currentPositionRef.current = position;
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plots"] });
      if (variables?.plot_id) {
        queryClient.invalidateQueries({ queryKey: ["plotDetails", variables.plot_id] });
      }
    },
    onSuccess: () => {
      // ✅ Keep edit session active; return to select mode
      onSaveSuccess?.();
    },
  });

  // Save current position
  const savePosition = useCallback(async () => {
    const [lat, lng] = currentPositionRef.current;
    try {
      await toast.promise(
        updateCoordinatesMutation.mutateAsync({
          plot_id: plotId,
          coordinates: `${lng}, ${lat}`,
        }),
        {
          loading: "Updating marker position...",
          success: "Marker position updated.",
          error: "Failed to update marker position.",
        },
      );
    } catch (e) {}
  }, [plotId, updateCoordinatesMutation]);

  // Cancel editing and reset position
  const cancelEditing = useCallback(() => {
    setLocalPosition(position);
    onEditComplete();
  }, [position, onEditComplete]);

  // Handle keyboard events (unchanged)
  useMapEvents({
    keydown(e: L.LeafletKeyboardEvent) {
      if (!isSelected) return;
      if (e.originalEvent.key === "Enter") {
        e.originalEvent.preventDefault();
        savePosition();
      } else if (e.originalEvent.key === "Escape") {
        e.originalEvent.preventDefault();
        cancelEditing();
      }
    },
  });

  // Setup dragging behavior (unchanged)
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    // Clear existing event listeners
    marker.off("dragstart").off("drag").off("dragend");

    if (isSelected && isEditable) {
      // Enable dragging
      if (!marker.dragging?.enabled()) {
        marker.dragging?.enable();
      }

      // Set up drag event listeners
      marker.on("dragstart", () => {
        isDraggingRef.current = true;
      });

      marker.on("drag", (e) => {
        const { lat, lng } = e.target.getLatLng();
        currentPositionRef.current = [lat, lng];
      });

      marker.on("dragend", () => {
        isDraggingRef.current = false;
      });

      // Focus map container for keyboard events
      const mapContainer = document.querySelector(".leaflet-container") as HTMLElement;
      if (mapContainer && mapContainer.getAttribute("tabindex") !== "0") {
        mapContainer.setAttribute("tabindex", "0");
        mapContainer.style.outline = "none";
      }
    } else {
      // Disable dragging
      if (marker.dragging?.enabled()) {
        marker.dragging?.disable();
      }
    }
  }, [isSelected, isEditable, savePosition]);

  // Handle marker click
  const handleMarkerClick = useCallback(() => {
    // Prevent click during drag
    if (isDraggingRef.current) return;
    if (isEditable) {
      onMarkerClick(plotId);
      // Focus map for keyboard events
      setTimeout(() => {
        const mapContainer = document.querySelector(".leaflet-container") as HTMLElement;
        if (mapContainer) {
          mapContainer.focus();
        }
      }, 0);
    }
  }, [isEditable, onMarkerClick, plotId]);

  // Event handlers
  const eventHandlers = useMemo(() => {
    const handlers: any = {
      click: handleMarkerClick,
    };
    // Only add popup handlers when not in edit mode
    if (!isEditable) {
      if (onPopupOpen) handlers.popupopen = onPopupOpen;
      if (onPopupClose) handlers.popupclose = onPopupClose;
    }
    return handlers;
  }, [handleMarkerClick, isEditable, onPopupOpen, onPopupClose]);

  return (
    <Marker ref={markerRef} position={localPosition} icon={markerIcon} eventHandlers={eventHandlers} draggable={isSelected && isEditable}>
      {/* Only render popup content when not in editable mode */}
      {!isEditable && children}
    </Marker>
  );
}
