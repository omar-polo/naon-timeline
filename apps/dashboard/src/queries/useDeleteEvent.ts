import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

export default function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await api.DELETE('/api/v1/events/{event_id}', {
        params: { path: { event_id: String(id) } },
      });
      if (error) throw new Error(error.detail ?? error.title ?? 'Failed to delete event');
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ['events', String(id)] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
