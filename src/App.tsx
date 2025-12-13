import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css';
import { LatLngBounds } from 'leaflet';

function App() {
  const bounds = new LatLngBounds([45.995334,12.5956731], [45.918336, 12.7074471])

  return (
    <>
      <MapContainer
        maxBounds={bounds} center={[45.9544979, 12.6596338]}
        zoom={13} maxZoom={18} minZoom={10}
        scrollWheelZoom={true}
        className="w-screen h-screen"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[45.9676511,12.6818763]}>
          <Popup>
                   A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </>
  )
}

export default App
