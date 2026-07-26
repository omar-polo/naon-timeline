import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { TimelineEvent } from './types';

const STEP_WIDTH = 40;
// Fixed width for a year that isn't the current one - it shows just its
// year number, not its individual events, regardless of how many it has.
const COLLAPSED_WIDTH = 34;
// Steps rendered on each side of the current one. Only this small window
// ever touches the DOM, regardless of how many events/years exist overall -
// this is what lets the strip stay cheap at a millennium's worth of data.
const WINDOW_RADIUS = 14;
const WHEEL_COMMIT_DELAY = 130;
const DRAG_THRESHOLD = 5;

// Consecutive same-year events (the window is date-sorted, so a year's
// events are always contiguous) get clustered into one visual group -
// each dot cell still occupies exactly STEP_WIDTH, so a group's rendered
// width is naturally count*STEP_WIDTH and the transform offset math below
// doesn't need to know grouping exists at all.
function groupByYear(events: TimelineEvent[]): { year: number; events: TimelineEvent[] }[] {
  const groups: { year: number; events: TimelineEvent[] }[] = [];
  for (const event of events) {
    const last = groups[groups.length - 1];
    if (last && last.year === event.year) last.events.push(event);
    else groups.push({ year: event.year, events: [event] });
  }
  return groups;
}

