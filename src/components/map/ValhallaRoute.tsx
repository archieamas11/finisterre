import React from "react";
import { Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { type ValhallaRouteResponse } from "@/api/valhalla.api";

interface ValhallaRouteProps {
  route: ValhallaRouteResponse | null;
  routeCoordinates: [number, number][];
  isNavigating?: boolean;
  // 📍 Original coordinates (not snapped to roads)
  originalStart?: [number, number];
  originalEnd?: [number, number];
  // 🎨 Styling options
  routeColor?: string;
  routeWeight?: number;
  routeOpacity?: number;
  // 🎯 Show start/end markers
  showMarkers?: boolean;
  // 🔄 Auto-fit bounds to route
  fitBounds?: boolean;
}

/**
 * 🗺️ Valhalla route component that renders route polyline and markers
 */
export function ValhallaRoute({
  route,
  routeCoordinates,
  isNavigating = false,
  originalStart,
  originalEnd,
  routeColor = "#3b82f6",
  routeWeight = 5,
  routeOpacity = 0.8,
  showMarkers = true,
  fitBounds = true,
}: ValhallaRouteProps) {
  const map = useMap();

  if (!route || routeCoordinates.length === 0) {
    return null;
  }

  // 🎯 Use original coordinates for markers if provided, otherwise fallback to route coordinates
  const startPoint = originalStart || routeCoordinates[0];
  const endPoint = originalEnd || routeCoordinates[routeCoordinates.length - 1];

  // 🗺️ For bounds fitting, include original coordinates if available
  const boundsCoordinates = React.useMemo(() => {
    const coords = [...routeCoordinates];
    if (originalStart && originalStart !== routeCoordinates[0]) {
      coords.unshift(originalStart);
    }
    if (originalEnd && originalEnd !== routeCoordinates[routeCoordinates.length - 1]) {
      coords.push(originalEnd);
    }
    return coords;
  }, [routeCoordinates, originalStart, originalEnd]);

  // 🎯 Auto-fit map bounds to route (including original coordinates)
  React.useEffect(() => {
    if (fitBounds && boundsCoordinates.length > 0) {
      try {
        const bounds = L.latLngBounds(boundsCoordinates);
        map.fitBounds(bounds, { padding: [20, 20] });
      } catch (error) {
        console.warn("🚫 Failed to fit route bounds:", error);
      }
    }
  }, [boundsCoordinates, fitBounds, map]);

  // 🎨 Dynamic styling based on navigation state
  const polylineColor = isNavigating ? "#3b82f6" : routeColor;
  const polylineOpacity = isNavigating ? 0.9 : routeOpacity;

  // 🏁 Start marker icon
  const startIcon = L.divIcon({
    className: "custom-start-marker",
    html: `
      <div role="img" aria-label="Start" style="position:relative;display:inline-block;width:28px;height:40px;">
        <svg width="28" height="40" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
          <title>Start</title>
          <defs>
            <filter id="start-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/>
            </filter>
          </defs>
          <path filter="url(#start-shadow)" d="M12 0C7.03 0 3 3.96 3 8.85c0 6.05 7.35 14.25 8.22 15.2.21.23.53.36.85.36.32 0 .64-.13.85-.36.87-.95 8.22-9.15 8.22-15.2C21 3.96 16.97 0 12 0z" fill="#10b981"/>
          <circle cx="12" cy="9" r="3.2" fill="#fff"/>
        </svg>
      </div>
    `,
    iconSize: [28, 40],
    iconAnchor: [13, 30],
  });

  // 🎯 End/Destination marker icon
  const endIcon = L.divIcon({
    className: "custom-destination-marker",
    html: `
      <div role="img" aria-label="Destination" style="position:relative;display:inline-block;width:28px;height:40px;">
        <svg width="28" height="40" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
          <title>Destination</title>
          <defs>
            <filter id="dest-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/>
            </filter>
          </defs>
          <path filter="url(#dest-shadow)" d="M12 0C7.03 0 3 3.96 3 8.85c0 6.05 7.35 14.25 8.22 15.2.21.23.53.36.85.36.32 0 .64-.13.85-.36.87-.95 8.22-9.15 8.22-15.2C21 3.96 16.97 0 12 0z" fill="#ef4444"/>
          <circle cx="12" cy="9" r="3.2" fill="#fff"/>
        </svg>
      </div>
    `,
    iconAnchor: [18, 35],
  });

  // 🔗 Create complete polyline coordinates that connect original points to snapped route
  const completePolylineCoordinates = React.useMemo(() => {
    const coords = [...routeCoordinates];

    // 🎯 If we have original coordinates, create connection lines
    if (originalStart && originalStart !== routeCoordinates[0]) {
      // Add original start at the beginning to connect to first route point
      coords.unshift(originalStart);
      console.log("🔗 Adding start connection:", originalStart, "→", routeCoordinates[0]);
    }

    if (originalEnd && originalEnd !== routeCoordinates[routeCoordinates.length - 1]) {
      // Add original end at the end to connect from last route point
      coords.push(originalEnd);
      console.log("🔗 Adding end connection:", routeCoordinates[routeCoordinates.length - 1], "→", originalEnd);
    }

    console.log("🗺️ Complete polyline coordinates:", {
      totalPoints: coords.length,
      routePoints: routeCoordinates.length,
      hasStartConnection: originalStart && originalStart !== routeCoordinates[0],
      hasEndConnection: originalEnd && originalEnd !== routeCoordinates[routeCoordinates.length - 1],
    });

    return coords;
  }, [routeCoordinates, originalStart, originalEnd]);

  return (
    <>
      {/* 🗺️ Complete route polyline that connects original coordinates to snapped route */}
      <Polyline
        positions={completePolylineCoordinates}
        pathOptions={{
          color: polylineColor,
          weight: routeWeight,
          opacity: polylineOpacity,
          lineCap: "round",
          lineJoin: "round",
        }}
      />

      {/* 🎯 Start and end markers */}
      {showMarkers && startPoint && <Marker position={startPoint} icon={startIcon}></Marker>}

      {showMarkers && endPoint && <Marker position={endPoint} icon={endIcon}></Marker>}
    </>
  );
}
