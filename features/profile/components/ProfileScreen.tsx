import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SectionLabel } from '../../../components/SectionLabel';
import { UserAvatar } from '../../../components/UserAvatar';
import { useAuthStore } from '../../auth/store/authStore';
import { SUBURBS } from '../../../constants/suburbs';
import { theme } from '../../../theme';
import { RootStackParamList, Suburb } from '../../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

export function ProfileScreen({ navigation }: Props): React.JSX.Element {
  const user = useAuthStore((state) => state.user);
  const suburb = useAuthStore((state) => state.suburb);
  const setSuburb = useAuthStore((state) => state.setSuburb);

  function handleSuburbSelect(s: Suburb): void {
    void setSuburb(s);
    navigation.reset({ index: 0, routes: [{ name: 'Categories', params: { suburb: s } }] });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.userCard}>
          <UserAvatar size={64} />
          <View style={styles.userText}>
            <Text style={styles.userName}>{user?.name ?? ''}</Text>
            <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel>Your Suburb</SectionLabel>
          <Text style={styles.hint}>
            Listings, meals, and activity groups are filtered to this suburb.
          </Text>
          {SUBURBS.map((s) => {
            const isSelected = suburb?.name === s.name && suburb?.postcode === s.postcode;
            return (
              <TouchableOpacity
                key={`${s.postcode}-${s.name}`}
                style={[styles.suburbRow, isSelected && styles.suburbRowSelected]}
                onPress={() => handleSuburbSelect(s)}
                activeOpacity={0.75}
              >
                <View style={styles.suburbInfo}>
                  <Text style={[styles.suburbName, isSelected && styles.suburbNameSelected]}>
                    {s.name}
                  </Text>
                  <Text style={[styles.suburbPostcode, isSelected && styles.suburbPostcodeSelected]}>
                    {s.postcode}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.background, flex: 1 },
  header: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backBtn: { padding: 4 },
  backArrow: { color: theme.colors.surface, fontSize: 32, lineHeight: 34 },
  title: { color: theme.colors.surface, fontSize: 20, fontWeight: '700' },
  scrollContent: { padding: 20, paddingBottom: 48 },
  userCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  userText: { flex: 1 },
  userName: { color: theme.colors.textPrimary, fontSize: 17, fontWeight: '700' },
  userEmail: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 2 },
  section: { gap: 8 },
  hint: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  suburbRow: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  suburbRowSelected: {
    backgroundColor: theme.colors.errorBg,
    borderColor: theme.colors.primary,
  },
  suburbInfo: { flex: 1 },
  suburbName: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '600' },
  suburbNameSelected: { color: theme.colors.primary },
  suburbPostcode: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 2 },
  suburbPostcodeSelected: { color: theme.colors.secondary },
  checkCircle: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkMark: { color: theme.colors.surface, fontSize: 13, fontWeight: '700' },
});
