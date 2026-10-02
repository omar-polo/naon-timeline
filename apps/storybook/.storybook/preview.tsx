import type { Preview } from '@storybook/react-vite';
import { QueryClientProvider } from '@tanstack/react-query';
import { createMockQueryClient } from '../../dashboard/src/testing/mockQueryClient';
import 'leaflet/dist/leaflet.css';
import '../../dashboard/src/index.css';

// Stories don't proxy to a real backend - pre-seed the query cache with the
// same mock data DashboardProvider uses so components using TanStack Query
// show fake data instead of a loading/error state.
const queryClient = createMockQueryClient();

const preview: Preview = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
