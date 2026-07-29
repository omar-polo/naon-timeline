import type { Meta, StoryObj } from '@storybook/react-vite';
import EventListItem from './EventListItem';
import mockEvents from '../../data/mockEvents';
import { withRouter } from '../../testing/withRouter';

const meta = {
  title: 'Dashboard/Events/EventListItem',
  component: EventListItem,
  decorators: [withRouter],
  render: (args) =>
    args.isMobile ? (
      <div className="w-[280px]">
        <EventListItem {...args} />
      </div>
    ) : (
      <table className="w-[520px]">
        <tbody>
          <EventListItem {...args} />
        </tbody>
      </table>
    ),
} satisfies Meta<typeof EventListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopPublished: Story = { args: { event: mockEvents[0], isMobile: false } };
export const DesktopDraft: Story = { args: { event: mockEvents[2], isMobile: false } };
export const Mobile: Story = { args: { event: mockEvents[0], isMobile: true } };
