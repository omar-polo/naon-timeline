import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L, { type LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MAP_BOUNDS, MAP_CENTER } from '../../lib/geo';
import useIsMobile from '../layout/useIsMobile';

// Same "square with one sharp corner, rotated -45deg" trick as
// packages/ui/src/markerIcon.ts, minus the label bubble - this pin never
// shows one.
const pinIcon = L.divIcon({
  html: '<div style="width:100%;height:100%;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:var(--color-accent);box-shadow:0 2px 4px rgba(0,0,0,.25)"></div>',
  className: '',
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

function ClickToPlace({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterOnChange({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.panTo([lat, lng]);
  }, [map, lat, lng]);
  return null;
}

export default function EventMapPicker({
  lat,
  lng,
  onChange,
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}) {
  const isMobile = useIsMobile();
  const position: LatLngTuple = [lat, lng];

  return (
    <div className={`isolate overflow-hidden rounded-lg ${isMobile ? 'h-[200px]' : 'h-[280px]'}`}>
      <MapContainer
        center={MAP_CENTER}
        maxBounds={MAP_BOUNDS}
        zoom={14}
        maxZoom={18}
        minZoom={10}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickToPlace onChange={onChange} />
        <RecenterOnChange lat={lat} lng={lng} />
        <Marker
          position={position}
          icon={pinIcon}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const { lat: nextLat, lng: nextLng } = e.target.getLatLng();
              onChange(nextLat, nextLng);
            },
          }}
        />
      </MapContainer>
    </div>
  );
}
