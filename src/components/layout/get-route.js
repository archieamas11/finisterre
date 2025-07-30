// Cemetery main entrance coordinate
var CEMETERY_GATE = L.latLng(10.248107820799307, 123.797607547609545);

// Navigation state with improved properties
var navigationState = {
    isActive: false,
    watchId: null,
    currentRoute: null,
    userMarker: null,
    routeLines: [],
    destinationMarker: null,
    destination: null,
    previousUserPosition: null,
    isRecalculating: false,
    simulationActive: false,
    simulationIndex: 0,
    simulationPath: [],
    simulationInterval: null,
    routeStartPoint: null
};

function navigateToGrave(graveLat, graveLng) {
    if (!navigator.geolocation) {
        alert('GPS not supported by your browser');
        return;
    }

    console.log('🧭 Starting navigation to grave:', graveLat, graveLng);
    stopNavigation();

    navigator.geolocation.getCurrentPosition(
        function (position) {
            var userLat = position.coords.latitude;
            var userLng = position.coords.longitude;

            // Set destination and initial start point
            navigationState.destination = L.latLng(graveLat, graveLng);
            navigationState.previousUserPosition = L.latLng(userLat, userLng);
            navigationState.routeStartPoint = L.latLng(userLat, userLng);

            createTwoStepRoute(userLat, userLng, graveLat, graveLng);
        },
        function (error) {
            alert('Could not get your location. Please enable GPS and try again.');
            console.error('Geolocation error:', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
        }
    );
}

function createTwoStepRoute(userLat, userLng, graveLat, graveLng) {
    console.log('🛣️ Creating two-step route...');
    var gateLat = CEMETERY_GATE.lat;
    var gateLng = CEMETERY_GATE.lng;

    // Step 1: Car route from user to cemetery gate
    getRoute(
        userLat, userLng, gateLat, gateLng,
        'https://router.project-osrm.org/route/v1/driving',
        '#FF6B6B',
        function (step1Route) {
            // Force last point of driving route to be exactly the gate
            if (step1Route.coordinates.length > 0) {
                step1Route.coordinates[step1Route.coordinates.length - 1] = [gateLat, gateLng];
            }
            console.log('🚗 Car route calculated');
            // Step 2: Walking route from gate to grave
            getRoute(
                gateLat, gateLng, graveLat, graveLng,
                'https://finisterreosm-production.up.railway.app/route/v1/foot',
                '#4ECDC4',
                function (step2Route) {
                    // Force first point of walking route to be exactly the gate
                    if (step2Route.coordinates.length > 0) {
                        step2Route.coordinates[0] = [gateLat, gateLng];
                    }
                    console.log('🚶 Walking route calculated');
                    var finalRoute = extendRouteToGrave(step2Route, graveLat, graveLng);
                    displayRoutes([step1Route, finalRoute], userLat, userLng, graveLat, graveLng);
                    startLiveTracking();
                },
                function() {
                    // Fallback: create direct walking route if OSRM walking fails
                    console.warn('Walking route failed, creating direct route');
                    var directRoute = createDirectRoute(gateLat, gateLng, graveLat, graveLng, '#4ECDC4');
                    displayRoutes([step1Route, directRoute], userLat, userLng, graveLat, graveLng);
                    startLiveTracking();
                }
            );
        }
    );
}

function getRoute(startLat, startLng, endLat, endLng, serviceUrl, color, successCallback, errorCallback) {
    var url = serviceUrl + '/' + startLng + ',' + startLat + ';' + endLng + ',' + endLat +
        '?overview=full&geometries=geojson';

    fetch(url)
        .then(function (response) {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(function (data) {
            if (data.routes && data.routes.length > 0) {
                var route = data.routes[0];
                var coordinates = route.geometry.coordinates.map(function (coord) {
                    return [coord[1], coord[0]];
                });

                successCallback({
                    coordinates: coordinates,
                    distance: route.distance,
                    duration: route.duration,
                    color: color
                });
            } else {
                throw new Error('No route found');
            }
        })
        .catch(function (error) {
            console.error('Routing error:', error);
            if (errorCallback) {
                errorCallback(error);
            } else {
                alert('Could not find route. Please try again.');
            }
        });
}

function createDirectRoute(startLat, startLng, endLat, endLng, color) {
    var coordinates = [[startLat, startLng], [endLat, endLng]];
    var distance = calculateDistanceBetweenPoints(startLat, startLng, endLat, endLng);
    
    return {
        coordinates: coordinates,
        distance: distance,
        duration: distance / 1.4, // Walking speed ~1.4 m/s
        color: color
    };
}

function extendRouteToGrave(footpathRoute, graveLat, graveLng) {
    var coordinates = footpathRoute.coordinates.slice();
    var lastPoint = coordinates[coordinates.length - 1];
    var lastLat = lastPoint[0];
    var lastLng = lastPoint[1];

    var distance = calculateDistanceBetweenPoints(lastLat, lastLng, graveLat, graveLng);

    if (distance > 2) {
        coordinates.push([graveLat, graveLng]);
        return {
            coordinates: coordinates,
            distance: footpathRoute.distance + distance,
            duration: footpathRoute.duration + (distance / 1.4),
            color: footpathRoute.color
        };
    }

    return footpathRoute;
}

function calculateDistanceBetweenPoints(lat1, lng1, lat2, lng2) {
    var R = 6371000; // Earth's radius in meters
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function createUserIcon() {
    return L.divIcon({
        html: '<div class="user-marker"><i class="fas fa-user"></i></div>',
        className: 'custom-user-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

function createDestinationIcon() {
    return L.divIcon({
        html: '<div class="marker-style target-destination"><i class="fas fa-map-marker-alt"></i></div>',
        className: 'custom-destination-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 34]
    });
}

function displayRoutes(routes, userLat, userLng, graveLat, graveLng) {
    clearRouteDisplay();

    // Create user marker
    navigationState.userMarker = L.marker([userLat, userLng], {
        icon: createUserIcon()
    }).addTo(map);

    // Create destination marker
    navigationState.destinationMarker = L.marker([graveLat, graveLng], {
        icon: createDestinationIcon()
    }).addTo(map);

    // Update first route point to current user location
    if (routes.length > 0 && routes[0].coordinates.length > 0) {
        routes[0].coordinates[0] = [userLat, userLng];
    }

    // Draw route lines
    routes.forEach(function (route) {
        var routeLine = L.polyline(route.coordinates, {
            color: route.color,
            weight: 6,
            opacity: 0.8
        }).addTo(map);
        navigationState.routeLines.push(routeLine);
    });

    // Fit map to show all elements
    var group = L.featureGroup([
        navigationState.userMarker,
        navigationState.destinationMarker
    ].concat(navigationState.routeLines));
    map.fitBounds(group.getBounds().pad(0.1));

    // Calculate totals and show panel
    var totalDistance = routes.reduce(function (sum, route) { return sum + route.distance; }, 0);
    var totalDuration = routes.reduce(function (sum, route) { return sum + route.duration; }, 0);

    showNavigationPanel(totalDistance, totalDuration);
    navigationState.isActive = true;
    navigationState.previousUserPosition = L.latLng(userLat, userLng);
    navigationState.routeStartPoint = L.latLng(userLat, userLng);
    navigationState.isRecalculating = false;
    
    console.log('✅ Routes displayed successfully');
}

function clearRouteDisplay() {
    // Remove existing markers
    if (navigationState.userMarker) {
        map.removeLayer(navigationState.userMarker);
        navigationState.userMarker = null;
    }
    if (navigationState.destinationMarker) {
        map.removeLayer(navigationState.destinationMarker);
        navigationState.destinationMarker = null;
    }

    // Remove existing route lines
    navigationState.routeLines.forEach(function (line) {
        map.removeLayer(line);
    });
    navigationState.routeLines = [];
}

function startLiveTracking() {
    if (!navigator.geolocation || navigationState.watchId) return;

    console.log('📡 Starting live GPS tracking...');

    navigationState.watchId = navigator.geolocation.watchPosition(
        function (position) {
            if (navigationState.isActive && navigationState.userMarker && !navigationState.simulationActive) {
                var newLat = position.coords.latitude;
                var newLng = position.coords.longitude;
                var newPosition = L.latLng(newLat, newLng);

                // Update user marker position
                navigationState.userMarker.setLatLng(newPosition);

                // Update route starting point and remove passed segments
                updateRouteProgress(newLat, newLng);

                // Check for drift and recalculate if needed
                if (navigationState.previousUserPosition && navigationState.destination) {
                    var driftDistance = calculateDistanceBetweenPoints(
                        newLat, newLng,
                        navigationState.previousUserPosition.lat,
                        navigationState.previousUserPosition.lng
                    );

                    if (driftDistance > 30 && !navigationState.isRecalculating) {
                        console.log('🚧 User drifted > 30m, recalculating route...');
                        navigationState.isRecalculating = true;
                        createTwoStepRoute(
                            newLat, newLng,
                            navigationState.destination.lat,
                            navigationState.destination.lng
                        );
                    }
                }

                // Update route start point for smooth line updates
                navigationState.routeStartPoint = newPosition;
            }
        },
        function (error) {
            console.warn('Live tracking error:', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 1000 // Update every second
        }
    );
}

function findClosestPointOnRoute(userPosition, routePoints) {
    var closestIndex = 0;
    var minDistance = userPosition.distanceTo(routePoints[0]);
    
    for (var i = 1; i < routePoints.length; i++) {
        var distance = userPosition.distanceTo(routePoints[i]);
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
        }
    }
    
    return closestIndex;
}

function updateRouteProgress(newLat, newLng) {
    if (navigationState.routeLines.length === 0) return;
    
    var userPosition = L.latLng(newLat, newLng);
    
    // Check each route line for progress
    for (var i = 0; i < navigationState.routeLines.length; i++) {
        var routeLine = navigationState.routeLines[i];
        var currentLatLngs = routeLine.getLatLngs();
        
        if (currentLatLngs.length === 0) continue;
        
        // Find the closest point on this route and remove passed points
        var closestIndex = findClosestPointOnRoute(userPosition, currentLatLngs);
        var distanceToClosest = userPosition.distanceTo(currentLatLngs[closestIndex]);
        
        // If user is close to this route (within 50m), update progress
        if (distanceToClosest <= 50) {
            // Remove all points before the closest point (user has passed them)
            var remainingPoints = currentLatLngs.slice(closestIndex);
            
            // Set current user position as the first point
            remainingPoints[0] = userPosition;
            
            // Update the route line with only remaining points
            routeLine.setLatLngs(remainingPoints);
            
            console.log(`📍 Route progress: removed ${closestIndex} passed points from route ${i + 1}`);
            
            // If this route is now very short (< 10m), consider removing it entirely
            if (remainingPoints.length <= 2) {
                var totalRemainingDistance = 0;
                for (var j = 0; j < remainingPoints.length - 1; j++) {
                    totalRemainingDistance += remainingPoints[j].distanceTo(remainingPoints[j + 1]);
                }
                
                if (totalRemainingDistance < 10) {
                    console.log(`🏁 Route ${i + 1} completed, removing...`);
                    map.removeLayer(routeLine);
                    navigationState.routeLines.splice(i, 1);
                    i--; // Adjust index after removal
                }
            }
            break; // Only update one route at a time
            
        } else if (i === 0) {
            // For the first route, always update start point even if user is far
            currentLatLngs[0] = userPosition;
            routeLine.setLatLngs(currentLatLngs);
        }
    }
}

function updateRouteStartPoint(newLat, newLng) {
    // Legacy function - now handled by updateRouteProgress
    updateRouteProgress(newLat, newLng);
}

function showNavigationPanel(totalDistance, totalDuration) {
    var distanceKm = (totalDistance / 1000).toFixed(1);
    var durationMin = Math.round(totalDuration / 60);

    var existingPanel = document.getElementById('nav-panel');
    var existingDirections = document.getElementById('directions-panel');
    if (existingPanel) existingPanel.remove();
    if (existingDirections) existingDirections.remove();

    var panel = document.createElement('div');
    panel.id = 'nav-panel';
    panel.className = 'cemetery-nav-panel';
    panel.innerHTML = `
        <div class="cemetery-nav-header">
            <div class="cemetery-nav-title">
                <i class="fas fa-route"></i>
                <strong>Navigation Active</strong>
            </div>
            <button onclick="stopNavigation()" class="cemetery-nav-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="cemetery-nav-stats">
            <div class="cemetery-nav-distance">
                <i class="fas fa-road"></i>
                <span>${distanceKm} km</span>
            </div>
            <div class="cemetery-nav-duration">
                <i class="fas fa-clock"></i>
                <span>${durationMin} min</span>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
}

function stopNavigation() {
    console.log('🛑 Stopping navigation...');
    
    // Stop GPS tracking
    if (navigationState.watchId) {
        navigator.geolocation.clearWatch(navigationState.watchId);
        navigationState.watchId = null;
    }

    // Stop simulation
    stopRouteSimulation();

    // Clear display
    clearRouteDisplay();

    // Remove panels
    var panel = document.getElementById('nav-panel');
    var directionsPanel = document.getElementById('directions-panel');
    if (panel) panel.remove();
    if (directionsPanel) directionsPanel.remove();

    // Reset state
    navigationState.isActive = false;
    navigationState.currentRoute = null;
    navigationState.destination = null;
    navigationState.previousUserPosition = null;
    navigationState.isRecalculating = false;
    navigationState.routeStartPoint = null;
}

// Format distance helper
function formatDistance(meters) {
    if (meters < 1000) {
        return Math.round(meters) + 'm';
    } else {
        return (meters / 1000).toFixed(1) + 'km';
    }
}

// Export functions to global scope
window.navigateToGrave = navigateToGrave;
window.stopNavigation = stopNavigation;
