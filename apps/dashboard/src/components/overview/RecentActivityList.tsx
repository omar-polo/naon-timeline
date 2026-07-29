import type { User } from '../../types';
import formatDate from '../../lib/formatDate';

export default function RecentActivityList({ users }: { users: User[] }) {
  const recent = users
    .slice()
    .sort((a, b) => b.lastLogin.localeCompare(a.lastLogin))
    .slice(0, 5);

  return (
    <>
      <div className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-muted">Recent activity</div>
      <div className="overflow-hidden rounded-[10px] border border-border bg-panel">
        {recent.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0"
          >
            <span className="text-[13px]">{u.name}</span>
            <span className="text-xs text-muted">
              {u.lastLogin === '—' ? 'never logged in' : `last login ${formatDate(u.lastLogin)}`}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
