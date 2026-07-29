import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { User } from '../../types';
import useDashboard from '../../state/useDashboard';
import useIsMobile from '../layout/useIsMobile';
import UserListItem from './UserListItem';
import UserFormModal from './UserFormModal';
import ResetPasswordModal from './ResetPasswordModal';

const columnHelper = createColumnHelper<User>();
const columns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('role', { header: 'Role' }),
  columnHelper.accessor('created', { header: 'Created' }),
  columnHelper.accessor('lastLogin', { header: 'Last login' }),
];

export default function UsersPage() {
  const { users, modal, openModal } = useDashboard();
  const isMobile = useIsMobile();
  const table = useReactTable({ data: users, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-3">
          {users.map((u) => (
            <UserListItem key={u.id} user={u} isMobile onEdit={() => openModal({ kind: 'userForm', mode: 'edit', userId: u.id })} />
          ))}
        </div>
      ) : (
        <table className="w-full overflow-hidden rounded-[10px] border border-border bg-panel">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wide text-muted">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <UserListItem
                key={row.original.id}
                user={row.original}
                isMobile={false}
                onEdit={() => openModal({ kind: 'userForm', mode: 'edit', userId: row.original.id })}
              />
            ))}
          </tbody>
        </table>
      )}

      {modal?.kind === 'userForm' && <UserFormModal modal={modal} />}
      {modal?.kind === 'resetPassword' && <ResetPasswordModal modal={modal} />}
    </>
  );
}
