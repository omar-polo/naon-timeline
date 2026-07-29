import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import EventMapPicker from './EventMapPicker';
import { MAP_CENTER } from '../../lib/geo';

function Demo() {
  const [lat, setLat] = useState(MAP_CENTER[0]);
  const [lng, setLng] = useState(MAP_CENTER[1]);
  return (
    <div className="w-[420px]">
      <EventMapPicker
        lat={lat}
        lng={lng}
        onChange={(nextLat, nextLng) => {
          setLat(nextLat);
          setLng(nextLng);
        }}
      />
    </div>
  );
}

const meta = {
  title: 'Dashboard/Events/EventMapPicker',
  component: Demo,
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
