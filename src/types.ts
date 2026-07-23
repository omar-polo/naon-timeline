import type { LatLngExpression } from 'leaflet';

export interface TimelineEvent {
  id: number;
  pos: LatLngExpression;
  title: string;
  date: string;
  year: number;
  month?: number;
  day?: number;
  text?: string;
  url?: string;
  image?: string;
}
