import { useCallback, useEffect, useMemo, useRef } from "react";
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
  onPopupOpen,
  onPopupClose,
}: EditableMarkerProps) {
  const markerRef = useRef<L.Marker>(null);
  const isDraggingRef = useRef(false);
  const currentPositionRef = useRef<[number, number]>(position);
  const queryClient = useQueryClient();

  // Update position ref when prop changes
  useEffect(() => {
    currentPositionRef.current = position;
  }, [position]);

  // Inject CSS once on mount
  useEffect(() => {
    if (document.getElementById("selected-marker-styles")) return;

    const style = document.createElement("style");
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
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 150%;
        height: 150%;
        border: 2px dashed #3b82f6;
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

  // Memoize the icon to prevent unnecessary recreations
  const markerIcon = useMemo(() => {
    if (!isSelected || !isEditable) {
      return icon;
    }

    // Create enhanced icon for selected/editable state
    // Safely get originalHtml from icon.options.html
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

  // Mutation for updating coordinates
  const updateCoordinatesMutation = useMutation({
    mutationFn: async ({ plot_id, coordinates }: { plot_id: string; coordinates: string }) => {
      return updatePlotCoordinates(plot_id, coordinates);
    },
    onSuccess: () => {
      toast.success("📍 Marker coordinates updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["plots"] });
      onEditComplete();
    },
    onError: (error) => {
      console.error("Failed to update coordinates:", error);
      toast.error("❌ Failed to update marker coordinates. Please try again.");
      // Reset marker position on error
      if (markerRef.current) {
        markerRef.current.setLatLng(position);
        currentPositionRef.current = position;
      }
    },
  });

  // Save current position
  const savePosition = useCallback(() => {
    const coordinates = `${currentPositionRef.current[1]}, ${currentPositionRef.current[0]}`;
    updateCoordinatesMutation.mutate({
      plot_id: plotId,
      coordinates,
    });
  }, [plotId, updateCoordinatesMutation]);

  // Cancel editing and reset position
  const cancelEditing = useCallback(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(position);
      currentPositionRef.current = position;
    }
    onEditComplete();
  }, [position, onEditComplete]);

  // Handle keyboard events
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

  // Setup dragging behavior
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    // Clear existing event listeners
    marker.off("dragstart drag dragend");

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
        // Optional: Auto-save on drag end
        // savePosition();
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
    <Marker ref={markerRef} position={position} icon={markerIcon} eventHandlers={eventHandlers} draggable={isSelected && isEditable}>
      {/* Only render popup content when not in editable mode */}
      {!isEditable && children}
    </Marker>
  );
}
