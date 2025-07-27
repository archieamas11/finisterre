const css = `
.custom-popup-img {
  display: block;
  margin: 0 auto;
  border: 2px solid #333;
  border-radius: 8px;
}

.custom-icon-img {
  border: 4px solid #FFFF;
  border-radius: 8px;
}`;

function createCustomIcon() {
    const size = 40;
    const imgUrl = `https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg`;
    return L.icon({
        iconUrl: imgUrl,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
        className: 'custom-icon-img'
    });
}

const style = document.createElement('style');
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);
// Playground
function pop_playground_1(feature, layer) {

    // Use Picsum image
    const imgUrl = 'https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg';
    const imgTag = `<img src="${imgUrl}" class="custom-popup-img" width="200">`;

    const popupContent = `
    <table>
      <tr><td colspan="2">${feature.properties['entrance'] || ''}</td></tr>
      <tr><td colspan="2">${imgTag}</td></tr>
    </table>`;

    const content = removeEmptyRowsFromPopupContent(popupContent, feature);
    layer.on('popupopen', function (e) {
        addClassToPopupIfMedia(content, e.popup);
    });
    layer.bindPopup(content, {
        maxHeight: 400
    });
}

function style_playground_1_0() {
    return {
        pane: 'pane_playground_1',
        rotationAngle: 0.0,
        rotationOrigin: 'center center',
        icon: L.icon({
            iconUrl: 'markers/entrance_6.svg',
            iconSize: [27.36, 27.36]
        }),
        interactive: true,
    }
}
map.createPane('pane_playground_1');
map.getPane('pane_playground_1').style.zIndex = 406;
map.getPane('pane_playground_1').style['mix-blend-mode'] = 'normal';
var layer_playground_1 = new L.geoJson(json_playground_1, {
    attribution: '',
    interactive: true,
    dataVar: 'json_playground_1',
    layerName: 'layer_playground_1',
    pane: 'pane_playground_1',
    onEachFeature: pop_playground_1,
    pointToLayer: function (feature, latlng) {
        const icon = createCustomIcon();
        return L.marker(latlng, {
            pane: 'pane_playground_1',
            icon: icon,
            interactive: true
        });
    }
});
bounds_group.addLayer(layer_playground_1);
map.addLayer(layer_playground_1);