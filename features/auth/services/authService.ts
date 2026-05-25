import * as SecureStore from 'expo-secure-store';

import { ApiError } from '@/lib/errors';
import { Suburb } from '@/types';
import { AuthUser } from '../types';

const CURRENT_SESSION_KEY = 'current_session';

// Each user's data lives under their own key, keyed by email.
// @ and . are replaced so the key is a valid SecureStore identifier.
function userDataKey(email: string): string {
  return `user_${email.replace(/[@.+]/g, '_')}`;
}

interface StoredUserData {
  user: AuthUser;
  suburb: Suburb | null;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

async function readSessionEmail(): Promise<string | null> {
  return SecureStore.getItemAsync(CURRENT_SESSION_KEY);
}

async function readUserData(email: string): Promise<StoredUserData | null> {
  const raw = await SecureStore.getItemAsync(userDataKey(email));
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isStoredUserData(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function writeUserData(email: string, data: StoredUserData): Promise<void> {
  await SecureStore.setItemAsync(userDataKey(email), JSON.stringify(data));
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getStoredUser(): Promise<AuthUser | null> {
  const email = await readSessionEmail();
  if (email === null) return null;
  const data = await readUserData(email);
  return data?.user ?? null;
}

export async function getStoredSuburb(): Promise<Suburb | null> {
  const email = await readSessionEmail();
  if (email === null) return null;
  const data = await readUserData(email);
  return data?.suburb ?? null;
}

// Persists the user and sets the active session.
// Existing suburb is preserved so returning users don't lose their selection.
export async function storeUser(user: AuthUser): Promise<void> {
  const existing = await readUserData(user.email);
  await writeUserData(user.email, { user, suburb: existing?.suburb ?? null });
  await SecureStore.setItemAsync(CURRENT_SESSION_KEY, user.email);
}

export async function storeSuburb(suburb: Suburb): Promise<void> {
  const email = await readSessionEmail();
  if (email === null) return;
  const existing = await readUserData(email);
  if (existing === null) return;
  await writeUserData(email, { ...existing, suburb });
}

// Clears only the active session — user data is kept for future logins.
export async function clearStoredUser(): Promise<void> {
  await SecureStore.deleteItemAsync(CURRENT_SESSION_KEY);
}

// ── Google userinfo ───────────────────────────────────────────────────────────

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

// ── Type guards ───────────────────────────────────────────────────────────────

function isAuthUser(val: unknown): val is AuthUser {
  if (typeof val !== 'object' || val === null) return false;
  const v = val as Record<string, unknown>;
  return (
    typeof v['id'] === 'string' &&
    typeof v['email'] === 'string' &&
    typeof v['name'] === 'string'
  );
}

function isStoredUserData(val: unknown): val is StoredUserData {
  if (typeof val !== 'object' || val === null) return false;
  const v = val as Record<string, unknown>;
  return isAuthUser(v['user']);
  // suburb field is trusted as-written; worst case it's null
}

function isGoogleUserPayload(val: unknown): val is GoogleUserPayload {
  if (typeof val !== 'object' || val === null) return false;
  const v = val as Record<string, unknown>;
  return (
    typeof v['id'] === 'string' &&
    typeof v['email'] === 'string' &&
    typeof v['name'] === 'string'
  );
}
