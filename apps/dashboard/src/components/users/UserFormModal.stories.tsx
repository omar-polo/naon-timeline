import type { Meta, StoryObj } from '@storybook/react-vite';
import UserFormModal from './UserFormModal';
import { DashboardProvider } from '../../state/DashboardContext';

const meta = {
  title: 'Dashboard/Users/UserFormModal',
  component: UserFormModal,
  decorators: [(Story) => <DashboardProvider><Story /></DashboardProvider>],
} satisfies Meta<typeof UserFormModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = { args: { modal: { kind: 'userForm', mode: 'create' } } };
export const Edit: Story = { args: { modal: { kind: 'userForm', mode: 'edit', userId: 1 } } };
