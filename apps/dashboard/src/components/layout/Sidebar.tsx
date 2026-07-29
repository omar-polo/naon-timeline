import { Link } from '@tanstack/react-router';
import logo from '../../logo-terracotta.svg';

const NAV_ITEMS = [
  { to: '/', label: 'Overview' },
  { to: '/events', label: 'Events' },
  { to: '/users', label: 'Users' },
] as const;

export default function Sidebar({
  adminName,
  onNavigate,
}: {
  adminName: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col p-3.5">
      <div className="flex items-center gap-2.5 px-2 pb-6">
        <img src={logo} alt="" className="h-7 w-7 flex-none rounded-[7px] object-cover" />
        <span className="whitespace-nowrap text-sm font-bold tracking-tight">Naon Dashboard</span>
      </div>
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            activeOptions={{ exact: item.to === '/' }}
            className="flex items-center gap-2.5 rounded-[7px] px-2.5 py-2.5 text-[13.5px] font-medium text-muted
              data-[status=active]:bg-accent-bg data-[status=active]:font-semibold data-[status=active]:text-ink"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-accent' : 'bg-[oklch(80%_0.01_70)]'}`}
                />
                <span>{item.label}</span>
              </>
            )}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-border px-2 pt-2.5 text-[11px] text-muted">
        Signed in as <strong className="text-ink">{adminName}</strong>
      </div>
    </div>
  );
}
