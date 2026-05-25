import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ListingCard } from '@/components/ListingCard';
import { theme } from '@/theme';
import { Listing } from '@/types';

type Props = {
  listings: Listing[];
  accentColor: string;
  onPressItem: (listing: Listing) => void;
};

export function ListView({ listings, accentColor, onPressItem }: Props) {
  return (
    <FlatList
      data={listings}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ListingCard listing={item} accentColor={accentColor} onPress={() => onPressItem(item)} />
      )}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No listings found for this suburb yet.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: { paddingTop: 60, alignItems: 'center' },
  emptyText: { color: theme.colors.textTertiary, fontSize: 15 },
});
