import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../../theme';

interface Props {
  latitude: number;
  longitude: number;
  title: string;
  accentColor: string;
}

const DELTA = 0.004;

export function MapPreview({ latitude, longitude, title, accentColor }: Props): React.JSX.Element {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Map unavailable on web</Text>
      </View>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Map unavailable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RNMapView
        style={styles.map}
        initialRegion={{ latitude, longitude, latitudeDelta: DELTA, longitudeDelta: DELTA }}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        liteMode
      >
        <Marker coordinate={{ latitude, longitude }} title={title} pinColor={accentColor} />
      </RNMapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 170 },
  map: { flex: 1 },
  fallback: {
    alignItems: 'center',
    backgroundColor: theme.colors.border,
    height: 170,
    justifyContent: 'center',
  },
  fallbackText: { color: theme.colors.textSecondary, fontSize: 13 },
});
