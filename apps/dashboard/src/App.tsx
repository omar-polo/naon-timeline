import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { DashboardProvider } from './state/DashboardContext';

export default function App() {
  return (
    <DashboardProvider>
      <RouterProvider router={router} />
    </DashboardProvider>
  );
}
