import { MapContainer, TileLayer } from 'react-leaflet';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import EventMarker from './EventMarker';
import { fixtureEvents } from './fixtures';

const meta = {
  title: 'Widgets/EventMarker',
  component: EventMarker,
  parameters: { layout: 'fullscreen' },
  // EventMarker renders a react-leaflet <Marker>, which needs a
  // <MapContainer> ancestor to provide Leaflet's map context.
  decorators: [(Story) => (
    <MapContainer center={fixtureEvents[0].pos} zoom={15} style={{ height: 320, width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Story />
    </MapContainer>
  )],
  args: { event: fixtureEvents[0], onClick: fn() },
} satisfies Meta<typeof EventMarker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  args: { isSelected: false },
};

export const Selected: Story = {
  args: { isSelected: true },
};
