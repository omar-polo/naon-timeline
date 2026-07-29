import { createRootRoute, createRouter, createMemoryHistory, RouterProvider } from '@tanstack/react-router';
import { useMemo, type ReactNode } from 'react';

// A handful of stories render components that use TanStack Router's <Link>
// (Sidebar, EventListItem), which needs a router context to render at all -
// this decorator provides a minimal in-memory one so those stories don't
// need a real app shell.
// eslint-disable-next-line react-refresh/only-export-components -- Storybook decorator, not app runtime code
function RouterWrapper({ children }: { children: ReactNode }) {
  const router = useMemo(() => {
    const rootRoute = createRootRoute({ component: () => <>{children}</> });
    return createRouter({ routeTree: rootRoute, history: createMemoryHistory({ initialEntries: ['/'] }) });
  }, [children]);
  return <RouterProvider router={router} />;
}

export function withRouter(Story: () => ReactNode) {
  return (
    <RouterWrapper>
      <Story />
    </RouterWrapper>
  );
}
