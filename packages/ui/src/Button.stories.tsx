import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: { children: 'Save changes', onPress: () => {} },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Cancel' } };
export const GhostSmall: Story = { args: { variant: 'ghostSmall', children: 'Reset password' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Delete event' } };
export const Disabled: Story = { args: { variant: 'primary', isDisabled: true } };
