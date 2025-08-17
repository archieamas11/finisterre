import { useEffect, useRef, useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [tempPosition, setTempPosition] = useState<[number, number]>(position);
  const queryClient = useQueryClient();

  // Inject CSS for selected marker animation
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
        z-index: 1000;
        transition: all 0.3s ease;
      }
      .marker-selected::before {
        content: '';
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
      }
      @keyframes rotate {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Create a custom icon with editing indicator when selected
  const getIcon = () => {
    if (isSelected && isEditable) {
      // Get the original HTML content as a string
      let originalHtml = "";
      if (icon.options.html) {
        if (typeof icon.options.html === "string") {
          originalHtml = icon.options.html;
        } else {
          originalHtml = icon.options.html.outerHTML;
        }
      }

      // Create wrapper div
      const wrapper = document.createElement("div");
      wrapper.className = "marker-wrapper";
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";
      wrapper.innerHTML = originalHtml;

      // Create the indicator element
      const indicator = document.createElement("div");
      indicator.className = "marker-indicator";
      indicator.style.position = "absolute";
      indicator.style.top = "50%";
      indicator.style.left = "50%";
      indicator.style.transform = "translate(-50%, -50%)";
      indicator.style.width = "150%";
      indicator.style.height = "150%";
      indicator.style.border = "2px dashed #3b82f6";
      indicator.style.borderRadius = "50%";
      indicator.style.animation = "rotate 10s linear infinite";
      indicator.style.zIndex = "-1";

      // Add the indicator to the wrapper
      wrapper.appendChild(indicator);

      return L.divIcon({
        className: icon.options.className || "",
        html: wrapper.outerHTML,
        iconSize: icon.options.iconSize,
        iconAnchor: icon.options.iconAnchor,
        popupAnchor: icon.options.popupAnchor,
      });
    }
    return icon;
  };

  // 🔄 Mutation for updating coordinates
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
      // 🔄 Reset position on error
      setTempPosition(position);
      if (markerRef.current) {
        markerRef.current.setLatLng(position);
      }
    },
  });

  // 🎯 Handle keyboard events
  useMapEvents({
    keydown(e: L.LeafletKeyboardEvent) {
      if (!isSelected) return;
      if (e.originalEvent.key === "Enter") {
        // 💾 Save the new coordinates
        const coordinates = `${tempPosition[1]}, ${tempPosition[0]}`;
        updateCoordinatesMutation.mutate({
          plot_id: plotId,
          coordinates,
        });
      } else if (e.originalEvent.key === "Escape") {
        // ❌ Cancel editing and reset position
        setTempPosition(position);
        if (markerRef.current) {
          markerRef.current.setLatLng(position);
        }
        onEditComplete();
      }
    },
  });

  // 🎣 Set up draggable behavior when selected for editing
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    if (isSelected && isEditable) {
      // 🎯 Make marker draggable
      marker.dragging?.enable();

      // 🎨 Update marker style to indicate it's selected
      const element = marker.getElement();
      if (element) {
        element.classList.add("marker-selected");
        // Position marker above others
        element.style.zIndex = "1000";
      }

      // 📍 Handle drag events
      marker.on("dragstart", () => {
        setIsDragging(true);
      });
      marker.on("drag", (e) => {
        const { lat, lng } = e.target.getLatLng();
        setTempPosition([lat, lng]);
      });
      marker.on("dragend", () => {
        setIsDragging(false);
      });
    } else {
      // 🚫 Disable dragging and reset style
      marker.dragging?.disable();
      const element = marker.getElement();
      if (element) {
        element.classList.remove("marker-selected");
        element.style.zIndex = "";
      }
    }

    // 🧹 Cleanup function
    return () => {
      marker.off("dragstart");
      marker.off("drag");
      marker.off("dragend");
    };
  }, [isSelected, isEditable]);

  // 🎯 Handle marker click in edit mode
  const handleMarkerClick = () => {
    if (isEditable && !isDragging) {
      onMarkerClick(plotId);
      // 🎯 Focus the map container to ensure keyboard events work
      const mapContainer = document.querySelector(".leaflet-container") as HTMLElement;
      if (mapContainer) {
        mapContainer.focus();
      }
    }
  };

  // 🎯 Create event handlers with proper typing
  const eventHandlers = {
    click: handleMarkerClick,
    // 🚫 Only enable popup events when not in edit mode
    ...(!isEditable && onPopupOpen && { popupopen: onPopupOpen }),
    ...(!isEditable && onPopupClose && { popupclose: onPopupClose }),
  };

  return (
    <Marker ref={markerRef} position={tempPosition} icon={getIcon()} eventHandlers={eventHandlers}>
      {/* 🚫 Only render popup content when not in editable mode */}
      {!isEditable && children}
    </Marker>
  );
}
