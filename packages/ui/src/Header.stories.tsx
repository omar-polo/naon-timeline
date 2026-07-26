import type { Meta, StoryObj } from '@storybook/react-vite';
import Header from './Header';

const meta = {
  title: 'Widgets/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithEvents: Story = {
  args: { year: 1840, count: 3 },
};

export const NoEvents: Story = {
  args: { year: 1841, count: 0 },
};
