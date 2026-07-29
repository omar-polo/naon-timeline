import type { Meta, StoryObj } from '@storybook/react-vite';
import Sidebar from './Sidebar';
import { withRouter } from '../../testing/withRouter';

const meta = {
  title: 'Dashboard/Layout/Sidebar',
  component: Sidebar,
  decorators: [withRouter],
  args: { adminName: 'Admin' },
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div className="h-[420px] w-[216px] bg-panel">
      <Sidebar {...args} />
    </div>
  ),
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
