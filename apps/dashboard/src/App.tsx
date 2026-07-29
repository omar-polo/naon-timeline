import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { DashboardProvider } from './state/DashboardContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardProvider>
        <RouterProvider router={router} />
      </DashboardProvider>
    </QueryClientProvider>
  );
}
