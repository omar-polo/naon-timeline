import useDashboard from '../../state/useDashboard';
import Button from '../ui/Button';
import StatsGrid from './StatsGrid';
import RecentActivityList from './RecentActivityList';

export default function OverviewPage() {
  const { users, events, downloadBackup } = useDashboard();

  const stats = [
    { label: 'Total users', value: users.length },
    { label: 'Total events', value: events.length },
    { label: 'Draft events', value: events.filter((e) => e.draft).length },
  ];

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button variant="ghost" onPress={downloadBackup}>
          Download backup (SQL)
        </Button>
      </div>
      <StatsGrid stats={stats} />
      <RecentActivityList users={users} />
    </>
  );
}
