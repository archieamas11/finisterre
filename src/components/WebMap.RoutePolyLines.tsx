// components/RoutePolylines.tsx
import { Polyline, Circle } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { type RouteData } from '@/hooks/WebMapRouting.hook';
import L from 'leaflet';

interface RoutePolylinesProps {
    publicRoute: RouteData | null;
    privateRoute: RouteData | null;
    userPosition?: L.LatLng | null;
    animated?: boolean;
}

export function RoutePolylines({
    publicRoute,
    privateRoute,
    userPosition,
    animated = false
}: RoutePolylinesProps) {
    const [animationOffset, setAnimationOffset] = useState(0);

    // Animate the route lines
    useEffect(() => {
        if (!animated) return;

        const interval = setInterval(() => {
            setAnimationOffset(prev => (prev + 1) % 20);
        }, 200);

        return () => clearInterval(interval);
    }, [animated]);

    // Helper function to create waypoint markers along the route
    const renderWaypoints = (route: RouteData, color: string) => {
        if (!route.polyline || route.polyline.length < 3) return null;

        // Show waypoints every ~100 meters along the route
        const waypoints: [number, number][] = [];
        const totalDistance = route.distance || 0;
        const waypointInterval = Math.max(100, totalDistance / 10); // Max 10 waypoints

        let currentDistance = 0;
        for (let i = 0; i < route.polyline.length - 1; i++) {
            const segmentDistance = calculateDistance(route.polyline[i], route.polyline[i + 1]);
            currentDistance += segmentDistance;

            if (currentDistance >= waypointInterval) {
                waypoints.push(route.polyline[i]);
                currentDistance = 0;
            }
        }

        return waypoints.map((point, index) => (
            <Circle
                key={`waypoint-${index}`}
                center={point}
                radius={2}
                pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.8,
                    weight: 1,
                    opacity: 0.9
                }}
            />
        ));
    };

    // Helper function to calculate distance between two points
    const calculateDistance = (from: [number, number], to: [number, number]): number => {
        const R = 6371000; // Earth's radius in meters
        const dLat = (to[0] - from[0]) * Math.PI / 180;
        const dLng = (to[1] - from[1]) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(from[0] * Math.PI / 180) * Math.cos(to[0] * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // // Find the nearest point on route for progress indication
    // const findNearestPointOnRoute = (route: RouteData): number => {
    //     if (!userPosition || !route.polyline.length) return 0;

    //     let nearestDistance = Infinity;
    //     let nearestIndex = 0;

    //     route.polyline.forEach((point, index) => {
    //         const distance = userPosition.distanceTo(L.latLng(point[0], point[1]));
    //         if (distance < nearestDistance) {
    //             nearestDistance = distance;
    //             nearestIndex = index;
    //         }
    //     });

    //     return nearestIndex / (route.polyline.length - 1); // Progress as percentage
    // };

    return (
        <>
            {/* Public route polyline (user to gate) - Red for driving */}
            {publicRoute && publicRoute.polyline.length > 1 && (
                <>
                    <Polyline
                        positions={publicRoute.polyline}
                        pathOptions={{
                            color: '#FF6B6B',
                            weight: 8,
                            opacity: 0.7,
                            lineCap: 'round',
                            lineJoin: 'round'
                        }}
                    />
                    {/* Animated overlay for active route */}
                    {animated && (
                        <Polyline
                            positions={publicRoute.polyline}
                            pathOptions={{
                                color: '#FFD93D',
                                weight: 4,
                                opacity: 0.9,
                                lineCap: 'round',
                                lineJoin: 'round',
                                dashArray: '10, 10',
                                dashOffset: animationOffset.toString()
                            }}
                        />
                    )}
                    {/* Progress indicator on public route */}
                    {userPosition && (
                        <Circle
                            center={publicRoute.polyline[0]}
                            radius={5}
                            pathOptions={{
                                color: '#FF6B6B',
                                fillColor: '#FF6B6B',
                                fillOpacity: 0.8,
                                weight: 2
                            }}
                        />
                    )}
                    {/* Waypoint markers for long routes */}
                    {publicRoute.distance && publicRoute.distance > 200 && renderWaypoints(publicRoute, '#FF6B6B')}
                </>
            )}

            {/* Private route polyline (gate to marker) - Teal for walking */}
            {privateRoute && privateRoute.polyline.length > 1 && (
                <>
                    <Polyline
                        positions={privateRoute.polyline}
                        pathOptions={{
                            color: '#4ECDC4',
                            weight: 6,
                            opacity: 0.8,
                            lineCap: 'round',
                            lineJoin: 'round',
                            dashArray: '8, 4' // Dashed line to differentiate walking route
                        }}
                    />
                    {/* Animated overlay for active walking route */}
                    {animated && (
                        <Polyline
                            positions={privateRoute.polyline}
                            pathOptions={{
                                color: '#A7F3D0',
                                weight: 3,
                                opacity: 0.9,
                                lineCap: 'round',
                                lineJoin: 'round',
                                dashArray: '5, 5',
                                dashOffset: (-animationOffset).toString() // Reverse animation for walking
                            }}
                        />
                    )}
                    {/* Destination marker */}
                    <Circle
                        center={privateRoute.to}
                        radius={8}
                        pathOptions={{
                            color: '#4ECDC4',
                            fillColor: '#4ECDC4',
                            fillOpacity: 0.6,
                            weight: 2,
                            opacity: 0.9
                        }}
                    />
                    {/* Waypoint markers for walking route */}
                    {privateRoute.distance && privateRoute.distance > 100 && renderWaypoints(privateRoute, '#4ECDC4')}
                </>
            )}

            {/* Route progress indicators */}
            {userPosition && publicRoute && (
                <Circle
                    center={[userPosition.lat, userPosition.lng]}
                    radius={3}
                    pathOptions={{
                        color: '#4285f4',
                        fillColor: '#4285f4',
                        fillOpacity: 1,
                        weight: 2,
                        opacity: 1
                    }}
                />
            )}
        </>
    );
}

