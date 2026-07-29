// Same bounds/center as the public timeline (apps/timeline/src/App.tsx),
// so both apps agree on where events can be placed on the map.
export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [45.995334, 12.5956731],
  [45.918336, 12.7074471],
];
export const MAP_CENTER: [number, number] = [45.9544979, 12.6596338];

// Small hardcoded gazetteer standing in for a real geocoding API.
export const GEOCODE: Record<string, { lat: number; lng: number }> = {
  'piazza xx settembre': { lat: 45.95299, lng: 12.64597 },
  'piazza cavour': { lat: 45.96453, lng: 12.6538 },
  'corso vittorio emanuele': { lat: 45.96453, lng: 12.65715 },
  'via mazzini': { lat: 45.94529, lng: 12.63479 },
  'duomo di pordenone': { lat: 45.96838, lng: 12.64932 },
  'palazzo comunale': { lat: 45.96145, lng: 12.64821 },
};

export function findAddress(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const hit = Object.keys(GEOCODE).find((k) => k.includes(q));
  return hit ? { name: hit, ...GEOCODE[hit] } : null;
}
