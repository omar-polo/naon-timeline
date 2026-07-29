import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/apiClient';
import { toEvent, toWireEvent } from './eventMapper';
import type { Event } from '../types';

export default function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (event: Event) => {
      const { data, error } = await api.PUT('/api/v1/events/{event_id}', {
        params: { path: { event_id: String(event.id) } },
        body: toWireEvent(event),
      });
      if (error) throw new Error(error.detail ?? error.title ?? 'Failed to update event');
      return toEvent(data);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['events', String(updated.id)], updated);
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
