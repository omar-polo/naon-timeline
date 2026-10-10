import type { TimelineEvent } from './types';

export default function EventDetail({ event }: { event: TimelineEvent }) {
  return (
    <>
      {event.image && <img src={event.image} alt={`image for ${event.title}`} className="mb-4" />}
      <p className="text-center text-muted text-sm mb-1">{event.date}</p>
      <h3 className="font-title font-semibold text-lg text-center mb-4">{event.title}</h3>
      {event.text && event.text.split("\n\n").map((paragraph, i) => <p key={i} className="mb-4">{paragraph}</p>)}
      {event.url && <p className="mt-8"><a href={event.url} target="_blank"><em>Per approfondire →</em></a></p>}
    </>
  );
}
