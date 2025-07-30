// types/mapTypes.ts

// Base coordinate types
export type Coordinate = [number, number]; // [lat, lng]
export type Bounds = [Coordinate, Coordinate]; // [southWest, northEast]

// Route-related types
export interface RouteData {
  from: Coordinate;
  to: Coordinate;
  polyline: Coordinate[];
  distance?: number;
  duration?: number;
  mode?: 'driving' | 'walking' | 'cycling';
}

export interface RouteRequest {
  from: Coordinate;
  to: Coordinate;
  mode: 'public' | 'private';
}

export interface RouteResponse {
  polyline: Coordinate[];
  distance: number;
  duration: number;
  error?: string;
}

// Navigation types
export interface NavigationState {
  isActive: boolean;
  publicRoute: RouteData | null;
  privateRoute: RouteData | null;
  isRecalculating: boolean;
  totalDistance: number;
  totalDuration: number;
}

export interface NavigationControls {
  start: (destination: Coordinate) => Promise<void>;
  stop: () => void;
  recalculate: (newPosition: Coordinate, destination: Coordinate) => Promise<void>;
}

// Location types
export interface LocationState {
  position: L.LatLng | null;
  accuracy?: number;
  timestamp?: number;
  error?: string;
}

export interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watchPosition?: boolean;
}

// Plot/Marker types
export type PlotStatus = 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';
export type PlotCategory = 'Bronze' | 'Silver' | 'Platinum' | 'Diamond';

export interface PlotMarker {
  id: string;
  position: Coordinate;
  plotStatus: PlotStatus;
  category: PlotCategory;
  name?: string;
  description?: string;
  price?: number;
  features?: string[];
}

// Map event types
export interface MapEventHandlers {
  onLocationFound?: (position: L.LatLng) => void;
  onLocationError?: (error: GeolocationPositionError) => void;
  onMarkerClick?: (marker: PlotMarker) => void;
  onRouteStart?: (destination: Coordinate) => void;
  onRouteStop?: () => void;
}

// Configuration types
export interface MapConfiguration {
  bounds: Bounds;
  defaultZoom: number;
  maxZoom: number;
  tileLayer: {
    url: string;
    maxNativeZoom: number;
    attribution: string;
  };
  cemeteryGate: Coordinate;
}

export interface RoutingConfiguration {
  apis: {
    public: string;
    private: string;
  };
  driftThreshold: number;
  speeds: {
    walking: number;
    driving: number;
  };
  timeout: number;
}

// Hook return types
export interface UseRoutingReturn {
  // State
  publicRoute: RouteData | null;
  privateRoute: RouteData | null;
  isRecalculating: boolean;
  totalDistance: number;
  totalDuration: number;
  
  // Actions
  startNavigation: (userPosition: L.LatLng, destination: Coordinate) => Promise<void>;
  stopNavigation: () => void;
  startLiveTracking: (
    userPosition: L.LatLng,
    onPositionUpdate: (position: L.LatLng) => void,
    onRecalculateRoute: (newPosition: L.LatLng, destination: Coordinate) => void
  ) => void;
  stopLiveTracking: () => void;
  setPendingDestination: (destination: Coordinate) => void;
  handlePendingDestination: (userPosition: L.LatLng) => void;
  
  // Utilities
  formatDistance: (meters: number) => string;
  formatDuration: (seconds: number) => string;
  
  // Constants
  CEMETERY_GATE: L.LatLng;
}

export interface UseLocationReturn {
  position: L.LatLng | null;
  error: string | null;
  isLoading: boolean;
  accuracy?: number;
  requestLocation: () => void;
  watchPosition: (enabled: boolean) => void;
}

// Component prop types
export interface LocationMarkerProps {
  userPosition: L.LatLng | null;
  onLocationFound: (position: L.LatLng) => void;
  onLocationError?: (error: GeolocationPositionError) => void;
  onExposeLocateFunction: (locateFunction: () => void) => void;
  showAccuracyCircle?: boolean;
}

export interface NavigationControlProps {
  publicRoute: RouteData | null;
  privateRoute: RouteData | null;
  totalDistance: number;
  totalDuration: number;
  isRecalculating: boolean;
  formatDistance: (meters: number) => string;
  formatDuration: (seconds: number) => string;
  onStopNavigation: () => void;
  showRouteBreakdown?: boolean;
}

export interface RoutePolylinesProps {
  publicRoute: RouteData | null;
  privateRoute: RouteData | null;
  animated?: boolean;
}

export interface PlotLocationsProps {
  marker: PlotMarker;
  backgroundColor?: string;
  onDirectionClick: () => void;
  showDetails?: boolean;
}

// Context types
export interface LocateContextValue {
  requestLocate: () => void;
  isLocating?: boolean;
}

// API response types
export interface OSRMRoute {
  geometry: {
    coordinates: [number, number][]; // [lng, lat] format
  };
  distance: number;
  duration: number;
  legs?: Array<{
    distance: number;
    duration: number;
    steps?: Array<{
      distance: number;
      duration: number;
      geometry: {
        coordinates: [number, number][];
      };
    }>;
  }>;
}

export interface OSRMResponse {
  routes: OSRMRoute[];
  waypoints?: Array<{
    location: [number, number];
    name?: string;
  }>;
  code: string;
  message?: string;
}

// Error types
export interface RoutingError extends Error {
  code?: 'NETWORK_ERROR' | 'API_ERROR' | 'NO_ROUTE' | 'INVALID_COORDINATES';
  details?: unknown;
}

export interface LocationError extends Error {
  code: number;
  PERMISSION_DENIED: 1;
  POSITION_UNAVAILABLE: 2;
  TIMEOUT: 3;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;