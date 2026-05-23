import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { LoginScreen } from './features/auth/components/LoginScreen';
import { useAuthStore } from './features/auth/store/authStore';
import CategoriesScreen from './features/categories/components/CategoriesScreen';
import HomeScreen from './features/home/components/HomeScreen';
import ListingDetailScreen from './features/listingDetail/components/ListingDetailScreen';
import ListingsScreen from './features/listings/components/ListingsScreen';
import { theme } from './theme';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.JSX.Element {
  const { user, isLoading, hydrate } = useAuthStore();

  useEffect(() => {
    void hydrate();
  // hydrate is a stable Zustand action — no need to re-run
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (user === null) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="Listings" component={ListingsScreen} />
        <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
  },
});
