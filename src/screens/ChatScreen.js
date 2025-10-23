// src/screens/ChatScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.85;
const SWIPE_THRESHOLD = SIDEBAR_WIDTH * 0.3;

import { chatStyles as styles, colors } from '../styles/chatStyles';
import ConversationList from '../components/chat/ConversationList';
import ChatArea from '../components/chat/ChatArea';
import NewChatModal from '../components/chat/NewChatModal';
import { useAuth } from '../context/AuthContext';

export default function ChatScreen({ navigation, route }) {
  // Estados principais
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Animated values
  const sidebarAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Usuário atual do contexto
  const { user } = useAuth();

  // Mock de usuário (caso não tenha no contexto)
  const currentUser = user || {
    id: 1,
    name: 'Aluno',
    email: 'aluno@etec.sp.gov.br',
    role: 'student',
    status: 'online',
  };

  // Professores disponíveis (mock - deve vir do backend)
  const availableTeachers = [
    {
      id: 2,
      name: 'Prof. João Santos',
      email: 'joao.santos@etec.sp.gov.br',
      avatar: 'https://ui-avatars.com/api/?name=Joao+Santos&background=8C43FF&color=fff',
      subject: 'Programação Web III',
      status: 'online',
      role: 'teacher',
    },
    {
      id: 3,
      name: 'Prof. Maria Costa',
      email: 'maria.costa@etec.sp.gov.br',
      avatar: 'https://ui-avatars.com/api/?name=Maria+Costa&background=8C43FF&color=fff',
      subject: 'Banco de Dados II',
      status: 'away',
      lastSeen: '2 min atrás',
      role: 'teacher',
    },
    {
      id: 4,
      name: 'Prof. Carlos Silva',
      email: 'carlos.silva@etec.sp.gov.br',
      avatar: 'https://ui-avatars.com/api/?name=Carlos+Silva&background=8C43FF&color=fff',
      subject: 'Desenvolvimento Mobile',
      status: 'online',
      role: 'teacher',
    },
  ];

  // Funções para controlar a sidebar
  const openSidebar = () => {
    setIsSidebarOpen(true);
    Animated.parallel([
      Animated.spring(sidebarAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 9,
        tension: 40,
      }),
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.spring(sidebarAnim, {
        toValue: -SIDEBAR_WIDTH,
        useNativeDriver: true,
        friction: 9,
        tension: 40,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => setIsSidebarOpen(false));
  };

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  };

  // PanResponder para gestos
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Ativa para swipe horizontal significativo
        if (isSidebarOpen) {
          return gestureState.dx < -10; // Swipe para esquerda
        }
        // Swipe da borda esquerda
        return gestureState.dx > 10 && evt.nativeEvent.pageX < 30;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isSidebarOpen) {
          // Fechando
          const newValue = Math.max(-SIDEBAR_WIDTH, Math.min(0, gestureState.dx));
          sidebarAnim.setValue(newValue);
          backdropAnim.setValue(1 + (gestureState.dx / SIDEBAR_WIDTH));
        } else {
          // Abrindo
          if (evt.nativeEvent.pageX < 30) {
            const newValue = Math.max(-SIDEBAR_WIDTH, Math.min(0, -SIDEBAR_WIDTH + gestureState.dx));
            sidebarAnim.setValue(newValue);
            backdropAnim.setValue(gestureState.dx / SIDEBAR_WIDTH);
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const shouldOpen = !isSidebarOpen && 
          (gestureState.dx > SWIPE_THRESHOLD || gestureState.vx > 0.5);
        
        const shouldClose = isSidebarOpen && 
          (gestureState.dx < -SWIPE_THRESHOLD || gestureState.vx < -0.5);

        if (shouldOpen) {
          openSidebar();
        } else if (shouldClose) {
          closeSidebar();
        } else {
          // Retornar ao estado original
          if (isSidebarOpen) {
            openSidebar();
          } else {
            closeSidebar();
          }
        }
      },
    })
  ).current;

  // Handler para enviar mensagem
  const handleSendMessage = () => {
    if (!message.trim() || !activeConversation) return;

    const newMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      content: message.trim(),
      timestamp: new Date(),
      status: 'sending',
    };

    // Atualizar conversação
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: {
                content: newMessage.content,
                timestamp: newMessage.timestamp,
                sender: newMessage.senderId,
              },
            }
          : conv
      )
    );

    // Atualizar activeConversation também
    setActiveConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: {
        content: newMessage.content,
        timestamp: newMessage.timestamp,
        sender: newMessage.senderId,
      },
    }));

    setMessage('');

    // Simular envio ao servidor
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversation.id
            ? {
                ...conv,
                messages: conv.messages.map((msg) =>
                  msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
                ),
              }
            : conv
        )
      );
    }, 500);
  };

  // Handler para iniciar nova conversa
  const handleStartNewChat = (teacher) => {
    const existingConv = conversations.find(
      (conv) => conv.type === 'dm' && conv.participant.id === teacher.id
    );

    if (existingConv) {
      setActiveConversation(existingConv);
    } else {
      const newConversation = {
        id: Date.now(),
        type: 'dm',
        participant: teacher,
        lastMessage: {
          content: '',
          timestamp: new Date(),
          sender: currentUser.id,
        },
        unreadCount: 0,
        subject: teacher.subject,
        messages: [],
      };

      setConversations((prev) => [newConversation, ...prev]);
      setActiveConversation(newConversation);
    }

    setShowNewChatModal(false);
    closeSidebar(); // Fecha a sidebar ao selecionar conversa
  };

  // Handler para abrir modal de ticket
  const handleOpenTicket = () => {
    setShowNewChatModal(false);
    // Aqui você pode abrir um modal de ticket ou navegar para outra tela
    alert('Funcionalidade de ticket em desenvolvimento');
  };

  // Carregar conversas mockadas ao iniciar
  useEffect(() => {
    // Dados mockados - em produção viria do backend
    const mockConversations = [
      {
        id: 1,
        type: 'dm',
        participant: availableTeachers[0],
        lastMessage: {
          content: 'Boa tarde! Sobre o projeto final, você já escolheu o tema?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          sender: 2,
        },
        unreadCount: 2,
        subject: 'Programação Web III',
        messages: [
          {
            id: 1,
            senderId: 2,
            content: 'Olá! Tudo bem?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: 'read',
          },
          {
            id: 2,
            senderId: 1,
            content: 'Oi professor! Tudo sim, obrigada!',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
            status: 'read',
          },
          {
            id: 3,
            senderId: 2,
            content: 'Boa tarde! Sobre o projeto final, você já escolheu o tema?',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            status: 'delivered',
          },
        ],
      },
      {
        id: 2,
        type: 'dm',
        participant: availableTeachers[1],
        lastMessage: {
          content: 'A prova será na próxima semana',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          sender: 3,
        },
        unreadCount: 0,
        subject: 'Banco de Dados II',
        messages: [
          {
            id: 1,
            senderId: 3,
            content: 'A prova será na próxima semana',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: 'read',
          },
        ],
      },
    ];

    setConversations(mockConversations);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={toggleSidebar}>
            <Ionicons name="menu" size={24} color={colors.dark.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Chat</Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowNewChatModal(true)}
          >
            <Ionicons name="create-outline" size={24} color={colors.dark.text} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
          {/* Sidebar - Conversas */}
          <Animated.View
            style={[
              styles.sidebar,
              {
                transform: [{ translateX: sidebarAnim }],
              },
            ]}
          >
            <ConversationList
              conversations={conversations}
              activeConversation={activeConversation}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectConversation={(conv) => {
                setActiveConversation(conv);
                closeSidebar();
              }}
              onNewChat={() => setShowNewChatModal(true)}
            />
          </Animated.View>

          {/* Backdrop/Overlay quando sidebar está aberta */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              opacity: backdropAnim,
              pointerEvents: isSidebarOpen ? 'auto' : 'none',
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={closeSidebar}
            />
          </Animated.View>

          {/* Área de Chat */}
          <View style={{ flex: 1 }}>
            {activeConversation ? (
              <ChatArea
                conversation={activeConversation}
                currentUser={currentUser}
                message={message}
                onMessageChange={setMessage}
                onSendMessage={handleSendMessage}
                isTyping={isTyping}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={64}
                  color={colors.dark.textTertiary}
                  style={styles.emptyStateIcon}
                />
                <Text style={styles.emptyStateTitle}>
                  Nenhuma conversa selecionada
                </Text>
                <Text style={styles.emptyStateText}>
                  Selecione uma conversa ou inicie um novo chat
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* FAB - Nova Conversa */}
        {!isSidebarOpen && !activeConversation && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setShowNewChatModal(true)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Modals */}
        <NewChatModal
          visible={showNewChatModal}
          teachers={availableTeachers}
          onClose={() => setShowNewChatModal(false)}
          onSelectTeacher={handleStartNewChat}
          onOpenTicket={handleOpenTicket}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
