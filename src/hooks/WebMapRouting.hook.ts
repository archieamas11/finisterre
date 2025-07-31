import { useState, useRef, useCallback, useEffect } from "react";
import L from "leaflet";

// Route interface
export interface RouteData {
  from: [number, number];
  to: [number, number];
  polyline: [number, number][];
  distance?: number;
  duration?: number;
}

// Routing configuration
const ROUTING_CONFIG = {
  CEMETERY_GATE: L.latLng(10.248107820799307, 123.797607547609545),
  DRIFT_THRESHOLD: 30, // meters
  APIS: {
    PUBLIC: "https://router.project-osrm.org/route/v1/driving",
    PRIVATE: "https://finisterreosm-production.up.railway.app/route/v1/foot",
  },
  SPEEDS: {
    WALKING: 1.4, // m/s
    DRIVING: 13.89, // m/s (~50 km/h)
  },
};

export function useRouting() {
  const [publicRoute, setPublicRoute] = useState<RouteData | null>(null);
  const [privateRoute, setPrivateRoute] = useState<RouteData | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Refs for tracking
  const lastUserPositionRef = useRef<L.LatLng | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const pendingDestinationRef = useRef<[number, number] | null>(null);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback(
    (from: [number, number], to: [number, number]): number => {
      const R = 6371000; // Earth's radius in meters
      const dLat = ((to[0] - from[0]) * Math.PI) / 180;
      const dLng = ((to[1] - from[1]) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((from[0] * Math.PI) / 180) *
          Math.cos((to[0] * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );

  // Fetch route polyline from OSRM API with error handling
  const fetchRoutePolyline = useCallback(
    async (
      from: [number, number],
      to: [number, number],
      type: "public" | "private"
    ): Promise<{
      polyline: [number, number][];
      distance: number;
      duration: number;
    }> => {
      const serviceUrl =
        type === "private"
          ? ROUTING_CONFIG.APIS.PRIVATE
          : ROUTING_CONFIG.APIS.PUBLIC;

      const url = `${serviceUrl}/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.routes?.length || !data.routes[0]) {
          throw new Error("No route found in API response");
        }

        const route = data.routes[0];
        if (!route.geometry?.coordinates) {
          throw new Error("Invalid route geometry");
        }

        // Convert [lng,lat] to [lat,lng] and validate coordinates
        const polyline: [number, number][] = route.geometry.coordinates
          .filter(
            (c: number[]) =>
              Array.isArray(c) &&
              c.length >= 2 &&
              typeof c[0] === "number" &&
              typeof c[1] === "number"
          )
          .map((c: number[]) => [c[1], c[0]]);

        if (polyline.length === 0) {
          throw new Error("No valid coordinates in route");
        }

        return {
          polyline,
          distance: Math.max(0, route.distance || 0),
          duration: Math.max(0, route.duration || 0),
        };
      } catch (err) {
        console.warn(`Route API failed for ${type} route:`, err);

        // Fallback: straight line with estimated distance/duration
        const distance = calculateDistance(from, to);
        const speed =
          type === "private"
            ? ROUTING_CONFIG.SPEEDS.WALKING
            : ROUTING_CONFIG.SPEEDS.DRIVING;

        return {
          polyline: [from, to],
          distance,
          duration: distance / speed,
        };
      }
    },
    [calculateDistance]
  );

  // Start live GPS tracking with dynamic route updates
  const startLiveTracking = useCallback(
    (
      initialPosition: L.LatLng,
      onPositionUpdate: (position: L.LatLng, heading?: number) => void,
      onRecalculateRoute: (
        newPosition: L.LatLng,
        destination: [number, number]
      ) => void
    ) => {
      if (!navigator.geolocation || watchIdRef.current) return;

      console.log("📡 Starting live GPS tracking...");
      lastUserPositionRef.current = initialPosition;

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLatLng = L.latLng(
            position.coords.latitude,
            position.coords.longitude
          );
          const heading = position.coords.heading; // Device heading if available

          // Calculate bearing if heading not available
          let calculatedHeading = heading;
          if (!heading && lastUserPositionRef.current) {
            calculatedHeading = calculateBearing(
              [
                lastUserPositionRef.current.lat,
                lastUserPositionRef.current.lng,
              ],
              [newLatLng.lat, newLatLng.lng]
            );
          }

          onPositionUpdate(newLatLng, calculatedHeading || undefined);

          // Dynamic route recalculation logic
          if (lastUserPositionRef.current && (publicRoute || privateRoute)) {
            const drift = newLatLng.distanceTo(lastUserPositionRef.current);
            const timeSinceLastUpdate =
              Date.now() - (lastUserPositionRef.current as any).timestamp || 0;

            // Recalculate if:
            // 1. User drifted significantly from the route
            // 2. It's been a while since last update (every 30 seconds during navigation)
            // 3. User is moving in opposite direction
            const shouldRecalculate =
              drift > ROUTING_CONFIG.DRIFT_THRESHOLD ||
              timeSinceLastUpdate > 30000 ||
              (calculatedHeading &&
                isMovingAwayFromRoute(newLatLng, calculatedHeading));

            if (shouldRecalculate && !isRecalculating) {
              console.log(
                `🚧 Recalculating route - drift: ${Math.round(
                  drift
                )}m, time: ${Math.round(timeSinceLastUpdate / 1000)}s`
              );
              setIsRecalculating(true);

              // Determine which route to recalculate based on current position
              const destination = privateRoute
                ? privateRoute.to
                : publicRoute?.to;
              if (destination) {
                onRecalculateRoute(newLatLng, destination);
              }
            }
          }

          // Update position with timestamp
          (newLatLng as any).timestamp = Date.now();
          lastUserPositionRef.current = newLatLng;
        },
        (error) => {
          console.warn("Live tracking error:", error.message);
          // Could implement fallback strategies here
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 2000, // More frequent updates for live tracking
        }
      );
    },
    [publicRoute, privateRoute, isRecalculating]
  );

  // Calculate bearing between two points
  const calculateBearing = useCallback(
    (from: [number, number], to: [number, number]): number => {
      const dLon = ((to[1] - from[1]) * Math.PI) / 180;
      const lat1 = (from[0] * Math.PI) / 180;
      const lat2 = (to[0] * Math.PI) / 180;

      const y = Math.sin(dLon) * Math.cos(lat2);
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

      let bearing = (Math.atan2(y, x) * 180) / Math.PI;
      return (bearing + 360) % 360; // Normalize to 0-360
    },
    []
  );

  // Check if user is moving away from the route
  const isMovingAwayFromRoute = useCallback(
    (userPos: L.LatLng, heading: number): boolean => {
      if (!publicRoute && !privateRoute) return false;

      // Get the current active route
      const activeRoute = publicRoute || privateRoute;
      if (!activeRoute || activeRoute.polyline.length < 2) return false;

      // Find the nearest point on the route
      let nearestDistance = Infinity;
      let nearestSegmentIndex = 0;

      for (let i = 0; i < activeRoute.polyline.length - 1; i++) {
        const segmentStart = activeRoute.polyline[i];
        const distance = calculateDistance(
          [userPos.lat, userPos.lng],
          segmentStart
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestSegmentIndex = i;
        }
      }

      // Get the direction of the route at the nearest segment
      const routeSegmentStart = activeRoute.polyline[nearestSegmentIndex];
      const routeSegmentEnd =
        activeRoute.polyline[
          Math.min(nearestSegmentIndex + 1, activeRoute.polyline.length - 1)
        ];

      const routeBearing = calculateBearing(routeSegmentStart, routeSegmentEnd);

      // Calculate the difference between user heading and route direction
      let bearingDiff = Math.abs(heading - routeBearing);
      if (bearingDiff > 180) bearingDiff = 360 - bearingDiff;

      // If user is heading more than 90 degrees away from route direction, they're moving away
      return bearingDiff > 90;
    },
    [publicRoute, privateRoute, calculateDistance, calculateBearing]
  );

  // Stop live GPS tracking
  const stopLiveTracking = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log("🛑 Stopped live GPS tracking");
    }
  }, []);

  // Start navigation with two-step routing and dynamic updates
  const startNavigation = useCallback(
    async (
      userLatLng: L.LatLng,
      destination: [number, number]
    ): Promise<void> => {
      try {
        setIsRecalculating(false);

        const userPos: [number, number] = [userLatLng.lat, userLatLng.lng];
        const gatePos: [number, number] = [
          ROUTING_CONFIG.CEMETERY_GATE.lat,
          ROUTING_CONFIG.CEMETERY_GATE.lng,
        ];

        // Determine if user is closer to gate or destination
        const distanceToGate = calculateDistance(userPos, gatePos);
        const distanceToDestination = calculateDistance(userPos, destination);

        let publicData: {
          polyline: [number, number][];
          distance: number;
          duration: number;
        };
        let privateData: {
          polyline: [number, number][];
          distance: number;
          duration: number;
        };

        if (distanceToGate < 50) {
          // User is near the gate, skip public route
          console.log("📍 User near gate, using walking route only");
          publicData = {
            polyline: [userPos, gatePos],
            distance: distanceToGate,
            duration: distanceToGate / ROUTING_CONFIG.SPEEDS.WALKING,
          };
          privateData = await fetchRoutePolyline(
            gatePos,
            destination,
            "private"
          );
        } else if (distanceToDestination < distanceToGate) {
          // User is already inside, use walking route only
          console.log("📍 User inside cemetery, using walking route only");
          publicData = { polyline: [], distance: 0, duration: 0 };
          privateData = await fetchRoutePolyline(
            userPos,
            destination,
            "private"
          );
        } else {
          // Standard two-phase routing
          [publicData, privateData] = await Promise.all([
            fetchRoutePolyline(userPos, gatePos, "public"),
            fetchRoutePolyline(gatePos, destination, "private"),
          ]);
        }

        // Ensure route continuity at the gate if both routes exist
        if (publicData.polyline.length > 0 && privateData.polyline.length > 0) {
          publicData.polyline[publicData.polyline.length - 1] = gatePos;
          privateData.polyline[0] = gatePos;
        }

        if (privateData.polyline.length > 0) {
          privateData.polyline[0] = gatePos;
          const lastIdx = privateData.polyline.length - 1;
          const lastPoint = privateData.polyline[lastIdx];
          // Only snap to destination if distance > 2 meters
          const snapDistance = calculateDistance(lastPoint, destination);
          if (snapDistance > 2) {
            privateData.polyline.push(destination);
          }
        }

        // Update routes
        if (publicData.polyline.length > 0) {
          setPublicRoute({
            from: userPos,
            to: gatePos,
            ...publicData,
          });
        } else {
          setPublicRoute(null);
        }

        setPrivateRoute({
          from:
            privateData.polyline.length > 0 ? privateData.polyline[0] : userPos,
          to: destination,
          ...privateData,
        });

        lastUserPositionRef.current = userLatLng;
        console.log("✅ Navigation routes calculated successfully");
      } catch (error) {
        console.error("Navigation error:", error);
        setIsRecalculating(false);
        throw error;
      }
    },
    [fetchRoutePolyline, calculateDistance]
  );

  // Dynamic route update as user moves
  const updateRouteFromCurrentPosition = useCallback(
    async (userLatLng: L.LatLng, destination: [number, number]) => {
      if (isRecalculating) return;

      try {
        setIsRecalculating(true);
        await startNavigation(userLatLng, destination);
      } catch (error) {
        console.error("Failed to update route:", error);
      } finally {
        setIsRecalculating(false);
      }
    },
    [isRecalculating, startNavigation]
  );

  // Stop navigation and cleanup
  const stopNavigation = useCallback(() => {
    setPublicRoute(null);
    setPrivateRoute(null);
    setIsRecalculating(false);
    pendingDestinationRef.current = null;
    lastUserPositionRef.current = null;
    stopLiveTracking();
    console.log("🛑 Navigation stopped");
  }, [stopLiveTracking]);

  // Handle pending destination when location becomes available
  const handlePendingDestination = useCallback(
    (userPosition: L.LatLng) => {
      if (pendingDestinationRef.current) {
        startNavigation(userPosition, pendingDestinationRef.current);
        pendingDestinationRef.current = null;
      }
    },
    [startNavigation]
  );

  // Set pending destination for later processing
  const setPendingDestination = useCallback((destination: [number, number]) => {
    pendingDestinationRef.current = destination;
  }, []);

  // Calculate totals
  const totalDistance =
    (publicRoute?.distance || 0) + (privateRoute?.distance || 0);
  const totalDuration =
    (publicRoute?.duration || 0) + (privateRoute?.duration || 0);

  // Format distance helper
  const formatDistance = useCallback((meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  }, []);

  // Format duration helper
  const formatDuration = useCallback((seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLiveTracking();
    };
  }, [stopLiveTracking]);

  return {
    // State
    publicRoute,
    privateRoute,
    isRecalculating,
    totalDistance,
    totalDuration,

    // Actions
    startNavigation,
    stopNavigation,
    startLiveTracking,
    stopLiveTracking,
    setPendingDestination,
    handlePendingDestination,
    updateRouteFromCurrentPosition, // New dynamic update function

    // Utilities
    formatDistance,
    formatDuration,
    calculateBearing,

    // Constants
    CEMETERY_GATE: ROUTING_CONFIG.CEMETERY_GATE,
  };
}
