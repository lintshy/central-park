import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Listing } from '../types';

type Props = {
  listing: Listing;
  accentColor: string;
};

export default function ListingCard({ listing, accentColor }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>
        <Text style={styles.address}>{listing.address}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {listing.description}
        </Text>

        {(listing.date || listing.time) && (
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>📅</Text>
            <Text style={styles.metaText}>
              {listing.date}
              {listing.time ? ` · ${listing.time}` : ''}
            </Text>
          </View>
        )}

        {listing.price && (
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>💰</Text>
            <Text style={[styles.metaText, styles.price]}>{listing.price}</Text>
          </View>
        )}

        {listing.host && (
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>👤</Text>
            <Text style={styles.metaText}>{listing.host}</Text>
          </View>
        )}

        {listing.contact && (
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>📧</Text>
            <Text style={[styles.metaText, { color: '#2980b9' }]}>{listing.contact}</Text>
          </View>
        )}

        {listing.tags && listing.tags.length > 0 && (
          <View style={styles.tagRow}>
            {listing.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { borderColor: accentColor }]}>
                <Text style={[styles.tagText, { color: accentColor }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  accentBar: { width: 5 },
  content: { flex: 1, padding: 16 },
  title: { fontSize: 16, fontWeight: '700', color: '#1c2833', marginBottom: 2 },
  address: { fontSize: 12, color: '#aab7b8', marginBottom: 8 },
  description: { fontSize: 13, color: '#5d6d7e', lineHeight: 19, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  metaIcon: { fontSize: 12, marginRight: 6 },
  metaText: { fontSize: 12, color: '#7f8c8d', flexShrink: 1 },
  price: { fontWeight: '700', color: '#27ae60', fontSize: 13 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 6 },
  tag: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: { fontSize: 11, fontWeight: '600' },
});
