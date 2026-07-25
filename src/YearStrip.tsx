import { useEffect, useRef } from 'react';
import type { TimelineEvent } from './types';
import { useDragScroll } from './useDragScroll';

export default function YearStrip({
  years,
  countsByYear,
  selectedYear,
  yearEvents,
  selectedEventId,
  onSelectYear,
  onSelectEvent,
}: {
  years: number[];
  countsByYear: Map<number, number>;
  selectedYear: number;
  yearEvents: TimelineEvent[];
  selectedEventId: number | null;
  onSelectYear: (year: number) => void;
  onSelectEvent: (event: TimelineEvent) => void;
}) {
  const { ref, isDragging, onPointerDown, onPointerMove, onPointerUp, onPointerLeave } =
    useDragScroll<HTMLDivElement>();
  const mounted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const cell = el?.querySelector<HTMLElement>(`[data-year="${selectedYear}"]`);
    if (!el || !cell) return;
    const target = cell.offsetLeft + cell.offsetWidth / 2 - el.clientWidth / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: mounted.current ? 'smooth' : 'auto' });
    mounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  return (
    <div
      ref={ref}
      className={`flex items-center gap-0.5 overflow-x-auto px-4 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      {years.map((year) => {
        const active = year === selectedYear;
        const count = countsByYear.get(year) ?? 0;

        if (active) {
          const width = Math.max(34, Math.min(26 + count * 22, 150));
          return (
            <div
              key={year}
              data-year={year}
              onClick={() => onSelectYear(year)}
              className="flex-none flex items-center justify-around gap-s4 px-4 rounded cursor-pointer transition-all"
              style={{
                width,
                height: 30,
                background: 'var(--color-accent-bg)',
                boxShadow: 'inset 0 0 0 1.5px var(--color-accent)',
              }}
            >
              {yearEvents.map((e) => {
                const isSelectedEvent = e.id === selectedEventId;
                return (
                  <div
                    key={e.id}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onSelectEvent(e);
                    }}
                    className="rounded-full cursor-pointer"
                    style={{
                      width: isSelectedEvent ? 10 : 8,
                      height: isSelectedEvent ? 10 : 8,
                      background: isSelectedEvent ? 'var(--color-accent)' : 'var(--color-neutral-dot)',
                    }}
                  />
                );
              })}
            </div>
          );
        }

        if (count > 0) {
          return (
            <div
              key={year}
              data-year={year}
              onClick={() => onSelectYear(year)}
              className="flex-none flex items-center justify-center rounded cursor-pointer transition-all"
              style={{ width: 22, height: 30, background: 'var(--color-neutral-bg)' }}
            >
              <span className="text-[11px] text-muted">{`'${String(year).slice(2)}`}</span>
            </div>
          );
        }

        return (
          <div
            key={year}
            data-year={year}
            className="flex-none transition-all rounded-sm"
            style={{ width: 8, height: 30, background: 'var(--color-neutral-bg)' }}
          />
        );
      })}
    </div>
  );
}
