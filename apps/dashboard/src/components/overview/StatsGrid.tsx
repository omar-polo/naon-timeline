import useIsMobile from '../layout/useIsMobile';

export default function StatsGrid({ stats }: { stats: { label: string; value: number }[] }) {
  const isMobile = useIsMobile();
  return (
    <div
      className={`mb-8 grid gap-3 md:gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}
    >
      {stats.map((s) => (
        <div key={s.label} className="rounded-[10px] border border-border bg-panel p-[18px]">
          <div className="mb-2 text-[11px] uppercase tracking-wide text-muted">{s.label}</div>
          <div className="text-[26px] font-bold">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
