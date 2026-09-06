import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OverviewPage from './OverviewPage';
import { DashboardProvider } from '../../state/DashboardContext';

const meta = {
  title: 'Dashboard/Overview/OverviewPage',
  component: OverviewPage,
  decorators: [(Story) => <DashboardProvider><Story /></DashboardProvider>],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof OverviewPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// useInfo() always passes its own queryFn, which takes priority over
// queryClient.setQueryDefaults - so overriding defaults on a fresh client
// doesn't stop it from firing (and failing) a real fetch. Instead, kick off
// a fetch for the same query key that never resolves *before* OverviewPage
// mounts: TanStack Query dedupes in-flight requests per key, so useInfo()'s
// own queryFn is never invoked - it just observes this pending fetch.
function LoadingQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    void client.fetchQuery({ queryKey: ['info'], queryFn: () => new Promise(() => {}) });
    return client;
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export const Loading: Story = {
  decorators: [(Story) => <LoadingQueryProvider><Story /></LoadingQueryProvider>],
};
