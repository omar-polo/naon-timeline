import type { TimelineEvent } from './types';
import { formatChipDate } from './dates';
import { useDragScroll } from './useDragScroll';

export default function ChipRail({
  year,
  events,
  selectedEventId,
  onSelect,
}: {
  year: number;
  events: TimelineEvent[];
  selectedEventId: number | null;
  onSelect: (event: TimelineEvent) => void;
}) {
  const { ref, isDragging, onPointerDown, onPointerMove, onPointerUp, onPointerLeave } =
    useDragScroll<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`flex gap-1.5 overflow-x-auto px-4 min-h-[38px] select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      {events.length === 0 && (
        <div className="flex-none self-center bg-[oklch(96%_0.008_250)] border border-dashed border-[oklch(82%_0.01_250)] rounded-full px-3.5 py-1.5">
          <span className="text-xs italic text-muted">Nessun evento registrato nel {year}</span>
        </div>
      )}
      {events.map((e) => {
        const active = e.id === selectedEventId;
        return (
          <div
            key={e.id}
            onClick={() => onSelect(e)}
            className="flex-none flex flex-col gap-px rounded-xl py-1.5 px-3 max-w-[180px] cursor-pointer"
            style={{
              background: active ? 'var(--color-accent-bg)' : 'oklch(96% 0.005 250)',
              boxShadow: active ? 'inset 0 0 0 1.5px var(--color-accent)' : 'none',
            }}
          >
            <span
              className="text-[12px] font-bold"
              style={{ color: active ? 'var(--color-accent)' : 'var(--color-muted)' }}
            >
              {formatChipDate(e)}
            </span>
            <span className="text-[13px] text-ink whitespace-nowrap overflow-hidden text-ellipsis">
              {e.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
