import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { ThemeModeProvider } from '@naon-timeline/ui';
import { router } from './router';
import { queryClient } from './lib/queryClient';
import { DashboardProvider } from './state/DashboardContext';

export default function App() {
  return (
    <ThemeModeProvider>
      <QueryClientProvider client={queryClient}>
        <DashboardProvider>
          <RouterProvider router={router} />
        </DashboardProvider>
      </QueryClientProvider>
    </ThemeModeProvider>
  );
}
