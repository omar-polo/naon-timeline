import type { Event } from '../types';

// Mirrors components["schemas"]["Event"] in @naon-timeline/api-client's
// generated schema - kept local since the package only exports the client,
// not its types, and this is the one place the wire shape meets the
// dashboard's flat Event type.
export interface WireEvent {
  id: number;
  draft?: boolean;
  coord: { lat: number; lng: number };
  title: string;
  date: string;
  text: string;
  url: string;
  image: string;
}

export function toEvent(ev: WireEvent): Event {
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
