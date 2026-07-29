import type { User } from '../../types';
import { Pill } from '@naon-timeline/ui';
import formatDate from '../../lib/formatDate';

export default function UserListItem({
  user,
  isMobile,
  onEdit,
}: {
  user: User;
  isMobile: boolean;
  onEdit: () => void;
}) {
  const roleLabel = user.role === 'admin' ? 'Admin' : 'User';
  const roleTone = user.role === 'admin' ? 'accent' : 'gray';

  if (isMobile) {
    return (
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full flex-col gap-2 rounded-[10px] border border-border bg-panel p-4 text-left"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{user.name}</span>
          <Pill label={roleLabel} tone={roleTone} />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11.5px] text-muted">
          <span>Created {formatDate(user.created)}</span>
          <span>Last login {formatDate(user.lastLogin)}</span>
        </div>
      </button>
    );
  }

  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit();
        }
      }}
      className="cursor-pointer border-b border-border text-[13px] last:border-b-0 hover:bg-page"
    >
      <td className="px-4 py-3 font-semibold">{user.name}</td>
      <td className="px-4 py-3">
        <Pill label={roleLabel} tone={roleTone} />
      </td>
      <td className="px-4 py-3 text-xs text-muted">{formatDate(user.created)}</td>
      <td className="px-4 py-3 text-xs text-muted">{formatDate(user.lastLogin)}</td>
    </tr>
  );
}
