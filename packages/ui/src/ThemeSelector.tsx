import { useRef } from 'react';
import useThemeMode from './useThemeMode';
import type { ThemeMode } from './themeModeContextInstance';

const OPTIONS: { key: ThemeMode; label: string }[] = [
  { key: 'system', label: 'Auto' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
];

// Three-state segmented control (Auto/Light/Dark). role="radiogroup" +
// role="radio" with a roving tabindex, so arrow keys move the selection and
// screen readers announce it as a radio group, not three plain buttons.
export default function ThemeSelector({ className = '' }: { className?: string }) {
  const { mode, setMode } = useThemeMode();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function moveSelection(delta: number) {
    const currentIndex = OPTIONS.findIndex((o) => o.key === mode);
    const nextIndex = (currentIndex + delta + OPTIONS.length) % OPTIONS.length;
    setMode(OPTIONS[nextIndex].key);
    buttonRefs.current[nextIndex]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={`flex overflow-hidden rounded-[7px] border border-border bg-page text-[11px] font-semibold ${className}`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          moveSelection(1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          moveSelection(-1);
        }
      }}
    >
      {OPTIONS.map((option, index) => {
        const selected = mode === option.key;
        return (
          <button
            key={option.key}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => setMode(option.key)}
            className={`flex-1 cursor-pointer px-2 py-1.5 text-center
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
              ${selected ? 'bg-accent-bg text-accent' : 'text-muted hover:text-ink'}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
