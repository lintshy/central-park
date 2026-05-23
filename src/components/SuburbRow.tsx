import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Suburb } from '../types';

type Props = {
  suburb: Suburb;
  onPress: () => void;
};

export default function SuburbRow({ suburb, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.name}>{suburb.name}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  arrow: { color: '#aed6f1', fontSize: 22, fontWeight: '300' },
  name: { color: '#1c2833', flex: 1, fontSize: 16, fontWeight: '600' },
});
