import useDashboard from '../../state/useDashboard';
import useInfo from '../../queries/useInfo';
import useUsers from '../../queries/useUsers';
import { Button } from '@naon-timeline/ui';
import StatsGrid from './StatsGrid';
import RecentActivityList from './RecentActivityList';

export default function OverviewPage() {
  const { downloadBackup } = useDashboard();
  const { data: info, isLoading, error } = useInfo();
  const { data: users } = useUsers();

  const stats = [
    { label: 'Total users', value: info?.users ?? 0 },
    { label: 'Total events', value: info?.events ?? 0 },
    { label: 'Draft events', value: info?.drafts ?? 0 },
  ];

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button variant="ghost" onPress={downloadBackup}>
          Download backup (SQL)
        </Button>
      </div>

      {isLoading && <p className="text-[13px] text-muted">Loading stats…</p>}
      {error && <p className="text-[13px] text-danger">Couldn&apos;t load stats: {error.message}</p>}

      {!isLoading && !error && <StatsGrid stats={stats} />}
      <RecentActivityList users={users ?? []} />
    </>
  );
}
