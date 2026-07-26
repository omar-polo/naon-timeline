import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import YearStrip from './YearStrip';
import { fixtureEvents } from './fixtures';
import type { TimelineEvent } from './types';

// YearStrip is a controlled component (selectedEventId/onSelectEvent are
// owned by the parent) - wrap it in a small stateful demo so drag/click/
// keyboard interaction is actually visible in Storybook, not just static.
function YearStripDemo({ events }: { events: TimelineEvent[] }) {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(events[0]?.id ?? null);
  return (
    <YearStrip
      events={events}
      selectedEventId={selectedEventId}
      onSelectEvent={(event) => setSelectedEventId(event.id)}
    />
  );
}

const meta = {
  title: 'Widgets/YearStrip',
  component: YearStripDemo,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof YearStripDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { events: fixtureEvents },
};
