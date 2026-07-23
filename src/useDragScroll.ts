import { useRef, useState, type PointerEvent, type RefObject } from 'react';

const DRAG_THRESHOLD = 5;

export function useDragScroll<T extends HTMLElement>(): {
  ref: RefObject<T | null>;
  isDragging: boolean;
  onPointerDown: (e: PointerEvent<T>) => void;
  onPointerMove: (e: PointerEvent<T>) => void;
  onPointerUp: (e: PointerEvent<T>) => void;
  onPointerLeave: (e: PointerEvent<T>) => void;
} {
  const ref = useRef<T>(null);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const onPointerDown = (e: PointerEvent<T>) => {
    if (e.pointerType === 'touch' || !ref.current) return;
    // Don't capture the pointer yet: capturing here would redirect the
    // browser's synthesized click away from whatever child (chip/cell) was
    // actually pressed, breaking click-to-select. Only start "dragging" once
    // real movement is seen, in onPointerMove.
    drag.current = { active: true, startX: e.clientX, scrollLeft: ref.current.scrollLeft };
  };

  const onPointerMove = (e: PointerEvent<T>) => {
    if (!drag.current.active || !ref.current) return;
    const dx = e.clientX - drag.current.startX;
    if (!isDragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    ref.current.scrollLeft = drag.current.scrollLeft - dx;
  };

  const onPointerUp = () => {
    drag.current.active = false;
    setIsDragging(false);
  };

  return { ref, isDragging, onPointerDown, onPointerMove, onPointerUp, onPointerLeave: onPointerUp };
}
