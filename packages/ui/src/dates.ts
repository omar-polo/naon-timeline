import type { TimelineEvent } from './types';

export const MONTHS_IT = [
  'gen', 'feb', 'mar', 'apr', 'mag', 'giu',
  'lug', 'ago', 'set', 'ott', 'nov', 'dic',
];

export function compareEvents(a: TimelineEvent, b: TimelineEvent): number {
  return (a.year - b.year) || (a.month ?? 13) - (b.month ?? 13) || (a.day ?? 32) - (b.day ?? 32);
}

export function formatChipDate(e: TimelineEvent): string {
  if (e.month == null || e.day == null) return String(e.year);
  return `${e.day} ${MONTHS_IT[e.month - 1]}`;
}

export function formatMarkerLabel(e: TimelineEvent): string {
  if (e.month == null || e.day == null) return `${e.year} · ${e.title}`;
  return `${e.day} ${MONTHS_IT[e.month - 1]} ${e.year} · ${e.title}`;
}

