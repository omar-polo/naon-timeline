export default function formatDate(iso: string) {
  if (!iso || iso === '—') return iso;
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}
