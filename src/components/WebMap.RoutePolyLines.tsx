// components/RoutePolylines.tsx
import { Polyline } from 'react-leaflet';
import type { RouteData } from '../hooks/WebMapRouting.hook';

interface RoutePolylinesProps {
    publicRoute: RouteData | null;
    privateRoute: RouteData | null;
}

export function RoutePolylines({ publicRoute, privateRoute }: RoutePolylinesProps) {
    return (
        <>
            {/* Public route polyline (user to gate) - Red for driving */}
            {publicRoute && (
                <Polyline
                    positions={publicRoute.polyline}
                    pathOptions={{
                        color: '#FF6B6B',
                        weight: 6,
                        opacity: 0.8,
                        lineCap: 'round',
                        lineJoin: 'round'
                    }}
                />
            )}

            {/* Private route polyline (gate to marker) - Teal for walking */}
            {privateRoute && (
                <Polyline
                    positions={privateRoute.polyline}
                    pathOptions={{
                        color: '#4ECDC4',
                        weight: 6,
                        opacity: 0.8,
                        lineCap: 'round',
                        lineJoin: 'round',
                    }}
                />
            )}
        </>
    );
}