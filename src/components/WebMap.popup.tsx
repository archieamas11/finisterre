import { CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, BadgeCheck, Info, MapPin, Ruler } from 'lucide-react';
import type { MarkerData } from '@/data/geojson/markerData';

interface PlotLocationsProps {
    marker: MarkerData;
    backgroundColor?: string;
    onDirectionClick?: () => void;
}

export function PlotLocations({ marker, backgroundColor, onDirectionClick }: PlotLocationsProps) {
    return (
        <div className="mt-5">
            <div className='p-3 rounded-t-lg' style={{ background: backgroundColor }}>
                <CardDescription>Finisterre</CardDescription>
                <CardTitle>Plot Information</CardTitle>
            </div>
            <div className='bg-gray-100 p-3 rounded-b-lg mb-3'>
                <div className="flex items-center justify-between gap-1">
                    <div className='flex items-center gap-1'>
                        <MapPin size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium">{marker.location}</span>
                    </div>
                    {/* Get direction button */}
                    <Button className="h-8 w-8 flex justify-center items-center rounded-full"
                        style={{ background: backgroundColor }}
                        onClick={onDirectionClick}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
                            <path fill="#FFFF" d="M502.6 233.3L278.7 9.4c-12.5-12.5-32.8-12.5-45.4 0L9.4 233.3c-12.5 12.5-12.5 32.8 0 45.4l223.9 223.9c12.5 12.5 32.8 12.5 45.4 0l223.9-223.9c12.5-12.5 12.5-32.8 0-45.4zm-101 12.6l-84.2 77.7c-5.1 4.7-13.4 1.1-13.4-5.9V264h-96v64c0 4.4-3.6 8-8 8h-32c-4.4 0-8-3.6-8-8v-80c0-17.7 14.3-32 32-32h112v-53.7c0-7 8.3-10.6 13.4-5.9l84.2 77.7c3.4 3.2 3.4 8.6 0 11.8z" />
                        </svg>
                    </Button>
                </div>
            </div>
            {/* Plot Status */}
            <div className="flex items-center justify-between gap-2 mb-3 bg-gray-100 p-2 rounded-lg">
                <div className="flex items-center justify-between gap-1">
                    <Info size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-500">Plot Status</span>
                </div>
                <span className={
                    marker.plotStatus === 'Reserved'
                        ? 'flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold'
                        : marker.plotStatus === 'Occupied'
                            ? 'flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold'
                            : 'flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold'
                }
                >
                    <BadgeCheck size={16} className="inline" />
                    {marker.plotStatus}
                </span>
            </div>
            {/* Plot Dimension */}
            <div className="flex gap-2 mb-3">
                <div className="flex-1 bg-gray-100 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                        <Ruler size={16} className="text-blue-500" />
                        <span className="text-xs font-semibold text-blue-700">Dimension</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-700 font-bold">
                            {marker.dimensions.length} m × {marker.dimensions.width} m<br />
                        </div>
                        <span className="text-xs text-gray-500">
                            {marker.dimensions.area.toLocaleString()} m²
                        </span>
                    </div>
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                        <Info size={16} className="text-gray-500" />
                        <span className="text-xs font-semibold text-gray-700">Details</span>
                    </div>
                    <span className={
                        (marker.category === 'Bronze'
                            ? 'bg-amber-100 text-amber-800'
                            : marker.category === 'Silver'
                                ? 'bg-gray-200 text-gray-800'
                                : 'bg-yellow-200 text-yellow-900')
                        + ' flex items-center justify-center px-2 py-1 rounded text-xs font-semibold'
                    }>
                        <Award size={14} className="inline" />
                        {marker.category}
                    </span>
                </div>
            </div>
            <div className="text-center text-xs text-gray-400 mt-2">No photos available</div>
        </div>
    );
}
