import { ImLibrary } from "react-icons/im";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Crown, Phone, MapPin } from 'lucide-react';
import type { multiplePlots } from '@/types/map.types';

interface ColumbariumPopupProps {
    marker: multiplePlots;
}

// 🗂️ Mock niche data structure
interface NicheData {
    id: string;
    nicheNumber: number;
    row: number;
    col: number;
    status: 'available' | 'occupied' | 'reserved';
    owner?: {
        name: string;
        phone: string;
        email: string;
    };
    deceased?: {
        name: string;
        dateOfBirth: string;
        dateOfDeath: string;
        dateOfInterment: string;
    };
}

// 🎭 Generate mock data for demonstration
const generateMockNicheData = (rows: number, cols: number, colId: string): NicheData[] => {
    const niches: NicheData[] = [];
    let nicheCounter = 1;

    for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= cols; col++) {
            const nicheId = `${colId}-N-${nicheCounter}-R${row}C${col}`;
            // 🎲 Random distribution: 40% available, 35% occupied, 25% reserved
            const rand = Math.random();
            let status: NicheData['status'];
            if (rand < 0.4) status = 'available';
            else if (rand < 0.75) status = 'occupied';
            else status = 'reserved';

            niches.push({
                id: nicheId,
                nicheNumber: nicheCounter,
                row,
                col,
                status,
                owner: status !== 'available' ? {
                    name: `${['Juan', 'Maria', 'Jose', 'Ana', 'Carlos', 'Rosa'][Math.floor(Math.random() * 6)]} ${['Santos', 'Reyes', 'Cruz', 'Garcia', 'Lopez', 'Ramos'][Math.floor(Math.random() * 6)]}`,
                    phone: `+63 9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
                    email: `owner${Math.floor(Math.random() * 100)}@gmail.com`
                } : undefined,
                deceased: status === 'occupied' ? {
                    name: `${['Pedro', 'Carmen', 'Miguel', 'Elena', 'Ricardo', 'Sofia'][Math.floor(Math.random() * 6)]} ${['Santos', 'Reyes', 'Cruz', 'Garcia', 'Lopez', 'Ramos'][Math.floor(Math.random() * 6)]}`,
                    dateOfBirth: `19${20 + Math.floor(Math.random() * 60)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                    dateOfDeath: `20${15 + Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                    dateOfInterment: `20${15 + Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
                } : undefined
            });

            nicheCounter++;
        }
    }

    return niches;
};

// 🎨 Get status styling for niche grid items
const getNicheStatusStyle = (status: NicheData['status']) => {
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
const getStatusBadgeVariant = (status: NicheData['status']) => {
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

export function ColumbariumPopup({ marker }: ColumbariumPopupProps) {
    const [selectedNiche, setSelectedNiche] = useState<NicheData | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const rows = parseInt(marker.rows);
    const cols = parseInt(marker.columns);

    // 🎭 Generate mock niche data
    // TODO: Replace with real API call to fetch niche data by columbarium ID
    const nicheData = generateMockNicheData(rows, cols, marker.col_id);

    const handleNicheClick = (niche: NicheData) => {
        console.log('🎯 Niche selected:', niche);
        setSelectedNiche(niche);
        setIsDetailOpen(true);
    };

    return (
        <div className="p-2 w-89">
            <div className="mb-3">
                <h3 className="flex items-center gap-2 font-bold text-lg mb-1 text-secondary">
                    <ImLibrary /> Columbarium {marker.col_id}
                </h3>
                <div className="flex gap-2 text-sm text-gray-600">
                    <span><span className="font-medium">Rows:</span> {marker.rows}</span>
                    <span><span className="font-medium">Columns:</span> {marker.columns}</span>
                    <span><span className="font-medium">Total:</span> {rows * cols} niches</span>
                </div>
            </div>

            {/* 🔢 Grid layout for niches */}
            <div className="mb-3">
                <h4 className="text-sm font-medium mb-2 text-gray-700">Niche Layout:</h4>
                <div
                    className="grid gap-1 border rounded p-2 bg-gray-50 w-85"
                    style={{
                        gridTemplateColumns: `repeat(${Math.min(cols, 9)}, minmax(0, 1fr))`,
                        fontSize: '10px',
                        scrollbarWidth: 'thin',
                    }}
                >
                    {nicheData.map((niche) => (
                        <button
                            key={niche.id}
                            onClick={() => handleNicheClick(niche)}
                            className={` aspect-square border rounded text-center p-1 transition-all duration-200 cursor-pointer
                                    flex flex-col items-center justify-center min-h-[28px] hover:scale-105 hover:shadow-sm
                                    ${getNicheStatusStyle(niche.status)}
                                `}
                            title={`${niche.id} - ${niche.status}${niche.owner ? ` (${niche.owner.name})` : ''}`}
                        >
                            <span className="font-mono text-[6px] leading-none">
                                N{niche.nicheNumber}
                            </span>
                            <span className="font-mono text-[7px] leading-none">
                                R{niche.row}C{niche.col}
                            </span>
                            {niche.status === 'occupied' && (
                                <span className="text-[6px] leading-none">👤</span>
                            )}
                            {niche.status === 'reserved' && (
                                <span className="text-[6px] leading-none">📝</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 🎨 Legend */}
            <div className="mb-3">
                <h4 className="text-sm font-medium mb-2 text-gray-700">Legend:</h4>
                <div className="flex gap-2 text-xs justify-between">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                        <span>Reserved</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                        <span>Occupied</span>
                    </div>
                </div>
            </div>

            {/* 📊 Summary stats */}
            <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-semibold text-green-700">
                        {nicheData.filter(n => n.status === 'available').length}
                    </div>
                    <div className="text-green-600">Available</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                    <div className="font-semibold text-yellow-700">
                        {nicheData.filter(n => n.status === 'reserved').length}
                    </div>
                    <div className="text-yellow-600">Reserved</div>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                    <div className="font-semibold text-red-700">
                        {nicheData.filter(n => n.status === 'occupied').length}
                    </div>
                    <div className="text-red-600">Occupied</div>
                </div>
            </div>

            {/* 🔍 Niche Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Crown className="w-5 h-5 text-purple-600" />
                            Columbarium {selectedNiche?.id}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedNiche && (
                        <div className="space-y-4">
                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                                <Badge className={getStatusBadgeVariant(selectedNiche.status)}>
                                    {selectedNiche.status.toUpperCase()}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                    Niche #{selectedNiche.nicheNumber} - Row {selectedNiche.row}, Column {selectedNiche.col}
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
                            {selectedNiche.status === 'available' && (
                                <Card className="bg-green-50 border-green-200">
                                    <CardContent className="pt-4">
                                        <p className="text-sm text-green-800 text-center">
                                            🎯 This niche is available for purchase or reservation.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Action buttons for available niches */}
                            {selectedNiche.status === 'available' && (
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
                            {selectedNiche.status === 'reserved' && (
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
        </div>
    );
}