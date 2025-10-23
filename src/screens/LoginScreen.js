"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

const roleConfigs = {
  aluno: {
    title: "Aluno",
    icon: "school", // ícone Ionicons para aluno
    fields: ["login", "rm", "codigoEtec", "password"],
  },
  professor: {
    title: "Professor",
    icon: "person", // ícone Ionicons para professor
    fields: ["login", "password"],
  },
  secretaria: {
    title: "Secretaria",
    icon: "briefcase", // ícone Ionicons para secretaria
    fields: ["login", "password"],
  },
  admin: {
    title: "Admin",
    icon: "shield", // ícone Ionicons para administrador
    fields: ["login", "password"],
  },
};

export default function LoginScreen() {
  const { theme } = useTheme();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState("aluno");
  const [formData, setFormData] = useState({ login: "", rm: "", codigoEtec: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  
  // Animações para o header dinâmico
  const iconScale = useRef(new Animated.Value(1)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(1)).current;
  const titleTranslateY = useRef(new Animated.Value(0)).current;

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFormData({ login: "", rm: "", codigoEtec: "", password: "" });
    setShowPassword(false);
    
    // Animar troca de ícone e título
    Animated.parallel([
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 100,
          friction: 3,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(iconRotate, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(titleTranslateY, {
          toValue: -10,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      iconRotate.setValue(0);
    });
  };

  const handleInputChange = (name, value) => {
    if (name === "rm") {
      // apenas números e máximo 5 dígitos
      const numericValue = value.replace(/\D/g, "").slice(0, 5);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === "codigoEtec") {
      // apenas números e máximo 3 dígitos
      const numericValue = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogin = async () => {
    const config = roleConfigs[selectedRole];
    const missing = config.fields.filter((f) => !formData[f]?.trim());
    if (missing.length > 0) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    // usar login() do AuthContext; passar login ou rm como username
    const username = formData.login.trim() || formData.rm.trim();
    const result = await login(username, formData.password.trim());
    setLoading(false);

    if (!result.success) {
      Alert.alert("Erro", result.error || "Falha ao fazer login");
    } else {
      // autenticação feita pelo AuthContext — AppNavigator irá trocar para Main
    }
  };

  // calcula e anima o indicador quando seleciona role ou quando muda largura do container
  useEffect(() => {
    if (!containerWidth) return;
    const slotWidth = containerWidth / 4; // Agora são 4 roles
    Animated.spring(translateX, {
      toValue: slotWidth * Object.keys(roleConfigs).indexOf(selectedRole),
      useNativeDriver: true,
      damping: 12,
      mass: 0.8,
    }).start();
  }, [selectedRole, containerWidth]);

  return (
    <LinearGradient colors={["#8B5CF6", "#A855F7", "#C084FC"]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <View style={[styles.content, { paddingHorizontal: 20 }]}>
          {/* Header Dinâmico com Animação */}
          <View style={styles.headerContainer}>
            {/* Ícone Animado que muda com o tipo de usuário */}
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [
                    { scale: iconScale },
                    {
                      rotate: iconRotate.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* Gradiente simulado com overlay */}
              <View style={styles.iconGradient}>
                <View style={styles.iconShine} />
                <Ionicons
                  name={roleConfigs[selectedRole].icon}
                  size={32}
                  color="#FFFFFF"
                  style={styles.iconStyle}
                />
              </View>
            </Animated.View>

            {/* Mensagem Dinâmica com Animação */}
            <Animated.View
              style={{
                opacity: titleOpacity,
                transform: [{ translateY: titleTranslateY }],
              }}
            >
              <Text style={styles.headerTitle}>
                Entre como {roleConfigs[selectedRole].title}!
              </Text>
            </Animated.View>
          </View>

          <View style={[styles.card, { backgroundColor: theme?.colors?.surface || "#FFFFFF" }]}>
            <View
              style={styles.roleRow}
              onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
            >
              {/* indicador deslizante */}
              {containerWidth > 0 && (
                <Animated.View
                  style={[
                    styles.slider,
                    {
                      width: containerWidth / 4 - 8, // Ajustado: mais espaço para os botões
                      transform: [{ translateX }],
                      backgroundColor: theme?.colors?.primary + "20",
                    },
                  ]}
                />
              )}
              {Object.keys(roleConfigs).map((role) => {
                const active = selectedRole === role;
                return (
                  <TouchableOpacity
                    key={role}
                    onPress={() => handleRoleChange(role)}
                    activeOpacity={0.9}
                    style={[
                      styles.roleButton,
                      // deixar fundo transparente (o slider fica por baixo do botão ativo)
                      { backgroundColor: "transparent", borderColor: theme?.colors?.border },
                    ]}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <Ionicons
                        name={roleConfigs[role].icon}
                        size={16} // Aumentado de 14 para 16
                        color={active ? theme?.colors?.primary : theme?.colors?.text}
                        style={{ marginRight: 4 }} // Reduzido de 6 para 4
                      />
                      <Text style={{ color: active ? theme?.colors?.primary : theme?.colors?.text, fontWeight: "600", fontSize: 12 }}>
                        {roleConfigs[role].title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Campos */}
            <View style={styles.inputContainer}>
              {roleConfigs[selectedRole].fields.includes("login") && (
                <TextInput
                  style={[styles.input, { borderColor: theme?.colors?.border, backgroundColor: theme?.colors?.background, color: theme?.colors?.text }]}
                  placeholder="Email"
                  placeholderTextColor={theme?.colors?.textSecondary}
                  value={formData.login}
                  onChangeText={(t) => handleInputChange("login", t)}
                  autoCapitalize="none"
                />
              )}

              {/* Linha dividida: RM e Código da Etec */}
              {(roleConfigs[selectedRole].fields.includes("rm") || roleConfigs[selectedRole].fields.includes("codigoEtec")) && (
                <View style={styles.rowInputs}>
                  {roleConfigs[selectedRole].fields.includes("rm") && (
                    <TextInput
                      style={[styles.halfInput, { borderColor: theme?.colors?.border, backgroundColor: theme?.colors?.background, color: theme?.colors?.text }]}
                      placeholder="RM"
                      placeholderTextColor={theme?.colors?.textSecondary}
                      value={formData.rm}
                      onChangeText={(t) => handleInputChange("rm", t)}
                      keyboardType="number-pad"
                    />
                  )}

                  {roleConfigs[selectedRole].fields.includes("codigoEtec") && (
                    <TextInput
                      style={[styles.halfInput, { borderColor: theme?.colors?.border, backgroundColor: theme?.colors?.background, color: theme?.colors?.text }]}
                      placeholder="Código Etec"
                      placeholderTextColor={theme?.colors?.textSecondary}
                      value={formData.codigoEtec}
                      onChangeText={(t) => handleInputChange("codigoEtec", t)}
                      keyboardType="number-pad"
                    />
                  )}
                </View>
              )}

              {roleConfigs[selectedRole].fields.includes("password") && (
                <View style={[styles.passwordWrapper, { borderColor: theme?.colors?.border }]}>
                  <TextInput
                    style={[styles.inputPassword, { color: theme?.colors?.text }]}
                    placeholder="Senha"
                    placeholderTextColor={theme?.colors?.textSecondary}
                    value={formData.password}
                    onChangeText={(t) => handleInputChange("password", t)}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.eyeButton}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={theme?.colors?.textSecondary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled, { backgroundColor: theme?.colors?.primary }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>{loading ? "Entrando..." : "Entrar"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  iconShine: {
    position: "absolute",
    top: 0,
    left: -64,
    width: 64,
    height: 64,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: [{ skewX: "-20deg" }],
  },
  iconStyle: {
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  card: {
    borderRadius: 20,
    padding: 28,
    width: width * 0.95, // Reduzido para dar mais espaço
    maxWidth: 600, // Reduzido para melhor proporção
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
  },
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    position: "relative",
    paddingHorizontal: 4, // Aumentado para dar mais espaço
  },
  roleButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4, // Reduzido para evitar overflow
    marginHorizontal: 1, // Reduzido para dar mais espaço aos campos
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 2, // ficar acima do slider
  },
  slider: {
    position: "absolute",
    left: 4, // Ajustado para compensar o novo paddingHorizontal
    top: 0,
    bottom: 0,
    borderRadius: 12,
    zIndex: 1,
  },
  inputContainer: {
    marginBottom: 12,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8, // Reduzido de 12 para 8
    marginBottom: 12,
  },
  halfInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12, // Reduzido de 14 para 12
    paddingVertical: 12,
    fontSize: 14, // Reduzido de 16 para 14
    minWidth: 0, // Permite que o flex funcione corretamente
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  inputPassword: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 10,
    fontSize: 16,
  },
  eyeButton: {
    padding: 8,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});