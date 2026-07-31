import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/apiClient';
import { toEvent } from './eventMapper';
import useDebouncedValue from '../lib/useDebouncedValue';
import type { EventFilters, EventStatusFilter } from '../types';

// dashboard's filter vocabulary ('all'/'draft') doesn't match the backend's
// ('any'/'drafted') - the rest of the values happen to line up already.
const STATUS_TO_QUERY: Record<EventStatusFilter, string> = {
  all: 'any',
  published: 'published',
  draft: 'drafted',
};

export default function useEvents(filters: EventFilters) {
  // debounce so typing in the search/year fields doesn't fire a request per
  // keystroke - status is a toggle group so it's unaffected either way.
  const debouncedFilters = useDebouncedValue(filters, 300);

  return useQuery({
    queryKey: ['events', debouncedFilters],
    queryFn: async () => {
      const query: Record<string, string> = { status: STATUS_TO_QUERY[debouncedFilters.status] };
      if (debouncedFilters.search.trim()) query.search = debouncedFilters.search.trim();
      if (debouncedFilters.yearFrom) query['from-year'] = debouncedFilters.yearFrom;
      if (debouncedFilters.yearTo) query['to-year'] = debouncedFilters.yearTo;

      const { data, error } = await api.GET('/api/v1/events', { params: { query } });
      if (error) throw new Error(error.detail ?? error.title ?? 'Failed to fetch events');
      return data.map(toEvent);
    },
  });
}
