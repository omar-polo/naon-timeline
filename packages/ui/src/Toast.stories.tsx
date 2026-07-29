import type { Meta, StoryObj } from '@storybook/react-vite';
import Toast from './Toast';

const meta = {
  title: 'UI/Toast',
  component: Toast,
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = { args: { message: 'Event created' } };
export const Hidden: Story = { args: { message: null } };
