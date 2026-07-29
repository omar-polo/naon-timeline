import type { Meta, StoryObj } from '@storybook/react-vite';
import ResetPasswordModal from './ResetPasswordModal';
import { DashboardProvider } from '../../state/DashboardContext';

const meta = {
  title: 'Dashboard/Users/ResetPasswordModal',
  component: ResetPasswordModal,
  decorators: [(Story) => <DashboardProvider><Story /></DashboardProvider>],
  args: { modal: { kind: 'resetPassword', userId: 1 } },
} satisfies Meta<typeof ResetPasswordModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
