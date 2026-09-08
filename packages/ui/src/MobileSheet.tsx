import type { TimelineEvent } from './types';
import EventDetail from './EventDetail';

export default function MobileSheet({ event, onClose }: { event: TimelineEvent; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-[10000] flex items-end bg-timeline-scrim" onClick={onClose}>
      <div
        className="w-full max-h-[80%] flex flex-col overflow-hidden rounded-t-2xl bg-panel shadow-[var(--shadow-sheet)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-8 h-1 rounded-full self-center my-2.5 bg-border" />
        <div className="overflow-y-auto p-4 pt-2">
          <EventDetail event={event} />
        </div>
      </div>
    </div>
  );
}
