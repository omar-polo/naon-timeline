import type { TimelineEvent } from './types';
import EventDetail from './EventDetail';

export default function DesktopPanel({ event, onClose }: { event: TimelineEvent; onClose: () => void }) {
  return (
    <div className="relative flex-none w-160 border-l border-border bg-white overflow-y-auto">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 p-2 bg-gray-200 hover:bg-gray-300 border border-solid border-gray-400 transition duration-300 rounded-full cursor-pointer"
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
