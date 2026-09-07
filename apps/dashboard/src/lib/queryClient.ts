import { QueryClient } from '@tanstack/react-query';

// Hoisted to its own module so router.tsx's beforeLoad guard can share the
// same cache as useCurrentUser() - one /me fetch per navigation, not two.
export const queryClient = new QueryClient();
