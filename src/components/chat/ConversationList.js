// src/components/chat/ConversationList.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { chatStyles as styles, colors } from '../../styles/chatStyles';
import StatusIndicator from './StatusIndicator';

/**
 * @param {Object} props
 * @param {import('../../types/chat.types').Conversation[]} props.conversations
 * @param {import('../../types/chat.types').Conversation | null} props.activeConversation
 * @param {string} props.searchQuery
 * @param {(query: string) => void} props.onSearchChange
 * @param {(conversation: import('../../types/chat.types').Conversation) => void} props.onSelectConversation
 * @param {() => void} props.onNewChat
 */
export default function ConversationList({
  conversations,
  activeConversation,
  searchQuery,
  onSearchChange,
  onSelectConversation,
  onNewChat,
}) {
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getTicketStatusColor = (status) => {
    switch (status) {
      case 'aguardando':
        return colors.dark.yellow;
      case 'em_analise':
        return colors.dark.blue;
      case 'em_andamento':
        return colors.dark.purple;
      case 'concluido':
        return colors.dark.green;
      case 'cancelado':
        return colors.dark.red;
      default:
        return colors.dark.textTertiary;
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversation = ({ item }) => {
    const isActive = activeConversation?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.conversationItem,
          isActive && styles.conversationItemActive,
        ]}
        onPress={() => onSelectConversation(item)}
        activeOpacity={0.7}
      >
        <View style={{ position: 'relative' }}>
          <Image
            source={{
              uri: item.participant.avatar || 'https://via.placeholder.com/48',
            }}
            style={styles.conversationAvatar}
          />
          <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
            <StatusIndicator status={item.participant.status} />
          </View>
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationName} numberOfLines={1}>
              {item.participant.name}
            </Text>
            <Text style={styles.conversationTime}>
              {formatTimestamp(item.lastMessage.timestamp)}
            </Text>
          </View>

          <Text style={styles.conversationLastMessage} numberOfLines={2}>
            {item.lastMessage.content || 'Nova conversa'}
          </Text>

          {item.unreadCount > 0 && (
            <View style={styles.conversationUnread}>
              <Text style={styles.conversationUnreadText}>
                {item.unreadCount}
              </Text>
            </View>
          )}

          {item.type === 'ticket' && item.ticketInfo && (
            <View
              style={[
                styles.ticketBadge,
                { backgroundColor: getTicketStatusColor(item.ticketInfo.status) },
              ]}
            >
              <Text style={styles.ticketBadgeText}>
                #{item.ticketInfo.protocol}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.sidebarHeader}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.dark.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar conversas..."
            placeholderTextColor={colors.dark.textTertiary}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={onNewChat}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={[styles.buttonText, { marginLeft: 8 }]}>
            Nova Conversa
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
