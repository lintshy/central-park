import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { RootStackParamList } from '../types';
import { Sidebar } from './Sidebar';
import { UserAvatar } from './UserAvatar';

interface Props {
  size?: number;
}

export function UserAvatarButton({ size = 36 }: Props): React.JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  function handleNavigateToProfile(): void {
    setSidebarOpen(false);
    navigation.navigate('Profile');
  }

  return (
    <>
      <TouchableOpacity onPress={() => setSidebarOpen(true)} hitSlop={8} activeOpacity={0.75}>
        <UserAvatar size={size} />
      </TouchableOpacity>
      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigateToProfile={handleNavigateToProfile}
      />
    </>
  );
}
