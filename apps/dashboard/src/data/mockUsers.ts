import type { User } from '../types';

const mockUsers: User[] = [
  { id: 1, email: 'sofia.ricci@example.com', name: 'Sofia Ricci', role: 'admin', status: 'active', created: '2024-01-15', lastLogin: '2026-07-27' },
  { id: 2, email: 'marco.bianchi@example.com', name: 'Marco Bianchi', role: 'admin', status: 'active', created: '2024-02-03', lastLogin: '2026-07-20' },
  { id: 3, email: 'elena.conti@example.com', name: 'Elena Conti', role: 'user', status: 'active', created: '2024-03-11', lastLogin: '2026-07-25' },
  { id: 4, email: 'davide.romano@example.com', name: 'Davide Romano', role: 'user', status: 'active', created: '2024-04-22', lastLogin: '2026-05-02' },
  { id: 5, email: 'giulia.ferrari@example.com', name: 'Giulia Ferrari', role: 'user', status: 'active', created: '2024-06-05', lastLogin: '2026-07-26' },
  { id: 6, email: 'luca.moretti@example.com', name: 'Luca Moretti', role: 'user', status: 'active', created: '2024-08-14', lastLogin: '2026-06-30' },
  { id: 7, email: 'chiara.galli@example.com', name: 'Chiara Galli', role: 'user', status: 'active', created: '2025-01-09', lastLogin: '2025-11-18' },
  { id: 8, email: 'andrea.villa@example.com', name: 'Andrea Villa', role: 'admin', status: 'active', created: '2025-03-30', lastLogin: '2026-07-28' },
];

export default mockUsers;
