import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import DesktopPanel from './DesktopPanel';
import { fixtureEvents } from './fixtures';

const meta = {
  title: 'Widgets/DesktopPanel',
  component: DesktopPanel,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ height: 640, display: 'flex' }}><Story /></div>],
  args: { onClose: fn() },
} satisfies Meta<typeof DesktopPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { event: fixtureEvents[0] },
};
