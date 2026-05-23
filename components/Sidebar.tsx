import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuthStore } from '../features/auth/store/authStore';
import { theme } from '../theme';
import { UserAvatar } from './UserAvatar';

interface Props {
  visible: boolean;
  onClose: () => void;
  onNavigateToProfile: () => void;
}

const PANEL_WIDTH = 280;

export function Sidebar({ visible, onClose, onNavigateToProfile }: Props): React.JSX.Element | null {
  const [shouldRender, setShouldRender] = useState(false);

  const slideX = useRef(new Animated.Value(PANEL_WIDTH)).current;

  const fade = useRef(new Animated.Value(0)).current;
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(slideX, { toValue: 0, duration: 260, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideX, { toValue: PANEL_WIDTH, duration: 220, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) setShouldRender(false);
      });
    }
    // slideX and fade are stable Animated.Value refs — intentionally omitted from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function handleSignOut(): void {
    onClose();
    void signOut();
  }

  if (!shouldRender) return null;

  return (
    <Modal
      transparent
      visible={shouldRender}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Animated.View style={[styles.overlay, { opacity: fade }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.panel, { transform: [{ translateX: slideX }] }]}>
          <View style={styles.userSection}>
            <UserAvatar size={56} />
            <Text style={styles.name} numberOfLines={1}>{user?.name ?? ''}</Text>
            <Text style={styles.email} numberOfLines={1}>{user?.email ?? ''}</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} onPress={onNavigateToProfile} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>👤</Text>
            <Text style={styles.menuLabel}>Profile</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.menuItemDisabled]} disabled>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={[styles.menuLabel, styles.menuLabelMuted]}>Settings</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={[styles.menuLabel, styles.signOutLabel]}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  panel: {
    backgroundColor: theme.colors.surface,
    bottom: 0,
    elevation: 16,
    position: 'absolute',
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    top: 0,
    width: PANEL_WIDTH,
  },
  userSection: {
    alignItems: 'flex-start',
    backgroundColor: theme.colors.primary,
    gap: 4,
    paddingBottom: 28,
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  name: {
    color: theme.colors.surface,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 12,
  },
  email: {
    color: theme.colors.primaryLight,
    fontSize: 13,
  },
  divider: {
    backgroundColor: theme.colors.border,
    height: 1,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  menuItemDisabled: { opacity: 0.4 },
  menuIcon: { fontSize: 20, width: 26 },
  menuLabel: {
    color: theme.colors.textPrimary,
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  menuLabelMuted: { color: theme.colors.textSecondary },
  menuArrow: { color: theme.colors.textTertiary, fontSize: 22, fontWeight: '300' },
  signOutLabel: { color: theme.colors.error, fontWeight: '600' },
});
