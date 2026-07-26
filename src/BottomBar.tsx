import type { TimelineEvent } from './types';
import { formatChipDate } from './dates';
import YearStrip from './YearStrip';

export default function BottomBar({
  events,
  selectedYear,
  yearEvents,
  selectedEventId,
  onSelectEvent,
}: {
  events: TimelineEvent[];
  selectedYear: number;
  yearEvents: TimelineEvent[];
  selectedEventId: number | null;
  onSelectEvent: (event: TimelineEvent, opts?: { openSheet?: boolean }) => void;
}) {
  const hasEvents = yearEvents.length > 0;
  const selectedEvent = yearEvents.find((e) => e.id === selectedEventId);

  return (
    <div className="flex-none bg-white border-t border-border flex flex-col gap-2 pt-2.5 pb-4">
      <div className="px-4 text-[10px] text-muted">
        {selectedYear} · {hasEvents ? 'tocca un punto per selezionare' : 'nessun evento registrato'}
      </div>

      <YearStrip
        events={events}
        selectedEventId={selectedEventId}
        onSelectEvent={onSelectEvent}
      />

      {hasEvents && (
        <div className="px-4 flex justify-between">
          <span className="text-[9px] text-muted">Gen</span>
          <span className="text-[9px] font-bold" style={{ color: 'var(--color-accent)' }}>
            {selectedEvent && formatChipDate(selectedEvent)}
          </span>
          <span className="text-[9px] text-muted">Dic</span>
        </div>
      )}
    </div>
  );
}
