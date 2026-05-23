import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import PostcodeChip from '../../components/PostcodeChip';
import SectionLabel from '../../components/SectionLabel';
import { NearbyResult, Postcode } from '../../types';

type Props = {
  results: NearbyResult[];
  selected: Postcode | null;
  onSelect: (code: Postcode) => void;
  onSearchInstead: () => void;
};

export default function NearbyPostcodeList({ results, selected, onSelect, onSearchInstead }: Props) {
  return (
    <View>
      <SectionLabel>Nearest postcodes</SectionLabel>
      <View style={styles.row}>
        {results.map(({ entry, distanceKm }) => (
          <PostcodeChip
            key={entry.code}
            entry={entry}
            distanceKm={distanceKm}
            selected={selected === entry.code}
            onPress={() => onSelect(entry.code)}
          />
        ))}
      </View>
      <TouchableOpacity onPress={onSearchInstead} style={styles.searchLink}>
        <Text style={styles.searchLinkText}>Search a different postcode →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  searchLink: { alignSelf: 'flex-end', paddingVertical: 4 },
  searchLinkText: { color: '#2980b9', fontSize: 13 },
});
