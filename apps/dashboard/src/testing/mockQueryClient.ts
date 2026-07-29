import { QueryClient } from '@tanstack/react-query';
import mockEvents from '../data/mockEvents';

// Storybook has no real backend behind it - seed the cache with the same
// mock data DashboardProvider uses, and mark it as never-stale so
// useEvents/useEvent never attempt a real fetch that would just fail and
// blow away the seeded data with a loading/error state.
export function createMockQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, retry: false } },
  });
  queryClient.setQueryData(['events'], mockEvents);
  for (const event of mockEvents) {
    queryClient.setQueryData(['events', String(event.id)], event);
  }
  return queryClient;
}
