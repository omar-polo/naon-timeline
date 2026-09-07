import type { Meta, StoryObj } from '@storybook/react-vite';
import LoginPage from './LoginPage';
import { withRouter } from '../../testing/withRouter';

const meta = {
  title: 'Dashboard/Auth/LoginPage',
  component: LoginPage,
  decorators: [withRouter],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
