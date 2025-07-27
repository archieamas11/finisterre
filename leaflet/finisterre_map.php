<?php include __DIR__ . '/finisterre_data.php'; ?>
<script>
var highlightLayer;

function highlightFeature(e) {
    highlightLayer = e.target;
    highlightLayer.openPopup();
}

var map = L.map('map', {
    zoomControl: false,
    maxZoom: 28,
    minZoom: 2
}).fitBounds([
    [10.247883800064669, 123.79691285546676],
    [10.249302749341647, 123.7988598710129]
]);

var hash = new L.Hash(map);
var autolinker = new Autolinker({
    truncate: {
        length: 30,
        location: 'smart'
    }
});

// Global variables for navigation
var userLocationMarker = null;
var currentRoute = null;
var isNavigating = false;
var destinationCoords = null;
var bounds_group = new L.featureGroup([]);

function setBounds() {}
map.createPane('pane_Esti_0');
map.getPane('pane_Esti_0').style.zIndex = 400;
var layer_Esti_0 = L.tileLayer(
    'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        pane: 'pane_Esti_0',
        opacity: 1.0,
        attribution: '',
        minZoom: 2,
        maxZoom: 28,
        minNativeZoom: 0,
        maxNativeZoom: 18
    });
layer_Esti_0;
map.addLayer(layer_Esti_0);

