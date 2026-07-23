import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css';
import L, { LatLngBounds, type LatLngExpression } from 'leaflet';
import { useState } from 'react';

import YearStrip from "./YearStrip";
import eventsData from "./events.json";

// not sure i understand why, but it's needed for keeping the assets
// @ts-ignore: Property
delete L.Icon.Default.prototype._getIconUrl;

// be explicit about asset paths
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet-images/marker-icon-2x.png',
  iconUrl: '/leaflet-images/marker-icon.png',
  shadowUrl: '/leaflet-images/marker-shadow.png',
});

interface IMarker {
  pos: LatLngExpression,
  title: string,
  date: string,
  year: number,
  text?: string,
  url?: string,
  image?: string,
}

const markers = eventsData as IMarker[];

const Close = ({onClick: onclick, className: cn = ""} : {onClick(): void, className?: string}) => {
  return (
    <button aria-label="Close"
      className={`p-2 bg-gray-200 hover:bg-gray-300 border border-solid border-gray-400 transition duration-300 rounded-full cursor-pointer ${cn}`}
      onClick={onclick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  )
}

const PanelBody = ({mark} : {mark: IMarker}) => {
  return (
    <>
      { mark.image && <img src={mark.image} alt={"image for "+ mark.title} className="mb-4" /> }
      <p className="text-center text-gray-500 text-sm mb-1">{mark.date}</p>
      <h3 className="text-xl text-center mb-4">{mark.title}</h3>
      {mark.text && mark.text.split("\n\n").map((paragraph, i) => <p key={i} className="mb-4">{paragraph}</p>)}
      {mark.url  && <p className="mt-8"><a href={mark.url} target="_blank"><em>Per approfondire →</em></a></p>}
    </>
  )
}

const Panel = ({mark, close} : {mark: IMarker | null, close(): void}) => {
  const show = mark != null
  return (
    <div>
      <div className={`absolute bottom-0 right-0 left-0 top-0 bg-gray-900/60 z-10000 ${!show && 'hidden'}`}
        onClick={_ => close()}>
      </div>
      <div className={`absolute bottom-0 right-0 left-0 top-0 w-full md:w-2/3 lg:w-1/3 overflow-auto z-10100 bg-white transition-transform duration-300 ease-in-out ${show ? 'translate-0' : '-translate-x-full'}`}
        onClick={_ => close()}>
        <Close onClick={close} className="absolute right-4 top-4" />
        <div onClick={e => e.stopPropagation()} className="w-full h-full p-4 pt-17">
          { show && <PanelBody mark={mark} />}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [mark, setMark] = useState<IMarker|null>(null)

  const [year, setYear] = useState(1840);

  const bounds = new LatLngBounds([45.995334,12.5956731], [45.918336, 12.7074471])

  return (
    <div className="w-screen h-dvh flex flex-col">

      <MapContainer
        maxBounds={bounds} center={[45.9544979, 12.6596338]}
        zoom={14} maxZoom={18} minZoom={10}
        scrollWheelZoom={true}
        className="grow"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          markers.filter(e => e.year === year).map((e, i) =>
            <Marker key={i} position={e.pos} eventHandlers={{
              click: _ => setMark(e)
            }}/>
          )
        }
      </MapContainer>

      <div className="text-center select-none">
        <YearStrip
          value={year}
          onChange={setYear}
          min={1840}
          max={1866}
          step={1}
        />
      </div>

      <Panel mark={mark} close={() => setMark(null)} />

    </div>
  )
}

export default App
