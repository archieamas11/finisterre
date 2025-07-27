function addNavigationScript() {
    const script = document.createElement('script');
    script.textContent = `
        /**
         * Cemetery-aware grave navigation system
         * Automatically uses custom paths when routing within cemetery boundaries
         */
        window.navigateToGrave = function(lat, lng) {
            console.log('🚀 Starting navigation to grave at:', [lat, lng]);
            
            // Check if geolocation is supported
            if (!navigator.geolocation) {
                alert('Geolocation is not supported by your browser. Please enable GPS to use navigation.');
                return;
            }

            // Store destination coordinates
            destinationCoords = [lat, lng];
            
            // Clear any existing route
            if (currentRoute) {
                if (currentRoute._container) {
                    map.removeControl(currentRoute);
                } else if (currentRoute.routeLine) {
                    map.removeLayer(currentRoute.routeLine);
                    if (currentRoute.userMarker) map.removeLayer(currentRoute.userMarker);
                    if (currentRoute.destMarker) map.removeLayer(currentRoute.destMarker);
                }
                currentRoute = null;
            }

            // Get current position and create intelligent route
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    
                    console.log('📍 User location:', [userLat, userLng]);
                    
                    // Check if both user and destination are within cemetery
                    const userInCemetery = CemeteryPathfinder.isWithinCemetery(userLat, userLng);
                    const destInCemetery = CemeteryPathfinder.isWithinCemetery(lat, lng);
                    
                    console.log('🏞️ Cemetery routing check - User:', userInCemetery, 'Destination:', destInCemetery);
                    
                    if (userInCemetery && destInCemetery) {
                        // Both points are in cemetery - use custom pathfinding
                        createCemeteryRoute(userLat, userLng, lat, lng);
                    } else {
                        // Use external routing (fallback to Leaflet Routing Machine)
                        createExternalRoute(userLat, userLng, lat, lng);
                    }
                },
                
                function(error) {
                    let errorMessage = 'Error getting your location: ';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += 'Location access denied. Please enable GPS and refresh the page.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += 'Location information unavailable. Please check your GPS signal.';
                            break;
                        case error.TIMEOUT:
                            errorMessage += 'Location request timed out. Please try again.';
                            break;
                        default:
                            errorMessage += 'An unknown error occurred.';
                            break;
                    }
                    alert(errorMessage);
                    console.error('Geolocation error:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        };

        /**
         * Create cemetery-specific route using custom pathfinding
         */
        function createCemeteryRoute(userLat, userLng, destLat, destLng) {
            console.log('🏛️ Creating cemetery route using custom paths...');
            
            // Find path using cemetery pathfinder
            const cemeteryPath = CemeteryPathfinder.findPath(userLat, userLng, destLat, destLng);
            
            if (cemeteryPath && cemeteryPath.length > 0) {
                console.log('✅ Cemetery path found with', cemeteryPath.length, 'waypoints');
                
                // Create custom route visualization
                const routeLine = L.polyline(cemeteryPath, {
                    color: 'rgb(19, 86, 254)',           // Pink color matching your path style
                    weight: 10,
                    opacity: 0.9,
                    dashArray: '',         // Dashed line to show it's a custom route
                    className: 'cemetery-route-line'
                }).addTo(map);

                // Add user marker
                const userMarker = L.marker([userLat, userLng], {
                    icon: createUserIcon()
                }).addTo(map);
                userMarker.bindPopup('🚶 Your Current Location');
                userLocationMarker = userMarker;

                // Add destination marker
                const destMarker = L.marker([destLat, destLng], {
                    icon: createDestinationIcon()
                }).addTo(map);
                destMarker.bindPopup('🎯 Your Selected Grave');

                // Store route components for cleanup
                currentRoute = {
                    routeLine: routeLine,
                    userMarker: userMarker,
                    destMarker: destMarker,
                    isCustomRoute: true
                };

                // Calculate route stats
                const totalDistance = calculatePathDistance(cemeteryPath);
                const estimatedTime = Math.round((totalDistance * 1000) / 1.4 / 60); // 1.4 m/s walking speed

                // Show navigation info
                showNavigationInfo({
                    totalDistance: totalDistance * 1000, // Convert to meters
                    totalTime: estimatedTime * 60        // Convert to seconds
                });

                // Fit map to show entire route
                const group = L.featureGroup([userMarker, destMarker, routeLine]);
                map.fitBounds(group.getBounds().pad(0.1));

                isNavigating = true;
                setupLiveTracking();
                
                console.log('🎉 Cemetery navigation activated!');
                
            } else {
                console.warn('❌ Could not find cemetery path, falling back to external routing');
                // Fallback to external routing
                createExternalRoute(userLat, userLng, destLat, destLng);
            }
        }

        /**
         * Create external route using Leaflet Routing Machine (fallback)
         */
        function createExternalRoute(userLat, userLng, destLat, destLng) {
            console.log('🌐 Creating external route using Leaflet Routing Machine...');
            
            // Create routing control with custom styling
            currentRoute = L.Routing.control({
                waypoints: [
                    L.latLng(userLat, userLng),
                    L.latLng(destLat, destLng)
                ],
                routeWhileDragging: false,
                addWaypoints: false,
                createMarker: function(i, waypoint, n) {
                    const marker = L.marker(waypoint.latLng, {
                        icon: i === 0 ? createUserIcon() : createDestinationIcon()
                    });
                    
                    if (i === 0) {
                        userLocationMarker = marker;
                        marker.bindPopup('🚶 Your Current Location');
                    } else {
                        marker.bindPopup('🎯 Your Selected Grave');
                    }
                    
                    return marker;
                },
                lineOptions: {
                    styles: [{
                        color: '#435ebe',
                        weight: 6,
                        opacity: 0.8
                    }]
                },
                router: L.Routing.osrmv1({
                    // serviceUrl: 'https://router.project-osrm.org/route/v1'
                    serviceUrl: 'http://localhost:5000/route/v1'
                }),
                fitSelectedRoutes: true,
                show: false,
                collapsible: true
            }).addTo(map);

            // Handle routing events
            currentRoute.on('routesfound', function(e) {
                const routes = e.routes;
                const summary = routes[0].summary;
                
                // Show navigation info
                showNavigationInfo(summary);
                
                // Fit map to show entire route
                const group = new L.featureGroup([
                    L.marker([userLat, userLng]),
                    L.marker([destLat, destLng])
                ]);
                map.fitBounds(group.getBounds().pad(0.1));
            });

            currentRoute.on('routingerror', function(e) {
                alert('Could not find a route. Please try walking to the nearest path.');
                console.error('Routing error:', e.error);
            });

            isNavigating = true;
            setupLiveTracking();
        }

        /**
         * Calculate total distance of a path array
         */
        function calculatePathDistance(pathCoordinates) {
            const R = 6371; // Earth's radius in kilometers
            let totalDistance = 0;

            for (let i = 0; i < pathCoordinates.length - 1; i++) {
                const [lat1, lng1] = pathCoordinates[i];
                const [lat2, lng2] = pathCoordinates[i + 1];

                const dLat = (lat2 - lat1) * (Math.PI / 180);
                const dLng = (lng2 - lng1) * (Math.PI / 180);

                const a = Math.sin(dLat / 2) ** 2 +
                        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                        Math.sin(dLng / 2) ** 2;

                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                totalDistance += R * c; // Distance in kilometers
            }

            return totalDistance;
        }

        /**
         * Create custom user location icon
         */
        function createUserIcon() {
            return L.divIcon({
                html: '<div class="user-marker"><i class="fas fa-user"></i></div>',
                className: 'custom-user-marker',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
        }

        /**
         * Create custom destination icon
         */
        function createDestinationIcon() {
            return L.divIcon({
                html: '<div class="destination-marker"><i class="fas fa-map-marker-alt"></i></div>',
                className: 'custom-destination-marker',
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });
        }

        /**
         * Setup live location tracking during navigation
         */
        function setupLiveTracking() {
            if (navigator.geolocation) {
                const watchId = navigator.geolocation.watchPosition(
                    function(position) {
                        if (isNavigating && userLocationMarker) {
                            const newLatLng = [position.coords.latitude, position.coords.longitude];
                            
                            // Update user marker position
                            userLocationMarker.setLatLng(newLatLng);
                            
                            // Update route if user has moved significantly
                            updateRouteIfNeeded(newLatLng);
                        }
                    },
                    function(error) {
                        console.warn('Live tracking error:', error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 3000
                    }
                );
                
                // Store watch ID for cleanup
                window.navigationWatchId = watchId;
            }
        }

        /**
         * Update route if user has moved significantly from the planned route
         */
        function updateRouteIfNeeded(userLatLng) {
            if (currentRoute && destinationCoords) {
                if (currentRoute.setWaypoints) {
                    // External route - update waypoints
                    const waypoints = currentRoute.getWaypoints();
                    waypoints[0].latLng = L.latLng(userLatLng[0], userLatLng[1]);
                    currentRoute.setWaypoints(waypoints);
                } else if (currentRoute.isCustomRoute) {
                    // Custom cemetery route - recreate if user moved significantly
                    const userInCemetery = CemeteryPathfinder.isWithinCemetery(userLatLng[0], userLatLng[1]);
                    const destInCemetery = CemeteryPathfinder.isWithinCemetery(destinationCoords[0], destinationCoords[1]);
                    
                    if (userInCemetery && destInCemetery) {
                        // Just update user marker position for now - don't constantly recreate route
                        if (currentRoute.userMarker) {
                            currentRoute.userMarker.setLatLng(userLatLng);
                        }
                    }
                }
            }
        }

        /**
         * Show navigation information panel
         */
        function showNavigationInfo(summary) {
            const distance = (summary.totalDistance / 1000).toFixed(2);
            const time = Math.round(summary.totalTime / 60);
            
            // Create or update navigation info panel
            let infoPanel = document.getElementById('navigation-info');
            if (!infoPanel) {
                infoPanel = document.createElement('div');
                infoPanel.id = 'navigation-info';
                infoPanel.className = 'navigation-info-panel';
                document.body.appendChild(infoPanel);
            }
            
            infoPanel.innerHTML = \`
                <div class="nav-header">
                    <i class="fas fa-route"></i>
                    <span>Navigation Active</span>
                    <button onclick="stopNavigation()" class="stop-nav-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="nav-details">
                    <div class="nav-stat">
                        <i class="fas fa-road"></i>
                        <span>\${distance} km</span>
                    </div>
                    <div class="nav-stat">
                        <i class="fas fa-walking"></i>
                        <span>\${time} min walk</span>
                    </div>
                </div>
            \`;
        }

        /**
         * Stop navigation and clean up
         */
        window.stopNavigation = function() {
            if (currentRoute) {
                if (currentRoute._container) {
                    // External route (Leaflet Routing Machine)
                    map.removeControl(currentRoute);
                } else if (currentRoute.routeLine) {
                    // Custom cemetery route
                    map.removeLayer(currentRoute.routeLine);
                    if (currentRoute.userMarker) map.removeLayer(currentRoute.userMarker);
                    if (currentRoute.destMarker) map.removeLayer(currentRoute.destMarker);
                }
                currentRoute = null;
            }
            
            if (window.navigationWatchId) {
                navigator.geolocation.clearWatch(window.navigationWatchId);
                window.navigationWatchId = null;
            }
            
            const infoPanel = document.getElementById('navigation-info');
            if (infoPanel) {
                infoPanel.remove();
            }
            
            isNavigating = false;
            userLocationMarker = null;
            destinationCoords = null;
            
            // Stop location control
            locateControl.stop();
        };
    `;
    document.head.appendChild(script);
}

