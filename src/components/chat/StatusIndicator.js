// src/components/chat/StatusIndicator.js
import React from 'react';
import { View } from 'react-native';
import { chatStyles as styles } from '../../styles/chatStyles';

/**
 * @param {Object} props
 * @param {'online' | 'away' | 'offline'} props.status
 * @param {number} [props.size=12]
 */
export default function StatusIndicator({ status, size = 12 }) {
  const getStatusStyle = () => {
    switch (status) {
      case 'online':
        return styles.statusOnline;
      case 'away':
        return styles.statusAway;
      case 'offline':
      default:
        return styles.statusOffline;
    }
  };

  return (
    <View
      style={[
        styles.statusIndicator,
        getStatusStyle(),
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
}
