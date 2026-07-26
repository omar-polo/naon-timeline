import { Marker } from 'react-leaflet';
import { useMemo } from 'react';
import type { TimelineEvent } from './types';
import { createEventIcon } from './markerIcon';

export default function EventMarker({
  event,
  isSelected,
  onClick,
}: {
  event: TimelineEvent;
  isSelected: boolean;
  onClick: () => void;
}) {
  const icon = useMemo(() => createEventIcon(event, isSelected), [event, isSelected]);
  return (
    <Marker
      position={event.pos}
      icon={icon}
      zIndexOffset={isSelected ? 1000 : 0}
      eventHandlers={{ click: onClick }}
    />
  );
}
