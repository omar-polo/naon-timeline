import { createRootRoute, createRoute, createRouter, redirect, Outlet } from '@tanstack/react-router';
import DashboardShell from './components/layout/DashboardShell';
import LoginPage from './components/auth/LoginPage';
import OverviewPage from './components/overview/OverviewPage';
import UsersPage from './components/users/UsersPage';
import EventsPage from './components/events/EventsPage';
import EventFormPage from './components/events/EventFormPage';
import { api, setUnauthorizedHandler } from './lib/apiClient';

const rootRoute = createRootRoute({ component: Outlet });

const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: LoginPage });

// Layout route: everything under here requires a session, checked against
// the server (the session cookie is HttpOnly, so the client can't just
// inspect it) before any of its child routes render.
const appRoute = createRoute({
  id: 'app',
  getParentRoute: () => rootRoute,
  component: DashboardShell,
  beforeLoad: async () => {
    const { error } = await api.GET('/api/v1/me');
    if (error) throw redirect({ to: '/login' });
  },
});

const overviewRoute = createRoute({ getParentRoute: () => appRoute, path: '/', component: OverviewPage });
const usersRoute = createRoute({ getParentRoute: () => appRoute, path: '/users', component: UsersPage });
const eventsRoute = createRoute({ getParentRoute: () => appRoute, path: '/events', component: EventsPage });
const newEventRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/events/new',
  component: () => <EventFormPage mode="create" />,
});
const editEventRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/events/$eventId',
  component: () => {
    const { eventId } = editEventRoute.useParams();
    return <EventFormPage mode="edit" eventId={eventId} />;
  },
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  appRoute.addChildren([overviewRoute, usersRoute, eventsRoute, newEventRoute, editEventRoute]),
]);

export const router = createRouter({ routeTree });

// A session that dies mid-use (not just a guarded route hit while logged
// out) also needs to land on /login - the global 401 handler covers that.
setUnauthorizedHandler(() => router.navigate({ to: '/login' }));

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
