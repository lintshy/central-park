import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { logger } from '@/lib/logger';
import { useAuthStore } from '../store/authStore';
import { fetchGoogleUser } from '../services/authService';

WebBrowser.maybeCompleteAuthSession();

// iOS OAuth clients use a reversed-domain URL scheme for redirects.
// ASWebAuthenticationSession handles this natively — no Expo proxy needed,
// and no scheme registration required even in Expo Go.
function buildRedirectUri(): string | undefined {
  if (Platform.OS === 'ios') {
    const iosClientId = process.env['EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID'];
    if (iosClientId !== undefined) {
      const prefix = iosClientId.replace('.apps.googleusercontent.com', '');
      const uri = `com.googleusercontent.apps.${prefix}:/`;
      logger.info('[Auth] iOS redirect URI', { uri });
      return uri;
    }
  }
  // Android and other platforms: let the library decide
  return undefined;
}

const redirectUri = buildRedirectUri();

interface GoogleAuthHook {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: () => void;
}

export function useGoogleAuth(): GoogleAuthHook {
  const signIn = useAuthStore((state) => state.signIn);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env['EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID'],
    iosClientId: process.env['EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID'],
    androidClientId: process.env['EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID'],
    redirectUri,
    extraParams: { prompt: 'select_account' },
  });

  useEffect(() => {
    if (response === null || response.type === 'cancel' || response.type === 'dismiss') return;

    if (response.type === 'error') {
      logger.warn('[Auth] OAuth error', { error: response.error });
      const code = response.error?.code ?? response.error?.message ?? 'unknown';
      setError(`Google sign-in error: ${code}`);
      return;
    }

    if (response.type !== 'success') return;

    const accessToken = response.authentication?.accessToken;

    logger.info('[Auth] response type', { type: response.type, hasAccessToken: accessToken !== undefined });

    if (accessToken === undefined) {
      setError('No access token received from Google');
      return;
    }

    setIsLoading(true);
    setError(null);

    void (async () => {
      try {
        const user = await fetchGoogleUser(accessToken);
        await signIn(user);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Sign-in failed');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [response, signIn]);

  const signInWithGoogle = useCallback((): void => {
    setError(null);
    void promptAsync();
  }, [promptAsync]);

  return {
    isReady: request !== null,
    isLoading,
    error,
    signIn: signInWithGoogle,
  };
}
