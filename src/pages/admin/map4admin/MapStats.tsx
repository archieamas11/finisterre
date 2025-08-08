import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Mock data for demonstration
const locationData = [
    {
        id: "serenity",
        name: "Serenity Lawn",
        stats: [
            { label: "Available", value: 42, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
            { label: "Occupied", value: 17, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
            { label: "Reserved", value: 8, color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
        ]
    },
    {
        id: "memorial",
        name: "Memorial Chambers",
        stats: [
            { label: "Available", value: 28, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
            { label: "Occupied", value: 32, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
            { label: "Reserved", value: 5, color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
        ]
    },
    {
        id: "columbarium",
        name: "Columbarium",
        stats: [
            { label: "Available", value: 15, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
            { label: "Occupied", value: 45, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
            { label: "Reserved", value: 10, color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
        ]
    }
];

export default function MapStats() {
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Calculate overall totals
    const totals = {
        available: locationData.reduce((sum, loc) => sum + loc.stats[0].value, 0),
        occupied: locationData.reduce((sum, loc) => sum + loc.stats[1].value, 0),
        reserved: locationData.reduce((sum, loc) => sum + loc.stats[2].value, 0),
    };

    const totalSpaces = totals.available + totals.occupied + totals.reserved;

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    // Stats Card Component (reused in both desktop and panel)
    const StatsCard = () => (
        <Card className="w-full bg-[#f1eff5]/90 dark:bg-[#16141e]/80 shadow-xl backdrop-blur-md border border-white/20 dark:border-stone-700/50 overflow-hidden p-0">
            {/* Header */}
            <div className="px-6 pt-5 pb-3 border-b border-gray-200 dark:border-stone-700">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Location Statistics</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Real-time availability data</p>
            </div>

            {/* Summary Stats */}
            <div className="px-6 py-5 bg-gray-50 dark:bg-stone-800/50">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Spaces</span>
                    <Badge variant="outline" className="text-xs font-semibold px-3 py-1">
                        {totalSpaces}
                    </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">{totals.available}</div>
                        <div className="text-xs text-green-700 dark:text-green-300">Available</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">{totals.occupied}</div>
                        <div className="text-xs text-red-700 dark:text-red-300">Occupied</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                        <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{totals.reserved}</div>
                        <div className="text-xs text-yellow-700 dark:text-yellow-300">Reserved</div>
                    </div>
                </div>
            </div>

            {/* Location Tabs */}
            <div className="pt-2 pb-1 px-2">
                <Tabs defaultValue="serenity" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gray-100 dark:bg-stone-800 gap-1 rounded-lg mb-2">
                        {locationData.map((location) => (
                            <TabsTrigger
                                key={location.id}
                                value={location.id}
                                className="text-xs py-2 px-2 rounded-md transition-colors data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700 data-[state=active]:shadow-sm"
                            >
                                {location.name.split(' ')[0]}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {locationData.map((location) => {
                        const locationTotal = location.stats.reduce((sum, stat) => sum + stat.value, 0);

                        return (
                            <TabsContent key={location.id} value={location.id} className="p-3 pt-1 space-y-5">
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{location.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{locationTotal} total spaces</p>
                                </div>

                                <div className="space-y-4">
                                    {location.stats.map((stat) => {
                                        const percentage = Math.round((stat.value / locationTotal) * 100);

                                        return (
                                            <div key={stat.label} className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.label}</span>
                                                    <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Progress
                                                        value={percentage}
                                                        className="h-2 flex-1"
                                                    />
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                                                        {percentage}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="pt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Occupancy Rate</span>
                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                            {Math.round((location.stats[1].value / locationTotal) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </div>
        </Card>
    );

    return (
        <>
            {/* Desktop View */}
            <div className="hidden lg:block z-999 absolute top-6 right-6 pointer-events-auto">
                <StatsCard />
            </div>

            {/* Mobile/Tablet View */}
            <div className="lg:hidden z-999 absolute top-6 left-6 pointer-events-auto">
                <div className="relative">
                    {/* Burger Menu Button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white/90 dark:bg-[#16141e]/80 shadow-lg backdrop-blur-md border border-white/20 dark:border-stone-700/50"
                    >
                        {open ? (
                            <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                        )}
                    </button>

                    {/* Slide-out Panel */}
                    <div
                        ref={panelRef}
                        className={`absolute top-0 left-0 w-[85vw] max-w-md transition-all duration-300 ease-in-out transform ${open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                            }`}
                    >
                        <StatsCard />
                    </div>
                </div>
            </div>
        </>
    );
}