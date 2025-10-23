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
  ActivityIndicator,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { GEMINI_API_KEY, GEMINI_API_URL, SYSTEM_PROMPT } from "../config/gemini"
import WellnessScreen from "./WellnessScreen"

const { width } = Dimensions.get("window")

export default function CloudScreen() {
  const [activeTab, setActiveTab] = useState("iatec")
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Olá! Eu sou a IAtec, assistente da Etec de Peruíbe. Como posso ajudar você hoje?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollViewRef = useRef()
  const { theme } = useTheme()

  // Função para alternar entre tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  // Função auxiliar para delay (para retry)
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  // Função para gerar resposta da IATEC usando Gemini com retry automático
  const generateIATECResponse = async (userMessage, additionalContext = "", retryCount = 0) => {
    const MAX_RETRIES = 3
    const RETRY_DELAYS = [1000, 2000, 4000] // 1s, 2s, 4s (exponential backoff)

    try {
      console.log(`📤 Enviando para Gemini (tentativa ${retryCount + 1}/${MAX_RETRIES + 1}):`, userMessage)

      const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`
      
      // Prompt completo com contexto adicional se houver
      const fullSystemPrompt = additionalContext 
        ? `${SYSTEM_PROMPT}\n\nContexto adicional:\n${additionalContext}`
        : SYSTEM_PROMPT

      // Histórico curto (últimas 8 mensagens) para manter contexto
      const history = messages
        .slice(-8)
        .filter((m) => m.content && !m.isLoading)
        .map((m) => ({ 
          role: m.role === 'user' ? 'user' : 'model', 
          parts: [{ text: m.content }] 
        }))

      const contents = [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ]

      const payload = {
        systemInstruction: { 
          role: 'system', 
          parts: [{ text: fullSystemPrompt }] 
        },
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
          topP: 0.95,
          topK: 40,
        }
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        timeout: 30000, // 30 segundos de timeout
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorCode = errorData.error?.code || response.status
        const errorMessage = errorData.error?.message || "Erro desconhecido"
        
        console.error(`❌ Erro da API (${errorCode}):`, errorMessage)

        // Se for erro 503 (overload) ou 429 (rate limit) e ainda houver tentativas, retry
        if ((errorCode === 503 || errorCode === 429) && retryCount < MAX_RETRIES) {
          const delayTime = RETRY_DELAYS[retryCount]
          console.log(`⏳ Aguardando ${delayTime}ms antes de tentar novamente...`)
          
          // Atualiza mensagem de loading com informação de retry
          setMessages((prev) => 
            prev.map(m => 
              m.isLoading 
                ? { ...m, content: `Servidor ocupado, tentando novamente... (${retryCount + 2}/${MAX_RETRIES + 1})` }
                : m
            )
          )

          await delay(delayTime)
          return generateIATECResponse(userMessage, additionalContext, retryCount + 1)
        }

        throw new Error(`Erro ${errorCode}: ${errorMessage}`)
      }

      const data = await response.json()
      console.log("✅ Resposta recebida do Gemini")

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text
      } else {
        throw new Error("Resposta inválida da API")
      }

    } catch (error) {
      // Se for erro de rede e ainda houver tentativas, retry
      if (error.message.includes("Network") && retryCount < MAX_RETRIES) {
        const delayTime = RETRY_DELAYS[retryCount]
        console.log(`⏳ Erro de rede, tentando novamente em ${delayTime}ms...`)
        
        setMessages((prev) => 
          prev.map(m => 
            m.isLoading 
              ? { ...m, content: `Erro de conexão, tentando novamente... (${retryCount + 2}/${MAX_RETRIES + 1})` }
              : m
          )
        )

        await delay(delayTime)
        return generateIATECResponse(userMessage, additionalContext, retryCount + 1)
      }

      console.error("❌ Erro final ao gerar resposta:", error)
      throw error
    }
  }

  const sendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage = {
      id: Date.now(),
      content: inputText.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsLoading(true)

    try {
      // Adiciona mensagem de carregamento
      const loadingMessage = {
        id: Date.now() + 1,
        content: "Digitando...",
        role: "assistant",
        timestamp: new Date(),
        isLoading: true,
      }
      setMessages((prev) => [...prev, loadingMessage])

      // Gera resposta da IA
      const aiResponse = await generateIATECResponse(userMessage.content)

      // Remove mensagem de carregamento e adiciona resposta real
      setMessages((prev) => 
        prev.filter(m => !m.isLoading).concat({
          id: Date.now() + 2,
          content: aiResponse,
          role: "assistant",
          timestamp: new Date(),
        })
      )

    } catch (error) {
      // Remove mensagem de carregamento
      setMessages((prev) => prev.filter(m => !m.isLoading))
      
      // Determina o tipo de erro e mensagem apropriada
      const errorMessage = error.message || ""
      let alertTitle = "Erro de Conexão"
      let alertMessage = "Não foi possível conectar com a IAtec. Verifique sua conexão e tente novamente."
      let botMessage = "Desculpe, estou com dificuldades para responder agora. Por favor, tente novamente em alguns instantes."

      if (errorMessage.includes("503") || errorMessage.includes("overloaded")) {
        alertTitle = "Servidor Sobrecarregado"
        alertMessage = "O servidor da IA está muito ocupado no momento. Já tentei 3 vezes mas não consegui. Por favor, aguarde alguns segundos e tente novamente."
        botMessage = "Desculpe, o servidor está muito ocupado no momento. 😔 Por favor, aguarde um pouquinho e tente novamente."
      } else if (errorMessage.includes("429") || errorMessage.includes("rate limit")) {
        alertTitle = "Muitas Requisições"
        alertMessage = "Você está enviando mensagens muito rápido. Por favor, aguarde um momento antes de tentar novamente."
        botMessage = "Você está enviando mensagens muito rápido. ⏱️ Por favor, aguarde um momento."
      } else if (errorMessage.includes("Network") || errorMessage.includes("network")) {
        alertTitle = "Erro de Rede"
        alertMessage = "Verifique sua conexão com a internet e tente novamente."
        botMessage = "Não consegui me conectar à internet. 📡 Verifique sua conexão e tente novamente."
      }
      
      // Alerta para o usuário
      Alert.alert(alertTitle, alertMessage, [{ text: "OK" }])

      // Adiciona mensagem de erro no chat
      setMessages((prev) => [...prev, {
        id: Date.now() + 2,
        content: botMessage,
        role: "assistant",
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  // Se a tab ativa for meditação, mostrar WellnessScreen
  if (activeTab === "meditation") {
    return <WellnessScreen isEmbedded={true} onTabChange={handleTabChange} />
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>IAtec</Text>
          {isLoading && (
            <View style={styles.typingIndicator}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={[styles.typingText, { color: theme.colors.textSecondary }]}>
                digitando...
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabsContainer, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          onPress={() => handleTabChange("iatec")}
          style={[
            styles.tab,
            activeTab === "iatec" && [styles.tabActive, { backgroundColor: "#58417d" }]
          ]}
        >
          <Ionicons 
            name="chatbubble-ellipses" 
            size={16} 
            color={activeTab === "iatec" ? "#FFFFFF" : theme.colors.textSecondary} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === "iatec" ? "#FFFFFF" : theme.colors.textSecondary }
          ]}>
            IATEC AI
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTabChange("meditation")}
          style={[
            styles.tab,
            { backgroundColor: "#8C43FF20" }
          ]}
        >
          <Ionicons 
            name="heart" 
            size={16} 
            color="#8C43FF" 
          />
          <Text style={[
            styles.tabText,
            { color: "#8C43FF" }
          ]}>
            Meditação
          </Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.messagesContent, { paddingBottom: 180 }]}
      >
        {messages.filter(m => !m.isLoading).map((message) => (
          <View
            key={message.id}
            style={[styles.messageContainer, message.role === "assistant" ? styles.botMessage : styles.userMessage]}
          >
            <View
              style={[
                styles.messageBubble,
                message.role === "assistant"
                  ? [styles.botBubble, { backgroundColor: theme.colors.surfaceSecondary }]
                  : [styles.userBubble, { backgroundColor: theme.colors.primary }],
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.role === "assistant" 
                    ? [styles.botText, { color: theme.colors.text }] 
                    : styles.userText,
                ]}
              >
                {message.content}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}
      >
        <View
          style={[styles.inputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
        >
          <TextInput
            style={[styles.textInput, { color: theme.colors.text }]}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={theme.colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isLoading}
            onSubmitEditing={sendMessage}
          />

          <TouchableOpacity 
            style={[
              styles.sendButton,
              { backgroundColor: theme.colors.primary },
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled
            ]} 
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="send" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  typingText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
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
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    // Color will be set dynamically
  },
  userText: {
    color: "#FFFFFF",
  },
  inputContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    gap: 8,
  },
  inputButton: {
    marginHorizontal: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  quickReplyButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  quickReplyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  tabActive: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
})
