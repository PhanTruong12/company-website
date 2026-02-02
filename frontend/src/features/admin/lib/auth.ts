// features/admin/lib/auth.ts - Admin authentication utilities
import { tokenStorage } from '../../../core/api/client';

export const authService = {
  login: (token: string): void => {
    tokenStorage.set(token);
  },

  logout: (): void => {
    tokenStorage.remove();
  },

  isAuthenticated: (): boolean => {
    return tokenStorage.has();
  },

  getToken: (): string | null => {
    return tokenStorage.get();
  },
};
