import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { createContext, useState, useCallback, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { GiOpenGate } from "react-icons/gi";
import { PiMapPinFill } from "react-icons/pi";
import { BiSolidChurch } from "react-icons/bi";

// Fix default icon paths so markers actually show up
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Components
import WebMapNavs from '@/pages/webmap/WebMapNavs';
import { LocationMarker } from '@/components/WebMap.LocationMarker';
import { NavigationControl } from '@/components/WebMapNavControls';
import { RoutePolylines } from '@/components/WebMap.RoutePolyLines';
import { PlotLocations } from '../WebMap.popup';

// Hooks and data
import { useRouting } from '@/hooks/WebMapRouting.hook';
import { type MarkerData } from '@/data/geojson/markerData';
import { markerData } from '@/data/geojson/markerData';

import {
  MAP_CONFIG,
  getGeolocationErrorMessage
} from '@/utils/WebMap.utils';

import type {
  LocateContextValue,
  Coordinate,
} from '@/types/WebMap.types';

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


export const LocateContext = createContext<LocateContextValue | null>(null);

export default function MapPage() {
  const [userPosition, setUserPosition] = useState<L.LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
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
    setIsLocating(false);
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
    const message = getGeolocationErrorMessage(error);
    setLocationError(message);
    setIsLocating(false);
    console.warn('Location error:', message);
  }, [getGeolocationErrorMessage]);

  // Expose locate function to context
  const handleExposeLocateFunction = useCallback((locateFunction: () => void) => {
    locateRef.current = locateFunction;
  }, []);

  // Handle navigation start
  const handleStartNavigation = useCallback(async (destination: Coordinate) => {
    try {
      if (userPosition) {
        await startNavigation(userPosition, destination);
      } else {
        // Store destination and trigger location request
        setPendingDestination(destination);
        setIsLocating(true);
        locateRef.current?.();
      }
    } catch (error) {
      console.error('Failed to start navigation:', error);
      setLocationError('Failed to calculate route. Please try again.');
    }
  }, [userPosition, startNavigation, setPendingDestination]);

  const handleStopNavigation = useCallback(() => {
    stopNavigation();
    setIsLocating(false);
    setLocationError(null);
  }, [stopNavigation]);

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
              <span className="text-red-500 text-lg">⚠️</span>
              <div>
                <div className="font-medium text-sm">Location Error</div>
                <div className="text-xs mt-1">{locationError}</div>
                <button
                  onClick={() => setLocationError(null)}
                  className="text-xs text-red-600 hover:text-red-800 mt-1 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLocating && (
          <div className="absolute top-4 left-4 z-[9999] bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-sm font-medium">Finding your location...</span>
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
          onStopNavigation={handleStopNavigation}
        />

        <MapContainer
          bounds={MAP_CONFIG.BOUNDS}
          zoom={18}
          maxZoom={25}
          scrollWheelZoom={true}
          className="h-full w-full"
          zoomControl={false}
          attributionControl={true}
        >
          <TileLayer
            url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxNativeZoom={18}
            maxZoom={25}
            attribution="&copy; Esri &mdash; Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community"
          />

          {/* User location marker */}
          <LocationMarker
            userPosition={userPosition}
            onLocationFound={handleLocationFound}
            onLocationError={handleLocationError}
            onExposeLocateFunction={handleExposeLocateFunction}
            showAccuracyCircle={true}
          />

          {/* Route polylines */}
          <RoutePolylines
            publicRoute={publicRoute}
            privateRoute={privateRoute}
            animated={true}
          />

          {privateRoute && (
            <Marker
              position={privateRoute.to}
              icon={L.divIcon({
                html: renderToStaticMarkup(
                  <div
                    style={{
                      background: '#ef4444',
                      borderRadius: '50% 50% 50% 0',
                      boxShadow: '0 0 8px rgba(0,0,0,0.15)',
                      border: '2px solid #fff',
                      transform: 'rotate(-45deg)',
                    }}
                  >
                    <PiMapPinFill
                      className='z-999'
                      size={24}
                      style={{
                        transform: 'rotate(45deg)'
                      }}
                    />
                  </div>
                ),
                className: 'destination-marker',
                iconSize: [32, 32],
                iconAnchor: [16, 35]
              })}
            >
            </Marker>
          )}

          {/* Cemetery Entrance Marker */}
          <Marker
            position={[CEMETERY_GATE.lat, CEMETERY_GATE.lng]}
            icon={L.divIcon({
              html: renderToStaticMarkup(
                <div
                  style={{
                    background: '#000000',
                    borderRadius: '50% 50% 50% 0',
                    boxShadow: '0 0 8px rgba(0,0,0,0.15)',
                    padding: '4px',
                    border: '2px solid #fff',
                    transform: 'rotate(-45deg)',
                    display: 'inline-block'
                  }}
                >
                  <GiOpenGate
                    className='z-999 text-white'
                    size={16}
                    strokeWidth={2.5}
                    style={{
                      transform: 'rotate(45deg)'
                    }}
                  />
                </div>
              ),
              className: 'destination-marker',
              iconSize: [32, 32],
            })}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-orange-600">🚪 Cemetery Gate</div>
                <div className="text-xs text-gray-500 mt-1">Entry point for cemetery visitors</div>
              </div>
            </Popup>
          </Marker>

          {/* Cemetery Exit Marker */}
          <Marker position={[10.248166481872728, 123.79754558858059]}
            icon={L.divIcon({
              html: renderToStaticMarkup(
                <div
                  style={{
                    background: '#000000',
                    borderRadius: '50% 50% 50% 0',
                    boxShadow: '0 0 8px rgba(0,0,0,0.15)',
                    padding: '4px',
                    border: '2px solid #fff',
                    transform: 'rotate(-45deg)',
                    display: 'inline-block'
                  }}
                >
                  <GiOpenGate
                    className='z-999 text-white'
                    size={16}
                    strokeWidth={2.5}
                    style={{
                      transform: 'rotate(45deg)'
                    }}
                  />
                </div>
              ),
              className: 'destination-marker',
              iconSize: [32, 32],
            })}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-orange-600">🚪 Cemetery Gate</div>
                <div className="text-xs text-gray-500 mt-1">Entry point for cemetery visitors</div>
              </div>
            </Popup>
          </Marker>

          {/* Cemetery Chapel Marker */}
          <Marker position={[10.248435228156183, 123.79787795587316]}
            icon={L.divIcon({
              html: renderToStaticMarkup(
                <div
                  style={{
                    background: '#FF9800',
                    borderRadius: '50% 50% 50% 0',
                    boxShadow: '0 0 8px rgba(0,0,0,0.15)',
                    padding: '4px',
                    border: '2px solid #fff',
                    transform: 'rotate(-45deg)',
                    display: 'inline-block'
                  }}
                >
                  <BiSolidChurch
                    className='z-999 text-white'
                    size={16}
                    strokeWidth={2.5}
                    style={{
                      transform: 'rotate(45deg)'
                    }}
                  />
                </div>
              ),
              className: 'destination-marker',
              iconSize: [32, 32],
            })}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-orange-600">🚪 Chapel</div>
                <div className="text-xs text-gray-500 mt-1">Entry point for chapel visitors</div>
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