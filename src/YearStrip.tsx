import { useCallback, useEffect, useRef, useState } from "react";

interface YearStripProps {
  value: number;
  onChange: (year: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Year = ({current, year, width, onChange} : {current: number, year: number, width: number, onChange?: (year: number) => void}) => (
  <div
    className="shrink-0 flex items-center justify-center text-sm tabular-nums transition-colors"
    style={{ width: width, scrollSnapAlign: "center" }}
    onClick={() => onChange && onChange(year)}
  >
    <span
      className={
        year === current
          ? "text-black font-bold text-lg"
          : "text-gray-500 hover:text-gray-300"
      }
    >
      {year}
    </span>
  </div>
)

export default function YearStrip({
  value,
  onChange,
  min = 1950,
  max = 2026,
  step = 1,
}: YearStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);

  const years = Array.from(
    { length: (max - min + step) / step },
    (_, i) => min + i * step
  );

  // ── Derive layout from container width ────────────────────────
  const itemW = Math.max(40, Math.min(72, containerW / 7)); // 7 items visible as baseline
  const visibleCount = Math.floor(containerW / itemW) || 1;
  const spacerW = (Math.floor(visibleCount / 2) * itemW); // center the selected item

  const snapToStep = useCallback(
    (y: number) => {
      const clamped = Math.max(min, Math.min(max, y));
      return min + Math.round((clamped - min) / step) * step;
    },
    [min, max, step]
  );

  useEffect(() => {
    const snapped = snapToStep(value);
    if (snapped !== value) onChange(snapped);
    // only on mount / step change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // ── Observe parent size ───────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Scroll to selected year ───────────────────────────────────
  useEffect(() => {
    if (!stripRef.current || dragging) return;
    const idx = years.indexOf(value);
    if (idx >= 0) stripRef.current.scrollTo({ left: idx * itemW, behavior: "smooth" });
  }, [value, years, itemW, dragging]);

  // ── Drag handlers ─────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    startXRef.current = e.clientX;
    scrollStartRef.current = stripRef.current!.scrollLeft;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - startXRef.current;
    stripRef.current!.scrollLeft = scrollStartRef.current - dx;
  };

  const onPointerUp = useCallback(() => {
    setDragging(false);
    if (!stripRef.current) return;
    const idx = Math.round(stripRef.current.scrollLeft / itemW);
    const clampedIdx = Math.max(0, Math.min(years.length - 1, idx));
    const snapped = years[clampedIdx];
    stripRef.current.scrollTo({ left: clampedIdx * itemW, behavior: "smooth" });
    if (snapped !== value) onChange(snapped);
  }, [itemW, years, value, onChange]);

  // ── Wheel handler ─────────────────────────────────────────────
  const onWheel = (e: React.WheelEvent) => {
    const direction = e.deltaY > 0 ? -1 : 1;
    const next = snapToStep(value + direction * step);
    if (next !== value) onChange(next);
  };

  // ── Keyboard handler ──────────────────────────────────────────
  const onKeyDown = (e: React.KeyboardEvent) => {
    let steps = 0;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") steps = 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") steps = -1;
    if (e.shiftKey) step *= 5;
    if (!step) return;
    const next = snapToStep(value + steps * step)
    if (next !== value) onChange(next);
  };

  // ── Snap after momentum scroll ends ────────────────────────────
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const onScroll = useCallback(() => {
    if (dragging) return;
    if (scrollTimeoutRef.current != null)
      clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      if (!stripRef.current) return;
      const idx = Math.round(stripRef.current.scrollLeft / itemW);
      const clampedIdx = Math.max(0, Math.min(years.length - 1, idx));
      const snapped = years[clampedIdx];
      stripRef.current.scrollTo({ left: clampedIdx * itemW, behavior: "smooth" });
      if (snapped !== value) onChange(snapped);
    }, 80); // wait for momentum to settle
  }, [dragging, itemW, years, value, onChange]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current != null)
	clearTimeout(scrollTimeoutRef.current);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full relative overflow-visible"
      style={{ touchAction: 'pan-y' }}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label="Select year"
    >
      {/* ── Edge fade masks ──────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-10 flex">
        <div
          className="shrink-0 bg-gradient-to-r from-gray-200 to-transparent"
          style={{ width: spacerW }}
        />
        <div className="flex-1" />
        <div
          className="shrink-0 bg-gradient-to-l from-gray-200 to-transparent"
          style={{ width: spacerW }}
        />
      </div>

      {/* ── Center indicator ─────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-y-0 z-20 -translate-x-1/2 border-2 border-blue-500 rounded-lg"
        style={{
          left: "50%",
          width: itemW,
        }}
      />

      {/* ── Scrollable strip ─────────────────────────────────── */}
      <div
        ref={stripRef}
        className="flex overflow-x-scroll scrollbar-none py-3 cursor-grab active:cursor-grabbing"
        style={{ scrollSnapType: "x mandatory" }}
	onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Left spacer */}
        <div className="shrink-0" style={{ width: spacerW }} />

        {years.map((y) => (
	  <Year key={y} current={value} year={y} width={itemW} onChange={onChange} />
        ))}

	<Year year={max + step} current={value} width={itemW} />

        {/* Right spacer */}
        <div className="shrink-0" style={{ width: spacerW }} />
      </div>
    </div>
  );
}