function addStyles() {
    const style = document.createElement('style');
    style.textContent = `        
            /* Custom user location marker */
            .custom-user-marker .user-marker {
                background: #4CAF50;
                border: 3px solid #fff;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                animation: pulse 2s infinite;
            }

            .custom-user-marker .user-marker i {
                color: white;
                font-size: 14px;
            }

            /* Custom destination marker */
            .custom-destination-marker .destination-marker {
                background: #f44336;
                border: 2px solid #fff;
                border-radius: 50% 50% 50% 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                transform: rotate(-45deg);
            }

            .custom-destination-marker .destination-marker i {
                color: white;
                font-size: 16px;
                transform: rotate(45deg);
            }

            /* Navigation info panel */
            .navigation-info-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                z-index: 1000;
                min-width: 280px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                overflow: hidden;
                border: 1px solid #e0e0e0;
            }

            .nav-header {
                background: linear-gradient(135deg, #435ebe, #5a6fd8);
                color: white;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: 600;
                font-size: 16px;
            }

            .nav-header i {
                margin-right: 10px;
                font-size: 18px;
            }

            .stop-nav-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                border-radius: 6px;
                color: white;
                padding: 8px 10px;
                cursor: pointer;
                transition: background 0.3s ease;
                font-size: 14px;
            }

            .stop-nav-btn:hover {
                background: rgba(255,255,255,0.3);
            }

            .nav-details {
                padding: 20px;
                display: flex;
                justify-content: space-around;
                background: #fafafa;
            }

            .nav-stat {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }

            .nav-stat i {
                font-size: 24px;
                color: #435ebe;
                margin-bottom: 8px;
            }

            .nav-stat span {
                font-size: 14px;
                font-weight: 600;
                color: #333;
            }

            /* Pulse animation for user marker */
            @keyframes pulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
                }
                70% {
                    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
                }
            }

            /* Custom routing control styles */
            .leaflet-routing-container {
                display: none; /* Hide default routing panel */
            }

            /* Mobile responsive adjustments */
            @media (max-width: 768px) {
                .navigation-info-panel {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                }
                
                .nav-details {
                    padding: 15px;
                }
                
                .nav-header {
                    padding: 12px 15px;
                    font-size: 14px;
                }
            }

            /* Accessibility improvements */
            .direction-icon:focus,
            .stop-nav-btn:focus {
                outline: 2px solid #435ebe;
                outline-offset: 2px;
            }

            /* High contrast mode support */
            @media (prefers-contrast: high) {
                .navigation-info-panel {
                    border: 2px solid #000;
                }
                
                .nav-header {
                    background: #000;
                }
            }
    `;
    document.head.appendChild(style);
}