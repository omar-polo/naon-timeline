import { useEffect, useState } from 'react';
import { compareEvents, type TimelineEvent } from '@naon-timeline/ui';
import { api } from './lib/apiClient';
import { toTimelineEvent } from './eventMapper';

// No status filter: GET /api/v1/events is a public endpoint (no
// session/cookie involved) and only ever returns published events to an
// unauthenticated caller.
export default function useEvents() {
  const [events, setEvents] = useState<TimelineEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.GET('/api/v1/events').then(({ data, error: apiError }) => {
      if (cancelled) return;
      if (apiError) {
        setError(apiError.detail ?? apiError.title ?? 'Failed to load events');
        return;
      }
      // The backend doesn't guarantee any particular order - sort oldest
      // first so the strip reads left-to-right chronologically, matching
      // the old fixture data (which just happened to already be ordered
      // that way in the source file).
      setEvents(data.map(toTimelineEvent).sort(compareEvents));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { events, error };
}
