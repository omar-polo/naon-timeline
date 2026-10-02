import type { TimelineEvent } from './types';
import EventDetail from './EventDetail';

export default function DesktopPanel({ event, onClose }: { event: TimelineEvent; onClose: () => void }) {
  return (
    <div className="relative flex-none w-160 border-l border-border bg-panel overflow-y-auto">
      <button
        aria-label="Chiudi"
        onClick={onClose}
        // label-bg rather than the handoff's rgba(20,14,10,.6): that value is
        // left over from the warm palette, and this sits over a photo where a
        // warm cast would read as a mistake.
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full
          bg-label-bg/60 hover:bg-label-bg/82 text-white transition-colors duration-150 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" viewBox="0 0 24 24"
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
