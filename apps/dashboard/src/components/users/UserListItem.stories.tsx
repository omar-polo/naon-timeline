import type { Meta, StoryObj } from '@storybook/react-vite';
import UserListItem from './UserListItem';
import mockUsers from '../../data/mockUsers';

const meta = {
  title: 'Dashboard/Users/UserListItem',
  component: UserListItem,
  args: { onEdit: () => {} },
  render: (args) =>
    args.isMobile ? (
      <div className="w-[280px]">
        <UserListItem {...args} />
      </div>
    ) : (
      <table className="w-[420px]">
        <tbody>
          <UserListItem {...args} />
        </tbody>
      </table>
    ),
} satisfies Meta<typeof UserListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopAdmin: Story = { args: { user: mockUsers[0], isMobile: false } };
export const DesktopUser: Story = { args: { user: mockUsers[2], isMobile: false } };
export const Mobile: Story = { args: { user: mockUsers[0], isMobile: true } };
