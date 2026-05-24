import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../../theme';

type Props = {
  isAccepting: boolean;
};

export function OrderStatusBadge({ isAccepting }: Props) {
  return (
    <View style={[styles.badge, isAccepting ? styles.open : styles.closed]}>
      <View style={[styles.dot, isAccepting ? styles.dotOpen : styles.dotClosed]} />
      <Text style={[styles.label, isAccepting ? styles.labelOpen : styles.labelClosed]}>
        {isAccepting ? 'Accepting orders' : 'Not accepting orders'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  closed: { backgroundColor: theme.colors.errorBg },
  dot: { borderRadius: 4, height: 8, width: 8 },
  dotClosed: { backgroundColor: theme.colors.error },
  dotOpen: { backgroundColor: theme.colors.success },
  label: { fontSize: 13, fontWeight: '600' },
  labelClosed: { color: theme.colors.errorDark },
  labelOpen: { color: theme.colors.successDark },
  open: { backgroundColor: theme.colors.successBg },
});
