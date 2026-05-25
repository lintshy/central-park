import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { theme } from '@/theme';

type Props = {
  onRequestLocation: () => void;
  onSkip: () => void;
};

export function GpsPromptCard({ onRequestLocation, onSkip }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>📍</Text>
      <Text style={styles.title}>Find postcodes near you</Text>
      <Text style={styles.body}>
        Allow location access to instantly see the closest postcodes in your area.
      </Text>
      <TouchableOpacity style={styles.primaryBtn} onPress={onRequestLocation} activeOpacity={0.85}>
        <Text style={styles.primaryBtnText}>Use my location</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
        <Text style={styles.skipText}>Skip, search instead</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    elevation: 3,
    marginTop: 8,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },
  body: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
    textAlign: 'center',
  },
  icon: { fontSize: 48, marginBottom: 16 },
  primaryBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 32,
    paddingVertical: 14,
    width: '100%',
  },
  primaryBtnText: { color: theme.colors.surface, fontSize: 15, fontWeight: '700' },
  skipBtn: { paddingVertical: 4 },
  skipText: { color: theme.colors.textSecondary, fontSize: 14, textDecorationLine: 'underline' },
  title: { color: theme.colors.textPrimary, fontSize: 18, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
});
