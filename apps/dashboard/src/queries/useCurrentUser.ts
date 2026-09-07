import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

// Exported as queryOptions (not just a hook) so router.tsx's beforeLoad
// guard can ensureQueryData() the exact same query - one /me fetch shared
// between the route guard and this hook, instead of each doing its own.
export const currentUserQueryOptions = queryOptions({
  queryKey: ['me'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/me');
    if (error) throw new Error(error.detail ?? error.title ?? 'Failed to fetch current user');
    return data;
  },
});

export default function useCurrentUser() {
  return useQuery(currentUserQueryOptions);
}
