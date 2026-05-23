import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { clearStoredUser, getStoredUser, storeUser } from '../services/authService';
import { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props): React.JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStoredUser()
      .then((stored) => setUser(stored))
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = useCallback(async (u: AuthUser): Promise<void> => {
    await storeUser(u);
    setUser(u);
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    await clearStoredUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === null) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
