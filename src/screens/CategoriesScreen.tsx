import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Category } from '../types';

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
    color: '#e8f8f5',
  },
  {
    id: 'garage_sales',
    label: 'Garage Sales',
    emoji: '🏷️',
    description: 'Local bargains and second-hand finds',
    color: '#fef9e7',
  },
  {
    id: 'activities',
    label: 'Activity Groups',
    emoji: '⚽',
    description: 'Running, cricket, yoga and more',
    color: '#eaf4fb',
  },
];

export default function CategoriesScreen({ navigation, route }: Props) {
  const { suburb } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5276" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#f4f6fb' },
  header: {
    backgroundColor: '#1a5276',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  suburb: { fontSize: 26, fontWeight: '800', color: '#fff' },
  postcode: { fontSize: 13, color: '#aed6f1', marginTop: 2 },
  body: { flex: 1, padding: 20, gap: 14 },
  prompt: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c2833',
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
  cardLabel: { fontSize: 18, fontWeight: '700', color: '#1c2833' },
  cardDesc: { fontSize: 13, color: '#7f8c8d', marginTop: 2 },
  cardArrow: { fontSize: 26, color: '#aab7b8', fontWeight: '300' },
  backBtn: { marginBottom: 8, alignSelf: 'flex-start' },
  backArrow: { fontSize: 32, color: '#fff', lineHeight: 34 },
});
