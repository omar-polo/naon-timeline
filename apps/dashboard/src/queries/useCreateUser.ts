import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/apiClient';
import { toUser } from './userMapper';
import type { Role, Status } from '../types';

export default function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { email: string; name: string; role: Role; status: Status; password: string }) => {
      const { data, error } = await api.POST('/api/v1/users', { body: input });
      if (error) throw new Error(error.detail ?? error.title ?? 'Failed to create user');
      return toUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
