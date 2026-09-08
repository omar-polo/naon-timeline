import { useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_EVENT_FILTERS, type EventFilters, type ModalState } from '../types';
import { useToast } from '@naon-timeline/ui';
import { DashboardContext, type DashboardContextValue } from './dashboardContextInstance';

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState | null>(null);
  const [eventFilters, setEventFiltersState] = useState<EventFilters>(DEFAULT_EVENT_FILTERS);
  const { message: toast, showToast } = useToast();

  const value = useMemo<DashboardContextValue>(
    () => ({
      modal,
      eventFilters,
      toast,
      showToast,
      openModal: (m) => setModal(m),
      closeModal: () => setModal(null),
      setEventFilters: (patch) => setEventFiltersState((f) => ({ ...f, ...patch })),
      downloadBackup: () => {
        showToast('Backup downloaded');
      },
    }),
    [modal, eventFilters, toast, showToast],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}
