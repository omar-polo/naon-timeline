import L from 'leaflet';
import type { TimelineEvent } from './types';
import { formatMarkerLabel } from './dates';

const ACCENT = 'oklch(58% 0.15 40)';
const NEUTRAL_DOT = 'oklch(65% 0.03 60 / 0.7)';
const INK = 'oklch(30% 0.02 50)';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function createEventIcon(event: TimelineEvent, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 24 : 20;

  // Classic CSS map-pin trick: a square with three corners rounded and one
  // sharp (border-radius 50% 50% 50% 0), rotated -45deg, reads as a
  // downward-pointing teardrop. The rotation is on this wrapper (not just
  // the pin shape) so the label bubble - a sibling, counter-rotated +45deg
  // to cancel it back out - stays upright and anchored above the pin,
  // matching the handoff's structure exactly.
  const pinStyle = [
    'width:100%',
    'height:100%',
    'border-radius:50% 50% 50% 0',
    `background:${isSelected ? ACCENT : NEUTRAL_DOT}`,
    'box-shadow:0 2px 4px rgba(0,0,0,.2)',
    'transition:background .15s',
  ].join(';');

  const label = isSelected
    ? `<div style="position:absolute;bottom:100%;left:50%;transform:translate(-50%,-8px) rotate(45deg);background:${INK};color:#fff;font-size:11px;padding:5px 9px;border-radius:6px;white-space:nowrap;pointer-events:none">${escapeHtml(formatMarkerLabel(event))}</div>`
    : '';

  const html = `
    <div style="width:${size}px;height:${size}px;transform:rotate(-45deg)">
      <div class="${isSelected ? 'marker-pulse' : ''}" style="${pinStyle}"></div>
      ${label}
    </div>
  `;

  return L.divIcon({
    html,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}
