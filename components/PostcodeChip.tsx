import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { theme } from '../theme';
import { PostcodeEntry } from '../types';

type Props = {
  entry: PostcodeEntry;
  selected: boolean;
  onPress: () => void;
  distanceKm?: number;
};

export function PostcodeChip({ entry, selected, onPress, distanceKm }: Props) {
  const regionLabel = entry.label.split('–')[1]?.trim() ?? entry.label;

  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.code, selected && styles.textActive]}>{entry.code}</Text>
      <Text style={[styles.region, selected && styles.textActive]} numberOfLines={2}>
        {regionLabel}
      </Text>
      {distanceKm !== undefined && (
        <Text style={[styles.distance, selected && styles.textActive]}>
          {distanceKm < 1
            ? `${Math.round(distanceKm * 1000)} m`
            : `${distanceKm.toFixed(1)} km`}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 14,
    borderWidth: 2,
    elevation: 2,
    flex: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  code: { color: theme.colors.primary, fontSize: 26, fontWeight: '800' },
  distance: { color: theme.colors.secondary, fontSize: 11, fontWeight: '600', marginTop: 4 },
  region: { color: theme.colors.textSecondary, fontSize: 11, marginTop: 4, textAlign: 'center' },
  textActive: { color: theme.colors.surface },
});
