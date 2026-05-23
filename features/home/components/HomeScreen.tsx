import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import SectionLabel from '../../../components/SectionLabel';
import SuburbRow from '../../../components/SuburbRow';
import { SUBURBS } from '../../../constants/suburbs';
import { theme } from '../../../theme';
import { Postcode, RootStackParamList, Suburb } from '../../../types';
import { useNearestPostcodes } from '../hooks/useNearestPostcodes';
import GpsPromptCard from './GpsPromptCard';
import NearbyPostcodeList from './NearbyPostcodeList';
import PostcodeTypeahead from './PostcodeTypeahead';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

type Phase = 'gps_prompt' | 'gps_loading' | 'nearby' | 'typeahead';

function derivePhase(
  gpsStatus: 'idle' | 'loading' | 'ready' | 'denied' | 'error',
  forceTypeahead: boolean,
): Phase {
  if (forceTypeahead) return 'typeahead';
  if (gpsStatus === 'loading') return 'gps_loading';
  if (gpsStatus === 'ready') return 'nearby';
  if (gpsStatus === 'denied' || gpsStatus === 'error') return 'typeahead';
  return 'gps_prompt';
}

export default function HomeScreen({ navigation }: Props) {
  const [forceTypeahead, setForceTypeahead] = useState(false);
  const [selectedPostcode, setSelectedPostcode] = useState<Postcode | null>(null);
  const [gpsState, requestGps] = useNearestPostcodes(3);

  const phase = derivePhase(gpsState.status, forceTypeahead);

  const filteredSuburbs = selectedPostcode
    ? SUBURBS.filter((s) => s.postcode === selectedPostcode)
    : [];

  function handleSuburbPress(suburb: Suburb) {
    navigation.navigate('Categories', { suburb });
  }

  function handlePostcodeSelect(code: Postcode) {
    setSelectedPostcode(code);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      <View style={styles.header}>
        <Text style={styles.appName}>Central Park</Text>
        <Text style={styles.tagline}>Your local community hub</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {phase === 'gps_prompt' && (
          <GpsPromptCard
            onRequestLocation={requestGps}
            onSkip={() => setForceTypeahead(true)}
          />
        )}

        {phase === 'gps_loading' && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Finding your location…</Text>
          </View>
        )}

        {phase === 'nearby' && (
          <NearbyPostcodeList
            results={gpsState.results}
            selected={selectedPostcode}
            onSelect={handlePostcodeSelect}
            onSearchInstead={() => setForceTypeahead(true)}
          />
        )}

        {phase === 'typeahead' && (
          <PostcodeTypeahead
            selected={selectedPostcode}
            onSelect={handlePostcodeSelect}
          />
        )}

        {selectedPostcode && filteredSuburbs.length > 0 && (
          <View style={styles.suburbSection}>
            <SectionLabel>Select your suburb</SectionLabel>
            {filteredSuburbs.map((suburb) => (
              <SuburbRow
                key={suburb.name}
                suburb={suburb}
                onPress={() => handleSuburbPress(suburb)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.background, flex: 1 },
  header: {
    backgroundColor: theme.colors.primary,
    paddingBottom: 28,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  appName: { color: theme.colors.surface, fontSize: 30, fontWeight: '800', letterSpacing: 0.5 },
  tagline: { color: theme.colors.primaryLight, fontSize: 14, marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  loading: { alignItems: 'center', gap: 16, paddingTop: 60 },
  loadingText: { color: theme.colors.textSecondary, fontSize: 15 },
  suburbSection: { marginTop: 24 },
});
