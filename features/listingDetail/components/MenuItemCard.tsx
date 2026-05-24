import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { theme } from '../../../theme';
import { MenuItem } from '../../../types';

type Props = {
  item: MenuItem;
  quantity: number;
  accentColor: string;
  onChangeQuantity: (qty: number) => void;
};

export function MenuItemCard({ item, quantity, accentColor, onChangeQuantity }: Props) {
  return (
    <View style={styles.card}>
      {item.thumbnailUrl ? (
        <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
      ) : (
        <View style={styles.thumbnailPlaceholder}>
          <Text style={styles.placeholderEmoji}>🍽️</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        )}
        <Text style={styles.price}>${item.priceAud.toFixed(2)}</Text>
      </View>

      <View style={styles.stepper}>
        <TouchableOpacity
          style={[styles.stepBtn, { borderColor: accentColor }]}
          onPress={() => onChangeQuantity(Math.max(0, quantity - 1))}
          activeOpacity={0.7}
        >
          <Text style={[styles.stepIcon, { color: accentColor }]}>−</Text>
        </TouchableOpacity>

        <Text style={styles.qty}>{quantity}</Text>

        <TouchableOpacity
          style={[styles.stepBtn, { borderColor: accentColor, backgroundColor: quantity > 0 ? accentColor : 'transparent' }]}
          onPress={() => onChangeQuantity(quantity + 1)}
          activeOpacity={0.7}
        >
          <Text style={[styles.stepIcon, { color: quantity > 0 ? '#fff' : accentColor }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    elevation: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  description: { color: theme.colors.textSecondary, fontSize: 12, lineHeight: 16, marginTop: 2 },
  info: { flex: 1 },
  name: { color: theme.colors.textPrimary, fontSize: 15, fontWeight: '700' },
  placeholderEmoji: { fontSize: 28 },
  price: { color: theme.colors.success, fontSize: 14, fontWeight: '700', marginTop: 4 },
  qty: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  stepBtn: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  stepIcon: { fontSize: 18, fontWeight: '600', lineHeight: 20 },
  stepper: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  thumbnail: { borderRadius: 10, height: 72, width: 72 },
  thumbnailPlaceholder: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
});
