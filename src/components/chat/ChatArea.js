// src/components/chat/ChatArea.js
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { chatStyles as styles, colors } from '../../styles/chatStyles';
import MessageBubble from './MessageBubble';
import StatusIndicator from './StatusIndicator';

/**
 * @param {Object} props
 * @param {import('../../types/chat.types').Conversation} props.conversation
 * @param {import('../../types/chat.types').User} props.currentUser
 * @param {string} props.message
 * @param {(text: string) => void} props.onMessageChange
 * @param {() => void} props.onSendMessage
 * @param {boolean} props.isTyping
 */
export default function ChatArea({
  conversation,
  currentUser,
  message,
  onMessageChange,
  onSendMessage,
  isTyping,
}) {
  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Scroll para o final quando novas mensagens chegam
    if (conversation.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversation.messages]);

  useEffect(() => {
    // Listener para quando o teclado aparecer
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const renderMessage = ({ item }) => {
    return (
      <MessageBubble
        message={item}
        isOwnMessage={item.senderId === currentUser.id}
        isSystem={item.isSystem}
      />
    );
  };

  return (
    <View style={styles.chatContainer}>
      {/* Header da conversa */}
      <View style={styles.chatHeader}>
        <Image
          source={{
            uri: conversation.participant.avatar || 'https://via.placeholder.com/40',
          }}
          style={styles.chatHeaderAvatar}
        />

        <View style={styles.chatHeaderInfo}>
          <Text style={styles.chatHeaderName}>
            {conversation.participant.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <StatusIndicator status={conversation.participant.status} size={8} />
            <Text style={styles.chatHeaderStatus}>
              {conversation.participant.status === 'online'
                ? 'Online'
                : conversation.participant.lastSeen || 'Offline'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.dark.text} />
        </TouchableOpacity>
      </View>

      {/* Mensagens */}
      <FlatList
        ref={flatListRef}
        data={conversation.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.messagesContainer,
          { paddingBottom: 16 }
        ]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
      />

      {/* Indicador de digitação */}
      {isTyping && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text style={{ fontSize: 12, color: colors.dark.textSecondary }}>
            {conversation.participant.name} está digitando...
          </Text>
        </View>
      )}

      {/* Input de mensagem */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.inputButton}>
            <Ionicons name="happy-outline" size={22} color={colors.dark.textSecondary} />
          </TouchableOpacity>

          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Digite uma mensagem..."
            placeholderTextColor={colors.dark.textTertiary}
            value={message}
            onChangeText={onMessageChange}
            onSubmitEditing={onSendMessage}
            multiline
            maxLength={1000}
            returnKeyType="send"
            blurOnSubmit={false}
          />

          <TouchableOpacity style={styles.inputButton}>
            <Ionicons name="attach-outline" size={22} color={colors.dark.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled,
          ]}
          onPress={onSendMessage}
          disabled={!message.trim()}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
