document.addEventListener('DOMContentLoaded', function () {
    // Get the necessary elements
    const mapLegend = document.getElementById('mapLegend');
    const minimizeBtn = document.getElementById('minimizeLegend');

    // If elements don't exist, exit early
    if (!mapLegend || !minimizeBtn) {
        console.error('Map legend elements not found');
        return;
    }

    // Get or create the icon element
    let minimizeIcon = minimizeBtn.querySelector('i');
    if (!minimizeIcon) {
        minimizeIcon = document.createElement('i');
        minimizeIcon.classList.add('bi', 'bi-dash-lg');
        minimizeBtn.appendChild(minimizeIcon);
    }

    // Function to save the legend state
    function saveLegendState(isMinimized) {
        try {
            localStorage.setItem('map-legend-state', JSON.stringify({
                minimized: isMinimized,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Error saving legend state:', error);
        }
    }

    // Function to update the icon based on state
    function updateIcon(isMinimized) {
        if (isMinimized) {
            minimizeIcon.classList.remove('bi-dash-lg');
            minimizeIcon.classList.add('bi-plus-lg');
        } else {
            minimizeIcon.classList.remove('bi-plus-lg');
            minimizeIcon.classList.add('bi-dash-lg');
        }
    }

    // Load saved state
    try {
        const savedState = localStorage.getItem('map-legend-state');
        if (savedState) {
            const state = JSON.parse(savedState);
            if (state && typeof state.minimized === 'boolean') {
                // Apply the saved state
                if (state.minimized) {
                    mapLegend.classList.add('minimized');
                } else {
                    mapLegend.classList.remove('minimized');
                }
                // Update icon to match state
                updateIcon(state.minimized);
            }
        }
    } catch (error) {
        console.error('Error loading legend state:', error);
    }

    // Add click event listener
    minimizeBtn.addEventListener('click', function () {
        // Toggle the minimized class
        const willBeMinimized = !mapLegend.classList.contains('minimized');
        mapLegend.classList.toggle('minimized');

        // Update icon
        updateIcon(willBeMinimized);

        // Save the state
        saveLegendState(willBeMinimized);
    });
});