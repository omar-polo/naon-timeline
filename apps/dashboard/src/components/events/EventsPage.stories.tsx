import type { Meta, StoryObj } from '@storybook/react-vite';
import EventsPage from './EventsPage';
import { DashboardProvider } from '../../state/DashboardContext';
import { withRouter } from '../../testing/withRouter';

const meta = {
  title: 'Dashboard/Events/EventsPage',
  component: EventsPage,
  decorators: [withRouter, (Story) => <DashboardProvider><Story /></DashboardProvider>],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EventsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
