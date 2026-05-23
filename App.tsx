import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import CategoriesScreen from './features/categories/components/CategoriesScreen';
import HomeScreen from './features/home/components/HomeScreen';
import ListingDetailScreen from './features/listingDetail/components/ListingDetailScreen';
import ListingsScreen from './features/listings/components/ListingsScreen';
import { theme } from './theme';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
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
