// src/components/chat/NewChatModal.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { chatStyles as styles, colors } from '../../styles/chatStyles';
import StatusIndicator from './StatusIndicator';

/**
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {import('../../types/chat.types').User[]} props.teachers
 * @param {() => void} props.onClose
 * @param {(teacher: import('../../types/chat.types').User) => void} props.onSelectTeacher
 * @param {() => void} props.onOpenTicket
 */
export default function NewChatModal({
  visible,
  teachers,
  onClose,
  onSelectTeacher,
  onOpenTicket,
}) {
  const renderTeacher = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.teacherItem}
        onPress={() => onSelectTeacher(item)}
        activeOpacity={0.7}
      >
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: item.avatar || 'https://via.placeholder.com/48' }}
            style={styles.teacherAvatar}
          />
          <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
            <StatusIndicator status={item.status} />
          </View>
        </View>

        <View style={styles.teacherInfo}>
          <Text style={styles.teacherName}>{item.name}</Text>
          <Text style={styles.teacherSubject}>{item.subject}</Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color={colors.dark.textTertiary} />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>Nova Conversa</Text>
              <Text style={styles.modalSubtitle}>
                Escolha um professor ou abra um ticket
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <Ionicons name="close" size={24} color={colors.dark.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={teachers}
            renderItem={renderTeacher}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary, { flex: 1 }]}
              onPress={onOpenTicket}
            >
              <Ionicons name="ticket-outline" size={20} color="#FFFFFF" />
              <Text style={[styles.buttonText, { marginLeft: 8 }]}>
                Abrir Ticket
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
