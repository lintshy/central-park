import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { Sidebar } from './Sidebar';
import { UserAvatar } from './UserAvatar';

interface Props {
  size?: number;
}

export function UserAvatarButton({ size = 36 }: Props): React.JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setSidebarOpen(true)} hitSlop={8} activeOpacity={0.75}>
        <UserAvatar size={size} />
      </TouchableOpacity>
      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
