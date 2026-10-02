import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { queryClient } from './lib/queryClient';
import { DashboardProvider } from './state/DashboardContext';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardProvider>
        <RouterProvider router={router} />
      </DashboardProvider>
    </QueryClientProvider>
  );
}
