import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import SectionLabel from '../../../components/SectionLabel';
import { RootStackParamList } from '../../../types';
import MenuItemCard from './MenuItemCard';
import OrderStatusBadge from './OrderStatusBadge';
import OrderSummary from './OrderSummary';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ListingDetail'>;
  route: RouteProp<RootStackParamList, 'ListingDetail'>;
};

export default function ListingDetailScreen({ navigation, route }: Props) {
  const { listing, accentColor } = route.params;
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const hasMenu = listing.menuItems !== undefined && listing.menuItems.length > 0;

  function handleChangeQuantity(itemId: string, qty: number) {
    setQuantities((prev) => ({ ...prev, [itemId]: qty }));
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5276" />

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: accentColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={2}>{listing.title}</Text>
          <Text style={styles.address}>{listing.address} · {listing.suburb}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Meta row ── */}
        <View style={styles.metaRow}>
          {listing.host && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>👤</Text>
              <Text style={styles.metaText}>{listing.host}</Text>
            </View>
          )}
          {listing.date && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaText}>{listing.date}</Text>
            </View>
          )}
          {listing.time && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🕐</Text>
              <Text style={styles.metaText}>{listing.time}</Text>
            </View>
          )}
        </View>

        {/* ── Order status ── */}
        {listing.isAcceptingOrders !== undefined && (
          <View style={styles.statusRow}>
            <OrderStatusBadge isAccepting={listing.isAcceptingOrders} />
          </View>
        )}

        {/* ── About ── */}
        <View style={styles.section}>
          <SectionLabel>About</SectionLabel>
          <Text style={styles.description}>{listing.description}</Text>
        </View>

        {/* ── Tags ── */}
        {listing.tags && listing.tags.length > 0 && (
          <View style={styles.tagRow}>
            {listing.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { borderColor: accentColor }]}>
                <Text style={[styles.tagText, { color: accentColor }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Menu ── */}
        {hasMenu && (
          <View style={styles.section}>
            <SectionLabel>Menu</SectionLabel>
            {listing.menuItems!.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                quantity={quantities[item.id] ?? 0}
                accentColor={accentColor}
                onChangeQuantity={(qty) => handleChangeQuantity(item.id, qty)}
              />
            ))}
          </View>
        )}

        {/* Contact */}
        {listing.contact && (
          <View style={styles.section}>
            <SectionLabel>Contact</SectionLabel>
            <Text style={styles.contactText}>{listing.contact}</Text>
          </View>
        )}
      </ScrollView>

      {/* ── Sticky order footer ── */}
      {hasMenu && (
        <OrderSummary
          items={listing.menuItems!}
          quantities={quantities}
          accentColor={accentColor}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f4f6fb', flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backBtn: { marginTop: 4 },
  backArrow: { color: '#fff', fontSize: 32, lineHeight: 34 },
  headerText: { flex: 1 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', lineHeight: 28 },
  address: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 16 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 14 },
  metaItem: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  metaIcon: { fontSize: 14 },
  metaText: { color: '#5d6d7e', fontSize: 13 },
  statusRow: { marginBottom: 20 },
  section: { marginBottom: 24 },
  description: { color: '#5d6d7e', fontSize: 14, lineHeight: 22 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  tag: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12, fontWeight: '600' },
  contactText: { color: '#2980b9', fontSize: 14 },
});
