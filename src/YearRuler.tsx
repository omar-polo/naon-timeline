import { useEffect, useRef } from 'react';
import { useDragScroll } from './useDragScroll';

export default function YearRuler({
  years,
  countsByYear,
  selectedYear,
  onSelect,
}: {
  years: number[];
  countsByYear: Map<number, number>;
  selectedYear: number;
  onSelect: (year: number) => void;
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
      className={`flex items-end gap-1 overflow-x-auto px-4 pb-1 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      {years.map((year) => {
        const count = countsByYear.get(year) ?? 0;
        const active = year === selectedYear;
        const width = count === 0 ? 14 : Math.min(14 + count * 16, 78);
        const showLabel = active || width >= 28 || year % 5 === 0;
        const dots = Array.from({ length: Math.min(count, 4) });

        return (
          <div
            key={year}
            data-year={year}
            onClick={() => onSelect(year)}
            className="flex-none flex flex-col items-center gap-1 cursor-pointer"
          >
            <div
              className="flex items-center justify-center gap-0.5 transition-all"
              style={{
                width,
                height: 32,
                borderRadius: count > 0 ? 5 : 3,
                background: active ? 'var(--color-accent-bg)' : 'var(--color-neutral-bg)',
                boxShadow: active ? 'inset 0 0 0 1.5px var(--color-accent)' : 'none',
              }}
            >
              {dots.map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: active ? 'var(--color-accent)' : 'var(--color-neutral-dot)' }}
                />
              ))}
            </div>
            {showLabel && (
              <div
                className="text-[11px]"
                style={{
                  fontWeight: active ? 700 : 400,
                  color: active ? 'var(--color-accent)' : 'var(--color-muted)',
                }}
              >
                {year}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
