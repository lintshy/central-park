import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { LISTINGS } from '../../../constants/listings';
import { Category, RootStackParamList } from '../../../types';
import ListView from './ListView';
import MapView from './MapView';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Listings'>;
  route: RouteProp<RootStackParamList, 'Listings'>;
};

const CATEGORY_META: Record<Category, { label: string; emoji: string; color: string }> = {
  meals: { label: 'Home Meals', emoji: '🍽️', color: '#1abc9c' },
  garage_sales: { label: 'Garage Sales', emoji: '🏷️', color: '#f39c12' },
  activities: { label: 'Activity Groups', emoji: '⚽', color: '#2980b9' },
};

type ViewMode = 'list' | 'map';

export default function ListingsScreen({ navigation, route }: Props) {
  const { category, suburb } = route.params;
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const meta = CATEGORY_META[category];

  const listings = useMemo(
    () => LISTINGS.filter((l) => l.category === category && l.postcode === suburb.postcode),
    [category, suburb.postcode],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5276" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.emoji}>{meta.emoji}</Text>
        <View>
          <Text style={styles.title}>{meta.label}</Text>
          <Text style={styles.subtitle}>
            {suburb.name} · {suburb.postcode}
          </Text>
        </View>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'list' && styles.toggleActive]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
            List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'map' && styles.toggleActive]}
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
            Map
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'list' ? (
        <ListView listings={listings} accentColor={meta.color} />
      ) : (
        <MapView listings={listings} accentColor={meta.color} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fb' },
  header: {
    backgroundColor: '#1a5276',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  emoji: { fontSize: 32 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: '#aed6f1', marginTop: 2 },
  toggleRow: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#e8eaf0',
    borderRadius: 10,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleActive: { backgroundColor: '#1a5276' },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#7f8c8d' },
  toggleTextActive: { color: '#fff' },
  backBtn: { marginRight: 12 },
  backArrow: { fontSize: 32, color: '#fff', lineHeight: 34 },
});
