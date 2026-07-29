import { Outlet, Link, useLocation } from '@tanstack/react-router';
import { ModalOverlay, Modal as AriaModal } from 'react-aria-components';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ModalHost from './ModalHost';
import Toast from '../ui/Toast';
import Button from '../ui/Button';
import useIsMobile from './useIsMobile';
import useDashboard from '../../state/useDashboard';

export default function DashboardShell() {
  const isMobile = useIsMobile();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { pathname } = useLocation();
  const { openModal, toast } = useDashboard();

  const isEventForm = pathname.startsWith('/events/');
  let title: string | undefined;
  let breadcrumbLabel: string | undefined;
  let primaryAction: React.ReactNode;

  if (pathname === '/') {
    title = 'Overview';
  } else if (pathname === '/users') {
    title = 'Users';
    primaryAction = <Button onPress={() => openModal({ kind: 'userForm', mode: 'create' })}>+ New user</Button>;
  } else if (pathname === '/events') {
    title = 'Events';
    primaryAction = (
      <Link to="/events/new">
        <Button>+ New event</Button>
      </Link>
    );
  } else if (pathname === '/events/new') {
    breadcrumbLabel = 'New event';
  } else if (isEventForm) {
    breadcrumbLabel = 'Edit event';
  }

  const sidebar = <Sidebar adminName="Admin" onNavigate={() => setMobileNavOpen(false)} />;

  return (
    <div className="flex h-dvh overflow-hidden bg-page font-sans text-ink">
      {isMobile ? (
        <ModalOverlay
          isOpen={mobileNavOpen}
          onOpenChange={setMobileNavOpen}
          isDismissable
          className="fixed inset-0 z-20 bg-[rgba(30,20,10,.35)] transition-opacity duration-200 ease-out data-[entering]:opacity-0 data-[exiting]:opacity-0"
        >
          <AriaModal className="h-full w-[240px] border-r border-border bg-panel transition-transform duration-200 ease-out data-[entering]:-translate-x-full data-[exiting]:-translate-x-full">
            {sidebar}
          </AriaModal>
        </ModalOverlay>
      ) : (
        <aside className="w-[216px] flex-none border-r border-border bg-panel">{sidebar}</aside>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          title={title}
          breadcrumbLabel={breadcrumbLabel}
          primaryAction={primaryAction}
          showHamburger={isMobile}
          onToggleNav={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-7">
          <Outlet />
        </main>
      </div>

      <ModalHost />
      <Toast message={toast} />
    </div>
  );
}
