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
    fields: ["login", "rm", "password"],
  },
  professor: {
    title: "Professor",
    icon: "person", // ícone Ionicons para professor
    fields: ["login", "password"],
  },
  admin: {
    title: "Administrador",
    icon: "shield", // ícone Ionicons para administrador
    fields: ["login", "password"],
  },
};

export default function LoginScreen() {
  const { theme } = useTheme();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState("aluno");
  const [formData, setFormData] = useState({ login: "", rm: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFormData({ login: "", rm: "", password: "" });
    setShowPassword(false);
  };

  const handleInputChange = (name, value) => {
    if (name === "rm") {
      // apenas números e máximo 5 dígitos
      const numericValue = value.replace(/\D/g, "").slice(0, 5);
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
    const slotWidth = containerWidth / 3;
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
          <View style={[styles.card, { backgroundColor: theme?.colors?.surface || "#FFFFFF" }]}>
            <Text style={[styles.title, { color: theme?.colors?.primary || "#8B5CF6" }]}>Bem-vindo!</Text>

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
                      width: containerWidth / 3 - 12, // retira margem horizontal (6+6)
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
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons
                        name={roleConfigs[role].icon}
                        size={14} // menor para evitar overflow
                        color={active ? theme?.colors?.primary : theme?.colors?.text}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={{ color: active ? theme?.colors?.primary : theme?.colors?.text, fontWeight: "600", fontSize: 13 }}>
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
                  placeholder="Login"
                  placeholderTextColor={theme?.colors?.textSecondary}
                  value={formData.login}
                  onChangeText={(t) => handleInputChange("login", t)}
                  autoCapitalize="none"
                />
              )}

              {roleConfigs[selectedRole].fields.includes("rm") && (
                <TextInput
                  style={[styles.input, { borderColor: theme?.colors?.border, backgroundColor: theme?.colors?.background, color: theme?.colors?.text }]}
                  placeholder="RM (apenas números)"
                  placeholderTextColor={theme?.colors?.textSecondary}
                  value={formData.rm}
                  onChangeText={(t) => handleInputChange("rm", t)}
                  keyboardType="number-pad"
                />
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
  card: {
    borderRadius: 20,
    padding: 28,
    width: width * 0.92,
    maxWidth: 520,
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
    paddingHorizontal: 6,
  },
  roleButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 2, // ficar acima do slider
  },
  slider: {
    position: "absolute",
    left: 6, // compensa marginHorizontal do primeiro botão
    top: 0,
    bottom: 0,
    borderRadius: 12,
    zIndex: 1,
  },
  inputContainer: {
    marginBottom: 12,
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