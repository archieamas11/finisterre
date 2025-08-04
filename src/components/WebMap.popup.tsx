import { FaHourglassStart } from "react-icons/fa";
import { BiCheckCircle } from "react-icons/bi";
import { BiXCircle } from "react-icons/bi";
import { FaDirections } from "react-icons/fa";
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Info, MapPin, Ruler } from 'lucide-react';
import { type ConvertedMarker } from '@/types/map.types';

interface PlotLocationsProps {
    marker: ConvertedMarker;
    backgroundColor?: string;
    onDirectionClick?: () => void;
}

export function PlotLocations({ marker, backgroundColor, onDirectionClick }: PlotLocationsProps) {

    return (
        <div className="mt-5">
            <div
                className='p-3 rounded-t-lg transition-colors bg-background dark:bg-muted'
                style={backgroundColor ? { background: backgroundColor } : {}}
            >
                <CardDescription className="text-primary/70 dark:text-primary/80">Finisterre</CardDescription>
                <CardTitle className="text-primary dark:text-primary">Plot Information</CardTitle>
            </div>
            <div className='bg-accent/60 dark:bg-accent/80 p-2 rounded-b-lg mb-3 transition-colors'>
                <div className="flex items-center justify-between gap-1">
                    <div className='flex items-center gap-1'>
                        <MapPin size={16} className="text-primary/80 dark:text-primary" />
                        <span className="text-sm text-foreground font-medium">{marker.location}</span>
                    </div>
                    <Button
                        className="h-8 w-8 flex justify-center items-center rounded-full shadow-md transition-colors"
                        style={backgroundColor ? { background: backgroundColor } : {}}
                        onClick={onDirectionClick}
                        variant="secondary"
                    >
                        <FaDirections className="text-white" />
                    </Button>
                </div>
            </div>
            {/* Plot Status */}
            <div className="flex items-center justify-between gap-2 mb-3 bg-muted/70 dark:bg-muted/80 p-2 rounded-lg transition-colors">
                <div className="flex items-center gap-1">
                    <Info size={16} className="text-primary/80 dark:text-primary" />
                    <span className="text-sm text-foreground">Plot Status</span>
                </div>
                <span
                    className={
                        marker.plotStatus === 'reserved'
                            ? 'flex items-center gap-1 bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs font-semibold'
                            : marker.plotStatus === 'occupied'
                                ? 'flex items-center gap-1 bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-xs font-semibold'
                                : 'flex items-center gap-1 bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-semibold'
                    }
                >
                    {/* 🟢 Show only the relevant icon for each plotStatus */}
                    {marker.plotStatus === 'reserved' && <FaHourglassStart size={10} />}
                    {marker.plotStatus === 'occupied' && <BiXCircle size={14} />}
                    {marker.plotStatus === 'available' && <BiCheckCircle size={14} />}
                    {!['reserved', 'occupied', 'available'].includes(marker.plotStatus)}
                    <span className="capitalize text-xs">{marker.plotStatus}</span>
                </span>
            </div>
            {/* Plot Dimension */}
            <div className="flex gap-2 mb-3">
                <div className="flex-1 bg-accent/40 dark:bg-accent/60 rounded-lg p-2 transition-colors shadow-sm">
                    <div className="flex items-center gap-1 mb-1">
                        <Ruler size={16} className="text-blue-600 dark:text-blue-300" />
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-200">Dimension</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-xs text-foreground font-bold">
                            {marker.dimensions.length} m × {marker.dimensions.width} m<br />
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {marker.dimensions.area.toLocaleString()} m²
                        </span>
                    </div>
                </div>
                <div className="flex-1 bg-accent/40 dark:bg-accent/60 rounded-lg p-2 transition-colors shadow-sm">
                    <div className="flex items-center gap-1 mb-1">
                        <Info size={16} className="text-primary/80 dark:text-primary" />
                        <span className="text-xs font-semibold text-foreground">Details</span>
                    </div>
                    <span className={
                        (marker.category === 'Bronze'
                            ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200'
                            : marker.category === 'Silver'
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                : 'bg-yellow-200 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-200')
                        + ' flex items-center justify-center px-2 py-1 rounded text-xs font-semibold shadow'
                    }>
                        <Award size={14} className="inline" />
                        {marker.category}
                    </span>
                </div>
            </div>
            <div className="text-center text-xs text-muted-foreground mt-2">No photos available</div>
        </div>
    );
}
