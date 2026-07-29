import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/apiClient';
import { toEvent } from './eventMapper';

export default function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/events', {
        params: { query: { 'include-drafts': 'true' } },
      });
      if (error) throw new Error(error.detail ?? error.title ?? 'Failed to fetch events');
      return data.map(toEvent);
    },
  });
}
