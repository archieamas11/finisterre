import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface RoutingMachineProps {
  from: [number, number];
  to: [number, number];
  onRouteFound?: () => void;
  onRouteError?: () => void;
}

export default function RoutingMachine({ from, to, onRouteFound, onRouteError }: RoutingMachineProps) {
  const map = useMap();
  const routingControlRef = useRef<any>(null);
  const routerRef = useRef<any>(null);
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    isUnmountedRef.current = false;

    // 🧹 Clean up existing routing control before creating new one
    if (routingControlRef.current) {
      try {
        routerRef.current?.abort?.();
      } catch {
        // noop
      }

      try {
        routingControlRef.current.off?.("routesfound");
        routingControlRef.current.off?.("routingerror");
        routingControlRef.current.off?.("routingstart");
      } catch {
        // noop
      }

      try {
        map.removeControl(routingControlRef.current);
      } catch {
        // noop
      }

      routingControlRef.current = null;
    }

    const createRoutingControl = () => {
      const router = L.Routing.osrmv1({
        serviceUrl: "https://routing.openstreetmap.de/routed-foot/route/v1",
        profile: "foot",
        suppressDemoServerWarning: true,
      });
      routerRef.current = router;

      return L.Routing.control({
        waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
        router,
        show: false,
        addWaypoints: false,
        routeWhileDragging: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        lineOptions: {
          styles: [
            {
              color: "#3b82f6",
              weight: 6,
              opacity: 0.9,
            },
          ],
          extendToWaypoints: true,
          missingRouteTolerance: 1,
        },
        createMarker: function (i: number, waypoint: any) {
          // Custom markers for start and end points
          if (i === 0) {
            return L.marker(waypoint.latLng, {
              icon: L.divIcon({
                className: "custom-user-marker",
                html: '<div aria-label="Your location" role="img" style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:2px solid #fff;box-shadow:0 0 0 4px rgba(59,130,246,0.25)"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              }),
            });
          } else {
            return L.marker(waypoint.latLng, {
              icon: L.divIcon({
                className: "custom-destination-marker",
                html:
                  // Accessible inline SVG map pin with subtle pulse
                  '<div role="img" aria-label="Destination" style="position:relative;display:inline-block;width:28px;height:40px;">\
                      <svg width="28" height="40" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">\
                        <title>Destination</title>\
                        <defs>\
                          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">\
                            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/>\
                          </filter>\
                        </defs>\
                        <path filter="url(#shadow)" d="M12 0C7.03 0 3 3.96 3 8.85c0 6.05 7.35 14.25 8.22 15.2.21.23.53.36.85.36.32 0 .64-.13.85-.36.87-.95 8.22-9.15 8.22-15.2C21 3.96 16.97 0 12 0z" fill="#ef4444"/>\
                        <circle cx="12" cy="9" r="3.2" fill="#fff"/>\
                      </svg>\
                    </div>',
                iconSize: [28, 40],
                iconAnchor: [20, 34],
              }),
            });
          }
        },
      } as any);
    };

    // Define handlers once so we can detach them on cleanup
    const handleRoutesFound = (e: any) => {
      if (isUnmountedRef.current) return;
      onRouteFound?.();

      // Force extend to waypoints by manually adjusting the polyline
      const routes = e?.routes;
      if (routes && routes.length > 0) {
        const coordinates = routes[0].coordinates;
        if (coordinates && coordinates.length > 0) {
          // Ensure the route connects exactly to the waypoints
          coordinates[0] = L.latLng(from[0], from[1]);
          coordinates[coordinates.length - 1] = L.latLng(to[0], to[1]);
        }
      }
    };

    const handleRoutingError = (e: any) => {
      if (isUnmountedRef.current) return;
      console.error("Routing error:", e);
      onRouteError?.();
    };

    const handleRoutingStart = () => {
      if (isUnmountedRef.current) return;
      // Route calculation started - loading state should already be active
    };

    try {
      routingControlRef.current = createRoutingControl();
      routingControlRef.current.addTo(map);

      // Add event listeners
      routingControlRef.current.on("routesfound", handleRoutesFound);
      routingControlRef.current.on("routingerror", handleRoutingError);
      routingControlRef.current.on("routingstart", handleRoutingStart);
    } catch (error) {
      console.error("Error creating routing control:", error);
      onRouteError?.();
    }

    return () => {
      isUnmountedRef.current = true;
      if (routingControlRef.current) {
        // Abort any in-flight XHRs to prevent callbacks on a detached map
        try {
          routerRef.current?.abort?.();
        } catch {
          // noop
        }
        // Detach events
        try {
          routingControlRef.current.off?.("routesfound", handleRoutesFound);
          routingControlRef.current.off?.("routingerror", handleRoutingError);
          routingControlRef.current.off?.("routingstart", handleRoutingStart);
        } catch {
          // noop
        }
        try {
          map.removeControl(routingControlRef.current);
        } catch (error) {
          console.error("Error removing routing control:", error);
        }
        routingControlRef.current = null;
      }
      routerRef.current = null;
    };
  }, [from, to, map, onRouteFound, onRouteError]);

  return null;
}
