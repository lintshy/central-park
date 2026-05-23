import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { POSTCODES,SUBURBS } from '../data/suburbs';
import { Postcode, RootStackParamList, Suburb } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const [selectedPostcode, setSelectedPostcode] = useState<Postcode | null>(null);

  const filteredSuburbs = selectedPostcode
    ? SUBURBS.filter((s) => s.postcode === selectedPostcode)
    : [];

  function handleSuburbPress(suburb: Suburb) {
    navigation.navigate('Categories', { suburb });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5276" />

      <View style={styles.header}>
        <Text style={styles.appName}>Central Park</Text>
        <Text style={styles.tagline}>Your local community hub</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionLabel}>Select your postcode</Text>

        <View style={styles.postcodeRow}>
          {POSTCODES.map((p) => (
            <TouchableOpacity
              key={p.code}
              style={[
                styles.postcodeCard,
                selectedPostcode === p.code && styles.postcodeCardActive,
              ]}
              onPress={() => setSelectedPostcode(p.code as Postcode)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.postcodeCode,
                  selectedPostcode === p.code && styles.postcodeTextActive,
                ]}
              >
                {p.code}
              </Text>
              <Text
                style={[
                  styles.postcodeRegion,
                  selectedPostcode === p.code && styles.postcodeTextActive,
                ]}
                numberOfLines={2}
              >
                {p.label.split('–')[1].trim()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedPostcode && (
          <>
            <Text style={styles.sectionLabel}>Select your suburb</Text>
            <FlatList
              data={filteredSuburbs}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suburbItem}
                  onPress={() => handleSuburbPress(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.suburbName}>{item.name}</Text>
                  <Text style={styles.suburbArrow}>›</Text>
                </TouchableOpacity>
              )}
              style={styles.suburbList}
            />
          </>
        )}

        {!selectedPostcode && (
          <View style={styles.hint}>
            <Text style={styles.hintText}>
              Choose a postcode above to explore meals, garage sales and local activities near you.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fb' },
  header: {
    backgroundColor: '#1a5276',
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  appName: { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  tagline: { fontSize: 14, color: '#aed6f1', marginTop: 4 },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7f8c8d',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  postcodeRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  postcodeCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8eaf0',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  postcodeCardActive: { borderColor: '#1a5276', backgroundColor: '#1a5276' },
  postcodeCode: { fontSize: 26, fontWeight: '800', color: '#1a5276' },
  postcodeRegion: { fontSize: 11, color: '#7f8c8d', marginTop: 4, textAlign: 'center' },
  postcodeTextActive: { color: '#fff' },
  suburbList: { flex: 1 },
  suburbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  suburbName: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1c2833' },
  suburbArrow: { fontSize: 22, color: '#aed6f1', fontWeight: '300' },
  hint: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  hintText: { fontSize: 15, color: '#aab7b8', textAlign: 'center', lineHeight: 22 },
});
