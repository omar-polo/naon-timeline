import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { Event } from '../../types';
import useDashboard from '../../state/useDashboard';
import useEvents from '../../queries/useEvents';
import useIsMobile from '../layout/useIsMobile';
import EventFilterBar from './EventFilterBar';
import EventListItem from './EventListItem';

const columnHelper = createColumnHelper<Event>();
const columns = [
  columnHelper.accessor('title', { header: 'Title' }),
  columnHelper.accessor('date', { header: 'Date' }),
  columnHelper.accessor('draft', { header: 'Status' }),
];

export default function EventsPage() {
  const { eventFilters, setEventFilters } = useDashboard();
  const { data: events, isLoading, error } = useEvents(eventFilters);
  const isMobile = useIsMobile();

  const list = events ?? [];
  const table = useReactTable({ data: list, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
      <EventFilterBar filters={eventFilters} onChange={setEventFilters} />

      {isLoading && <p className="text-[13px] text-muted">Loading events…</p>}
      {error && <p className="text-[13px] text-danger">Couldn&apos;t load events: {error.message}</p>}

      {!isLoading && !error && (isMobile ? (
        <div className="flex flex-col gap-3">
          {list.map((ev) => (
            <EventListItem key={ev.id} event={ev} isMobile />
          ))}
        </div>
      ) : (
        <table className="w-full overflow-hidden rounded-[10px] border border-border bg-panel">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wide text-muted"
              >
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
              <EventListItem key={row.original.id} event={row.original} isMobile={false} />
            ))}
          </tbody>
        </table>
      ))}
    </>
  );
}
