import "maplibre-theme/icons.default.css";
import "maplibre-theme/modern.css";
import "maplibre-react-components/style.css";
import { FaDirections } from "react-icons/fa";
import { useCallback, useEffect, useState, useRef } from "react";
import MapLibreGLDirections from "@maplibre/maplibre-gl-directions";
import { type StyleSpecification, GeolocateControl } from "maplibre-gl";
import {
    RNavigationControl,
    RMarker,
    RPopup,
    RMap,
} from "maplibre-react-components";

import type { MarkerData } from "@/data/geojson/markerData";

import { Button } from "@/components/ui/button";
import { markerData } from "@/data/geojson/markerData";

import CustomMarker from "./CustomerMarker";

const MAP_BOUNDS: [number, number] = [123.79792022538493, 10.24892453527049];

function MapLibre() {
    // 🗺️ Track which marker is selected for popup
    const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
    const mapRef = useRef<any>(null);

    // 🧭 Directions and routing state
    const [directionsControl, setDirectionsControl] = useState<MapLibreGLDirections | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [isLoadingDirections, setIsLoadingDirections] = useState(false);
    const [directionsError, setDirectionsError] = useState<string | null>(null);
    const [isTrackingLocation, setIsTrackingLocation] = useState(false);
    const [isMapReady, setIsMapReady] = useState(false);

    // 🧭 Keep a ref for geolocate control to avoid multiple attachments
    const geolocateControlRef = useRef<any>(null);

    // 🛣️ Show route between two points
    const showRoute = useCallback(async (from: [number, number], to: [number, number]) => {
        if (!directionsControl) {
            console.log("⚠️ Directions control not available for route calculation");
            return;
        }

        setIsLoadingDirections(true);
        setDirectionsError(null);

        try {
            console.log("🛣️ Calculating route from", from, "to", to);

            // 🗺️ Set waypoints for the route with error handling
            await new Promise((resolve, reject) => {
                try {
                    directionsControl.setWaypoints([
                        [from[1], from[0]], // 📍 Origin (longitude, latitude)
                        [to[1], to[0]]      // 🎯 Destination (longitude, latitude)
                    ]);

                    // 🔄 Give the route some time to calculate
                    setTimeout(() => {
                        console.log("✅ Route displayed successfully");
                        resolve(true);
                    }, 1000);
                } catch (error) {
                    reject(error);
                }
            });

            // 📍 Start tracking user location for live updates
            setIsTrackingLocation(true);

        } catch (error) {
            console.error("❌ Failed to calculate route:", error);
            setDirectionsError("Failed to calculate route. This might be due to network issues or the route service being unavailable.");
        } finally {
            setIsLoadingDirections(false);
        }
    }, [directionsControl]);

    // 🎯 Handle directions button click
    const handleDirectionsClick = useCallback(async () => {
        console.log("🔍 Debug - selectedMarker:", selectedMarker);
        console.log("🔍 Debug - directionsControl:", !!directionsControl);
        console.log("🔍 Debug - userLocation:", userLocation);
        console.log("🔍 Debug - isMapReady:", isMapReady);

        if (!selectedMarker) {
            console.log("⚠️ No marker selected");
            setDirectionsError("Please select a marker first");
            return;
        }

        if (!directionsControl) {
            console.log("⚠️ Directions control not initialized");
            setDirectionsError("Directions service is still loading. Please wait a moment and try again.");
            return;
        }

        console.log("📍 Selected marker position:", selectedMarker.position);
        setDirectionsError(null); // Clear any previous errors

        if (!userLocation) {
            console.log("📍 Getting user location for directions");
            setIsLoadingDirections(true);

            if ('geolocation' in navigator) {
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            timeout: 10000,
                            maximumAge: 60000,
                            enableHighAccuracy: true
                        });
                    });

                    const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(coords);
                    console.log("📍 User location obtained:", coords);

                    // 🗺️ Show route from user location to selected marker
                    await showRoute(coords, selectedMarker.position);

                } catch (error) {
                    console.error("❌ Failed to get user location:", error);
                    setDirectionsError("Unable to get your location. Please enable location services and try again.");
                } finally {
                    setIsLoadingDirections(false);
                }
            } else {
                setDirectionsError("Geolocation is not supported by this browser.");
                setIsLoadingDirections(false);
            }
        } else {
            // 🗺️ User location already available, show route
            await showRoute(userLocation, selectedMarker.position);
        }
    }, [selectedMarker, directionsControl, userLocation, isMapReady, showRoute]);

    // 🗺️ Initialize directions control when map is ready
    useEffect(() => {
        if (mapRef.current?.map && isMapReady && !directionsControl) {
            console.log("🔄 Initializing directions control...");

            // 🔄 Add a small delay to ensure map is fully ready
            const initializeDirections = async () => {
                try {
                    await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms

                    const directions = new MapLibreGLDirections(mapRef.current.map, {
                        profile: "driving",
                        api: "https://router.project-osrm.org/route/v1",
                        requestOptions: {
                            overview: "full",
                            alternatives: "false"
                        }
                    });
                    directions.interactive = false;
                    setDirectionsControl(directions);
                    console.log("✅ Directions control initialized successfully");
                } catch (error) {
                    console.error("❌ Failed to initialize directions control:", error);

                    // 🔄 Retry once after a longer delay
                    setTimeout(() => {
                        try {
                            const directions = new MapLibreGLDirections(mapRef.current.map, {
                                profile: "driving",
                                api: "https://router.project-osrm.org/route/v1",
                                requestOptions: {
                                    overview: "full",
                                    alternatives: "false"
                                }
                            });
                            directions.interactive = false;
                            setDirectionsControl(directions);
                            console.log("✅ Directions control initialized successfully (retry)");
                        } catch (retryError) {
                            console.error("❌ Failed to initialize directions control after retry:", retryError);
                            setDirectionsError("Failed to initialize directions service. Please refresh the page.");
                        }
                    }, 2000);
                }
            };

            initializeDirections();
        }
    }, [isMapReady, directionsControl]);

    // 🧹 Clear directions when marker is deselected
    useEffect(() => {
        if (!selectedMarker && directionsControl) {
            console.log("🧹 Clearing directions - no marker selected");
            directionsControl.clear();
            setIsTrackingLocation(false);
            setDirectionsError(null);
        }
    }, [selectedMarker, directionsControl]);

    // 📍 Set up geolocation tracking when map is ready
    useEffect(() => {
        if (mapRef.current?.map && isTrackingLocation) {
            console.log("📡 Setting up live location tracking");

            let watchId: number | null = null;

            if ('geolocation' in navigator) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
                        console.log("📍 Location updated:", coords);

                        setUserLocation(coords);

                        // 🔄 Update route if we have a selected marker
                        if (selectedMarker && directionsControl) {
                            console.log("🔄 Updating route with new user location");
                            showRoute(coords, selectedMarker.position);
                        }
                    },
                    (error) => {
                        console.error("❌ Live tracking error:", error);
                        setDirectionsError("Location tracking failed. Please check your permissions.");
                    },
                    {
                        timeout: 10000,
                        maximumAge: 2000, // 🔄 Update every 2 seconds
                        enableHighAccuracy: true
                    }
                );
            }

            // 🧹 Cleanup function
            return () => {
                if (watchId !== null) {
                    navigator.geolocation.clearWatch(watchId);
                    console.log("🛑 Stopped location tracking");
                }
            };
        }
    }, [isTrackingLocation, selectedMarker, directionsControl, showRoute]);

    // Esri imagery as a valid typed MapLibre style
    const esriImageryStyle: StyleSpecification = {
        version: 8,
        layers: [
            {
                minzoom: 1,
                maxzoom: 19,
                type: "raster",
                source: "esri",
                id: "esri-layer",
            },
        ],
        sources: {
            esri: {
                tileSize: 256,
                type: "raster",
                tiles: [
                    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                ],
            },
        },
    };

    return (
        <div className="h-screen w-full">
            <RMap
                onLoad={() => {
                    console.log("🗺️ Map loaded successfully");
                    setIsMapReady(true);

                    // 🧭 Add GeolocateControl imperatively (only once)
                    if (mapRef.current?.map && !geolocateControlRef.current) {
                        // 🧭 Create and add the geolocate control to the map
                        geolocateControlRef.current = new GeolocateControl({
                            trackUserLocation: true,
                            showAccuracyCircle: true,
                            positionOptions: { enableHighAccuracy: true },
                        });
                        mapRef.current.map.addControl(geolocateControlRef.current, "top-left");
                        console.log("✅ Geolocate control added");
                    }
                }}
                onClick={() => { setSelectedMarker(null); }}
                initialAttributionControl={false}
                mapStyle={esriImageryStyle}
                initialCenter={MAP_BOUNDS}
                initialZoom={19}
                ref={mapRef}
                maxZoom={18}
                minZoom={6}
            >
                {/* Render all markers from markerData */}
                {markerData.map((marker, idx) => (
                    <RMarker
                        onClick={e => {
                            e.stopPropagation();
                            setSelectedMarker(marker);
                        }}
                        longitude={marker.position[1]}
                        latitude={marker.position[0]}
                        key={idx}
                    >
                        <CustomMarker />
                    </RMarker>
                ))}

                {/* Show popup for selected marker */}
                {selectedMarker && (
                    <RPopup
                        longitude={selectedMarker.position[1]}
                        latitude={selectedMarker.position[0]}
                        className="bg-red"
                        maxWidth="120%"
                        offset={5}
                    >
                        <div className="w-72 rounded-lg shadow-lg bg-white border border-gray-200">
                            {/* Header */}
                            <div className="rounded-t-lg px-4 py-2 bg-yellow-600 text-white">
                                <div className="text-xs font-semibold tracking-wide">Finisterre</div>
                                <div className="text-md font-bold">{selectedMarker.location}</div>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-3">
                                <div className="text-sm text-gray-600">
                                    <div><strong>Status:</strong> {selectedMarker.plotStatus}</div>
                                    <div><strong>Category:</strong> {selectedMarker.category}</div>
                                    <div><strong>Area:</strong> {selectedMarker.dimensions.area}m²</div>
                                </div>

                                {/* Location coordinates */}
                                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                    <div>Lat: {selectedMarker.position[0].toFixed(6)}</div>
                                    <div>Lng: {selectedMarker.position[1].toFixed(6)}</div>
                                </div>

                                {/* Directions button */}
                                <div className="pt-2 border-t border-gray-200">
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
                                        disabled={isLoadingDirections || !directionsControl}
                                        onClick={handleDirectionsClick}
                                        size="sm"
                                    >
                                        <FaDirections className="mr-2 h-3 w-3" />
                                        {isLoadingDirections
                                            ? "Getting Directions..."
                                            : !directionsControl
                                                ? "Loading Service..."
                                                : "Get Directions"
                                        }
                                    </Button>

                                    {/* Error message */}
                                    {directionsError && (
                                        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                                            {directionsError}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </RPopup>
                )}

                {/* Navigation controls */}
                <RNavigationControl position="top-left" />
            </RMap>
        </div>
    );
}

export default MapLibre;
