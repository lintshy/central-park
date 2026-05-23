import { create } from 'zustand';

import { clearStoredUser, getStoredUser, storeUser } from '../services/authService';
import { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  signIn: (user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,

  hydrate: async () => {
    const stored = await getStoredUser();
    set({ user: stored, isLoading: false });
  },

  signIn: async (user: AuthUser) => {
    await storeUser(user);
    set({ user });
  },

  signOut: async () => {
    await clearStoredUser();
    set({ user: null });
  },
}));
