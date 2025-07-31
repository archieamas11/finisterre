// utils/mapUtils.ts
import L from 'leaflet';

// Map configuration constants
export const MAP_CONFIG = {
    BOUNDS: [
        [10.247883800064669, 123.79691285546676],
        [10.249302749341647, 123.7988598710129],
    ] as [[number, number], [number, number]],

    DEFAULT_ZOOM: 18,
    MAX_ZOOM: 25,

    TILE_LAYER: {
        URL: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        MAX_NATIVE_ZOOM: 18,
        ATTRIBUTION: "&copy; Esri &mdash; Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community"
    },

    CEMETERY_GATE: {
        LAT: 10.248107820799307,
        LNG: 123.797607547609545
    }
};

// Plot status color mapping
export const PLOT_STATUS_COLORS = {
    'Available': '#22c55e',
    'Occupied': '#ef4444',
    'Reserved': '#facc15',
    'Maintenance': '#6b7280',
    'default': '#a3a3a3'
} as const;

// Category background colors
export const CATEGORY_COLORS = {
    'Bronze': '#7d7d7d',
    'Silver': '#b00020',
    'Platinum': '#d4af37',
    'Diamond': '#cc6688'
} as const;

// Icon creation utilities
export const createUserLocationIcon = (withPulse = true): L.DivIcon => {
    const pulseAnimation = withPulse ? `
    <div style="
      position: absolute;
      top: -5px;
      left: -5px;
      width: 30px;
      height: 30px;
      border: 2px solid #4285f4;
      border-radius: 50%;
      opacity: 0.3;
      animation: pulse 2s infinite;
    "></div>
  ` : '';

    return L.divIcon({
        html: `
      <div style="
        background: #4285f4; 
        border: 3px solid white; 
        border-radius: 50%; 
        width: 20px; 
        height: 20px; 
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: relative;
      ">
        ${pulseAnimation}
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      </style>
    `,
        className: 'custom-user-marker',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
    });
};

export const createPlotStatusIcon = (status: string, size = 20): L.DivIcon => {
    const color = PLOT_STATUS_COLORS[status as keyof typeof PLOT_STATUS_COLORS] || PLOT_STATUS_COLORS.default;

    return L.divIcon({
        html: `<div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      border: 2px solid #fff;
      box-shadow: 0 0 4px rgba(0,0,0,0.15);
      cursor: pointer;
      transition: transform 0.2s ease;
    " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"></div>`,
        className: 'plot-marker',
        iconSize: [size + 4, size + 4],
        iconAnchor: [(size + 4) / 2, (size + 4) / 2],
        popupAnchor: [0, -(size / 2)]
    });
};

export const createGateIcon = (): L.DivIcon => {
    return L.divIcon({
        html: `<div style="
      background: #FFA500; 
      border: 2px solid white; 
      border-radius: 50%; 
      width: 16px; 
      height: 16px; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      cursor: pointer;
      position: relative;
    ">
      <div style="
        position: absolute;
        top: -8px;
        left: -8px;
        width: 32px;
        height: 32px;
        border: 1px solid #FFA500;
        border-radius: 50%;
        opacity: 0.3;
      "></div>
    </div>`,
        className: 'gate-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
};

// Validation utilities
export const isValidCoordinate = (coord: unknown): coord is [number, number] => {
    return Array.isArray(coord) &&
        coord.length === 2 &&
        typeof coord[0] === 'number' &&
        typeof coord[1] === 'number' &&
        !isNaN(coord[0]) && !isNaN(coord[1]) &&
        Math.abs(coord[0]) <= 90 && Math.abs(coord[1]) <= 180;
};

export const isValidLatLng = (latlng: unknown): latlng is L.LatLng => {
    return latlng instanceof L.LatLng &&
        !isNaN(latlng.lat) && !isNaN(latlng.lng) &&
        Math.abs(latlng.lat) <= 90 && Math.abs(latlng.lng) <= 180;
};

// Distance calculation utilities
export const calculateHaversineDistance = (
    from: [number, number],
    to: [number, number]
): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (to[0] - from[0]) * Math.PI / 180;
    const dLng = (to[1] - from[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(from[0] * Math.PI / 180) * Math.cos(to[0] * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Formatting utilities
export const formatDistance = (meters: number): string => {
    if (meters < 1000) {
        return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
};

export const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const formatCoordinates = (lat: number, lng: number, precision = 6): string => {
    return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
};

// Geolocation utilities
export const getCurrentPosition = (options?: PositionOptions): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000, // Cache for 1 minute
            ...options
        });
    });
};

// Bounds checking utilities
export const isWithinBounds = (
    coordinate: [number, number],
    bounds: [[number, number], [number, number]]
): boolean => {
    const [lat, lng] = coordinate;
    const [[southWest_lat, southWest_lng], [northEast_lat, northEast_lng]] = bounds;

    return lat >= southWest_lat &&
        lat <= northEast_lat &&
        lng >= southWest_lng &&
        lng <= northEast_lng;
};

// Error handling utilities
export const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
    const errorMessages: Record<string, string> = {
        '1': 'Location access denied. Please enable location services in your browser settings.',
        '2': 'Location information is unavailable. Please check your internet connection.',
        '3': 'Location request timed out. Please try again.'
    };

    return errorMessages[String(error.code)] || `Location error: ${error.message}`;
};

// Route optimization utilities
export const optimizeWaypoints = (waypoints: [number, number][]): [number, number][] => {
    if (waypoints.length <= 2) return waypoints;

    // Simple optimization: remove points that are too close together
    const optimized: [number, number][] = [waypoints[0]];
    const minDistance = 10; // meters

    for (let i = 1; i < waypoints.length - 1; i++) {
        const distance = calculateHaversineDistance(
            optimized[optimized.length - 1],
            waypoints[i]
        );

        if (distance >= minDistance) {
            optimized.push(waypoints[i]);
        }
    }

    // Always include the last waypoint
    if (waypoints.length > 1) {
        optimized.push(waypoints[waypoints.length - 1]);
    }

    return optimized;
};