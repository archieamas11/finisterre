import { useMapEvents, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

interface LocationMarkerProps {
    userPosition: L.LatLng | null;
    userHeading?: number; // User's heading/bearing in degrees
    accuracy?: number; // GPS accuracy in meters
    onLocationFound: (position: L.LatLng, accuracy?: number) => void;
    onLocationError?: (error: GeolocationPositionError) => void;
    onExposeLocateFunction: (locateFunction: () => void) => void;
    showAccuracyCircle?: boolean;
}

export function LocationMarker({
    userPosition,
    userHeading,
    accuracy,
    onLocationFound,
    onLocationError,
    onExposeLocateFunction,
    showAccuracyCircle = false
}: LocationMarkerProps) {
    const hasInitialLocationRef = useRef(false);

    const map = useMapEvents({
        locationfound(e) {
            onLocationFound(e.latlng, e.accuracy);

            // Only auto-center on first location find
            if (!hasInitialLocationRef.current) {
                map.flyTo(e.latlng, Math.max(map.getZoom(), 18));
                hasInitialLocationRef.current = true;
            }
        },
        locationerror(e) {
            console.warn('Location error:', e.message);
            onLocationError?.(e as unknown as GeolocationPositionError);
        }
    });

    // Expose locate function to parent
    useEffect(() => {
        const locateFunction = () => {
            map.locate({
                setView: false, // Don't auto-center after initial location
                maxZoom: 20,
                enableHighAccuracy: true,
                timeout: 10000
            });
        };

        onExposeLocateFunction(locateFunction);
    }, [map, onExposeLocateFunction]);

    if (!userPosition) return null;

    // Create directional icon with heading indicator
    const createDirectionalIcon = (heading?: number) => {
        // const rotation = heading !== undefined ? `transform: rotate(${heading}deg);` : '';
        const directionArrow = heading !== undefined ? `
      <div style="
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%) ${heading !== undefined ? `rotate(${heading}deg)` : ''};
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 8px solid #4285f4;
        z-index: 10;
      "></div>
    ` : '';

        return L.divIcon({
            html: `
        <div style="position: relative;">
          <div style="
            background: #4285f4; 
            border: 3px solid white; 
            border-radius: 50%; 
            width: 20px; 
            height: 20px; 
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            position: relative;
          ">
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
          </div>
          ${directionArrow}
        </div>
        <style>
          @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.1; }
            100% { transform: scale(1.4); opacity: 0; }
          }
        </style>
      `,
            className: 'user-location-marker',
            iconSize: [26, 26],
            iconAnchor: [13, 13]
        });
    };

    const userIcon = createDirectionalIcon(userHeading);

    return (
        <>
            {/* Accuracy circle */}
            {showAccuracyCircle && accuracy && accuracy > 0 && (
                <Circle
                    center={userPosition}
                    radius={accuracy}
                    pathOptions={{
                        color: '#4285f4',
                        fillColor: '#4285f4',
                        fillOpacity: 0.1,
                        weight: 1,
                        opacity: 0.5
                    }}
                />
            )}

            {/* User position marker */}
            <Marker position={userPosition} icon={userIcon}>
                <Popup>
                    <div className="text-center min-w-[200px]">
                        <div className="font-semibold text-blue-600 mb-2">📍 You are here</div>
                        <div className="text-xs text-gray-600 space-y-1">
                            <div>📍 {userPosition.lat.toFixed(6)}, {userPosition.lng.toFixed(6)}</div>
                            {userHeading !== undefined && (
                                <div>🧭 Heading: {Math.round(userHeading)}°</div>
                            )}
                            {accuracy && (
                                <div>🎯 Accuracy: ±{Math.round(accuracy)}m</div>
                            )}
                            <div className="text-xs text-gray-400 mt-2">
                                Last updated: {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                </Popup>
            </Marker>
        </>
    );
}