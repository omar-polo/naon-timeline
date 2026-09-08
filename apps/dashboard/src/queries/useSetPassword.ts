import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

export default function useSetPassword() {
  return useMutation({
    mutationFn: async ({ userId, password }: { userId: number; password: string }) => {
      const { error } = await api.POST('/api/v1/users/{user_id}/password', {
        params: { path: { user_id: String(userId) } },
        body: { password },
      });
      if (error) throw new Error(error.detail ?? error.title ?? 'Failed to set password');
    },
  });
}
