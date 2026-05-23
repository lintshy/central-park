import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import SectionLabel from '../../components/SectionLabel';
import { POSTCODES } from '../../data/suburbs';
import { Postcode, PostcodeEntry } from '../../types';

type Props = {
  selected: Postcode | null;
  onSelect: (code: Postcode) => void;
};

function DropdownItem({ entry, onPress }: { entry: PostcodeEntry; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.itemCode}>{entry.code}</Text>
      <Text style={styles.itemLabel}>{entry.label.split('–')[1]?.trim() ?? entry.label}</Text>
    </TouchableOpacity>
  );
}

export default function PostcodeTypeahead({ selected, onSelect }: Props) {
  const [query, setQuery] = useState('');

  const results = POSTCODES.filter(
    (p) =>
      query.length === 0 ||
      p.code.includes(query) ||
      p.label.toLowerCase().includes(query.toLowerCase()),
  );

  function handleSelect(code: Postcode) {
    setQuery('');
    onSelect(code);
  }

  return (
    <View>
      <SectionLabel>Search postcode</SectionLabel>
      <TextInput
        style={styles.input}
        placeholder="Type a postcode or suburb…"
        placeholderTextColor="#aab7b8"
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {query.length > 0 && (
        <View style={styles.dropdown}>
          {results.map((entry) => (
            <DropdownItem key={entry.code} entry={entry} onPress={() => handleSelect(entry.code)} />
          ))}
          {results.length === 0 && (
            <Text style={styles.noResults}>No postcodes found</Text>
          )}
        </View>
      )}
      {selected && query.length === 0 && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedText}>✓ Postcode {selected} selected</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#e8eaf0',
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 16,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#e8eaf0',
    borderRadius: 12,
    borderWidth: 1.5,
    color: '#1c2833',
    fontSize: 15,
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  item: {
    borderBottomColor: '#f4f6fb',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemCode: { color: '#1a5276', fontSize: 16, fontWeight: '700', width: 44 },
  itemLabel: { color: '#7f8c8d', fontSize: 14 },
  noResults: { color: '#aab7b8', fontSize: 14, padding: 16, textAlign: 'center' },
  selectedBadge: {
    backgroundColor: '#eafaf1',
    borderRadius: 8,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectedText: { color: '#27ae60', fontSize: 13, fontWeight: '600' },
});
