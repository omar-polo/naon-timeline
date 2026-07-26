import type { Meta, StoryObj } from '@storybook/react-vite';
import EventDetail from './EventDetail';
import { fixtureEvents } from './fixtures';

const meta = {
  title: 'Widgets/EventDetail',
  component: EventDetail,
  decorators: [(Story) => <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}><Story /></div>],
} satisfies Meta<typeof EventDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImageAndLink: Story = {
  args: { event: fixtureEvents[0] },
};

export const TextOnly: Story = {
  args: { event: fixtureEvents[1] },
};

export const YearOnly: Story = {
  args: { event: fixtureEvents[3] },
};
