import { Link, useNavigate } from '@tanstack/react-router';
import type { Event } from '../../types';
import { Pill } from '@naon-timeline/ui';
import formatDate from '../../lib/formatDate';

function excerpt(text: string) {
  return text.length > 90 ? `${text.slice(0, 90).trim()}…` : text;
}

export default function EventListItem({ event, isMobile }: { event: Event; isMobile: boolean }) {
  const navigate = useNavigate();
  const statusLabel = event.draft ? 'Draft' : 'Published';
  const statusTone = event.draft ? 'muted' : 'success';

  if (isMobile) {
    return (
      <Link
        to="/events/$eventId"
        params={{ eventId: String(event.id) }}
        className="flex flex-col gap-2 rounded-[10px] border border-border bg-panel p-4"
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold">{event.title}</span>
          <Pill label={statusLabel} tone={statusTone} />
        </div>
        <div className="text-[11.5px] leading-relaxed text-muted">{excerpt(event.text)}</div>
        <div className="text-[11.5px] text-muted">{formatDate(event.date)}</div>
      </Link>
    );
  }

  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={() => navigate({ to: '/events/$eventId', params: { eventId: String(event.id) } })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate({ to: '/events/$eventId', params: { eventId: String(event.id) } });
        }
      }}
      className="cursor-pointer border-b border-border text-[13px] last:border-b-0 hover:bg-page"
    >
      <td className="flex flex-col gap-1 px-4 py-3">
        <span className="font-semibold">{event.title}</span>
        <span className="text-[11.5px] leading-relaxed text-muted">{excerpt(event.text)}</span>
      </td>
      <td className="px-4 py-3 text-xs text-muted">{formatDate(event.date)}</td>
      <td className="px-4 py-3">
        <Pill label={statusLabel} tone={statusTone} />
      </td>
    </tr>
  );
}
