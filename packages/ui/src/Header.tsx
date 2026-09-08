import { eventCountLabel } from './dates';
import logo from './logo.svg';
import ThemeSelector from './ThemeSelector';

export default function Header({ year, count }: { year: number; count: number }) {
  return (
    <header className="flex-none h-14 flex items-center justify-between px-5 border-b border-border font-sans">
      <span className="flex items-center gap-2">
        <img src={logo} alt="" className="logo-invert h-6 w-6" />
        <span className="text-[15px] font-semibold text-ink">Naon Timeline</span>
      </span>
      <span className="flex items-center gap-3">
        <span className="text-xs text-muted">{year} · {eventCountLabel(count)}</span>
        <ThemeSelector />
      </span>
    </header>
  );
}
