import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import BottomBar from './BottomBar';
import { fixtureEvents } from './fixtures';
import type { TimelineEvent } from './types';

// BottomBar is controlled the same way YearStrip is - wrap it in a small
// stateful demo so selecting a chip/dot actually updates what's shown.
function BottomBarDemo({ events }: { events: TimelineEvent[] }) {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(events[0]?.id ?? null);
  const selectedYear = events.find((e) => e.id === selectedEventId)?.year ?? events[0]?.year ?? 0;
  const yearEvents = events.filter((e) => e.year === selectedYear);
  return (
    <BottomBar
      events={events}
      selectedYear={selectedYear}
      yearEvents={yearEvents}
      selectedEventId={selectedEventId}
      onSelectEvent={(event) => setSelectedEventId(event.id)}
    />
  );
}

const meta = {
  title: 'Widgets/BottomBar',
  component: BottomBarDemo,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BottomBarDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { events: fixtureEvents },
};
