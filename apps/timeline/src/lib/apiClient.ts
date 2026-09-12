import { createApiClient } from '@naon-timeline/api-client';

// Empty base URL: requests stay same-origin and go through the dev proxy
// (see vite.config.ts) instead of hitting the backend's own origin directly.
export const api = createApiClient('');
