import type { Meta, StoryObj } from '@storybook/react-vite';
import Pill from './Pill';

const meta = {
  title: 'UI/Pill',
  component: Pill,
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Admin: Story = { args: { label: 'Admin', tone: 'accent' } };
export const User: Story = { args: { label: 'User', tone: 'gray' } };
export const Published: Story = { args: { label: 'Published', tone: 'success' } };
export const Draft: Story = { args: { label: 'Draft', tone: 'muted' } };
