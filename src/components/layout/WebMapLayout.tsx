import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix default icon paths so markers actually show up
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import WebMapNavs from '@/pages/webmap/WebMapNavs';
import { markerData } from '@/components/webmap/markerData';
import { Skull } from 'lucide-react';
import type { MarkerData } from '@/components/webmap/markerData';
import { createContext, useRef } from 'react';
import { useState } from 'react';
import RoutingMachine from './RoutingMachine';
import { PlotLocations } from './PlotLocations';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Context to signal a locate request from navs to map
export const LocateContext = createContext<{ requestLocate: () => void } | null>(null);

export default function MapPage() {
  const bounds: [[number, number], [number, number]] = [
    [10.247883800064669, 123.79691285546676],
    [10.249302749341647, 123.7988598710129],
  ];
  const locateRef = useRef<(() => void) | null>(null);
  const [userPosition, setUserPosition] = useState<L.LatLng | null>(null);
  const [route, setRoute] = useState<{ from: [number, number]; to: [number, number] } | null>(null);
  // Store pending destination if user location is not yet available
  const pendingDestinationRef = useRef<[number, number] | null>(null);

  function LocationMarker() {
    const map = useMapEvents({
      locationfound(e) {
        setUserPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        // If a direction was requested before location was available, set the route now
        if (pendingDestinationRef.current) {
          setRoute({
            from: [e.latlng.lat, e.latlng.lng],
            to: pendingDestinationRef.current
          });
          pendingDestinationRef.current = null;
        }
      },
    });
    locateRef.current = () => map.locate();
    return userPosition === null ? null : (
      <Marker position={userPosition}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  // Provide context to navs
  const requestLocate = () => {
    if (locateRef.current) locateRef.current();
  };

  return (
    <LocateContext.Provider value={{ requestLocate }}>
      <div className="h-screen w-full">
        <WebMapNavs />
        <MapContainer
          bounds={bounds}
          zoom={18}
          maxZoom={25}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxNativeZoom={18}
            maxZoom={25}
          />
          <LocationMarker />
          {route && <RoutingMachine from={route.from} to={route.to} />}
          {markerData.map((marker: MarkerData, idx: number) => {
            // Render the Skull icon as SVG HTML for Leaflet divIcon
            const skullIcon = L.divIcon({
              html: renderToStaticMarkup(<Skull size={24} color="#FFFF" />),
              className: '', // Optionally add custom class
              iconSize: [24, 24], // Match SVG size
              iconAnchor: [12, 12], // Center the icon
            });
            // Type-safe background color assignment
            const backgroundColor: string | undefined =
              marker.category === 'Bronze'
                ? '#7d7d7d'
                : marker.category === 'Silver'
                  ? '#b00020'
                  : marker.category === 'Platinum'
                    ? '#d4af37'
                    : marker.category === 'Diamond'
                      ? '#cc6688'
                      : undefined;
            return (
              <Marker key={idx} position={marker.position} icon={skullIcon}>
                <Popup className=''>
                  <PlotLocations
                    marker={marker}
                    backgroundColor={backgroundColor}
                    onDirectionClick={() => {
                      if (userPosition) {
                        setRoute({
                          from: [userPosition.lat, userPosition.lng],
                          to: marker.position as [number, number]
                        });
                      } else {
                        // Store destination and trigger location request
                        pendingDestinationRef.current = marker.position as [number, number];
                        if (locateRef.current) locateRef.current();
                      }
                    }}
                  />
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </LocateContext.Provider>
  );
}
