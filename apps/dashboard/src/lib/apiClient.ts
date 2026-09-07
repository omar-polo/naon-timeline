import { createApiClient } from '@naon-timeline/api-client';

// Empty base URL: requests stay same-origin and go through the dev proxy
// (see vite.config.ts) instead of hitting the backend's own origin directly.
export const api = createApiClient('');

let unauthorizedHandler: (() => void) | null = null;

// Called by the router once it exists, so a session that dies mid-use (not
// just a guarded route hit while logged out) also lands on /login.
export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

api.use({
  onResponse({ request, response }) {
    // /login itself answers 401 for wrong credentials - that's a form
    // error, not a dead session, so it must not trigger a redirect.
    if (response.status === 401 && !request.url.endsWith('/api/v1/login')) {
      unauthorizedHandler?.();
    }
    return response;
  },
});
