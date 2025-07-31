import type { RouteData } from '@/hooks/WebMapRouting.hook';
import { MapPin, Timer, Car, Footprints, StopCircle, Loader2 } from 'lucide-react';

interface NavigationControlProps {
    publicRoute: RouteData | null;
    privateRoute: RouteData | null;
    totalDistance: number;
    totalDuration: number;
    isRecalculating: boolean;
    formatDistance: (meters: number) => string;
    formatDuration: (seconds: number) => string;
    onStopNavigation: () => void;
}

export function NavigationControl({
    publicRoute,
    privateRoute,
    totalDistance,
    totalDuration,
    isRecalculating,
    formatDistance,
    formatDuration,
    onStopNavigation
}: NavigationControlProps) {
    if (!publicRoute && !privateRoute) return null;

    return (
        <>
            {/* Navigation Control Panel */}
            <div className="absolute top-4 left-1/2 z-[9999] -translate-x-1/2 flex flex-col items-center gap-2 mt-0 md:mt-18 lg:mt-18">
                {/* Route Info Card */}
                <div className="shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-stone-800/80 dark:hover:bg-stone-800/90 dark:border-stone-700 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">{formatDistance(totalDistance)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4" />
                            <span className="font-medium">{formatDuration(totalDuration)}</span>
                        </div>
                    </div>

                    {/* Route breakdown */}
                    {publicRoute && privateRoute && (
                        <div className="mt-2 pt-2 border-t text-xs">
                            <div className="flex flex-row justify-between items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <Car className="w-3 h-3" />
                                    Drive: {formatDistance(publicRoute.distance || 0)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Footprints className="w-3 h-3" />
                                    Walk: {formatDistance(privateRoute.distance || 0)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stop Navigation Button */}
                <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm active:scale-95 flex items-center gap-2"
                    aria-label="Stop Navigation"
                    onClick={onStopNavigation}
                >
                    <StopCircle className="w-4 h-4" />
                    Stop Navigation
                </button>
            </div>

            {/* Recalculating Indicator */}
            {isRecalculating && (
                <div className="absolute top-32 left-1/2 z-[9999] -translate-x-1/2">
                    <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span className="text-sm font-medium">Recalculating route...</span>
                    </div>
                </div>
            )}
        </>
    );
}