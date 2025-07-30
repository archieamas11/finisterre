//RoutingMachine.tsx 
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface RoutingMachineProps {
    from: [number, number];
    to: [number, number];
    type?: 'public' | 'private';
}

export default function RoutingMachine({ from, to, type = 'public' }: RoutingMachineProps) {
    const map = useMap();
    useEffect(() => {
        let control: any = null;
        // @ts-ignore
        // L.Routing is added by leaflet-routing-machine
        // @ts-ignore
        control = L.Routing.control({
            waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
            // @ts-ignore
            router: L.Routing.osrmv1({
                serviceUrl:
                    type === 'private'
                        ? "https://finisterreosm-production.up.railway.app/route/v1/foot"
                        : "https://router.project-osrm.org/route/v1"
            }),
            show: false,
            addWaypoints: false,
            routeWhileDragging: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            lineOptions: {
                styles: [
                    { color: type === 'private' ? '#22c55e' : '#0074D9', weight: 5 }
                ],
                extendToWaypoints: true,
                missingRouteTolerance: 1
            }
        }).addTo(map);
        return () => {
            if (control) {
                map.removeControl(control);
            }
        };
    }, [from, to, map, type]);
    return null;
}
