import { createContext } from 'react';
import type { Event, EventFilters, ModalState, Role, User } from '../types';

export interface DashboardContextValue {
  users: User[];
  events: Event[];
  modal: ModalState | null;
  eventFilters: EventFilters;
  toast: string | null;
  showToast: (message: string) => void;
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
  setEventFilters: (patch: Partial<EventFilters>) => void;
  createUser: (input: { name: string; role: Role; password: string }) => void;
  updateUser: (id: number, patch: { name: string; role: Role }) => void;
  deleteUser: (id: number) => void;
  resetPassword: (id: number, password: string) => void;
  downloadBackup: () => void;
}

export const DashboardContext = createContext<DashboardContextValue | null>(null);
