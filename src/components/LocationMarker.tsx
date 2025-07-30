// components/LocationMarker.tsx
import { useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

interface LocationMarkerProps {
    userPosition: L.LatLng | null;
    onLocationFound: (position: L.LatLng) => void;
    onLocationError?: (error: GeolocationPositionError) => void;
    onExposeLocateFunction: (locateFunction: () => void) => void;
}

export function LocationMarker({
    userPosition,
    onLocationFound,
    onLocationError,
    onExposeLocateFunction
}: LocationMarkerProps) {
    const hasInitialLocationRef = useRef(false);

    const map = useMapEvents({
        locationfound(e) {
            onLocationFound(e.latlng);

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

    const userIcon = L.divIcon({
        html: `<div style="
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
    <style>
      @keyframes pulse {
        0% { transform: scale(0.8); opacity: 0.5; }
        50% { transform: scale(1.2); opacity: 0.1; }
        100% { transform: scale(1.4); opacity: 0; }
      }
    </style>`,
        className: 'custom-user-marker',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
    });

    return (
        <Marker position={userPosition} icon={userIcon}>
            <Popup>
                <div className="text-center">
                    <div className="font-semibold text-blue-600">📍 You are here</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {userPosition.lat.toFixed(6)}, {userPosition.lng.toFixed(6)}
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}