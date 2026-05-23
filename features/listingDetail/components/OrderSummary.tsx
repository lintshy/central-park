import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MenuItem } from '../../../types';

type Props = {
  items: MenuItem[];
  quantities: Record<string, number>;
  accentColor: string;
};

export default function OrderSummary({ items, quantities, accentColor }: Props) {
  const totalCount = Object.values(quantities).reduce((sum, q) => sum + q, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (quantities[item.id] ?? 0) * item.priceAud,
    0,
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        {totalCount > 0 ? (
          <>
            <Text style={styles.count}>{totalCount} {totalCount === 1 ? 'item' : 'items'}</Text>
            <Text style={styles.total}>${totalPrice.toFixed(2)}</Text>
          </>
        ) : (
          <Text style={styles.hint}>Select items above to place an order</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.orderBtn, { backgroundColor: accentColor }, styles.orderBtnDisabled]}
        disabled
        activeOpacity={1}
      >
        <Text style={styles.orderBtnText}>Order via WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopColor: '#e8eaf0',
    borderTopWidth: 1,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  count: { color: '#1c2833', fontSize: 15, fontWeight: '700' },
  hint: { color: '#aab7b8', fontSize: 14 },
  orderBtn: {
    alignItems: 'center',
    borderRadius: 14,
    marginTop: 12,
    paddingVertical: 16,
  },
  orderBtnDisabled: { opacity: 0.45 },
  orderBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  total: { color: '#27ae60', fontSize: 18, fontWeight: '800' },
});
