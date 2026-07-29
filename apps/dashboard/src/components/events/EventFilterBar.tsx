import { ToggleButtonGroup, ToggleButton, TextField, Input } from 'react-aria-components';
import type { EventFilters, EventStatusFilter } from '../../types';

const SEGMENTS: { key: EventStatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Draft' },
];

export default function EventFilterBar({
  filters,
  onChange,
}: {
  filters: EventFilters;
  onChange: (patch: Partial<EventFilters>) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <TextField
        aria-label="Search title or description"
        value={filters.search}
        onChange={(value) => onChange({ search: value })}
        className="min-w-[240px] flex-1"
      >
        <Input
          placeholder="Search title or description..."
          className="w-full rounded-[7px] border border-border bg-white px-2.5 py-2 text-[12.5px]"
        />
      </TextField>

      <ToggleButtonGroup
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[filters.status]}
        onSelectionChange={(keys) => {
          const [key] = [...keys];
          if (key) onChange({ status: key as EventStatusFilter });
        }}
        aria-label="Filter by status"
        className="flex flex-none overflow-hidden rounded-[7px] border border-border bg-white text-[11.5px] font-semibold"
      >
        {SEGMENTS.map((seg) => (
          <ToggleButton
            key={seg.key}
            id={seg.key}
            className="cursor-pointer px-2.5 py-[7px] text-muted data-[selected]:bg-accent-bg data-[selected]:text-accent"
          >
            {seg.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <input
        type="number"
        placeholder="From year"
        value={filters.yearFrom}
        onChange={(e) => onChange({ yearFrom: e.target.value })}
        className="w-[88px] flex-none rounded-[7px] border border-border px-2 py-2 text-center text-xs"
      />
      <span className="flex-none text-xs text-muted">&ndash;</span>
      <input
        type="number"
        placeholder="To year"
        value={filters.yearTo}
        onChange={(e) => onChange({ yearTo: e.target.value })}
        className="w-[88px] flex-none rounded-[7px] border border-border px-2 py-2 text-center text-xs"
      />
    </div>
  );
}
