// Create animated search box using L.Control.Searchbox
const animatedSearchBox = L.control.searchbox({
    position: 'topright',
    expand: 'right',
    collapsed: false,
    width: '180px',
    iconPath: "images/search_icon.png",
    autocompleteFeatures: ['setValueOnClick']
});

// Add to map
map.addControl(animatedSearchBox);

// Add search functionality
animatedSearchBox.onInput('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm.length < 2) {
        animatedSearchBox.clearItems();
        return;
    }

    const results = [];
    layer_pointsfinall_3.eachLayer(function (layer) {
        const props = layer.feature.properties;
        const visibility = String(props.Visibility).toLowerCase();
        const name = String(props.Name || '').toLowerCase();
        const deceasedName = String(props.deceased_fname || '').toLowerCase() + ' ' + String(props
            .deceased_lname || '').toLowerCase();

        // Check if search term matches name or deceased name
        if (name.includes(searchTerm) || deceasedName.includes(searchTerm)) {
            results.push({
                text: props.Name || 'Unnamed Grave',
                layer: layer
            });
        }
    });

    // Clear and add new results
    animatedSearchBox.clearItems();
    results.slice(0, 10).forEach(function (result) {
        animatedSearchBox.addItem(result.text);
    });
});

// Handle item selection
animatedSearchBox.onAutocomplete('click', function (e) {
    const selectedText = e.target.textContent;

    // Find the corresponding layer
    layer_pointsfinall_3.eachLayer(function (layer) {
        const props = layer.feature.properties;
        if (props.Name === selectedText) {
            const latlng = layer.getLatLng();
            map.setView(latlng, 28);
            layer.openPopup();
            animatedSearchBox.clearItems();
            // Clear the search input value after finding a match
            animatedSearchBox.setValue('');
            return;
        }
    });
});

// Handle search button click
animatedSearchBox.onButton('click', function () {
    const searchTerm = animatedSearchBox.getValue().toLowerCase();

    if (searchTerm.length < 2) return;

    // Find first matching result and navigate to it
    let found = false;
    layer_pointsfinall_3.eachLayer(function (layer) {
        if (found) return;

        const props = layer.feature.properties;
        const visibility = String(props.Visibility || '').toLowerCase();
        const name = String(props.Name || '').toLowerCase();
        const deceasedName = String(props.deceased_fname || '').toLowerCase() + ' ' + String(props
            .deceased_lname || '').toLowerCase();

        if (name.includes(searchTerm) || deceasedName.includes(searchTerm)) {
            const latlng = layer.getLatLng();
            map.setView(latlng, 28);
            layer.openPopup();
            // Clear the search input value after finding a match
            animatedSearchBox.setValue('');
            animatedSearchBox.clearItems();
            found = true;
        }
    });
});

// Move to search container if it exists
if (document.getElementById('search-container')) {
    const searchContainer = document.getElementById('search-container');
    const searchElement = document.querySelector('.leaflet-searchbox-container');
    if (searchElement) {
        searchContainer.appendChild(searchElement);
    }
}

// Set placeholder text for the search input
setTimeout(function () {
    const searchInput = document.querySelector('.leaflet-searchbox');
    if (searchInput) {
        searchInput.placeholder = 'Search grave records...';
    }
}, 100);
