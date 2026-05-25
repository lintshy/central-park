import { create } from 'zustand';

import { Suburb } from '@/types';
import {
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
    // storeUser preserves any existing suburb for this email address
    await storeUser(user);
    // Read back the suburb so returning users are restored to their suburb immediately
    const suburb = await getStoredSuburb();
    set({ user, suburb });
  },

  signOut: async () => {
    // Clears only the session — user_${email} data (including suburb) is kept
    // so returning users don't have to re-select their suburb
    await clearStoredUser();
    set({ user: null, suburb: null });
  },

  setSuburb: async (suburb: Suburb) => {
    await storeSuburb(suburb);
    set({ suburb });
  },
}));
