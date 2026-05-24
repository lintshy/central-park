import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { UserAvatarButton } from '../../../components/UserAvatarButton';
import { LISTINGS } from '../../../constants/listings';
import { theme } from '../../../theme';
import { Category, RootStackParamList } from '../../../types';
import { ListView } from './ListView';
import { MapView } from './MapView';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Listings'>;
  route: RouteProp<RootStackParamList, 'Listings'>;
};

const CATEGORY_META: Record<Category, { label: string; emoji: string; color: string }> = {
  meals: { label: 'Home Meals', emoji: '🍽️', color: theme.colors.categoryMeals },
  garage_sales: { label: 'Garage Sales', emoji: '🏷️', color: theme.colors.categoryGarageSales },
  activities: { label: 'Activity Groups', emoji: '⚽', color: theme.colors.categoryActivities },
};

type ViewMode = 'list' | 'map';

export function ListingsScreen({ navigation, route }: Props) {
  const { category, suburb } = route.params;
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const meta = CATEGORY_META[category];

  const listings = useMemo(
    () => LISTINGS.filter((l) => l.category === category && l.postcode === suburb.postcode),
    [category, suburb.postcode],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.emoji}>{meta.emoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{meta.label}</Text>
          <Text style={styles.subtitle}>
            {suburb.name} · {suburb.postcode}
          </Text>
        </View>
        <UserAvatarButton size={36} />
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
        <ListView
          listings={listings}
          accentColor={meta.color}
          onPressItem={(listing) =>
            navigation.navigate('ListingDetail', { listing, accentColor: meta.color })
          }
        />
      ) : (
        <MapView listings={listings} accentColor={meta.color} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  emoji: { fontSize: 32 },
  title: { fontSize: 22, fontWeight: '800', color: theme.colors.surface },
  subtitle: { fontSize: 13, color: theme.colors.primaryLight, marginTop: 2 },
  toggleRow: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: theme.colors.border,
    borderRadius: 10,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleActive: { backgroundColor: theme.colors.primary },
  toggleText: { fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary },
  toggleTextActive: { color: theme.colors.surface },
  headerText: { flex: 1 },
  backBtn: { marginRight: 12 },
  backArrow: { fontSize: 32, color: theme.colors.surface, lineHeight: 34 },
});
