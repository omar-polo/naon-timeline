import { z } from 'zod';
import type { TimelineEvent } from '@naon-timeline/ui';

const MONTHS_IT = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];

// Mirrors components["schemas"]["Event"] in @naon-timeline/api-client's
// generated schema - kept in sync by hand since the package only exports
// the client, not a runtime-checkable schema.
const wireEventSchema = z.object({
  id: z.number(),
  coord: z.object({ lat: z.number(), lng: z.number() }),
  title: z.string(),
  date: z.iso.datetime(),
  text: z.string(),
  url: z.string(),
  image: z.string(),
});

// The backend only stores a single point-in-time date, unlike the retired
// fixture data's hand-authored strings ("24-30 marzo 1848" for a date
// range, or a bare year for month/day-less events) - every event coming
// from the API renders as one exact day.
export function toTimelineEvent(raw: unknown): TimelineEvent {
  const ev = wireEventSchema.parse(raw);
  const parsed = new Date(ev.date);
  const year = parsed.getUTCFullYear();
  const month = parsed.getUTCMonth() + 1;
  const day = parsed.getUTCDate();

  return {
    id: ev.id,
    pos: [ev.coord.lat, ev.coord.lng],
    title: ev.title,
    date: `${day} ${MONTHS_IT[month - 1]} ${year}`,
    year,
    month,
    day,
    text: ev.text,
    url: ev.url,
    image: ev.image,
  };
}
