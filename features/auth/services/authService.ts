import * as SecureStore from 'expo-secure-store';

import { ApiError } from '../../../lib/errors';
import { AuthUser } from '../types';

const AUTH_USER_KEY = 'auth_user';

export async function getStoredUser(): Promise<AuthUser | null> {
  const raw = await SecureStore.getItemAsync(AUTH_USER_KEY);
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isAuthUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function storeUser(user: AuthUser): Promise<void> {
  await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(user));
}

export async function clearStoredUser(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_USER_KEY);
}

interface GoogleUserPayload {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export async function fetchGoogleUser(accessToken: string): Promise<AuthUser> {
  const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new ApiError('Failed to fetch Google user info', res.status, 'GOOGLE_USERINFO_FAILED');
  }
  const data: unknown = await res.json();
  if (!isGoogleUserPayload(data)) {
    throw new ApiError('Unexpected Google user response shape', 500, 'GOOGLE_USERINFO_INVALID');
  }
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    picture: data.picture ?? null,
  };
}

function isAuthUser(val: unknown): val is AuthUser {
  if (typeof val !== 'object' || val === null) return false;
  const v = val as Record<string, unknown>;
  return typeof v['id'] === 'string' && typeof v['email'] === 'string' && typeof v['name'] === 'string';
}

function isGoogleUserPayload(val: unknown): val is GoogleUserPayload {
  if (typeof val !== 'object' || val === null) return false;
  const v = val as Record<string, unknown>;
  return typeof v['id'] === 'string' && typeof v['email'] === 'string' && typeof v['name'] === 'string';
}
