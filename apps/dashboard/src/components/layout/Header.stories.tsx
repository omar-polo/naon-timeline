import type { Meta, StoryObj } from '@storybook/react-vite';
import Header from './Header';
import { Button } from '@naon-timeline/ui';
import { withRouter } from '../../testing/withRouter';

const meta = {
  title: 'Dashboard/Layout/Header',
  component: Header,
  decorators: [withRouter],
  parameters: { layout: 'fullscreen' },
  args: { showHamburger: false, onToggleNav: () => {} },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = { args: { title: 'Overview' } };
export const UsersWithAction: Story = {
  args: { title: 'Users', primaryAction: <Button onPress={() => {}}>+ New user</Button> },
};
export const Breadcrumb: Story = { args: { breadcrumbLabel: 'Cotton mill opens' } };
export const MobileWithHamburger: Story = { args: { title: 'Overview', showHamburger: true } };
