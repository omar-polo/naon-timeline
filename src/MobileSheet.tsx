import type { TimelineEvent } from './types';
import EventDetail from './EventDetail';

export default function MobileSheet({ event, onClose }: { event: TimelineEvent; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-[10000] flex items-end bg-black/15" onClick={onClose}>
      <div
        className="w-full max-h-[66%] flex flex-col overflow-hidden rounded-t-2xl bg-panel shadow-[0_-6px_20px_rgba(0,0,0,.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-8 h-1 rounded-full self-center my-2.5" style={{ background: 'oklch(85% 0.01 60)' }} />
        <div className="overflow-y-auto p-4 pt-2">
          <EventDetail event={event} />
        </div>
      </div>
    </div>
  );
}
