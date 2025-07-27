// components/QGISMap.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/css/cemetery-navigation-panel.css';
import 'leaflet/css/floating-navbar.css';
import 'leaflet/css/fontawesome-all.min.css';
import 'leaflet/css/L.Control.Layers.Tree.css';
import 'leaflet/css/L.Control.Locate.min.css';
import 'leaflet/css/leaflet-measure.css';
import 'leaflet/css/leaflet-searchbar.css';
import 'leaflet/css/Leaflet.AnimatedSearchBox.css';
import 'leaflet/css/leaflet.css';
import 'leaflet/css/leaflet.photon.css';
import 'leaflet/css/map-filter.css';
import 'leaflet/css/map-legend.css';
import 'leaflet/css/map-overview.css';
import 'leaflet/css/MarkerCluster.css';
import 'leaflet/css/MarkerCluster.Default.css';
import 'leaflet/css/popup-modal.css';
import 'leaflet/css/qgis2web.css';
import jsonChapel1 from '../../../leaflet/data/Chapel_1.json';

const QGISMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Set initial bounds from finisterre_map.php
    const bounds: L.LatLngBoundsLiteral = [
      [10.247883800064669, 123.79691285546676],
      [10.249302749341647, 123.7988598710129]
    ];

    const map = L.map(mapRef.current!, {
      zoomControl: false,
      maxZoom: 28,
      minZoom: 2,
      crs: L.CRS.EPSG3857,
      worldCopyJump: false,
    }).fitBounds(bounds);

    // Add base layer (ArcGIS imagery)
    const arcgisLayer = L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxNativeZoom: 18 }
    ).addTo(map);

    // Add OpenStreetMap as alternative base layer
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });

    const baseLayers = {
      'ArcGIS Imagery': arcgisLayer,
      'OpenStreetMap': osmLayer
    };

    // Add layer control
    L.control.layers(baseLayers).addTo(map);

    // Add scale control
    L.control.scale({ imperial: false }).addTo(map);

    // Add QGIS layers (sample: Chapel)
    addQGISLayers(map);

    mapInstance.current = map;

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="qgis-map-container"
      style={{ height: '100%', width: '100%' }}
    />
  );
};

// Function to add QGIS layers (Chapel)
const addQGISLayers = (map: L.Map) => {
  const style_Chapel_1_0 = () => ({
    fillColor: '#ff0000',
    weight: 2,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7
  });

  const pop_Chapel_1 = (feature: any, layer: L.Layer) => {
    if (feature.properties) {
      let popupContent = '<table>';
      for (const key in feature.properties) {
        popupContent += `<tr><th>${key}</th><td>${feature.properties[key] !== null ? feature.properties[key] : ''}</td></tr>`;
      }
      popupContent += '</table>';
      (layer as L.Marker).bindPopup(popupContent);
    }
    layer.on('mouseover', function () {
      (layer as L.Marker).openPopup();
    });
  };

  const chapelLayer = L.geoJSON(jsonChapel1 as GeoJSON.FeatureCollection, {
    style: style_Chapel_1_0,
    onEachFeature: pop_Chapel_1
  });
  chapelLayer.addTo(map);
};

export default QGISMap;