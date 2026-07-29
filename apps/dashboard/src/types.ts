export type Role = 'admin' | 'user';

export interface User {
  id: number;
  name: string;
  role: Role;
  status: 'active' | 'disabled';
  created: string;
  lastLogin: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  draft: boolean;
  text: string;
  url: string;
  image: string;
  lat: number;
  lng: number;
}

export type EventStatusFilter = 'all' | 'published' | 'draft';

export interface EventFilters {
  search: string;
  status: EventStatusFilter;
  yearFrom: string;
  yearTo: string;
}

export type ModalState =
  | { kind: 'userForm'; mode: 'create' }
  | { kind: 'userForm'; mode: 'edit'; userId: number }
  | { kind: 'resetPassword'; userId: number }
  | { kind: 'confirmDelete'; target: 'user' | 'event'; id: number; label: string };
