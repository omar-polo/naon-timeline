import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css';
import { LatLngBounds } from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';

import eventsData from "./events.json";
import type { TimelineEvent } from './types';
import { compareEvents } from './dates';
import { createEventIcon } from './markerIcon';
import Header from './Header';
import BottomBar from './BottomBar';

const events = eventsData as TimelineEvent[];

const YEAR_START = 1840;
const YEAR_END = 1866;
const YEARS = Array.from({ length: YEAR_END - YEAR_START + 1 }, (_, i) => YEAR_START + i);

function buildEventsByYear(evts: TimelineEvent[]): Map<number, TimelineEvent[]> {
  const map = new Map<number, TimelineEvent[]>();
  for (const e of evts) {
    const list = map.get(e.year);
    if (list) list.push(e);
    else map.set(e.year, [e]);
  }
  for (const list of map.values()) list.sort(compareEvents);
  return map;
}

const EVENTS_BY_YEAR = buildEventsByYear(events);
const COUNTS_BY_YEAR = new Map(YEARS.map((y) => [y, EVENTS_BY_YEAR.get(y)?.length ?? 0]));

const EventMarker = ({
  event,
  isSelected,
  onClick,
}: {
  event: TimelineEvent;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const icon = useMemo(() => createEventIcon(event, isSelected), [event, isSelected]);
  return (
    <Marker
      position={event.pos}
      icon={icon}
      zIndexOffset={isSelected ? 1000 : 0}
      eventHandlers={{ click: onClick }}
    />
  );
};

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

const PanelBody = ({mark} : {mark: TimelineEvent}) => {
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

const Panel = ({mark, close} : {mark: TimelineEvent | null, close(): void}) => {
  const show = mark != null
  return (
    <div>
      <div className={`absolute bottom-0 right-0 left-0 top-0 bg-gray-900/60 z-10000 ${!show && 'hidden'}`}
        onClick={() => close()}>
      </div>
      <div className={`absolute bottom-0 right-0 top-0 w-full md:w-2/3 lg:w-1/3 overflow-auto z-10100 bg-white transition-transform duration-300 ease-in-out ${show ? 'translate-0' : 'translate-x-full'}`}
        onClick={() => close()}>
        <Close onClick={close} className="absolute left-4 top-4" />
        <div onClick={e => e.stopPropagation()} className="w-full h-full p-4 pt-17">
          { show && <PanelBody mark={mark} />}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [selectedYear, setSelectedYear] = useState<number>(YEAR_START);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(
    () => EVENTS_BY_YEAR.get(YEAR_START)?.[0]?.id ?? null
  );
  const [panelEventId, setPanelEventId] = useState<number | null>(null);

  const bounds = new LatLngBounds([45.995334,12.5956731], [45.918336, 12.7074471])

  const yearEvents = EVENTS_BY_YEAR.get(selectedYear) ?? [];
  const panelEvent = panelEventId != null ? events.find((e) => e.id === panelEventId) ?? null : null;

  function selectYear(year: number) {
    const evs = EVENTS_BY_YEAR.get(year) ?? [];
    setSelectedYear(year);
    setSelectedEventId(evs[0]?.id ?? null);
    setPanelEventId(null);
  }

  function selectEvent(event: TimelineEvent, opts?: { openPanel?: boolean }) {
    setSelectedYear(event.year);
    setSelectedEventId(event.id);
    setPanelEventId(opts?.openPanel ? event.id : null);
  }

  // Let the browser's back button close the panel instead of leaving the
  // page: push a history entry when it opens, and let popstate be the only
  // place that actually clears panelEventId (closePanel below just triggers
  // that via history.back(), so the pushed entry never dangles).
  const panelWasOpenRef = useRef(false);
  useEffect(() => {
    const isOpen = panelEventId != null;
    if (isOpen && !panelWasOpenRef.current) {
      window.history.pushState({ panelOpen: true }, '');
    }
    panelWasOpenRef.current = isOpen;
  }, [panelEventId]);

  useEffect(() => {
    const onPopState = () => setPanelEventId(null);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function closePanel() {
    if (panelEventId != null) window.history.back();
  }

  return (
    <div className="relative w-screen h-dvh flex flex-col overflow-hidden">
      <Header year={selectedYear} count={yearEvents.length} />

      <MapContainer
        maxBounds={bounds} center={[45.9544979, 12.6596338]}
        zoom={14} maxZoom={18} minZoom={10}
        scrollWheelZoom={true}
        className="grow min-h-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          yearEvents.map((e) => (
            <EventMarker
              key={e.id}
              event={e}
              isSelected={e.id === selectedEventId}
              onClick={() => selectEvent(e, { openPanel: true })}
            />
          ))
        }
      </MapContainer>

      <BottomBar
        years={YEARS}
        countsByYear={COUNTS_BY_YEAR}
        selectedYear={selectedYear}
        yearEvents={yearEvents}
        selectedEventId={selectedEventId}
        onSelectYear={selectYear}
        onSelectEvent={(event) => selectEvent(event, { openPanel: true })}
      />

      <Panel mark={panelEvent} close={closePanel} />

    </div>
  )
}

export default App
