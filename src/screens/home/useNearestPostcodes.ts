import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

import { POSTCODES } from '../../data/suburbs';
import { NearbyResult } from '../../types';

type Status = 'idle' | 'loading' | 'ready' | 'denied' | 'error';

interface State {
  status: Status;
  results: NearbyResult[];
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useNearestPostcodes(n = 3): [State, () => Promise<void>] {
  const [state, setState] = useState<State>({ status: 'idle', results: [] });

  const request = useCallback(async () => {
    setState({ status: 'loading', results: [] });
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState({ status: 'denied', results: [] });
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const results = POSTCODES.map((entry) => ({
        entry,
        distanceKm: haversineKm(coords.latitude, coords.longitude, entry.latitude, entry.longitude),
      }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, n);
      setState({ status: 'ready', results });
    } catch {
      setState({ status: 'error', results: [] });
    }
  }, [n]);

  return [state, request];
}
