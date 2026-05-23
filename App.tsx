import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import CategoriesScreen from './features/categories/components/CategoriesScreen';
import HomeScreen from './features/home/components/HomeScreen';
import ListingsScreen from './features/listings/components/ListingsScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#f4f6fb' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="Listings" component={ListingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
