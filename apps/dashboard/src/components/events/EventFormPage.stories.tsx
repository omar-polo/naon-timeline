import type { Meta, StoryObj } from '@storybook/react-vite';
import EventFormPage from './EventFormPage';
import { DashboardProvider } from '../../state/DashboardContext';
import { withRouter } from '../../testing/withRouter';

const meta = {
  title: 'Dashboard/Events/EventFormPage',
  component: EventFormPage,
  decorators: [withRouter, (Story) => <DashboardProvider><Story /></DashboardProvider>],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EventFormPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = { args: { mode: 'create' } };
export const Edit: Story = { args: { mode: 'edit', eventId: '1' } };
