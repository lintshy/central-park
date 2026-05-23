import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '../features/auth/store/authStore';
import { theme } from '../theme';

interface Props {
  size?: number;
}

export function UserAvatar({ size = 36 }: Props): React.JSX.Element {
  const user = useAuthStore((state) => state.user);

  const style = { width: size, height: size, borderRadius: size / 2 };

  if (user?.picture !== null && user?.picture !== undefined) {
    return <Image source={{ uri: user.picture }} style={[styles.avatar, style]} />;
  }

  const initials = user?.name
    .split(' ')
    .map((n) => n[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '?';

  return (
    <View style={[styles.fallback, style]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderColor: 'rgba(255,255,255,0.4)',
    borderWidth: 2,
  },
  fallback: {
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    borderColor: 'rgba(255,255,255,0.4)',
    borderWidth: 2,
    justifyContent: 'center',
  },
  initials: {
    color: theme.colors.surface,
    fontWeight: '700',
  },
});
