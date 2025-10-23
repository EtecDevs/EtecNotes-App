// src/styles/chatStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  // Dark theme
  dark: {
    background: '#0D1117',
    surface: '#1E1E1E',
    surfaceLight: '#2D2D2D',
    border: '#30363D',
    text: '#FFFFFF',
    textSecondary: '#8B949E',
    textTertiary: '#6E7681',
    primary: '#8C43FF',
    primaryDark: '#6B32C3',
    purple: '#A855F7',
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    red: '#EF4444',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  // Light theme
  light: {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceLight: '#F3F4F6',
    border: '#E5E7EB',
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    primary: '#8C43FF',
    primaryDark: '#6B32C3',
    purple: '#A855F7',
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    red: '#EF4444',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
};

export const chatStyles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.dark.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark.text,
  },
  headerButton: {
    padding: 8,
    borderRadius: 12,
  },
  
  // Sidebar (Conversation List)
  sidebar: {
    width: width * 0.85,
    backgroundColor: colors.dark.surface,
    borderRightWidth: 1,
    borderRightColor: colors.dark.border,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
  sidebarHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surfaceLight,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.dark.text,
    marginLeft: 8,
  },
  
  // Conversation Item
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  conversationItemActive: {
    backgroundColor: colors.dark.surfaceLight,
  },
  conversationAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: colors.dark.surfaceLight,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
    flex: 1,
  },
  conversationTime: {
    fontSize: 12,
    color: colors.dark.textTertiary,
  },
  conversationLastMessage: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  conversationUnread: {
    backgroundColor: colors.dark.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  conversationUnreadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Chat Area
  chatContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.dark.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: colors.dark.surfaceLight,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginTop: 2,
    marginLeft: 6,
  },
  
  // Messages
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubble: {
    maxWidth: '75%',
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  messageBubbleReceived: {
    alignSelf: 'flex-start',
    backgroundColor: colors.dark.surfaceLight,
  },
  messageBubbleSent: {
    alignSelf: 'flex-end',
    backgroundColor: colors.dark.primary,
  },
  messageText: {
    fontSize: 15,
    color: colors.dark.text,
    lineHeight: 20,
  },
  messageTextSent: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 11,
    color: colors.dark.textTertiary,
    marginTop: 4,
    textAlign: 'right',
  },
  messageTimeSent: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  messageSystem: {
    alignSelf: 'center',
    backgroundColor: colors.dark.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginVertical: 8,
  },
  messageSystemText: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },
  
  // Input Area
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 80,
    backgroundColor: colors.dark.surface,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surfaceLight,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.dark.text,
    maxHeight: 100,
    paddingVertical: 4,
  },
  inputButton: {
    padding: 6,
    marginLeft: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.dark.surfaceLight,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.dark.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: colors.dark.surface,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.dark.surfaceLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginTop: 4,
  },
  modalContent: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    gap: 12,
  },
  
  // Buttons
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonPrimary: {
    backgroundColor: colors.dark.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.dark.surfaceLight,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: colors.dark.text,
  },
  
  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  
  // Status Indicator
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.dark.surface,
  },
  statusOnline: {
    backgroundColor: colors.dark.green,
  },
  statusAway: {
    backgroundColor: colors.dark.yellow,
  },
  statusOffline: {
    backgroundColor: colors.dark.textTertiary,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },
  
  // Ticket Badge
  ticketBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  ticketBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // New Chat Modal
  teacherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  teacherAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: colors.dark.surfaceLight,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
  },
  teacherSubject: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginTop: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dark.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: colors.dark.textTertiary,
  },
});
