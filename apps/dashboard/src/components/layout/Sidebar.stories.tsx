import type { Meta, StoryObj } from '@storybook/react-vite';
import Sidebar from './Sidebar';
import { withRouter } from '../../testing/withRouter';

const meta = {
  title: 'Dashboard/Layout/Sidebar',
  component: Sidebar,
  decorators: [withRouter],
  args: { userName: 'Sofia Ricci', isAdmin: true },
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

// Non-admins never see the Users nav item.
export const AsUser: Story = { args: { userName: 'Elena Conti', isAdmin: false } };
