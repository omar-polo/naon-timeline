import { createContext } from 'react';
import type { EventFilters, ModalState } from '../types';

export interface DashboardContextValue {
  modal: ModalState | null;
  eventFilters: EventFilters;
  toast: string | null;
  showToast: (message: string) => void;
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
  setEventFilters: (patch: Partial<EventFilters>) => void;
  downloadBackup: () => void;
}

export const DashboardContext = createContext<DashboardContextValue | null>(null);
