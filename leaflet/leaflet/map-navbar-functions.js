function whereAmI() {
    if (typeof map !== 'undefined') {
        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const userLocation = L.latLng(lat, lng);

                // Center the map on user's location
                map.setView(userLocation, 18);

                // Add a marker for the user's location
                L.marker(userLocation).addTo(map)
                    .bindPopup('You are here!')
                    .openPopup();
            }, () => {
                alert('Unable to retrieve your location.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }
}

function centerMap() {
    if (typeof map !== 'undefined') {
        map.fitBounds([
            [10.247883800064669, 123.79691285546676],
            [10.249302749341647, 123.7988598710129]
        ]);
    }
}

function showLayers() {
    if (typeof map !== 'undefined') {
        alert('Layer management is not implemented yet.');
    }
}