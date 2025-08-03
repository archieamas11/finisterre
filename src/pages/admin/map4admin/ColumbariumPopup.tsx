import { ImLibrary } from "react-icons/im";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Crown, Phone, MapPin, Loader2 } from 'lucide-react';
import { useNichesByPlot } from '@/hooks/plots-hooks/niche.hooks';
import type { ConvertedMarker } from '@/types/map.types';
import type { nicheData } from '@/types/niche.types';

interface ColumbariumPopupProps {
    marker: ConvertedMarker;
}

export default function ColumbariumPopup({ marker }: ColumbariumPopupProps) {
    const [selectedNiche, setSelectedNiche] = useState<nicheData | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const rows = parseInt(marker.rows);
    const cols = parseInt(marker.columns);

    // 🔄 Fetch niche data using React Query
    const {
        data: nicheData = [],
        isLoading: loading,
        error
    } = useNichesByPlot(marker.plot_id, rows, cols);

    const handleNicheClick = (niche: nicheData) => {
        console.log('🎯 Niche selected:', niche);
        setSelectedNiche(niche);
        setIsDetailOpen(true);
    };

    // 🔄 Show loading state
    if (loading) {
        return (
            <div className="p-4 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading niche data...</span>
            </div>
        );
    }

    // ❌ Show error state
    if (error) {
        return (
            <div className="p-4 text-red-600">
                <p>Error: {error.message || 'Failed to load niche data'}</p>
                <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="p-2 w-110">
            <div className="mb-3">
                <h3 className="flex items-center gap-2 font-bold text-lg mb-1 text-accent-foreground">
                    <ImLibrary /> Chamber {marker.plot_id}
                </h3>
                <div className="flex gap-2 text-sm text-secondary-foreground">
                    <span><span className="font-medium">Rows:</span> {marker.rows}</span>
                    <span><span className="font-medium">Columns:</span> {marker.columns}</span>
                    <span><span className="font-medium">Total:</span> {rows * cols} niches</span>
                </div>
            </div>

            {/* 🔢 Grid layout for niches */}
            <div className="mb-3">
                <h4 className="text-sm font-medium mb-2 text-secondary-foreground">Niche Layout:</h4>
                <div
                    className="grid gap-1 border rounded p-2 bg-card w-105"
                    style={{
                        gridTemplateColumns: `repeat(${Math.min(cols, 9)}, minmax(0, 1fr))`,
                        fontSize: '20px',
                        scrollbarWidth: 'thin',
                    }}
                >
                    {nicheData.map((niche) => (
                        <button
                            key={niche.id}
                            onClick={() => handleNicheClick(niche)}
                            className={` aspect-square border rounded text-center p-1 transition-all duration-200 cursor-pointer
                                    flex flex-col items-center justify-center min-h-[40px] hover:scale-105 hover:shadow-sm
                                    ${getNicheStatusStyle(niche.niche_status)}
                                `}
                            title={`${niche.id} - ${niche.niche_status}${niche.owner ? ` (${niche.owner.name})` : ''}`}
                        >
                            <span className="font-mono text-[10px] leading-tight">
                                N{niche.niche_number}
                            </span>
                            <span className="font-mono text-[11px] leading-tight">
                                R{niche.row}C{niche.col}
                            </span>
                        </button>
                    ))
                    }
                </div >
            </div >

            {/* 🎨 Legend */}
            < div className="mb-3" >
                <h4 className="text-sm font-medium mb-2 text-accent-foreground">Legend:</h4>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                        <span className="text-secondary-foreground">Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                        <span className="text-secondary-foreground">Reserved</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                        <span className="text-secondary-foreground">Occupied</span>
                    </div>
                </div>
            </div >

            {/* 📊 Summary stats */}
            < div className="grid grid-cols-3 gap-2 text-xs" >
                <div className="text-center p-2 bg-green-50 dark:bg-green-200 rounded">
                    <div className="font-semibold text-green-700">
                        {nicheData.filter(n => n.niche_status === 'available').length}
                    </div>
                    <div className="text-green-600">Available</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-200 rounded">
                    <div className="font-semibold text-yellow-700">
                        {nicheData.filter(n => n.niche_status === 'reserved').length}
                    </div>
                    <div className="text-yellow-600">Reserved</div>
                </div>
                <div className="text-center p-2 bg-red-50 dark:bg-red-200 rounded">
                    <div className="font-semibold text-red-700">
                        {nicheData.filter(n => n.niche_status === 'occupied').length}
                    </div>
                    <div className="text-red-600">Occupied</div>
                </div>
            </div >

            {/* Media display */}
            {/* {(() => {
                // 🖼️ Check both file_names_array and file_name properties
                const images = marker.file_names_array || marker.file_name || [];
                console.log("🖼️ Images to display:", images, "from marker:", marker);
                return Array.isArray(images) && images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mt-5">
                        {images.map((imageUrl, idx) => (
                            <img
                                key={idx}
                                src={imageUrl}
                                alt={`Plot media ${idx + 1}`}
                                className="w-full h-30 object-cover rounded hover:transform hover:scale-105 transition-transform duration-200"
                                onError={(e) => {
                                    console.log("🖼️ Image failed to load:", imageUrl);
                                    e.currentTarget.style.display = 'none';
                                }}
                                onLoad={() => {
                                    console.log("✅ Image loaded successfully:", imageUrl);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-xs text-gray-400 mt-5">
                        No photos available
                    </div>
                );
            })()} */}

            {/* 🔍 Niche Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Crown className="w-5 h-5 text-purple-600" />
                            Chamber {selectedNiche?.id}
                        </DialogTitle>
                        {/* ✅ Proper location for description */}
                        <DialogDescription className="sr-only">
                            Details and actions for the selected chambers niche.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedNiche && (
                        <div className="space-y-4">
                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                                <Badge className={getStatusBadgeVariant(selectedNiche.niche_status)}>
                                    {selectedNiche.niche_status.toUpperCase()}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                    Niche #{selectedNiche.niche_number} - Row {selectedNiche.row}, Column {selectedNiche.col}
                                </span>
                            </div>

                            {/* Owner Information */}
                            {selectedNiche.owner && (
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Owner Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User className="w-3 h-3 text-gray-500" />
                                            <span className="text-sm">{selectedNiche.owner.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-3 h-3 text-gray-500" />
                                            <span className="text-sm">{selectedNiche.owner.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3 h-3 text-gray-500" />
                                            <span className="text-sm">{selectedNiche.owner.email}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Deceased Information */}
                            {selectedNiche.deceased && (
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Deceased Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-2">
                                        <div>
                                            <span className="font-medium text-sm">{selectedNiche.deceased.name}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                            <div>
                                                <span className="font-medium">Born:</span>
                                                <br />
                                                {selectedNiche.deceased.dateOfBirth}
                                            </div>
                                            <div>
                                                <span className="font-medium">Died:</span>
                                                <br />
                                                {selectedNiche.deceased.dateOfDeath}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            <span className="font-medium">Interment:</span> {selectedNiche.deceased.dateOfInterment}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Available niche message */}
                            {selectedNiche.niche_status === 'available' && (
                                <Card className="bg-green-50 border-green-200">
                                    <CardContent className="pt-4">
                                        <p className="text-sm text-green-800 text-center">
                                            🎯 This niche is available for purchase or reservation.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Action buttons for available niches */}
                            {selectedNiche.niche_status === 'available' && (
                                <div className="flex gap-2">
                                    <Button size="sm" className="flex-1">
                                        Reserve
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex-1">
                                        More Info
                                    </Button>
                                </div>
                            )}
                            {/* Action buttons for reserved niches */}
                            {selectedNiche.niche_status === 'reserved' && (
                                <div className="flex gap-2">
                                    <Button size="sm" className="flex-1">
                                        Add Record
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex-1">
                                        More Info
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    );
}

// 🎨 Get status styling for niche grid items
const getNicheStatusStyle = (status: nicheData['niche_status']) => {
    switch (status) {
        case 'available':
            return 'bg-green-100 hover:bg-green-200 border-green-300 text-green-800';
        case 'occupied':
            return 'bg-red-100 hover:bg-red-200 border-red-300 text-red-800';
        case 'reserved':
            return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800';
        default:
            return 'bg-gray-100 hover:bg-gray-200 border-gray-300';
    }
};

// 🎯 Get status badge styling
const getStatusBadgeVariant = (status: nicheData['niche_status']) => {
    switch (status) {
        case 'available':
            return 'bg-green-500 text-white';
        case 'occupied':
            return 'bg-red-500 text-white';
        case 'reserved':
            return 'bg-yellow-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};