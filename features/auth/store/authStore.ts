import { create } from 'zustand';

import { Suburb } from '../../../types';
import {
  clearStoredSuburb,
  clearStoredUser,
  getStoredSuburb,
  getStoredUser,
  storeSuburb,
  storeUser,
} from '../services/authService';
import { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  suburb: Suburb | null;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  signIn: (user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
  setSuburb: (suburb: Suburb) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  suburb: null,
  isLoading: true,

  hydrate: async () => {
    const [user, suburb] = await Promise.all([getStoredUser(), getStoredSuburb()]);
    set({ user, suburb, isLoading: false });
  },

  signIn: async (user: AuthUser) => {
    await storeUser(user);
    set({ user });
  },

  signOut: async () => {
    await Promise.all([clearStoredUser(), clearStoredSuburb()]);
    set({ user: null, suburb: null });
  },

  setSuburb: async (suburb: Suburb) => {
    await storeSuburb(suburb);
    set({ suburb });
  },
}));
