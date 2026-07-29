import { createContext } from 'react';
import type { Event, EventFilters, ModalState, Role, User } from '../types';

export interface DashboardContextValue {
  users: User[];
  events: Event[];
  modal: ModalState | null;
  eventFilters: EventFilters;
  toast: string | null;
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
  setEventFilters: (patch: Partial<EventFilters>) => void;
  createUser: (input: { name: string; role: Role; password: string }) => void;
  updateUser: (id: number, patch: { name: string; role: Role }) => void;
  deleteUser: (id: number) => void;
  resetPassword: (id: number, password: string) => void;
  createEvent: (input: Omit<Event, 'id'>) => void;
  updateEvent: (id: number, patch: Omit<Event, 'id'>) => void;
  deleteEvent: (id: number) => void;
  downloadBackup: () => void;
}

export const DashboardContext = createContext<DashboardContextValue | null>(null);
