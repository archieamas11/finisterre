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
    useEffect(() => {
        let control: any = null;
        let isUnmounted = false;
        // @ts-ignore
        // L.Routing is added by leaflet-routing-machine
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
        return () => {
            isUnmounted = true;
            if (control) {
                control.remove();
            }
        };
    }, [from, to, map]);
    return null;
}
