import type { Meta, StoryObj } from '@storybook/react-vite';
import UsersPage from './UsersPage';
import { DashboardProvider } from '../../state/DashboardContext';

const meta = {
  title: 'Dashboard/Users/UsersPage',
  component: UsersPage,
  decorators: [(Story) => <DashboardProvider><Story /></DashboardProvider>],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof UsersPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