export default function YearStrip({
  events,
  selectedEventId,
  onSelectEvent,
}: {
  events: TimelineEvent[];
  selectedEventId: number | null;
  onSelectEvent: (event: TimelineEvent, opts?: { openSheet?: boolean }) => void;
}) {
  const currentIndex = Math.max(0, events.findIndex((e) => e.id === selectedEventId));

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Live pixel offset on top of the base position implied by currentIndex -
  // the sub-step remainder that hasn't crossed a full STEP_WIDTH yet, for
  // smooth visual following. Whole steps crossed during a gesture commit
  // immediately (see commitSteps), so the expand/collapse of a year happens
  // live as you pass through it, not just once the gesture ends.
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef({ active: false, startX: 0, committedSteps: 0, lastOffset: 0 });
  const wheelAccum = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mirrors currentIndex, but can be advanced synchronously multiple times
  // within a single event handler (e.g. a fast drag crossing several
  // events, or several whole steps in one wheel tick) without waiting for
  // React to re-render - reading currentIndex directly there would use a
  // stale value and each call would compute the same "next" index instead
  // of compounding.
  const pendingIndexRef = useRef(currentIndex);
  useEffect(() => {
    pendingIndexRef.current = currentIndex;
  });

  function commitSteps(delta: number) {
    if (delta === 0) return;
    const dir = delta > 0 ? 1 : -1;
    for (let i = 0; i < Math.abs(delta); i++) {
      const next = Math.max(0, Math.min(events.length - 1, pendingIndexRef.current + dir));
      if (next === pendingIndexRef.current) break;
      pendingIndexRef.current = next;
      const nextEvent = events[next];
      if (nextEvent) onSelectEvent(nextEvent);
    }
  }

  // Wheel/trackpad input is handled via a native, non-passive listener:
  // React attaches onWheel as a passive listener by default, which would
  // silently ignore preventDefault and let the page/ancestors also try to
  // scroll alongside our own handling.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      wheelAccum.current += delta;
      while (Math.abs(wheelAccum.current) >= STEP_WIDTH) {
        const dir = wheelAccum.current > 0 ? 1 : -1;
        commitSteps(dir);
        wheelAccum.current -= dir * STEP_WIDTH;
      }
      setDragOffset(-wheelAccum.current);
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => {
        wheelAccum.current = 0;
        setDragOffset(0);
      }, WHEEL_COMMIT_DELAY);
    }
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    drag.current = { active: true, startX: e.clientX, committedSteps: 0, lastOffset: 0 };
    // Don't capture the pointer yet: capturing here would redirect the
    // browser's synthesized click away from whatever dot was actually
    // tapped, breaking click-to-select. Only start "dragging" - and only
    // then capture - once real movement is seen, in onPointerMove.
  }
  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const rawOffset = e.clientX - drag.current.startX;
    if (!isDragging) {
      if (Math.abs(rawOffset) < DRAG_THRESHOLD) return;
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const totalSteps = Math.trunc(-rawOffset / STEP_WIDTH);
    const diff = totalSteps - drag.current.committedSteps;
    if (diff !== 0) {
      commitSteps(diff);
      drag.current.committedSteps = totalSteps;
    }
    const remainder = rawOffset + totalSteps * STEP_WIDTH;
    drag.current.lastOffset = remainder;
    setDragOffset(remainder);
  }
  function onPointerUp() {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (isDragging) {
      setIsDragging(false);
      // Snap any final sub-step remainder to the nearest step (rounding,
      // not truncating, so releasing just past halfway completes it).
      commitSteps(Math.round(-drag.current.lastOffset / STEP_WIDTH));
      setDragOffset(0);
    }
  }

  const windowStart = Math.max(0, currentIndex - WINDOW_RADIUS);
  const windowEnd = Math.min(events.length, currentIndex + WINDOW_RADIUS + 1);
  const windowEvents = useMemo(
    () => events.slice(windowStart, windowEnd),
    [events, windowStart, windowEnd]
  );

  // Only the current year expands to show its individual events (each at a
  // fixed STEP_WIDTH); every other visible year collapses to a compact,
  // fixed-width cell showing just its year - so rendered widths vary per
  // group and the base offset has to be the cumulative sum up to the
  // current dot, not a simple index*STEP_WIDTH. Gesture-to-step conversion
  // elsewhere deliberately keeps using the fixed STEP_WIDTH regardless -
  // how far you need to drag to move one event stays constant no matter
  // how much screen space neighboring collapsed years take up.
  const windowGroups = useMemo(() => {
    return groupByYear(windowEvents).reduce<
      Array<{ year: number; events: TimelineEvent[]; isCurrentGroup: boolean; width: number; startOffset: number }>
    >((acc, group) => {
      const isCurrentGroup = group.events.some((e) => e.id === selectedEventId);
      const width = isCurrentGroup ? group.events.length * STEP_WIDTH : COLLAPSED_WIDTH;
      const prev = acc[acc.length - 1];
      const startOffset = prev ? prev.startOffset + prev.width : 0;
      return [...acc, { ...group, isCurrentGroup, width, startOffset }];
    }, []);
  }, [windowEvents, selectedEventId]);

  const currentDotCenter = (() => {
    for (const g of windowGroups) {
      if (g.isCurrentGroup) {
        const idx = g.events.findIndex((e) => e.id === selectedEventId);
        return g.startOffset + idx * STEP_WIDTH + STEP_WIDTH / 2;
      }
    }
    return 0;
  })();

  const baseOffset = containerWidth / 2 - currentDotCenter;

  return (
    <div
      ref={containerRef}
      className="relative h-[46px] overflow-hidden select-none outline-none"
      style={{ touchAction: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
      tabIndex={0}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={events.length - 1}
      aria-valuenow={currentIndex}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') commitSteps(1);
        else if (e.key === 'ArrowLeft') commitSteps(-1);
      }}
    >
      <div
        className="absolute top-0 left-0 flex items-center h-full"
        style={{
          transform: `translateX(${baseOffset + dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {windowGroups.map((group) => {
          const key = `y${group.year}-${group.events[0].id}`;

          if (!group.isCurrentGroup) {
            return (
              <div
                key={key}
                onClick={() => onSelectEvent(group.events[0], { openSheet: true })}
                className="flex-none flex items-center justify-center rounded cursor-pointer transition-all"
                style={{ width: group.width, height: 30, background: 'var(--color-neutral-bg)' }}
              >
                <span className="text-[11px] text-muted">{group.year}</span>
              </div>
            );
          }

          return (
            <div
              key={key}
              className="flex items-center justify-around rounded transition-all"
              style={{
                width: group.width,
                height: 30,
                background: 'var(--color-accent-bg)',
                boxShadow: 'inset 0 0 0 1.5px var(--color-accent)',
              }}
            >
              {group.events.map((event) => {
                const isCurrent = event.id === selectedEventId;
                return (
                  <div
                    key={event.id}
                    onClick={() => onSelectEvent(event, { openSheet: true })}
                    className="flex-none flex items-center justify-center cursor-pointer"
                    style={{ width: STEP_WIDTH, height: 30 }}
                  >
                    <div
                      className="rounded-full transition-all"
                      style={{
                        width: isCurrent ? 12 : 8,
                        height: isCurrent ? 12 : 8,
                        background: isCurrent ? 'var(--color-accent)' : 'var(--color-neutral-dot)',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
