import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import MobileSheet from './MobileSheet';
import { fixtureEvents } from './fixtures';

const meta = {
  title: 'Widgets/MobileSheet',
  component: MobileSheet,
  parameters: { layout: 'fullscreen' },
  // MobileSheet positions itself with `absolute inset-0`, so it needs a
  // sized, relatively-positioned ancestor to render against - same
  // requirement it has inside the real app's layout.
  decorators: [(Story) => (
    <div style={{ position: 'relative', width: 390, height: 700, overflow: 'hidden', border: '1px solid #ccc', margin: '0 auto' }}>
      <Story />
    </div>
  )],
  args: { onClose: fn() },
} satisfies Meta<typeof MobileSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { event: fixtureEvents[0] },
};
