// WebMapNavs.tsx - Refactored and improved

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { createContext, useState, useCallback, useRef } from 'react';

// Fix default icon paths so markers actually show up
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Components
import WebMapNavs from '@/pages/webmap/WebMapNavs';
import { LocationMarker } from '@/components/LocationMarker';
import { NavigationControl } from '@/components/NavigationControl';
import { RoutePolylines } from '@/components/RoutePolyLines';
import { PlotLocations } from './PlotLocations';

// Hooks and data
import { useRouting } from '@/hooks/useRouting';
import { markerData } from '@/components/webmap/markerData';
import type { MarkerData } from '@/components/webmap/markerData';

// Fix Leaflet default icon
const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Context to signal a locate request from navs to map
export const LocateContext = createContext<{ requestLocate: () => void } | null>(null);

// Map bounds
const MAP_BOUNDS: [[number, number], [number, number]] = [
  [10.247883800064669, 123.79691285546676],
  [10.249302749341647, 123.7988598710129],
];

export default function MapPage() {
  const [userPosition, setUserPosition] = useState<L.LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const locateRef = useRef<(() => void) | null>(null);

  // Use the routing hook
  const {
    publicRoute,
    privateRoute,
    isRecalculating,
    totalDistance,
    totalDuration,
    startNavigation,
    stopNavigation,
    startLiveTracking,
    setPendingDestination,
    handlePendingDestination,
    formatDistance,
    formatDuration,
    CEMETERY_GATE
  } = useRouting();

  // Handle location found
  const handleLocationFound = useCallback((position: L.LatLng) => {
    setUserPosition(position);
    setLocationError(null);
    handlePendingDestination(position);

    // Start live tracking if navigation is active
    if (publicRoute || privateRoute) {
      startLiveTracking(
        position,
        setUserPosition,
        (newPos, dest) => startNavigation(newPos, dest)
      );
    }
  }, [publicRoute, privateRoute, startLiveTracking, handlePendingDestination, startNavigation]);

  // Handle location error
  const handleLocationError = useCallback((error: GeolocationPositionError) => {
    const errorMessages: { [key: number]: string } = {
      [error.PERMISSION_DENIED]: 'Location access denied. Please enable location services.',
      [error.POSITION_UNAVAILABLE]: 'Location unavailable. Please check your connection.',
      [error.TIMEOUT]: 'Location request timed out. Please try again.'
    };

    const message = errorMessages[error.code] || `Location error: ${error.message}`;
    setLocationError(message);
    console.warn('Location error:', message);
  }, []);

  // Expose locate function to context
  const handleExposeLocateFunction = useCallback((locateFunction: () => void) => {
    locateRef.current = locateFunction;
  }, []);

  // Handle navigation start
  const handleStartNavigation = useCallback(async (destination: [number, number]) => {
    try {
      if (userPosition) {
        await startNavigation(userPosition, destination);
      } else {
        // Store destination and trigger location request
        setPendingDestination(destination);
        locateRef.current?.();
      }
    } catch (error) {
      console.error('Failed to start navigation:', error);
      // Could show user-friendly error message here
    }
  }, [userPosition, startNavigation, setPendingDestination]);

  // Context value
  const requestLocate = useCallback(() => {
    locateRef.current?.();
  }, []);

  // Create marker icon based on plot status
  const createPlotIcon = useCallback((status: string) => {
    const statusColors = {
      'Available': '#22c55e',
      'Occupied': '#ef4444',
      'Reserved': '#facc15',
      'default': '#a3a3a3'
    };

    const color = statusColors[status as keyof typeof statusColors] || statusColors.default;

    return L.divIcon({
      html: `<div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid #fff;
        box-shadow: 0 0 4px rgba(0,0,0,0.15);
        cursor: pointer;
      "></div>`,
      className: 'plot-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }, []);

  // Get category background color
  const getCategoryBackgroundColor = useCallback((category: string): string | undefined => {
    const categoryColors = {
      'Bronze': '#7d7d7d',
      'Silver': '#b00020',
      'Platinum': '#d4af37',
      'Diamond': '#cc6688'
    };
    return categoryColors[category as keyof typeof categoryColors];
  }, []);

  return (
    <LocateContext.Provider value={{ requestLocate }}>
      <div className="h-screen w-full relative">
        <WebMapNavs />

        {/* Location error notification */}
        {locationError && (
          <div className="absolute top-4 right-4 z-[9999] bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-start gap-2">
              <span className="text-red-500">⚠️</span>
              <div>
                <div className="font-medium text-sm">Location Error</div>
                <div className="text-xs mt-1">{locationError}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Control Panel */}
        <NavigationControl
          publicRoute={publicRoute}
          privateRoute={privateRoute}
          totalDistance={totalDistance}
          totalDuration={totalDuration}
          isRecalculating={isRecalculating}
          formatDistance={formatDistance}
          formatDuration={formatDuration}
          onStopNavigation={stopNavigation}
        />

        <MapContainer
          bounds={MAP_BOUNDS}
          zoom={18}
          maxZoom={25}
          scrollWheelZoom={true}
          className="h-full w-full"
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer
            url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxNativeZoom={18}
            maxZoom={25}
          />

          {/* User location marker */}
          <LocationMarker
            userPosition={userPosition}
            onLocationFound={handleLocationFound}
            onLocationError={handleLocationError}
            onExposeLocateFunction={handleExposeLocateFunction}
          />

          {/* Route polylines */}
          <RoutePolylines
            publicRoute={publicRoute}
            privateRoute={privateRoute}
          />

          {/* Cemetery Gate Marker */}
          <Marker
            position={[CEMETERY_GATE.lat, CEMETERY_GATE.lng]}
            icon={L.divIcon({
              html: `<div class="bg-orange-400 border-2 border-white rounded-full w-4 h-4 shadow-md cursor-pointer flex items-center justify-center"></div>`,
              className: 'gate-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-orange-600">🚪 Cemetery Gate</div>
                <div className="text-xs text-gray-500 mt-1">Entry point for cemetery visitors</div>
              </div>
            </Popup>
          </Marker>

          {/* Plot markers */}
          {markerData.map((marker: MarkerData, idx: number) => {
            const plotIcon = createPlotIcon(marker.plotStatus);
            const backgroundColor = getCategoryBackgroundColor(marker.category);

            return (
              <Marker key={idx} position={marker.position} icon={plotIcon}>
                <Popup>
                  <PlotLocations
                    marker={marker}
                    backgroundColor={backgroundColor}
                    onDirectionClick={() => handleStartNavigation(marker.position as [number, number])}
                  />
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </LocateContext.Provider>
  );
}