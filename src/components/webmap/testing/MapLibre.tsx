import "maplibre-theme/icons.default.css";
import "maplibre-theme/modern.css";
import "maplibre-react-components/style.css";
import { FaDirections } from "react-icons/fa";

import type { StyleSpecification } from "maplibre-gl";
import { markerData } from "@/data/geojson/markerData";
import type { MarkerData } from "@/data/geojson/markerData";
import {
    RGeolocateControl,
    RMap,
    RMarker,
    RNavigationControl,
    RPopup,
} from "maplibre-react-components";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import CustomMarker from "./CustomerMarker";

const MAP_BOUNDS: [number, number] = [123.79792022538493, 10.24892453527049];

function MapLibre() {
    // Track which marker is selected for popup
    const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
    const [isLoadingDirections, setIsLoadingDirections] = useState(false);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isDirectionsReady, setIsDirectionsReady] = useState(false);

    // Ref for map instance and directions plugin
    const mapRef = useRef<any>(null);
    const directionsRef = useRef<any>(null);

    // Initialize directions plugin after map is loaded
    const handleMapLoad = useCallback(() => {
        console.log('Map loaded');
        setIsMapLoaded(true);

        const rawMap = mapRef.current?.map;
        if (!directionsRef.current && rawMap) {
            console.log('Initializing directions plugin...');

            // Dynamically import plugin to avoid SSR issues
            import('@maplibre/maplibre-gl-directions').then(({ default: MapLibreGlDirections }) => {
                try {
                    directionsRef.current = new MapLibreGlDirections(rawMap, {
                        // Configure the directions service
                        api: 'https://api.openrouteservice.org/v2/directions/driving-car',
                        profile: 'driving-car',
                    });

                    rawMap.addControl(directionsRef.current, 'top-left');

                    // Listen for route events
                    directionsRef.current.on('route', (e: any) => {
                        console.log('Route calculated:', e.route);
                        setIsLoadingDirections(false);
                    });

                    directionsRef.current.on('error', (e: any) => {
                        console.error('Directions error:', e.error);
                        setIsLoadingDirections(false);
                        alert('Failed to get directions. Please try again.');
                    });

                    setIsDirectionsReady(true);
                    console.log('Directions plugin initialized successfully');

                } catch (error) {
                    console.error('Failed to initialize directions plugin:', error);
                    setIsDirectionsReady(false);
                }
            }).catch(error => {
                console.error('Failed to load directions plugin:', error);
                setIsDirectionsReady(false);
            });
        }
    }, []);

    // Get user's current location with better error handling
    const getUserLocation = (): Promise<[number, number]> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve([position.coords.longitude, position.coords.latitude]);
                },
                (error) => {
                    let message = 'Failed to get your location';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = 'Location access denied. Please enable location permissions.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = 'Location information unavailable.';
                            break;
                        case error.TIMEOUT:
                            message = 'Location request timed out.';
                            break;
                    }
                    reject(new Error(message));
                },
                options
            );
        });
    };

    // Show directions from user location to selected marker
    const handleDirectionsClick = async () => {
        console.log('Direction button clicked');
        console.log('Selected marker:', selectedMarker);
        console.log('Directions ready:', isDirectionsReady);
        console.log('Directions ref:', directionsRef.current);

        if (!selectedMarker) {
            alert('Please select a marker first.');
            return;
        }

        if (!isMapLoaded) {
            alert('Please wait for the map to fully load.');
            return;
        }

        // If the plugin isn't ready, try the alternative method
        if (!directionsRef.current || !isDirectionsReady) {
            console.log('Using alternative directions method');
            await handleDirectionsClickAlternative();
            return;
        }

        setIsLoadingDirections(true);

        try {
            const userLocation = await getUserLocation();
            const destination = [selectedMarker.position[1], selectedMarker.position[0]]; // lng, lat

            console.log('User location:', userLocation);
            console.log('Destination:', destination);

            // Clear any existing routes
            if (typeof directionsRef.current.removeRoutes === 'function') {
                directionsRef.current.removeRoutes();
            }

            // Set the waypoints for directions
            directionsRef.current.setWaypoints([
                userLocation,
                destination
            ]);

            // If the plugin has a method to explicitly calculate route
            if (typeof directionsRef.current.getRoutes === 'function') {
                directionsRef.current.getRoutes();
            }

        } catch (error) {
            console.error('Error getting directions:', error);
            setIsLoadingDirections(false);
            alert(error instanceof Error ? error.message : 'Failed to get directions');
        }
    };

    // Alternative implementation using OSRM routing service
    const handleDirectionsClickAlternative = async () => {
        if (!selectedMarker) {
            alert('Please select a marker first.');
            return;
        }

        setIsLoadingDirections(true);

        try {
            const userLocation = await getUserLocation();
            const destination = [selectedMarker.position[1], selectedMarker.position[0]];

            console.log('Using OSRM routing - User:', userLocation, 'Destination:', destination);

            // Use OSRM API for routing (free, no API key required)
            const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userLocation[0]},${userLocation[1]};${destination[0]},${destination[1]}?overview=full&geometries=geojson`;

            console.log('OSRM URL:', osrmUrl);

            try {
                const response = await fetch(osrmUrl);

                if (!response.ok) {
                    throw new Error(`OSRM API error: ${response.status}`);
                }

                const data = await response.json();
                console.log('OSRM Response:', data);

                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    const routeGeometry = route.geometry;

                    // Display the actual route from OSRM
                    const rawMap = mapRef.current?.map;
                    if (rawMap && routeGeometry) {
                        const routeId = 'osrm-route';
                        const routeMarkerId = 'osrm-route-markers';

                        // Remove existing route if any
                        [routeId, routeMarkerId].forEach(layerId => {
                            if (rawMap.getSource(layerId)) {
                                rawMap.removeLayer(layerId);
                                rawMap.removeSource(layerId);
                            }
                        });

                        // Add OSRM route source and layer
                        try {
                            rawMap.addSource(routeId, {
                                type: 'geojson',
                                data: {
                                    type: 'Feature',
                                    properties: {
                                        distance: route.distance,
                                        duration: route.duration
                                    },
                                    geometry: routeGeometry
                                }
                            });
                            console.log('OSRM route source added successfully');

                            rawMap.addLayer({
                                id: routeId,
                                type: 'line',
                                source: routeId,
                                layout: {
                                    'line-join': 'round',
                                    'line-cap': 'round'
                                },
                                paint: {
                                    'line-color': '#2563eb',
                                    'line-width': 6,
                                    'line-opacity': 0.8
                                }
                            });
                            console.log('OSRM route layer added successfully');

                            // Add start and end markers
                            rawMap.addSource(routeMarkerId, {
                                type: 'geojson',
                                data: {
                                    type: 'FeatureCollection',
                                    features: [
                                        {
                                            type: 'Feature',
                                            properties: { type: 'start', label: 'Your Location' },
                                            geometry: {
                                                type: 'Point',
                                                coordinates: userLocation
                                            }
                                        },
                                        {
                                            type: 'Feature',
                                            properties: { type: 'end', label: selectedMarker.location },
                                            geometry: {
                                                type: 'Point',
                                                coordinates: destination
                                            }
                                        }
                                    ]
                                }
                            });

                            rawMap.addLayer({
                                id: routeMarkerId,
                                type: 'circle',
                                source: routeMarkerId,
                                paint: {
                                    'circle-radius': 10,
                                    'circle-color': [
                                        'case',
                                        ['==', ['get', 'type'], 'start'],
                                        '#10b981', // green for start
                                        '#ef4444'  // red for end
                                    ],
                                    'circle-stroke-color': '#ffffff',
                                    'circle-stroke-width': 3
                                }
                            });

                            // Fit map to show the route
                            const coordinates = routeGeometry.coordinates;
                            const lngs = coordinates.map((coord: number[]) => coord[0]);
                            const lats = coordinates.map((coord: number[]) => coord[1]);

                            const bounds = [
                                [Math.min(...lngs), Math.min(...lats)], // Southwest
                                [Math.max(...lngs), Math.max(...lats)]  // Northeast
                            ];

                            rawMap.fitBounds(bounds, {
                                padding: 60
                            });

                            // Show route info
                            const distanceKm = (route.distance / 1000).toFixed(1);
                            const durationMin = Math.round(route.duration / 60);

                            console.log(`Route: ${distanceKm} km, ${durationMin} minutes`);

                            // You can display this info in a toast or alert
                            alert(`Route found!\nDistance: ${distanceKm} km\nEstimated time: ${durationMin} minutes`);

                        } catch (error) {
                            console.error('Error adding OSRM route to map:', error);
                            throw error;
                        }
                    }
                } else {
                    throw new Error('No route found');
                }

            } catch (fetchError) {
                console.error('OSRM API call failed:', fetchError);

                // Fallback to straight line if OSRM fails
                console.log('Falling back to straight line route');
                await showStraightLineRoute(
                    userLocation as [number, number],
                    destination as [number, number]
                );
            }

            setIsLoadingDirections(false);

        } catch (error) {
            console.error('Error getting directions:', error);
            setIsLoadingDirections(false);
            alert('Failed to get directions. Please check your location permissions and try again.');
        }
    };

    // Fallback function to show straight line route
    const showStraightLineRoute = async (userLocation: [number, number], destination: [number, number]) => {
        const rawMap = mapRef.current?.map;
        if (rawMap) {
            const routeId = 'fallback-route';
            const routeMarkerId = 'fallback-route-markers';

            // Remove existing route if any
            [routeId, routeMarkerId].forEach(layerId => {
                if (rawMap.getSource(layerId)) {
                    rawMap.removeLayer(layerId);
                    rawMap.removeSource(layerId);
                }
            });

            // Create a simple route line (straight line)
            const routeGeoJSON = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: [userLocation, destination]
                }
            };

            // Add route source and layer
            rawMap.addSource(routeId, {
                type: 'geojson',
                data: routeGeoJSON
            });

            rawMap.addLayer({
                id: routeId,
                type: 'line',
                source: routeId,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#f59e0b',
                    'line-width': 4,
                    'line-opacity': 0.8,
                    'line-dasharray': [2, 2] // dashed line to indicate it's not a real route
                }
            });

            // Add markers
            rawMap.addSource(routeMarkerId, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            properties: { type: 'start' },
                            geometry: {
                                type: 'Point',
                                coordinates: userLocation
                            }
                        },
                        {
                            type: 'Feature',
                            properties: { type: 'end' },
                            geometry: {
                                type: 'Point',
                                coordinates: destination
                            }
                        }
                    ]
                }
            });

            rawMap.addLayer({
                id: routeMarkerId,
                type: 'circle',
                source: routeMarkerId,
                paint: {
                    'circle-radius': 8,
                    'circle-color': [
                        'case',
                        ['==', ['get', 'type'], 'start'],
                        '#10b981',
                        '#ef4444'
                    ],
                    'circle-stroke-color': '#ffffff',
                    'circle-stroke-width': 2
                }
            });

            // Fit map to show the route
            const lngs = [userLocation[0], destination[0]];
            const lats = [userLocation[1], destination[1]];

            const bounds = [
                [Math.min(...lngs), Math.min(...lats)],
                [Math.max(...lngs), Math.max(...lats)]
            ];

            rawMap.fitBounds(bounds, {
                padding: 50
            });

            console.log('Fallback straight line route displayed');
        }
    };

    // Clear directions
    const clearDirections = () => {
        if (directionsRef.current && typeof directionsRef.current.removeRoutes === 'function') {
            directionsRef.current.removeRoutes();
        }

        // Also clear custom route if using alternative method
        const rawMap = mapRef.current?.map;
        if (rawMap) {
            ['custom-route', 'route-markers', 'osrm-route', 'osrm-route-markers', 'fallback-route', 'fallback-route-markers'].forEach(layerId => {
                if (rawMap.getSource(layerId)) {
                    rawMap.removeLayer(layerId);
                    rawMap.removeSource(layerId);
                }
            });
        }
    };

    // Esri imagery as a valid typed MapLibre style
    const esriImageryStyle: StyleSpecification = {
        version: 8,
        sources: {
            esri: {
                type: "raster",
                tiles: [
                    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                ],
                tileSize: 256,
            },
        },
        layers: [
            {
                id: "esri-layer",
                type: "raster",
                source: "esri",
                minzoom: 1,
                maxzoom: 19,
            },
        ],
    };

    return (
        <div className="h-screen w-full">
            <RMap
                ref={mapRef}
                maxZoom={18}
                minZoom={6}
                initialZoom={19}
                initialCenter={MAP_BOUNDS}
                initialAttributionControl={false}
                mapStyle={esriImageryStyle}
                onClick={() => setSelectedMarker(null)}
                onLoad={handleMapLoad}
            >
                {/* Render all markers from markerData */}
                {markerData.map((marker, idx) => (
                    <RMarker
                        key={idx}
                        longitude={marker.position[1]}
                        latitude={marker.position[0]}
                        onClick={e => {
                            e.stopPropagation();
                            setSelectedMarker(marker);
                        }}
                    >
                        <CustomMarker />
                    </RMarker>
                ))}

                {/* Show popup for selected marker */}
                {selectedMarker && (
                    <RPopup
                        longitude={selectedMarker.position[1]}
                        latitude={selectedMarker.position[0]}
                        offset={5}
                        maxWidth="120%"
                        className="bg-red"
                    >
                        <div className="w-72 rounded-lg shadow-lg bg-white border border-gray-200">
                            {/* Header */}
                            <div className="rounded-t-lg px-4 py-2 bg-yellow-600 text-white">
                                <div className="text-xs font-semibold tracking-wide">Finisterre</div>
                                <div className="text-base font-bold">Plot Information</div>
                            </div>

                            {/* Location with directions buttons */}
                            <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-gray-100">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0c-4.418 0-8 1.79-8 4v3h16v-3c0-2.21-3.582-4-8-4z" />
                                </svg>
                                <span className="font-medium text-gray-800">{selectedMarker.location}</span>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleDirectionsClick}
                                        disabled={isLoadingDirections}
                                        aria-label="Show directions"
                                        size="sm"
                                    >
                                        {isLoadingDirections ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <FaDirections />
                                        )}
                                    </Button>
                                    <Button
                                        onClick={clearDirections}
                                        variant="outline"
                                        size="sm"
                                        aria-label="Clear directions"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2 px-4 py-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2-2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z" />
                                </svg>
                                <span className="font-medium text-gray-700">Plot Status</span>
                                <span className={`ml-auto px-2 py-0.5 rounded text-xs font-semibold ${selectedMarker.plotStatus === 'Occupied' ? 'bg-red-100 text-red-700' : selectedMarker.plotStatus === 'Reserved' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                    {selectedMarker.plotStatus}
                                </span>
                            </div>

                            {/* Dimensions & Category */}
                            <div className="flex gap-2 px-4 py-2">
                                <div className="flex-1 bg-blue-50 rounded p-2 flex flex-col items-start">
                                    <div className="flex items-center gap-1 text-blue-700 font-semibold text-xs">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                        Dimension
                                    </div>
                                    <div className="text-sm font-bold text-gray-800">
                                        {selectedMarker.dimensions.length} m × {selectedMarker.dimensions.width} m
                                    </div>
                                    <div className="text-xs text-gray-500">{selectedMarker.dimensions.area} m²</div>
                                </div>
                                <div className="flex-1 bg-gray-50 rounded p-2 flex flex-col items-start">
                                    <div className="flex items-center gap-1 text-gray-700 font-semibold text-xs">
                                        <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a1 1 0 01.894.553l7 14A1 1 0 0117 18H3a1 1 0 01-.894-1.447l7-14A1 1 0 0110 2zm0 3.618L5.832 16h8.336L10 5.618z" />
                                        </svg>
                                        Details
                                    </div>
                                    <span className={`mt-1 px-2 py-0.5 rounded text-xs font-semibold ${selectedMarker.category === 'Platinum' ? 'bg-yellow-200 text-yellow-800' : selectedMarker.category === 'Silver' ? 'bg-gray-200 text-gray-800' : 'bg-orange-200 text-orange-800'}`}>
                                        {selectedMarker.category}
                                    </span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
                                No photos available
                            </div>
                        </div>
                    </RPopup>
                )}

                <RNavigationControl position="top-right" visualizePitch={false} />
                <RGeolocateControl
                    showUserLocation={true}
                    showAccuracyCircle={true}
                    trackUserLocation={false}
                    positionOptions={{
                        enableHighAccuracy: true,
                    }}
                    fitBoundsOptions={{
                        maxZoom: 18,
                    }}
                />
            </RMap>
        </div>
    );
}

export default MapLibre;