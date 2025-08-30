"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Eu sou a IATEC. Como posso ajudar você hoje?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const scrollViewRef = useRef()

  const sendMessage = () => {
    if (!inputText.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "Obrigada pela sua mensagem! Como posso ajudar você com seus estudos hoje?",
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>IATEC</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="restaurant" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, styles.headerButtonActive]}>
            <Ionicons name="fitness" size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.messageContainer, message.isBot ? styles.botMessage : styles.userMessage]}
          >
            <View style={[styles.messageBubble, message.isBot ? styles.botBubble : styles.userBubble]}>
              <Text style={[styles.messageText, message.isBot ? styles.botText : styles.userText]}>{message.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.inputButton}>
            <Ionicons name="attach" size={20} color="#8B5CF6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.inputButton}>
            <Ionicons name="camera" size={20} color="#8B5CF6" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />

          <TouchableOpacity style={styles.inputButton}>
            <Ionicons name="mic" size={20} color="#8B5CF6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.quickReplyButton}>
          <Text style={styles.quickReplyText}>Oi</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonActive: {
    backgroundColor: "#EDE9FE",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  botMessage: {
    alignItems: "flex-start",
  },
  userMessage: {
    alignItems: "flex-end",
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  botBubble: {
    backgroundColor: "#E5E7EB",
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: "#8B5CF6",
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: "#374151",
  },
  userText: {
    color: "#FFFFFF",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputButton: {
    marginHorizontal: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    marginHorizontal: 12,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 4,
  },
  quickReplyButton: {
    alignSelf: "flex-end",
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  quickReplyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
})
