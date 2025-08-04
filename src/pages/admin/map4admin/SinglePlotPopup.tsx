import { Ruler, Plus, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ConvertedMarker } from '@/types/map.types';
import { useState } from 'react';
import EditMapDialog from './editMapDialog';
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle, FaAward, FaHourglassStart } from 'react-icons/fa';
import { BiCheckCircle, BiXCircle } from 'react-icons/bi';

interface PlotLocationsProps {
    marker: ConvertedMarker;
    backgroundColor?: string;
}

export default function SinglePlotLocations({ marker }: PlotLocationsProps) {
    // 🔧 State for edit dialog
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // 🔧 Handler functions for plot operations
    const handleEdit = () => {
        console.log("✏️ Edit plot:", marker.plot_id);
        setIsEditDialogOpen(true);
    };

    const handleAdd = () => {
        console.log("➕ Add deceased record:", marker.plot_id);
        // TODO: Open add plot dialog/form
    };

    const handleView = () => {
        console.log("👁️ View plot details:", marker.plot_id);
        // TODO: Open detailed view modal
    };

    return (
        <div className="mt-6">
            <div className='bg-card p-3 rounded-lg mb-3 shadow-lg'>
                <div className='rounded-lg flex items-stretch gap-3 mb-2'>
                    <Button className="flex-1 flex items-center justify-center bg-accent rounded-md text-accent-foreground" onClick={handleEdit}><Edit /></Button>
                    <Button className="flex-1 flex items-center justify-center bg-accent rounded-md text-accent-foreground" onClick={handleAdd}><Plus /></Button>
                    <Button className="flex-1 flex items-center justify-center bg-accent rounded-md text-accent-foreground" onClick={handleView}><Eye /></Button>
                </div>
                <div className="flex items-center justify-between gap-1 bg-accent p-2 rounded-lg shadow-sm">
                    <div className='flex items-center gap-2'>
                        <FaMapMarkerAlt className="text-accent-foreground" size={14} />
                        <span className="text-xs text-accent-foreground font-medium">{marker.location}</span>
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
                <div className="flex items-center justify-between gap-2 bg-accent p-2 rounded-lg shadow-sm mt-2">
                    <div className='flex item-center gap-2'>
                        {/* ℹ️ Use react-icons for info */}
                        <FaInfoCircle className="text-accent-foreground" size={14} />
                        <span className="text-xs text-accent-foreground">Plot Category</span>
                    </div>
                    <span
                        className={
                            (marker.category === 'bronze'
                                ? 'bg-amber-100 text-amber-800'
                                : marker.category === 'silver'
                                    ? 'bg-gray-200 text-gray-800'
                                    : marker.category === 'platinum'
                                        ? 'bg-yellow-200 text-yellow-900'
                                        : marker.category === 'diamond'
                                            ? 'bg-pink-200 text-pink-900'
                                            : 'bg-gray-100 text-gray-700')
                            + ' flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-semibold'
                        }
                    >
                        {/* 🏆 Use react-icons for award */}
                        <FaAward className="inline" size={14} />
                        <span className="ml-1">{marker.category.charAt(0).toUpperCase() + marker.category.slice(1)}</span>
                    </span>
                </div>
                {/* 🧑‍💼 Customer Info */}
                <div className="flex items-center justify-between mt-2 bg-accent p-2 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <FaUser className="text-accent-foreground" size={14} />
                        <span className="text-xs text-accent-foreground font-medium">Juan Dela Cruz</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-accent-foreground" size={14} />
                        <span className="text-xs text-accent-foreground font-medium">2023-10-15</span>
                    </div>
                </div>
            </div>
            {/* Plot Dimension */}
            <div className="flex gap-2 mb-5">
                <div className="flex-1 bg-card rounded-lg p-2 shadow-lg">
                    <div className="flex items-center gap-1 mb-1">
                        <Ruler size={16} className="text-blue-500" />
                        <span className="text-xs font-semibold text-accent-foreground">Dimension</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-xs text-accent-foreground font-bold">
                            {/* 🧮 Show N/A if length or width is missing or not a number */}
                            {isNaN(marker.dimensions.length) || marker.dimensions.length === undefined || marker.dimensions.length === null
                                ? "N/A"
                                : marker.dimensions.length} m × {isNaN(marker.dimensions.width) || marker.dimensions.width === undefined || marker.dimensions.width === null
                                    ? "N/A"
                                    : marker.dimensions.width} m<br />
                        </div>
                        <span className="text-xs text-accent-foreground">
                            {/* 🧮 Show N/A if area is missing or not a number */}
                            {isNaN(marker.dimensions.area) || marker.dimensions.area === undefined || marker.dimensions.area === null
                                ? "N/A"
                                : marker.dimensions.area.toLocaleString()} m²
                        </span>
                    </div>
                </div>
            </div>
            {/* Media display
            // {(() => {
            //     // 🖼️ Check both file_names_array and file_name properties
            //     const images = marker.file_names_array || marker.file_name || [];
            //     console.log("🖼️ Images to display:", images, "from marker:", marker);
            //     return Array.isArray(images) && images.length > 0 ? (
            //         <div className="grid grid-cols-2 gap-2 mt-2">
            //             {images.map((imageUrl, idx) => (
            //                 <img
            //                     key={idx}
            //                     src={imageUrl}
            //                     alt={`Plot media ${idx + 1}`}
            //                     className="w-full h-30 object-cover rounded hover:transform hover:scale-105 transition-transform duration-200"
            //                     onError={(e) => {
            //                         console.log("🖼️ Image failed to load:", imageUrl);
            //                         e.currentTarget.style.display = 'none';
            //                     }}
            //                 />
            //             ))}
            //         </div>
            //     ) : (
            //         <div className="text-center text-xs text-gray-400 mt-2">
            //         </div>
            //     );
            // })()} */}

            {/* 🔧 Edit Dialog */}
            <EditMapDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                plots={{
                    plot_id: marker.plot_id,
                    category: marker.category,
                    length: marker.dimensions.length,
                    width: marker.dimensions.width,
                    area: marker.dimensions.area,
                    status: marker.plotStatus,
                    label: marker.label || "",
                    file_name: marker.file_names_array || marker.file_name || [],
                    block: marker.block,
                    coordinates: marker.position,
                }}
            />
        </div>
    );
}
