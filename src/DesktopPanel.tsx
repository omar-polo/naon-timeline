import type { TimelineEvent } from './types';
import EventDetail from './EventDetail';

export default function DesktopPanel({ event }: { event: TimelineEvent }) {
  return (
    <div className="flex-none w-160 border-l border-border bg-white overflow-y-auto">
      <div className="p-4">
        <EventDetail event={event} />
      </div>
    </div>
  );
}
