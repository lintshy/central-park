import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { theme } from '../../../theme';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

export function LoginScreen(): React.JSX.Element {
  const { isReady, isLoading, error, signIn } = useGoogleAuth();
  const isBusy = isLoading || !isReady;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      <View style={styles.header}>
        <Text style={styles.appName}>Central Park</Text>
        <Text style={styles.tagline}>Your local community hub</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.headline}>Welcome</Text>
        <Text style={styles.subtext}>
          Sign in to browse home meals, garage sales, and activity groups in your neighbourhood.
        </Text>

        {error !== null && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.googleBtn, isBusy && styles.googleBtnDisabled]}
          onPress={signIn}
          disabled={isBusy}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.textPrimary} size="small" />
          ) : (
            <>
              <View style={styles.googleIconCircle}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By signing in you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 80,
    paddingBottom: 48,
    paddingHorizontal: 28,
  },
  appName: {
    color: theme.colors.surface,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tagline: { color: theme.colors.primaryLight, fontSize: 15, marginTop: 6 },
  body: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
  },
  headline: {
    color: theme.colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 10,
  },
  subtext: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 36,
  },
  errorBanner: {
    backgroundColor: theme.colors.errorBg,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  errorText: {
    color: theme.colors.errorDark,
    fontSize: 13,
    fontWeight: '500',
  },
  googleBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    elevation: 2,
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  googleBtnDisabled: { opacity: 0.5 },
  googleIconCircle: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  googleIconText: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  googleBtnText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    color: theme.colors.textTertiary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});
