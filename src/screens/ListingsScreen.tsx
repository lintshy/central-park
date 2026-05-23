import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Listing, Category } from '../types';
import { LISTINGS } from '../data/listings';
import ListingCard from '../components/ListingCard';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Listings'>;
  route: RouteProp<RootStackParamList, 'Listings'>;
};

const CATEGORY_META: Record<Category, { label: string; emoji: string; color: string }> = {
  meals: { label: 'Home Meals', emoji: '🍽️', color: '#1abc9c' },
  garage_sales: { label: 'Garage Sales', emoji: '🏷️', color: '#f39c12' },
  activities: { label: 'Activity Groups', emoji: '⚽', color: '#2980b9' },
};

type ViewMode = 'list' | 'map';

export default function ListingsScreen({ navigation, route }: Props) {
  const { category, suburb } = route.params;
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const meta = CATEGORY_META[category];

  const listings = useMemo(
    () => LISTINGS.filter((l) => l.category === category && l.postcode === suburb.postcode),
    [category, suburb.postcode]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5276" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.emoji}>{meta.emoji}</Text>
        <View>
          <Text style={styles.title}>{meta.label}</Text>
          <Text style={styles.subtitle}>
            {suburb.name} · {suburb.postcode}
          </Text>
        </View>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'list' && styles.toggleActive]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
            List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'map' && styles.toggleActive]}
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
            Map
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'list' ? (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListingCard listing={item} accentColor={meta.color} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No listings found for this suburb yet.</Text>
            </View>
          }
        />
      ) : (
        <MapView listings={listings} accentColor={meta.color} />
      )}
    </View>
  );
}

function MapView({ listings, accentColor }: { listings: Listing[]; accentColor: string }) {
  const [selected, setSelected] = useState<Listing | null>(null);

  // On web or if react-native-maps isn't available, show a grid fallback
  if (Platform.OS === 'web') {
    return (
      <View style={mapStyles.container}>
        <Text style={mapStyles.webNote}>Map view is available on iOS and Android.</Text>
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
  let RNMapView: any = null;
  let Marker: any = null;
  try {
    const maps = require('react-native-maps');
    RNMapView = maps.default;
    Marker = maps.Marker;
  } catch {
    return (
      <View style={mapStyles.container}>
        <Text style={mapStyles.webNote}>Map not available in this environment.</Text>
      </View>
    );
  }

  const region = listings.length
    ? {
        latitude: listings.reduce((s, l) => s + l.latitude, 0) / listings.length,
        longitude: listings.reduce((s, l) => s + l.longitude, 0) / listings.length,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }
    : { latitude: -33.72, longitude: 150.87, latitudeDelta: 0.06, longitudeDelta: 0.06 };

  return (
    <View style={mapStyles.container}>
      <RNMapView style={mapStyles.map} initialRegion={region}>
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
        <View style={mapStyles.popup}>
          <TouchableOpacity style={mapStyles.closeBtn} onPress={() => setSelected(null)}>
            <Text style={mapStyles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={mapStyles.popupTitle}>{selected.title}</Text>
          <Text style={mapStyles.popupAddr}>{selected.address}</Text>
          {selected.date && (
            <Text style={mapStyles.popupMeta}>
              {selected.date} {selected.time ? `· ${selected.time}` : ''}
            </Text>
          )}
          {selected.price && <Text style={mapStyles.popupPrice}>{selected.price}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fb' },
  header: {
    backgroundColor: '#1a5276',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  emoji: { fontSize: 32 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: '#aed6f1', marginTop: 2 },
  toggleRow: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#e8eaf0',
    borderRadius: 10,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleActive: { backgroundColor: '#1a5276' },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#7f8c8d' },
  toggleTextActive: { color: '#fff' },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: { paddingTop: 60, alignItems: 'center' },
  emptyText: { color: '#aab7b8', fontSize: 15 },
  backBtn: { marginRight: 12 },
  backArrow: { fontSize: 32, color: '#fff', lineHeight: 34 },
});

const mapStyles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  webNote: { textAlign: 'center', color: '#7f8c8d', padding: 24, fontSize: 14 },
  popup: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  closeBtn: { position: 'absolute', top: 12, right: 14 },
  closeText: { fontSize: 16, color: '#aab7b8' },
  popupTitle: { fontSize: 16, fontWeight: '700', color: '#1c2833', marginBottom: 4, paddingRight: 20 },
  popupAddr: { fontSize: 13, color: '#7f8c8d', marginBottom: 4 },
  popupMeta: { fontSize: 13, color: '#2980b9' },
  popupPrice: { fontSize: 14, fontWeight: '700', color: '#27ae60', marginTop: 4 },
});
