import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css';
import { LatLngBounds, type LatLngExpression } from 'leaflet';
import { useState } from 'react';

interface IMarker {
  pos: LatLngExpression,
  text: string,
  image?: string,
}

const markers: { [id: string] : [IMarker]; } = {
  antica: [{
    pos: [45.9676511,12.6818763],
    text: "Torre",
  }, {
    pos: [45.9686511,12.6418763],
    text: "punto a caso",
  }, {
    pos: [45.9499511,12.6425763],
    text: "punto a caso due",
    image: "https://placehold.co/600x400?text=Punto+di+interesse",
  }],
  moderna: [{
    pos: [45.9545329, 12.6593973],
    text: "municipio",
  }, {
    pos: [45.9666511,12.6516763],
    text: "qualcosa di diverso",
  }],
  contemporanea: [{
    pos: [45.9568299, 12.6657233],
    text: "PAFF!"
  }, {
    pos: [45.9564299, 12.6543233],
    text: "stazione"
  }],
}

interface IEpochSelector {
  target: string,
  current: string,
  setEpoch(epoch : string): void,
}

const EpochSelector = ({target, current, setEpoch} : IEpochSelector) => {
  const c = "mx-1 p-2 cursor-pointer"

  if (target == current) {
    return <strong className={c}>{target}</strong>
  }

  return <button className={c} onClick={() => setEpoch(target)}>{target}</button>
}

const PanelBody = ({mark} : {mark: IMarker}) => {
  return (
    <>
    { mark.image && <img src={mark.image} alt={"image for "+ mark.text} className="" /> }
    <p>descrizione del punto: <br/> <em>{mark.text}</em></p>
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
      <div className={`absolute bottom-0 right-0 left-0 top-0 w-full md:w-2/3 lg:w-1/3 z-10100 bg-white transition-transform duration-300 ease-in-out ${show ? 'translate-0' : '-translate-x-full'}`}
        onClick={_ => close()}>
        <div onClick={e => e.stopPropagation()} className="w-full h-full p-4">
          { show && <PanelBody mark={mark} />}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [epoch, setEpoch] = useState('antica')
  const [mark, setMark] = useState<IMarker|null>(null)

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
          markers[epoch].map((e, i) =>
            <Marker key={i} position={e.pos} eventHandlers={{
              click: _ => setMark(e)
            }}>
              {/* <Popup>{e.text}</Popup> */}
            </Marker>)
        }
      </MapContainer>

      <div className="text-center p-3">
        <EpochSelector target="antica" current={epoch} setEpoch={setEpoch} />
        <EpochSelector target="moderna" current={epoch} setEpoch={setEpoch} />
        <EpochSelector target="contemporanea" current={epoch} setEpoch={setEpoch} />
      </div>

      <Panel mark={mark} close={() => setMark(null)} />

    </div>
  )
}

export default App
