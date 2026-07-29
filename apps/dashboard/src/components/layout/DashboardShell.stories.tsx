import type { Meta, StoryObj } from '@storybook/react-vite';
import { createRootRoute, createRoute, createRouter, createMemoryHistory, RouterProvider } from '@tanstack/react-router';
import DashboardShell from './DashboardShell';
import { DashboardProvider } from '../../state/DashboardContext';

function DemoPage() {
  return <p className="text-sm text-muted">Page content goes here.</p>;
}

function ShellDemo({ initialPath }: { initialPath: string }) {
  const rootRoute = createRootRoute({ component: DashboardShell });
  const routeTree = rootRoute.addChildren([
    createRoute({ getParentRoute: () => rootRoute, path: '/', component: DemoPage }),
    createRoute({ getParentRoute: () => rootRoute, path: '/users', component: DemoPage }),
    createRoute({ getParentRoute: () => rootRoute, path: '/events', component: DemoPage }),
  ]);
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [initialPath] }) });
  return (
    <DashboardProvider>
      <div className="h-[560px]">
        <RouterProvider router={router} />
      </div>
    </DashboardProvider>
  );
}

const meta = {
  title: 'Dashboard/Layout/DashboardShell',
  component: ShellDemo,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ShellDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = { args: { initialPath: '/' } };
export const Users: Story = { args: { initialPath: '/users' } };
export const Events: Story = { args: { initialPath: '/events' } };
