import { useMemo, useState, type ReactNode } from 'react';
import mockUsers from '../data/mockUsers';
import mockEvents from '../data/mockEvents';
import { DEFAULT_EVENT_FILTERS, type EventFilters, type ModalState, type User } from '../types';
import { useToast } from '@naon-timeline/ui';
import { DashboardContext, type DashboardContextValue } from './dashboardContextInstance';

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const events = mockEvents;
  const [modal, setModal] = useState<ModalState | null>(null);
  const [eventFilters, setEventFiltersState] = useState<EventFilters>(DEFAULT_EVENT_FILTERS);
  const { message: toast, showToast } = useToast();

  const value = useMemo<DashboardContextValue>(
    () => ({
      users,
      events,
      modal,
      eventFilters,
      toast,
      showToast,
      openModal: (m) => setModal(m),
      closeModal: () => setModal(null),
      setEventFilters: (patch) => setEventFiltersState((f) => ({ ...f, ...patch })),
      deleteUser: (id) => {
        setUsers((us) => us.filter((u) => u.id !== id));
        setModal(null);
        showToast('Deleted');
      },
      downloadBackup: () => {
        showToast('Backup downloaded');
      },
    }),
    [users, events, modal, eventFilters, toast, showToast],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}