function pop_Chapel_1(feature, layer) {
    layer.on({
        mouseout: function(e) {
            if (typeof layer.closePopup == 'function') {
                layer.closePopup();
            } else {
                layer.eachLayer(function(feature) {
                    feature.closePopup()
                });
            }
        },
        mouseover: highlightFeature,
    });
    var popupContent = '<table>\
                        <tr>\
                            <td colspan="2">' + (feature.properties['Chapel'] !== null ? autolinker.link(String(feature
        .properties['Chapel']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
                        </tr>\
                    </table>';
    var content = removeEmptyRowsFromPopupContent(popupContent, feature);
    layer.on('popupopen', function(e) {
        addClassToPopupIfMedia(content, e.popup);
    });
    layer.bindPopup(content, {
        maxHeight: 400
    });
}

function style_Chapel_1_0() {
    return {
        pane: 'pane_Chapel_1',
        rotationOrigin: 'center center',
        icon: L.divIcon({
            html: '<div class="marker-style chapel"><i class="fa-solid fa-church"></i></div>',
            className: 'chapel-marker-style',
        }),
        interactive: true,
    }
}
map.createPane('pane_Chapel_1');
map.getPane('pane_Chapel_1').style.zIndex = 401;
map.getPane('pane_Chapel_1').style['mix-blend-mode'] = 'normal';
var layer_Chapel_1 = new L.geoJson(json_Chapel_1, {
    attribution: '',
    interactive: true,
    dataVar: 'json_Chapel_1',
    layerName: 'layer_Chapel_1',
    pane: 'pane_Chapel_1',
    onEachFeature: pop_Chapel_1,
    pointToLayer: function(feature, latlng) {
        var context = {
            feature: feature,
            variables: {}
        };
        return L.marker(latlng, style_Chapel_1_0(feature));
    },
});
bounds_group.addLayer(layer_Chapel_1);
map.addLayer(layer_Chapel_1);

function pop_parking_2(feature, layer) {
    layer.on({
        mouseout: function(e) {
            if (typeof layer.closePopup == 'function') {
                layer.closePopup();
            } else {
                layer.eachLayer(function(feature) {
                    feature.closePopup()
                });
            }
        },
        mouseover: highlightFeature,
    });
    var popupContent = '<table>\
                        <tr>\
                            <td colspan="2">' + (feature.properties['parking'] !== null ? autolinker.link(String(
        feature
        .properties['parking']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
                        </tr>\
                    </table>';
    var content = removeEmptyRowsFromPopupContent(popupContent, feature);
    layer.on('popupopen', function(e) {
        addClassToPopupIfMedia(content, e.popup);
    });
    layer.bindPopup(content, {
        maxHeight: 400
    });
}

function style_parking_2_0() {
    return {
        pane: 'pane_parking_2',
        rotationAngle: 0.0,
        rotationOrigin: 'center center',
        icon: L.divIcon({
            html: '<div class="marker-style parking"><i class="fa-solid fa-p"></i></div>',
            className: 'parking-marker-style',
        }),
        interactive: true,
    }
}
map.createPane('pane_parking_2');
map.getPane('pane_parking_2').style.zIndex = 402;
map.getPane('pane_parking_2').style['mix-blend-mode'] = 'normal';
var layer_parking_2 = new L.geoJson(json_parking_2, {
    attribution: '',
    interactive: true,
    dataVar: 'json_parking_2',
    layerName: 'layer_parking_2',
    pane: 'pane_parking_2',
    onEachFeature: pop_parking_2,
    pointToLayer: function(feature, latlng) {
        var context = {
            feature: feature,
            variables: {}
        };
        return L.marker(latlng, style_parking_2_0(feature));
    },
});
bounds_group.addLayer(layer_parking_2);
map.addLayer(layer_parking_2);

function pop_Clusters_3(feature, layer) {
    var popupContent = '<table>\
                        <tr>\
                            <td colspan="2">' + (feature.properties['Clusters'] !== null ? autolinker.link(String(
        feature
        .properties['Clusters']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
                        </tr>\
                    </table>';
    var content = removeEmptyRowsFromPopupContent(popupContent, feature);
    layer.on('popupopen', function(e) {
        addClassToPopupIfMedia(content, e.popup);
    });
}

function style_Clusters_3_0() {
    return {
        pane: 'pane_Clusters_3',
        opacity: 1,
        color: 'rgba(35,35,35,1.0)',
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 1.0,
        fill: true,
        fillOpacity: 1,
        fillColor: 'rgba(243,166,178,0.3215686274509804)',
        interactive: true,
    }
}
map.createPane('pane_Clusters_3');
map.getPane('pane_Clusters_3').style.zIndex = 403;
map.getPane('pane_Clusters_3').style['mix-blend-mode'] = 'normal';
var layer_Clusters_3 = new L.geoJson(json_Clusters_3, {
    attribution: '',
    interactive: true,
    dataVar: 'json_Clusters_3',
    layerName: 'layer_Clusters_3',
    pane: 'pane_Clusters_3',
    onEachFeature: pop_Clusters_3,
    style: style_Clusters_3_0,
});
bounds_group.addLayer(layer_Clusters_3);
map.addLayer(layer_Clusters_3);

function getCategoryClass(category) {
    if (!category) return '';
    const cat = category.toString().toLowerCase();
    return ['platinum', 'bronze', 'silver', 'diamond'].includes(cat) ? cat : '';
}

function getHeader(feature) {
    const cssClass = getCategoryClass(feature.properties['category']);
    return `
        <div class="popup-header ${cssClass}">
            <div class="header-title">
                <span class="popup-title1">Finisterre</span> <br>
                <span class="popup-title">Plot Information</span>
            </div>
        </div>
  `;
}

function getPopup(feature) {
    return `
        ${getHeader(feature)}
        <div class="info-grid">
            ${getLocationSection(feature)}
        </div>

        <div class="timeline-grid">
            ${getPlotStatus(feature)}
        </div>

        <div class="plot-specifications-container">
            ${getPlotSpecifications(feature)}
        </div>
        <hr>
        ${getPhotosSection(feature)}`;
}


function getLocationSection(feature) {
    const cssClass = getCategoryClass(feature.properties['category']);
    return `
        <div class="icons">
            <div class="values">
                <i class="fas fa-map-pin me-1"></i>
                <span class="info-label">Location</span> <br>
                <span id="block" class="info-value">Block ${feature.properties['Block'] || 'N/A'} • Grave ${feature.properties['Grave No.'] || 'N/A'}</span>
            </div>
            <div class="navigation-section">
                <a onclick="navigateToGrave(${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]})" class="direction-button ${cssClass}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M502.6 233.3L278.7 9.4c-12.5-12.5-32.8-12.5-45.4 0L9.4 233.3c-12.5 12.5-12.5 32.8 0 45.4l223.9 223.9c12.5 12.5 32.8 12.5 45.4 0l223.9-223.9c12.5-12.5 12.5-32.8 0-45.4zm-101 12.6l-84.2 77.7c-5.1 4.7-13.4 1.1-13.4-5.9V264h-96v64c0 4.4-3.6 8-8 8h-32c-4.4 0-8-3.6-8-8v-80c0-17.7 14.3-32 32-32h112v-53.7c0-7 8.3-10.6 13.4-5.9l84.2 77.7c3.4 3.2 3.4 8.6 0 11.8z"/></svg>
                </a>
            </div>
        </div>`;
}

function getPlotStatus(feature) {
    const status = feature.properties['Status'] || 'N/A';
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

    const iconClass =
        status === 'available' ? 'fa-check-circle' :
        status === 'reserved' ? 'fa-hourglass-start' :
        status === 'occupied' ? 'fa-circle-xmark' :
        'fa-info-circle';

    return `
        <div class="icons">
            <div class="plot-status-title">
                <i class="fas fa-info-circle me-1"></i>
                <span class="info-label">Plot Status</span>
            </div>
            <div class="plot-status-badge ${capitalizedStatus}">
                <i class="fas ${iconClass}"></i>
                <span>${capitalizedStatus}</span>
            </div>
        </div>
    `;
}

function getPlotSpecifications(feature) {
    const category = feature.properties['category'] || 'N/A';
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    const status = feature.properties['Status'] || 'N/A';
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    const cssClass = getCategoryClass(feature.properties['category']);
    return `
        <div class="plot-dimension">
            <div class="plot-dimension-header">
                <span class="info-label"><i class="fa-solid fa-pen-ruler me-2"></i>Dimension</span>
            </div>
            <div class="plot-dimension-content">
                <span class="info-value">2.5m x 1.2m</span>
                <span>3.0 square meters</span>
            </div>
        </div>
        <div class="plot-dimension">
            <div class="plot-dimension-header ${category}">
                <span class="info-label"><i class="fa-solid fa-star me-2"></i>Details</span>
            </div>
            <div class="plot-dimension-content">
                <div class="plot-dimension-badge ${category}">
                    <i class="fa-solid fa-award"></i>
                    <span>${capitalizedCategory}</span>
                </div>
            </div>
        </div>
        `;
}

function getPhotosSection(feature) {
    return `
        <div class="images-container" style="width: 100%;">
            ${feature.properties['PhotoCount'] > 0 
                ? `<div class="images-grid">${feature.properties['Photos']}</div>`
                : '<div style="display: flex; justify-content: center;">No photos available</div>'}
        </div>`;
}

function pop_category_5(feature, layer) {
    const deceasedCount = feature.properties['DeceasedCount'] || 0;
    const graveStatus = feature.properties['Status'];
    const visibility = feature.properties['Visibility'];

    const popupContent =
        getPopup(feature);
    const content = removeEmptyRowsFromPopupContent(popupContent, feature);
    layer.on('popupopen', (e) => addClassToPopupIfMedia(content, e.popup));
    layer.bindPopup(content, {
        maxHeight: 1000,
        minHeight: 1000,
        maxWidth: 450
    });
}

function style_category_5_0(feature) {
    switch (String(feature.properties['Status'])) {
        case 'occupied':
            return {
                pane: 'pane_category_5',
                    shape: 'circle',
                    radius: 6.4,
                    opacity: 1,
                    color: 'rgba(0, 0, 0, 0.5)',
                    dashArray: '',
                    lineCap: 'butt',
                    lineJoin: 'miter',
                    weight: 2.0,
                    fill: true,
                    fillOpacity: 1,
                    fillColor: 'rgba(239,13,17,1.0)',
                    interactive: true,
            }
            break;
        case 'available':
            return {
                pane: 'pane_category_5',
                    shape: 'circle',
                    radius: 6.4,
                    opacity: 1,
                    color: 'rgba(0, 0, 0, 0.5)',
                    dashArray: '',
                    lineCap: 'butt',
                    lineJoin: 'miter',
                    weight: 2.0,
                    fill: true,
                    fillOpacity: 1,
                    fillColor: 'rgba(5,255,0,1)',
                    interactive: true,
            }
            break;
        case 'reserved':
            return {
                pane: 'pane_category_5',
                    shape: 'circle',
                    radius: 6.4,
                    opacity: 1,
                    color: 'rgba(0, 0, 0, 0.5)',
                    dashArray: '',
                    lineCap: 'butt',
                    lineJoin: 'miter',
                    weight: 2.0,
                    fill: true,
                    fillOpacity: 1,
                    fillColor: 'rgba(255,191,0,1.0)',
                    interactive: true,
            }
            break;
    }
}
map.createPane('pane_category_5');
map.getPane('pane_category_5').style.zIndex = 405;
map.getPane('pane_category_5').style['mix-blend-mode'] = 'normal';
var layer_category_5 = new L.geoJson(json_category_5, {
    attribution: '',
    interactive: true,
    dataVar: 'json_category_5',
    layerName: 'layer_category_5',
    pane: 'pane_category_5',
    onEachFeature: pop_category_5,
    pointToLayer: function(feature, latlng) {
        var context = {
            feature: feature,
            variables: {}
        };
        return L.shapeMarker(latlng, style_category_5_0(feature));
    },
});
bounds_group.addLayer(layer_category_5);
map.addLayer(layer_category_5);

function pop_entrance_6(feature, layer) {
    layer.on({
        mouseout: function(e) {
            if (typeof layer.closePopup == 'function') {
                layer.closePopup();
            } else {
                layer.eachLayer(function(feature) {
                    feature.closePopup()
                });
            }
        },
        mouseover: highlightFeature,
    });
    var popupContent = '<table>\
                        <tr>\
                            <td colspan="2">' + (feature.properties['entrance'] !== null ? autolinker.link(String(
        feature
        .properties['entrance']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
                        </tr>\
                    </table>';
    var content = removeEmptyRowsFromPopupContent(popupContent, feature);
    layer.on('popupopen', function(e) {
        addClassToPopupIfMedia(content, e.popup);
    });
    layer.bindPopup(content, {
        maxHeight: 400
    });
}

function style_entrance_6_0() {
    return {
        pane: 'pane_entrance_6',
        rotationAngle: 0.0,
        rotationOrigin: 'center center',
        icon: L.icon({
            iconUrl: 'markers/entrance_6.svg',
            iconSize: [27.36, 27.36]
        }),
        interactive: true,
    }
}
map.createPane('pane_entrance_6');
map.getPane('pane_entrance_6').style.zIndex = 406;
map.getPane('pane_entrance_6').style['mix-blend-mode'] = 'normal';
var layer_entrance_6 = new L.geoJson(json_entrance_6, {
    attribution: '',
    interactive: true,
    dataVar: 'json_entrance_6',
    layerName: 'layer_entrance_6',
    pane: 'pane_entrance_6',
    onEachFeature: pop_entrance_6,
    pointToLayer: function(feature, latlng) {
        var context = {
            feature: feature,
            variables: {}
        };
        return L.marker(latlng, style_entrance_6_0(feature));
    },
});
bounds_group.addLayer(layer_entrance_6);
map.addLayer(layer_entrance_6);

function pop_exit_7(feature, layer) {
    layer.on({
        mouseout: function(e) {
            if (typeof layer.closePopup == 'function') {
                layer.closePopup();
            } else {
                layer.eachLayer(function(feature) {
                    feature.closePopup()
                });
            }
        },
        mouseover: highlightFeature,
    });
    var popupContent = '<table>\
                        <tr>\
                            <td colspan="2">' + (feature.properties['exit'] !== null ? autolinker.link(String(feature
        .properties['exit']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
                        </tr>\
                    </table>';
    var content = removeEmptyRowsFromPopupContent(popupContent, feature);
    layer.on('popupopen', function(e) {
        addClassToPopupIfMedia(content, e.popup);
    });
    layer.bindPopup(content, {
        maxHeight: 400
    });
}

function style_exit_7_0() {
    return {
        pane: 'pane_exit_7',
        rotationAngle: 0.0,
        rotationOrigin: 'center center',
        icon: L.icon({
            iconUrl: 'markers/exit_7.svg',
            iconSize: [27.36, 27.36]
        }),
        interactive: true,
    }
}
map.createPane('pane_exit_7');
map.getPane('pane_exit_7').style.zIndex = 407;
map.getPane('pane_exit_7').style['mix-blend-mode'] = 'normal';
var layer_exit_7 = new L.geoJson(json_exit_7, {
    attribution: '',
    interactive: true,
    dataVar: 'json_exit_7',
    layerName: 'layer_exit_7',
    pane: 'pane_exit_7',
    onEachFeature: pop_exit_7,
    pointToLayer: function(feature, latlng) {
        var context = {
            feature: feature,
            variables: {}
        };
        return L.marker(latlng, style_exit_7_0(feature));
    },
});

// Display all point images in the bounds group
const displayImages = document.createElement('script');
displayImages.src = './leaflet/popup-images.js';
displayImages.type = 'text/javascript';
document.head.appendChild(displayImages);

// Display all layers in the bounds group
const displayLayersScript = document.createElement('script');
displayLayersScript.src = './leaflet/display-layers.js';
displayLayersScript.type = 'text/javascript';
document.head.appendChild(displayLayersScript);

// Include the clean navigation system (two-step routing: city→gate→grave)
const navigationScript = document.createElement('script');
navigationScript.src = './leaflet/get-route.js';
navigationScript.type = 'text/javascript';
document.head.appendChild(navigationScript);

// Include the search box functionality
const searchboxScript = document.createElement('script');
searchboxScript.src = './leaflet/animated-searchbar.js';
searchboxScript.type = 'text/javascript';
document.head.appendChild(searchboxScript);
</script>