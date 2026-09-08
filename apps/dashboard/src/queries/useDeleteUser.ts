import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

export default function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await api.DELETE('/api/v1/users/{user_id}', {
        params: { path: { user_id: String(id) } },
      });
      if (error) throw new Error(error.detail ?? error.title ?? 'Failed to delete user');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
