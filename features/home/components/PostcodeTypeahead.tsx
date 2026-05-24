import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SectionLabel } from '../../../components/SectionLabel';
import { POSTCODES } from '../../../constants/suburbs';
import { theme } from '../../../theme';
import { Postcode, PostcodeEntry } from '../../../types';

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

export function PostcodeTypeahead({ selected, onSelect }: Props) {
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
        placeholderTextColor={theme.colors.textTertiary}
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
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 16,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 12,
    borderWidth: 1.5,
    color: theme.colors.textPrimary,
    fontSize: 15,
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  item: {
    borderBottomColor: theme.colors.background,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemCode: { color: theme.colors.primary, fontSize: 16, fontWeight: '700', width: 44 },
  itemLabel: { color: theme.colors.textSecondary, fontSize: 14 },
  noResults: { color: theme.colors.textTertiary, fontSize: 14, padding: 16, textAlign: 'center' },
  selectedBadge: {
    backgroundColor: theme.colors.successBg,
    borderRadius: 8,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectedText: { color: theme.colors.success, fontSize: 13, fontWeight: '600' },
});
