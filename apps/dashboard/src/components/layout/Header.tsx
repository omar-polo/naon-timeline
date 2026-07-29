import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export default function Header({
  title,
  breadcrumbLabel,
  primaryAction,
  showHamburger,
  onToggleNav,
}: {
  title?: string;
  breadcrumbLabel?: string;
  primaryAction?: ReactNode;
  showHamburger: boolean;
  onToggleNav: () => void;
}) {
  return (
    <header className="flex h-[60px] flex-none items-center justify-between border-b border-border px-4 md:px-7">
      <span className="flex items-center gap-3">
        {showHamburger && (
          <button
            type="button"
            aria-label="Open navigation"
            onClick={onToggleNav}
            className="cursor-pointer rounded-md p-1 text-lg"
          >
            &#9776;
          </button>
        )}
        {breadcrumbLabel ? (
          <span className="flex items-baseline gap-1.5 text-base">
            <Link to="/events" className="font-semibold text-muted">
              Events
            </Link>
            <span className="text-[oklch(70%_0.01_60)]">/</span>
            <span className="max-w-[360px] overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-ink">
              {breadcrumbLabel}
            </span>
          </span>
        ) : (
          <span className="text-[17px] font-semibold">{title}</span>
        )}
      </span>
      {primaryAction}
    </header>
  );
}
