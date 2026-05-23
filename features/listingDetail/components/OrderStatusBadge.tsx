import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  isAccepting: boolean;
};

export default function OrderStatusBadge({ isAccepting }: Props) {
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
  closed: { backgroundColor: '#fdf2f2' },
  dot: { borderRadius: 4, height: 8, width: 8 },
  dotClosed: { backgroundColor: '#e74c3c' },
  dotOpen: { backgroundColor: '#27ae60' },
  label: { fontSize: 13, fontWeight: '600' },
  labelClosed: { color: '#c0392b' },
  labelOpen: { color: '#1e8449' },
  open: { backgroundColor: '#eafaf1' },
});
