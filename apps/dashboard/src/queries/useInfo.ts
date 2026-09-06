import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

export default function useInfo() {
  return useQuery({
    queryKey: ['info'],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/info');
      if (error) throw new Error(error.detail ?? error.title ?? 'Failed to fetch info');
      return data;
    },
  });
}
