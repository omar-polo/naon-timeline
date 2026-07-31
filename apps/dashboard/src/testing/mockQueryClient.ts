import { QueryClient } from '@tanstack/react-query';
import mockEvents from '../data/mockEvents';
import { DEFAULT_EVENT_FILTERS } from '../types';

// Storybook has no real backend behind it - seed the cache with the same
// mock data DashboardProvider uses, and mark it as never-stale so
// useEvents/useEvent never attempt a real fetch that would just fail and
// blow away the seeded data with a loading/error state.
//
// useEvents keys its query on the filters object, so this only covers the
// unfiltered (default) view - a story that changes the filters will fall
// through to a real (failing) fetch, same as any other interactive mutation.
export function createMockQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, retry: false } },
  });
  queryClient.setQueryData(['events', DEFAULT_EVENT_FILTERS], mockEvents);
  for (const event of mockEvents) {
    queryClient.setQueryData(['events', String(event.id)], event);
  }
  return queryClient;
}
