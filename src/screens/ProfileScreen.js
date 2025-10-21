"use client"

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

export default function ProfileScreen() {
  const { user, logout } = useAuth()
  const { theme, isDark, toggleTheme } = useTheme()

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: logout,
      },
    ])
  }

  const styles = createStyles(theme, isDark)

  return (
    <LinearGradient colors={["#8B5CF6", "#A855F7", "#C084FC"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          {/* Profile Icon */}
          <View style={styles.profileIconContainer}>
            <Ionicons name="person" size={48} color="#8B5CF6" />
          </View>

          {/* User Info */}
          <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
          <Text style={styles.userEmail}>{user?.email || "email@exemplo.com"}</Text>

          {/* User Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Escola:</Text>
              <Text style={styles.detailValue}>{user?.school || "Etec de Peruíbe"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cod. Etec:</Text>
              <Text style={styles.detailValue}>{user?.identification || "266"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>RM:</Text>
              <Text style={styles.detailValue}>{user?.rm || "04617"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ano escolar:</Text>
              <Text style={styles.detailValue}>{user?.year || "3º ano do ensino médio, 2025"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Curso:</Text>
              <Text style={styles.detailValue}>{user?.course || "Desenvolvimento de Sistemas"}</Text>
            </View>
          </View>

          <View style={styles.settingsContainer}>
            <Text style={styles.settingsTitle}>Configurações</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name={isDark ? "moon" : "sunny"} size={20} color="#8B5CF6" style={styles.settingIcon} />
                <Text style={styles.settingLabel}>Tema escuro</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: "#E5E7EB", true: "#8B5CF6" }}
                thumbColor={isDark ? "#FFFFFF" : "#F3F4F6"}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const createStyles = (theme, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingVertical: 60,
    },
    profileCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      padding: 32,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 15,
    },
    profileIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isDark ? "#2D2D2D" : "#F3F4F6",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    userName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    userEmail: {
      fontSize: 16,
      color: "#8B5CF6",
      marginBottom: 32,
      textAlign: "center",
    },
    detailsContainer: {
      width: "100%",
      marginBottom: 32,
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    detailLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#8B5CF6",
      flex: 1,
    },
    detailValue: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      flex: 2,
      textAlign: "right",
    },
    settingsContainer: {
      width: "100%",
      marginBottom: 32,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    settingsTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 16,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    settingInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingIcon: {
      marginRight: 12,
    },
    settingLabel: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: "500",
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#8B5CF6",
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 12,
      gap: 8,
    },
    logoutButtonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "600",
    },
  })
