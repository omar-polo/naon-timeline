import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

export default function useLogin() {
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const { data, error } = await api.POST('/api/v1/login', { body: input });
      if (error) throw new Error(error.detail ?? error.title ?? 'Invalid email or password');
      return data;
    },
  });
}
