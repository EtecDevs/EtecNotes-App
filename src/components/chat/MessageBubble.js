// src/components/chat/MessageBubble.js
import React from 'react';
import { View, Text } from 'react-native';
import { chatStyles as styles } from '../../styles/chatStyles';

/**
 * @param {Object} props
 * @param {import('../../types/chat.types').Message} props.message
 * @param {boolean} props.isOwnMessage
 * @param {boolean} [props.isSystem]
 */
export default function MessageBubble({ message, isOwnMessage, isSystem = false }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (isSystem) {
    return (
      <View style={styles.messageSystem}>
        <Text style={styles.messageSystemText}>{message.content}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.messageBubble,
        isOwnMessage ? styles.messageBubbleSent : styles.messageBubbleReceived,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          isOwnMessage && styles.messageTextSent,
        ]}
      >
        {message.content}
      </Text>
      <Text
        style={[
          styles.messageTime,
          isOwnMessage && styles.messageTimeSent,
        ]}
      >
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
}
