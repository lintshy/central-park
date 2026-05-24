import React from 'react';
import {
  ActionSheetIOS,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { theme } from '../../../theme';

interface Props {
  address: string;
  suburb: string;
  latitude: number;
  longitude: number;
  accentColor: string;
}

function openAppleMaps(lat: number, lng: number, label: string): void {
  void Linking.openURL(`maps://?ll=${lat},${lng}&q=${encodeURIComponent(label)}`);
}

function openGoogleMaps(lat: number, lng: number): void {
  void Linking.openURL(`https://maps.google.com/?q=${lat},${lng}`);
}

function showMapOptions(address: string, suburb: string, lat: number, lng: number): void {
  const label = `${address}, ${suburb}`;

  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: label,
        options: ['Cancel', 'Open in Apple Maps', 'Open in Google Maps'],
        cancelButtonIndex: 0,
      },
      (index) => {
        if (index === 1) openAppleMaps(lat, lng, label);
        if (index === 2) openGoogleMaps(lat, lng);
      },
    );
  } else {
    Alert.alert('Open in Maps', label, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Google Maps', onPress: () => openGoogleMaps(lat, lng) },
    ]);
  }
}

export function AddressWidget({ address, suburb, latitude, longitude, accentColor }: Props): React.JSX.Element {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => showMapOptions(address, suburb, latitude, longitude)}
      activeOpacity={0.75}
    >
      <View style={[styles.pinCircle, { backgroundColor: accentColor }]}>
        <Text style={styles.pinEmoji}>📍</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.addressLine}>{address}</Text>
        <Text style={styles.suburbLine}>{suburb}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pinCircle: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  pinEmoji: { fontSize: 16 },
  textBlock: { flex: 1 },
  addressLine: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600' },
  suburbLine: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 },
  chevron: { color: theme.colors.textTertiary, fontSize: 22, fontWeight: '300' },
});
