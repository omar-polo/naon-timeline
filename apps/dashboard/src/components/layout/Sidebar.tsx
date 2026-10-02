import { Link, useNavigate } from '@tanstack/react-router';
import logo from '../../logo-terracotta.svg';
import useLogout from '../../queries/useLogout';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', adminOnly: false },
  { to: '/events', label: 'Events', adminOnly: false },
  { to: '/users', label: 'Users', adminOnly: true },
] as const;

export default function Sidebar({
  userName,
  isAdmin,
  onNavigate,
}: {
  userName: string;
  isAdmin: boolean;
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const navItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="flex h-full flex-col p-3.5">
      <div className="flex items-center gap-2.5 px-2 pb-6">
        <img src={logo} alt="" className="h-7 w-7 flex-none rounded-[7px] object-cover" />
        <span className="whitespace-nowrap text-sm font-bold tracking-tight">Naon Dashboard</span>
      </div>
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => (
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
                  className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-accent' : 'bg-dot-inactive'}`}
                />
                <span>{item.label}</span>
              </>
            )}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-2.5 border-t border-border px-2 pt-2.5 text-[11px] text-muted">
        <div>
          <div>
            Signed in as <strong className="text-ink">{userName}</strong>
          </div>
          <button
            type="button"
            onClick={() => logoutMutation.mutate(undefined, { onSuccess: () => navigate({ to: '/login' }) })}
            className="mt-1 cursor-pointer font-medium text-muted underline-offset-2 hover:underline"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
