import { z } from 'zod';
import type { User } from '../types';

// Mirrors components["schemas"]["User"] in @naon-timeline/api-client's
// generated schema - kept in sync by hand since the package only exports
// the client, not a runtime-checkable schema.
export const wireUserSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  role: z.enum(['admin', 'user']),
  status: z.enum(['active', 'disabled']),
  created: z.iso.datetime(),
  lastLogin: z.iso.datetime().nullish(),
});

export function toUser(raw: unknown): User {
  const u = wireUserSchema.parse(raw);
  return {
    id: u.id,
    name: u.name,
    role: u.role,
    status: u.status,
    created: u.created.slice(0, 10),
    lastLogin: u.lastLogin ? u.lastLogin.slice(0, 10) : '—',
  };
}
