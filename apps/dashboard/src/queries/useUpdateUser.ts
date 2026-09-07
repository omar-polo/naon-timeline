import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/apiClient';
import { toUser, toWireUserUpdate } from './userMapper';
import type { User } from '../types';

export default function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      const { data, error } = await api.PUT('/api/v1/users/{user_id}', {
        params: { path: { user_id: String(user.id) } },
        body: toWireUserUpdate(user),
      });
      if (error) throw new Error(error.detail ?? error.title ?? 'Failed to update user');
      return toUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
