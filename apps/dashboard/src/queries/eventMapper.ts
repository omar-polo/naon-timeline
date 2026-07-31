import { z } from 'zod';
import type { Event } from '../types';

// Mirrors components["schemas"]["Event"] in @naon-timeline/api-client's
// generated schema - kept in sync by hand since the package only exports
// the client, not a runtime-checkable schema.
export const wireEventSchema = z.object({
  id: z.number(),
  draft: z.boolean().optional(),
  coord: z.object({ lat: z.number(), lng: z.number() }),
  title: z.string(),
  date: z.iso.datetime(),
  text: z.string(),
  url: z.string(),
  image: z.string(),
});

export type WireEvent = z.infer<typeof wireEventSchema>;

export function toEvent(raw: unknown): Event {
  const ev = wireEventSchema.parse(raw);
  return {
    id: ev.id,
    title: ev.title,
    date: ev.date.slice(0, 10),
    draft: ev.draft ?? false,
    text: ev.text,
    url: ev.url,
    image: ev.image,
    lat: ev.coord.lat,
    lng: ev.coord.lng,
  };
}

export function toWireEvent(ev: Event): WireEvent {
  return {
    id: ev.id,
    draft: ev.draft,
    coord: { lat: ev.lat, lng: ev.lng },
    title: ev.title,
    // the form only collects a plain yyyy-mm-dd (see the <input type="date">
    // in EventFormPage) - midnight UTC matches what the backend already
    // stores (see the "date-time" values returned by GET).
    date: `${ev.date}T00:00:00Z`,
    text: ev.text,
    url: ev.url,
    image: ev.image,
  };
}
