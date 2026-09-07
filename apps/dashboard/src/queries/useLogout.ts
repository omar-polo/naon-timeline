import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

export default function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await api.POST('/api/v1/logout');
      if (error) throw new Error(error.detail ?? error.title ?? 'Failed to log out');
    },
    onSuccess: () => {
      // Drop everything cached under the old session rather than picking
      // through it - the next login starts from a clean slate.
      queryClient.clear();
    },
  });
}
