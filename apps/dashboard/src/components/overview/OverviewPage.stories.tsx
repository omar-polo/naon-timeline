import type { Meta, StoryObj } from '@storybook/react-vite';
import OverviewPage from './OverviewPage';
import { DashboardProvider } from '../../state/DashboardContext';

const meta = {
  title: 'Dashboard/Overview/OverviewPage',
  component: OverviewPage,
  decorators: [(Story) => <DashboardProvider><Story /></DashboardProvider>],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof OverviewPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
