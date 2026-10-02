import { useLayoutEffect, useRef } from 'react';

import type { TimelineEvent } from './types';
import EventDetail from './EventDetail';

export default function DesktopPanel({ event, onClose }: { event: TimelineEvent; onClose: () => void }) {
  // The panel stays mounted across event switches, so the scroll offset of
  // the previous event would carry over into the next one's text.
  const scrollRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [event.id]);

  return (
    <div ref={scrollRef} className="relative flex-none w-160 border-l border-border bg-panel overflow-y-auto">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 p-2 bg-neutral-bg hover:opacity-70 border border-solid border-border text-ink transition duration-300 rounded-full cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div className="p-4 pt-16">
        <EventDetail event={event} />
      </div>
    </div>
  );
}
