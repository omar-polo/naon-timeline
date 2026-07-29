import type { Meta, StoryObj } from '@storybook/react-vite';
import RecentActivityList from './RecentActivityList';
import mockUsers from '../../data/mockUsers';

const meta = {
  title: 'Dashboard/Overview/RecentActivityList',
  component: RecentActivityList,
  args: { users: mockUsers },
} satisfies Meta<typeof RecentActivityList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
