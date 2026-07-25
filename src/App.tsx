import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
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
import DesktopPanel from './DesktopPanel';
import MobileSheet from './MobileSheet';

const events = eventsData as TimelineEvent[];

const YEAR_START = 1840;
const YEAR_END = 1866;
const YEARS = Array.from({ length: YEAR_END - YEAR_START + 1 }, (_, i) => YEAR_START + i);
const MOBILE_BREAKPOINT = 720;

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

// The map's available width changes whenever the desktop side panel
// mounts/unmounts or the mobile breakpoint flips, neither of which fires a
// native `window resize` event that Leaflet listens for on its own.
const MapResize = ({ dep }: { dep: unknown }) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map, dep]);
  return null;
};

function App() {
  const [selectedYear, setSelectedYear] = useState<number>(YEAR_START);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(
    () => EVENTS_BY_YEAR.get(YEAR_START)?.[0]?.id ?? null
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const bounds = new LatLngBounds([45.995334,12.5956731], [45.918336, 12.7074471])

  const yearEvents = EVENTS_BY_YEAR.get(selectedYear) ?? [];
  const selectedEvent = selectedEventId != null ? events.find((e) => e.id === selectedEventId) ?? null : null;

  const showPanel = !isMobile && selectedEvent != null;
  const showSheet = isMobile && sheetOpen && selectedEvent != null;

  function selectYear(year: number) {
    const evs = EVENTS_BY_YEAR.get(year) ?? [];
    setSelectedYear(year);
    setSelectedEventId(evs[0]?.id ?? null);
  }

  function selectEvent(event: TimelineEvent) {
    setSelectedYear(event.year);
    setSelectedEventId(event.id);
    setSheetOpen(true);
  }

  function deselectEvent() {
    setSelectedEventId(null);
  }

  // Let the browser's back button close the sheet instead of leaving the
  // page: push a history entry when it opens, and let popstate be the only
  // place that actually clears sheetOpen (closeSheet below just triggers
  // that via history.back(), so the pushed entry never dangles).
  const sheetWasOpenRef = useRef(false);
  useEffect(() => {
    if (showSheet && !sheetWasOpenRef.current) {
      window.history.pushState({ sheetOpen: true }, '');
    }
    sheetWasOpenRef.current = showSheet;
  }, [showSheet]);

  useEffect(() => {
    const onPopState = () => setSheetOpen(false);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function closeSheet() {
    window.history.back();
  }

  return (
    <div className="relative w-screen h-dvh flex flex-col overflow-hidden">
      <Header year={selectedYear} count={yearEvents.length} />

      <div className="relative flex-1 min-h-0 flex overflow-hidden">
        <MapContainer
          maxBounds={bounds} center={[45.9544979, 12.6596338]}
          zoom={14} maxZoom={18} minZoom={10}
          scrollWheelZoom={true}
          className="flex-1 min-h-0"
        >
          <MapResize dep={showPanel} />
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
                onClick={() => selectEvent(e)}
              />
            ))
          }
        </MapContainer>

        {showPanel && selectedEvent && <DesktopPanel event={selectedEvent} onClose={deselectEvent} />}
      </div>

      <BottomBar
        years={YEARS}
        countsByYear={COUNTS_BY_YEAR}
        selectedYear={selectedYear}
        yearEvents={yearEvents}
        selectedEventId={selectedEventId}
        onSelectYear={selectYear}
        onSelectEvent={selectEvent}
      />

      {showSheet && selectedEvent && <MobileSheet event={selectedEvent} onClose={closeSheet} />}
    </div>
  )
}

export default App
