import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { UserAvatarButton } from '@/components/UserAvatarButton';
import { theme } from '@/theme';
import { Category, RootStackParamList } from '@/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Categories'>;
  route: RouteProp<RootStackParamList, 'Categories'>;
};

const CATEGORIES: { id: Category; label: string; emoji: string; description: string; color: string }[] = [
  {
    id: 'meals',
    label: 'Home Meals',
    emoji: '🍽️',
    description: 'Home-cooked food from neighbours',
    color: theme.colors.categoryMealsBg,
  },
  {
    id: 'garage_sales',
    label: 'Garage Sales',
    emoji: '🏷️',
    description: 'Local bargains and second-hand finds',
    color: theme.colors.categoryGarageSalesBg,
  },
  {
    id: 'activities',
    label: 'Activity Groups',
    emoji: '⚽',
    description: 'Running, cricket, yoga and more',
    color: theme.colors.categoryActivitiesBg,
  },
];

export function CategoriesScreen({ navigation, route }: Props) {
  const { suburb } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      <View style={styles.header}>
        <View style={styles.headerTop}>

          <UserAvatarButton size={36} />
        </View>
        <Text style={styles.suburb}>{suburb.name}</Text>
        <Text style={styles.postcode}>Postcode {suburb.postcode}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.prompt}>What are you looking for?</Text>

        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.card, { backgroundColor: cat.color }]}
            onPress={() => navigation.navigate('Listings', { category: cat.id, suburb })}
            activeOpacity={0.8}
          >
            <Text style={styles.cardEmoji}>{cat.emoji}</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>{cat.label}</Text>
              <Text style={styles.cardDesc}>{cat.description}</Text>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  suburb: { fontSize: 26, fontWeight: '800', color: theme.colors.surface },
  postcode: { fontSize: 13, color: theme.colors.primaryLight, marginTop: 2 },
  body: { flex: 1, padding: 20, gap: 14 },
  prompt: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardEmoji: { fontSize: 36, marginRight: 16 },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary },
  cardDesc: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
  cardArrow: { fontSize: 26, color: theme.colors.textTertiary, fontWeight: '300' },
  headerTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  backBtn: { alignSelf: 'flex-start' },
  backArrow: { fontSize: 32, color: theme.colors.surface, lineHeight: 34 },
});
