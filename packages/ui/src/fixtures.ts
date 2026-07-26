import type { TimelineEvent } from './types';

// Sample data for Storybook only - independent of any app's real dataset
// (packages/ui can't depend on apps/timeline/src/events.json, that would
// be a reverse dependency). Deliberately covers the shapes components
// need to handle: full event (image + text + url), text-only, and an
// event with no month/day (year-level precision), plus a same-year
// cluster so YearStrip/BottomBar grouping is visible.
export const fixtureEvents: TimelineEvent[] = [
  {
    id: 1,
    pos: [45.9682357, 12.6823985],
    title: "Nasce l'industria tessile nel Pordenonese",
    date: '6 febbraio 1840',
    year: 1840,
    month: 2,
    day: 6,
    image: 'https://placehold.co/600x360?text=1840',
    text: "Testo di esempio per lo storybook.\n\nSecondo paragrafo di esempio, per mostrare la formattazione su più blocchi di testo.",
    url: 'https://example.com',
  },
  {
    id: 2,
    pos: [45.9429976, 12.6189918],
    title: 'A Vienna scoppia la Rivoluzione di marzo',
    date: '13 marzo 1848',
    year: 1848,
    month: 3,
    day: 13,
    text: 'Evento di solo testo, senza immagine né link di approfondimento.',
  },
  {
    id: 3,
    pos: [45.9544616, 12.6600413],
    title: "L'eco della rivolta si diffonde a Pordenone",
    date: '18 marzo 1848',
    year: 1848,
    month: 3,
    day: 18,
    text: 'Secondo evento dello stesso anno, per mostrare il raggruppamento.',
  },
  {
    id: 4,
    pos: [45.951, 12.657],
    title: 'Evento con precisione al solo anno',
    date: '1852',
    year: 1852,
  },
];
