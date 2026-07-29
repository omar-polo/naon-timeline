import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import DashboardShell from './components/layout/DashboardShell';
import OverviewPage from './components/overview/OverviewPage';
import UsersPage from './components/users/UsersPage';
import EventsPage from './components/events/EventsPage';
import EventFormPage from './components/events/EventFormPage';

const rootRoute = createRootRoute({ component: DashboardShell });

const overviewRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: OverviewPage });
const usersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/users', component: UsersPage });
const eventsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/events', component: EventsPage });
const newEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/new',
  component: () => <EventFormPage mode="create" />,
});
const editEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$eventId',
  component: () => {
    const { eventId } = editEventRoute.useParams();
    return <EventFormPage mode="edit" eventId={eventId} />;
  },
});

const routeTree = rootRoute.addChildren([overviewRoute, usersRoute, eventsRoute, newEventRoute, editEventRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
