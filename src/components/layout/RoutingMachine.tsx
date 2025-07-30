import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface RoutingMachineProps {
    from: [number, number];
    to: [number, number];
}

export default function RoutingMachine({ from, to }: RoutingMachineProps) {
    const map = useMap();
    // Track geolocation watchId so we can clear it on unmount
    useEffect(() => {
        let control: any = null;
        let isUnmounted = false;
        let watchId: number | null = null;

        // Helper to update route start point as user moves
        function handlePosition(position: GeolocationPosition) {
            const newLat = position.coords.latitude;
            const newLng = position.coords.longitude;
            // Update route start point to live user position
            if (control) {
                // Only update the first waypoint (user position)
                control.setWaypoints([
                    L.latLng(newLat, newLng),
                    L.latLng(to[0], to[1])
                ]);
            }
        }

        // @ts-ignore
        control = L.Routing.control({
            waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
            // @ts-ignore
            router: L.Routing.osrmv1({
                serviceUrl: "https://router.project-osrm.org/route/v1"
            }),
            show: true,
            addWaypoints: false,
            routeWhileDragging: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            lineOptions: {
                styles: [{ color: "#0074D9", weight: 5 }],
                extendToWaypoints: true,
                missingRouteTolerance: 1
            }
        }).addTo(map);
        if (control && typeof control._clearLines === 'function') {
            const origClearLines = control._clearLines;
            control._clearLines = function() {
                if (isUnmounted || !this._map) return;
                return origClearLines.apply(this, arguments);
            };
        }

        // Start live tracking when route is active
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                handlePosition,
                function (error) {
                    // NOTE: Only log error, don't break route
                    console.warn('Live tracking error:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 1000
                }
            );
        }

        return () => {
            isUnmounted = true;
            if (control) {
                control.remove();
            }
            if (watchId !== null && navigator.geolocation) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [from, to, map]);
    return null;
}
