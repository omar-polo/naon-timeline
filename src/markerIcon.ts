import L from 'leaflet';
import type { TimelineEvent } from './types';
import { formatMarkerLabel } from './dates';

const ACCENT = 'oklch(55% 0.16 250)';
const ACCENT_GLOW = 'oklch(55% 0.16 250 / 0.18)';
const NEUTRAL_DOT = 'oklch(55% 0.01 250 / 0.55)';
const INK = 'oklch(20% 0.01 250)';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function createEventIcon(event: TimelineEvent, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 20 : 16;
  const dotStyle = [
    `width:${size}px`,
    `height:${size}px`,
    'border-radius:50%',
    `background:${isSelected ? ACCENT : NEUTRAL_DOT}`,
    `box-shadow:${isSelected ? `0 0 0 6px ${ACCENT_GLOW}` : 'none'}`,
    'transition:all .15s',
  ].join(';');

  const label = isSelected
    ? `<div style="position:absolute;bottom:100%;left:50%;transform:translate(-50%,-8px);background:${INK};color:#fff;font-size:11px;padding:5px 9px;border-radius:6px;white-space:nowrap;pointer-events:none">${escapeHtml(formatMarkerLabel(event))}</div>`
    : '';

  return L.divIcon({
    html: `<div style="${dotStyle}"></div>${label}`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
