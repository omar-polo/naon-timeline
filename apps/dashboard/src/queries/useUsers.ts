import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/apiClient';
import { toUser } from './userMapper';

export default function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/users');
      if (error) throw new Error(error.detail ?? error.title ?? 'Failed to fetch users');
      return data.map(toUser);
    },
  });
}
