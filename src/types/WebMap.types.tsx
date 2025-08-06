// Hook return types
export interface UseRoutingReturn {
  totalDistance: number;
  totalDuration: number;
  // Constants
  CEMETERY_GATE: L.LatLng;
  isRecalculating: boolean;
  stopNavigation: () => void;

  stopLiveTracking: () => void;
  // State
  publicRoute: RouteData | null;
  privateRoute: RouteData | null;
  // Utilities
  formatDistance: (meters: number) => string;
  formatDuration: (seconds: number) => string;
  setPendingDestination: (destination: Coordinate) => void;

  handlePendingDestination: (userPosition: L.LatLng) => void;
  // Actions
  startNavigation: (userPosition: L.LatLng, destination: Coordinate) => Promise<void>;

  startLiveTracking: (
    userPosition: L.LatLng,
    onPositionUpdate: (position: L.LatLng) => void,
    onRecalculateRoute: (newPosition: L.LatLng, destination: Coordinate) => void
  ) => void;
}
// API response types
export interface OSRMRoute {
  distance: number;
  duration: number;
  geometry: {
    coordinates: [number, number][]; // [lng, lat] format
  };
  legs?: {
    steps?: {
      geometry: {
        coordinates: [number, number][];
      };
      distance: number;
      duration: number;
    }[];
    distance: number;
    duration: number;
  }[];
}

export interface NavigationControlProps {
  totalDistance: number;
  totalDuration: number;
  isRecalculating: boolean;
  onStopNavigation: () => void;
  showRouteBreakdown?: boolean;
  publicRoute: RouteData | null;
  privateRoute: RouteData | null;
  formatDistance: (meters: number) => string;
  formatDuration: (seconds: number) => string;
}

// Component prop types
export interface LocationMarkerProps {
  showAccuracyCircle?: boolean;
  userPosition: L.LatLng | null;
  onLocationFound: (position: L.LatLng) => void;
  onLocationError?: (error: GeolocationPositionError) => void;
  onExposeLocateFunction: (locateFunction: () => void) => void;
}

// Map event types
export interface MapEventHandlers {
  onRouteStop?: () => void;
  onMarkerClick?: (marker: PlotMarker) => void;
  onLocationFound?: (position: L.LatLng) => void;
  onRouteStart?: (destination: Coordinate) => void;
  onLocationError?: (error: GeolocationPositionError) => void;
}

// Configuration types
export interface MapConfiguration {
  bounds: Bounds;
  maxZoom: number;
  defaultZoom: number;
  cemeteryGate: Coordinate;
  tileLayer: {
    maxNativeZoom: number;
    attribution: string;
    url: string;
  };
}

export interface UseLocationReturn {
  accuracy?: number;
  isLoading: boolean;
  error: string | null;
  position: L.LatLng | null;
  requestLocation: () => void;
  watchPosition: (enabled: boolean) => void;
}

export interface PlotMarker {
  id: string;
  name?: string;
  price?: number;
  features?: string[];
  position: Coordinate;
  description?: string;
  plotStatus: PlotStatus;
  category: PlotCategory;
}

export interface RoutingConfiguration {
  timeout: number;
  driftThreshold: number;
  apis: {
    private: string;
    public: string;
  };
  speeds: {
    walking: number;
    driving: number;
  };
}

// Navigation types
export interface NavigationState {
  isActive: boolean;
  totalDistance: number;
  totalDuration: number;
  isRecalculating: boolean;
  publicRoute: RouteData | null;
  privateRoute: RouteData | null;
}
export interface NavigationControls {
  stop: () => void;
  start: (destination: Coordinate) => Promise<void>;
  recalculate: (newPosition: Coordinate, destination: Coordinate) => Promise<void>;
}

// Route-related types
export interface RouteData {
  to: Coordinate;
  from: Coordinate;
  distance?: number;
  duration?: number;
  polyline: Coordinate[];
  mode?: 'driving' | 'walking' | 'cycling';
}

export interface OSRMResponse {
  code: string;
  message?: string;
  routes: OSRMRoute[];
  waypoints?: {
    location: [number, number];
    name?: string;
  }[];
}

export interface PlotLocationsProps {
  marker: PlotMarker;
  showDetails?: boolean;
  backgroundColor?: string;
  onDirectionClick: () => void;
}

// Error types
export interface RoutingError extends Error {
  details?: unknown;
  code?: 'INVALID_COORDINATES' | 'NETWORK_ERROR' | 'API_ERROR' | 'NO_ROUTE';
}

export interface LocationOptions {
  timeout?: number;
  maximumAge?: number;
  watchPosition?: boolean;
  enableHighAccuracy?: boolean;
}

export interface LocationError extends Error {
  TIMEOUT: 3;
  code: number;
  PERMISSION_DENIED: 1;
  POSITION_UNAVAILABLE: 2;
}

export interface RoutePolylinesProps {
  animated?: boolean;
  publicRoute: RouteData | null;
  privateRoute: RouteData | null;
}

// Location types
export interface LocationState {
  error?: string;
  accuracy?: number;
  timestamp?: number;
  position: L.LatLng | null;
}

export interface RouteResponse {
  error?: string;
  distance: number;
  duration: number;
  polyline: Coordinate[];
}

export interface RouteRequest {
  to: Coordinate;
  from: Coordinate;
  mode: 'private' | 'public';
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Context types
export interface LocateContextValue {
  isLocating?: boolean;
  requestLocate: () => void;
}

// Plot/Marker types
export type PlotStatus = 'Maintenance' | 'Available' | 'Occupied' | 'Reserved';

export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

export type PlotCategory = 'Platinum' | 'Diamond' | 'Bronze' | 'Silver';

export type RequiredBy<T, K extends keyof T> = Required<Pick<T, K>> & T;

export type Bounds = [Coordinate, Coordinate]; // [southWest, northEast]

// Base coordinate types
export type Coordinate = [number, number]; // [lat, lng]