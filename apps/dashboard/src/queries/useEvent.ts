import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/apiClient';
import { toEvent } from './eventMapper';

export default function useEvent(eventId: string | undefined) {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/events/{event_id}', {
        params: { path: { event_id: eventId! } },
      });
      if (error) throw new Error(error.detail ?? error.title ?? 'Failed to fetch event');
      return toEvent(data);
    },
    enabled: eventId !== undefined,
  });
}
