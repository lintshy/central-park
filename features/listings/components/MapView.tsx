import React, { useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ListingCard from '../../../components/ListingCard';
import { theme } from '../../../theme';
import { Listing } from '../../../types';

type Props = {
  listings: Listing[];
  accentColor: string;
};

export default function MapView({ listings, accentColor }: Props) {
  const [selected, setSelected] = useState<Listing | null>(null);

  const region = useMemo(() => {
    if (listings.length === 0) {
      return { latitude: -33.72, longitude: 150.87, latitudeDelta: 0.06, longitudeDelta: 0.06 };
    }
    return {
      latitude: listings.reduce((s, l) => s + l.latitude, 0) / listings.length,
      longitude: listings.reduce((s, l) => s + l.longitude, 0) / listings.length,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    };
  }, [listings]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.webNote}>Map view is available on iOS and Android.</Text>
        <FlatList
          data={listings}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <ListingCard listing={item} accentColor={accentColor} />}
          contentContainerStyle={{ padding: 16 }}
        />
      </View>
    );
  }

  // Lazy-require so the app doesn't crash if react-native-maps isn't linked
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any
  let RNMapView: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Marker: any = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const maps = require('react-native-maps');
    RNMapView = maps.default;
    Marker = maps.Marker;
  } catch {
    return (
      <View style={styles.container}>
        <Text style={styles.webNote}>Map not available in this environment.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RNMapView style={styles.map} initialRegion={region}>
        {listings.map((item) => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            title={item.title}
            description={item.address}
            pinColor={accentColor}
            onPress={() => setSelected(item)}
          />
        ))}
      </RNMapView>

      {selected && (
        <View style={styles.popup}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.popupTitle}>{selected.title}</Text>
          <Text style={styles.popupAddr}>{selected.address}</Text>
          {selected.date && (
            <Text style={styles.popupMeta}>
              {selected.date} {selected.time ? `· ${selected.time}` : ''}
            </Text>
          )}
          {selected.price && <Text style={styles.popupPrice}>{selected.price}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  webNote: { textAlign: 'center', color: theme.colors.textSecondary, padding: 24, fontSize: 14 },
  popup: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  closeBtn: { position: 'absolute', top: 12, right: 14 },
  closeText: { fontSize: 16, color: theme.colors.textTertiary },
  popupTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 4, paddingRight: 20 },
  popupAddr: { fontSize: 13, color: theme.colors.textSecondary, marginBottom: 4 },
  popupMeta: { fontSize: 13, color: theme.colors.secondary },
  popupPrice: { fontSize: 14, fontWeight: '700', color: theme.colors.success, marginTop: 4 },
});
