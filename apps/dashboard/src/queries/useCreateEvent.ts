import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/apiClient';
import { toEvent, toWireEvent } from './eventMapper';
import type { Event } from '../types';

export default function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<Event, 'id'>) => {
      // the backend ignores the id in the request body and assigns its own -
      // toWireEvent just needs a full Event shape to build the request from.
      const { data, error } = await api.POST('/api/v1/events', {
        body: toWireEvent({ ...input, id: 0 }),
      });
      if (error) throw new Error(error.detail ?? error.title ?? 'Failed to create event');
      return toEvent(data);
    },
    onSuccess: (created) => {
      queryClient.setQueryData(['events', String(created.id)], created);
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
