import type { Meta, StoryObj } from '@storybook/react-vite';
import StatsGrid from './StatsGrid';

const meta = {
  title: 'Dashboard/Overview/StatsGrid',
  component: StatsGrid,
  args: {
    stats: [
      { label: 'Total users', value: 8 },
      { label: 'Total events', value: 10 },
      { label: 'Draft events', value: 3 },
    ],
  },
} satisfies Meta<typeof StatsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
