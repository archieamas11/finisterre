import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface RoutingMachineProps {
  from: [number, number];
  to: [number, number];
  // Called when route is found; provides the first route object from LRM
  onRouteFound?: (route?: any) => void;
  onRouteError?: () => void;
}

export default function RoutingMachine({ from, to, onRouteFound, onRouteError }: RoutingMachineProps) {
  const map = useMap();
  const routingControlRef = useRef<any>(null);
  const routerRef = useRef<any>(null);
  const isUnmountedRef = useRef(false);
  const onRouteFoundRef = useRef<RoutingMachineProps["onRouteFound"] | undefined>(undefined);
  const onRouteErrorRef = useRef<RoutingMachineProps["onRouteError"] | undefined>(undefined);
  const fromRef = useRef<[number, number]>(from);
  const toRef = useRef<[number, number]>(to);
  const pendingRequestRef = useRef<boolean>(false);

  // Keep latest callbacks without retriggering routing setup
  useEffect(() => {
    onRouteFoundRef.current = onRouteFound;
  }, [onRouteFound]);

  useEffect(() => {
    onRouteErrorRef.current = onRouteError;
  }, [onRouteError]);

  // keep latest waypoints in refs for event handlers
  useEffect(() => {
    fromRef.current = from;
    toRef.current = to;
  }, [from, to]);

  // Mount once: create the routing control and listeners
  useEffect(() => {
    isUnmountedRef.current = false;

    const handleRoutesFound = (e: any) => {
      if (isUnmountedRef.current) return;
      pendingRequestRef.current = false;
      const route = e?.routes?.[0];
      onRouteFoundRef.current?.(route);

      const routes = e?.routes;
      if (routes && routes.length > 0) {
        const coordinates = routes[0].coordinates;
        if (coordinates && coordinates.length > 0) {
          const [fx, fy] = fromRef.current;
          const [tx, ty] = toRef.current;
          coordinates[0] = L.latLng(fx, fy);
          coordinates[coordinates.length - 1] = L.latLng(tx, ty);
        }
      }
    };

    const handleRoutingError = (e: any) => {
      if (isUnmountedRef.current) return;
      pendingRequestRef.current = false;
      console.error("Routing error:", e);
      onRouteErrorRef.current?.();
    };

    const handleRoutingStart = () => {
      if (isUnmountedRef.current) return;
      pendingRequestRef.current = true;
    };

    try {
      const router = L.Routing.osrmv1({
        serviceUrl: "https://routing.openstreetmap.de/routed-foot/route/v1",
        profile: "foot",
        suppressDemoServerWarning: true,
      });
      routerRef.current = router;

      const control = L.Routing.control({
        waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
        router,
        show: false,
        addWaypoints: false,
        routeWhileDragging: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        lineOptions: {
          styles: [{ color: "#3b82f6", weight: 6, opacity: 0.9 }],
          extendToWaypoints: true,
          missingRouteTolerance: 1,
        },
        createMarker: function (i: number, waypoint: any) {
          if (i === 0) {
            return L.marker(waypoint.latLng, {
              icon: L.divIcon({ className: "custom-user-marker" }),
            });
          }
          return L.marker(waypoint.latLng, {
            icon: L.divIcon({
              className: "custom-destination-marker",
              html: '<div role="img" aria-label="Destination" style="position:relative;display:inline-block;width:28px;height:40px;">\
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
        },
      } as any);

      routingControlRef.current = control;
      control.addTo(map);
      control.on("routesfound", handleRoutesFound);
      control.on("routingerror", handleRoutingError);
      control.on("routingstart", handleRoutingStart);
    } catch (error) {
      console.error("Error creating routing control:", error);
      onRouteError?.();
    }

    return () => {
      isUnmountedRef.current = true;

      // 🛡️ Wait for any pending requests to complete before cleanup
      if (pendingRequestRef.current && routerRef.current) {
        try {
          routerRef.current.abort?.();
        } catch (error) {
          console.warn("Error aborting router:", error);
        }
      }

      if (routingControlRef.current) {
        try {
          // 🧹 Remove event listeners first
          routingControlRef.current.off?.("routesfound", handleRoutesFound);
          routingControlRef.current.off?.("routingerror", handleRoutingError);
          routingControlRef.current.off?.("routingstart", handleRoutingStart);
        } catch (error) {
          console.warn("Error removing event listeners:", error);
        }

        try {
          // 🗑️ Clear any existing routes before removing control
          if (routingControlRef.current._routes && routingControlRef.current._routes.length > 0) {
            routingControlRef.current.getPlan()?.setWaypoints?.([]);
          }

          // 🧹 Also clear any route lines manually
          if (routingControlRef.current._routeLines) {
            routingControlRef.current._routeLines.forEach((line: any) => {
              if (map.hasLayer(line)) {
                map.removeLayer(line);
              }
            });
            routingControlRef.current._routeLines = [];
          }
        } catch (error) {
          console.warn("Error clearing routes:", error);
        }

        // 🗑️ Immediately remove control without delay
        try {
          if (routingControlRef.current && map.hasLayer?.(routingControlRef.current)) {
            map.removeControl(routingControlRef.current);
          }
        } catch (error) {
          console.warn("Error removing routing control:", error);
        }
        routingControlRef.current = null;
      }

      routerRef.current = null;
      pendingRequestRef.current = false;
    };
  }, [map]);

  // When from/to change, update waypoints on the existing control
  useEffect(() => {
    const control = routingControlRef.current;
    if (!control || isUnmountedRef.current) return;

    // 🚫 Cancel any pending requests
    if (pendingRequestRef.current && routerRef.current) {
      try {
        routerRef.current.abort?.();
      } catch (error) {
        console.warn("Error aborting previous route request:", error);
      }
    }

    try {
      const waypoints = [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])];

      // 🔄 Always clear existing routes first, regardless of their existence
      control.getPlan()?.setWaypoints?.([]);

      // 🧹 Also clear any route lines manually
      if (control._routeLines) {
        control._routeLines.forEach((line: any) => {
          if (map.hasLayer(line)) {
            map.removeLayer(line);
          }
        });
        control._routeLines = [];
      }

      // ⏱️ Delay to ensure cleanup before new route
      setTimeout(() => {
        if (!isUnmountedRef.current && routingControlRef.current === control) {
          try {
            control.getPlan()?.setWaypoints?.(waypoints);
          } catch (error) {
            console.warn("Error setting waypoints after cleanup:", error);
            onRouteErrorRef.current?.();
          }
        }
      }, 50);
    } catch (error) {
      console.error("Error updating waypoints:", error);
      onRouteErrorRef.current?.();
    }
  }, [from, to]);

  return null;
}
