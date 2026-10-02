import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { LatLngBounds } from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  type TimelineEvent,
  compareEvents,
  Header,
  BottomBar,
  DesktopPanel,
  MobileSheet,
  EventMarker,
} from '@naon-timeline/ui';
import useEvents from './useEvents';

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

export default function App() {
  const { events, error } = useEvents();

  if (error) {
    return (
      <p className="flex h-dvh items-center justify-center bg-page text-sm text-danger">
        Couldn&apos;t load events: {error}
      </p>
    );
  }
  if (!events) {
    return <p className="flex h-dvh items-center justify-center bg-page text-sm text-muted">Loading…</p>;
  }

  return <Timeline events={events} />;
}

function Timeline({ events }: { events: TimelineEvent[] }) {
  const eventsByYear = useMemo(() => buildEventsByYear(events), [events]);
  const yearStart = useMemo(() => Math.min(...events.map((e) => e.year)), [events]);

  const [selectedYear, setSelectedYear] = useState<number>(yearStart);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(
    () => eventsByYear.get(yearStart)?.[0]?.id ?? null
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const bounds = new LatLngBounds([45.995334,12.5956731], [45.918336, 12.7074471])

  const yearEvents = eventsByYear.get(selectedYear) ?? [];
  const selectedEvent = selectedEventId != null ? events.find((e) => e.id === selectedEventId) ?? null : null;

  const showPanel = !isMobile && selectedEvent != null;
  const showSheet = isMobile && sheetOpen && selectedEvent != null;

  function selectEvent(event: TimelineEvent, opts?: { openSheet?: boolean }) {
    setSelectedYear(event.year);
    setSelectedEventId(event.id);
    // Gesture-driven selection (scrolling/dragging/arrow-keying through the
    // strip) stays lightweight - opening the full-screen mobile sheet on
    // every step would block further interaction with the strip beneath
    // its scrim. Only an explicit action (tapping a dot, tapping a marker)
    // opens it.
    if (opts?.openSheet) setSheetOpen(true);
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
    <div className="relative w-screen h-dvh flex flex-col overflow-hidden bg-page">
      <Header />

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
                onClick={() => selectEvent(e, { openSheet: true })}
              />
            ))
          }
        </MapContainer>

        {showPanel && selectedEvent && <DesktopPanel event={selectedEvent} onClose={deselectEvent} />}

        {showSheet && selectedEvent && <MobileSheet event={selectedEvent} onClose={closeSheet} />}
      </div>

      <BottomBar
        events={events}
        selectedYear={selectedYear}
        yearEvents={yearEvents}
        selectedEventId={selectedEventId}
        onSelectEvent={selectEvent}
      />
    </div>
  )
}
