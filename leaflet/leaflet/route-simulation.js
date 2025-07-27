// SIMULATION MODE FOR TESTING
function startRouteSimulation() {
    if (!navigationState.isActive || navigationState.routeLines.length === 0) {
        console.warn('Cannot start simulation: navigation not active');
        return;
    }

    console.log('🎬 Starting route simulation...');
    navigationState.simulationActive = true;
    navigationState.simulationIndex = 0;
    navigationState.simulationPath = [];

    // Collect all route points
    navigationState.routeLines.forEach(function(routeLine) {
        var latLngs = routeLine.getLatLngs();
        latLngs.forEach(function(latLng) {
            navigationState.simulationPath.push(latLng);
        });
    });

    // Update navigation panel to show simulation mode
    showNavigationPanel(1000, 600); // Dummy values for simulation

    // Start simulation interval
    navigationState.simulationInterval = setInterval(function() {
        if (navigationState.simulationIndex < navigationState.simulationPath.length) {
            var currentPoint = navigationState.simulationPath[navigationState.simulationIndex];
            
            // Update user marker position
            if (navigationState.userMarker) {
                navigationState.userMarker.setLatLng(currentPoint);
                
                // Update route progress and remove passed segments
                updateRouteProgress(currentPoint.lat, currentPoint.lng);
                
                // Center map on current position
                map.panTo(currentPoint);
            }
            
            navigationState.simulationIndex++;
            console.log(`🎬 Simulation step ${navigationState.simulationIndex}/${navigationState.simulationPath.length}`);
        } else {
            // Simulation complete
            stopRouteSimulation();
            console.log('🏁 Simulation completed!');
        }
    }, 500);
}

function stopRouteSimulation() {
    if (navigationState.simulationInterval) {
        clearInterval(navigationState.simulationInterval);
        navigationState.simulationInterval = null;
    }
    navigationState.simulationActive = false;
    navigationState.simulationIndex = 0;
    navigationState.simulationPath = [];
    console.log('🛑 Simulation stopped');
    
    // Update panel to remove simulation mode indicator
    if (navigationState.isActive) {
        showNavigationPanel(1000, 600); // Refresh panel without simulation mode
    }
}

window.startRouteSimulation = startRouteSimulation;
window.stopRouteSimulation = stopRouteSimulation;