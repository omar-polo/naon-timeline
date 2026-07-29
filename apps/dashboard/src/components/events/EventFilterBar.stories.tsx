import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import EventFilterBar from './EventFilterBar';
import type { EventFilters } from '../../types';

function Demo() {
  const [filters, setFilters] = useState<EventFilters>({ search: '', status: 'all', yearFrom: '', yearTo: '' });
  return <EventFilterBar filters={filters} onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))} />;
}

const meta = {
  title: 'Dashboard/Events/EventFilterBar',
  component: Demo,
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
