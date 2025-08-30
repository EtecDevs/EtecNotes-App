"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import { View, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import LoginScreen from "./src/screens/LoginScreen"
import HomeScreen from "./src/screens/HomeScreen"
import CalendarScreen from "./src/screens/CalendarScreen"
import ChatScreen from "./src/screens/ChatScreen"
import ProfileScreen from "./src/screens/ProfileScreen"
import NotesScreen from "./src/screens/NotesScreen"
import WellnessScreen from "./src/screens/WellnessScreen"

// Import theme context
import { ThemeProvider, useTheme } from "./src/context/ThemeContext"
import { AuthProvider, useAuth } from "./src/context/AuthContext"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function TabNavigator() {
  const { theme, isDark } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Calendar") {
            iconName = focused ? "calendar" : "calendar-outline"
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbubble" : "chatbubble-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          } else if (route.name === "Notes") {
            iconName = focused ? "book" : "book-outline"
          } else if (route.name === "Wellness") {
            iconName = focused ? "fitness" : "fitness-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#8B5CF6",
        tabBarInactiveTintColor: isDark ? "#9CA3AF" : "#6B7280",
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "Início" }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: "Calendário" }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarLabel: "Chat" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: "Perfil" }} />
      <Tab.Screen name="Notes" component={NotesScreen} options={{ tabBarLabel: "Notas" }} />
      <Tab.Screen name="Wellness" component={WellnessScreen} options={{ tabBarLabel: "Bem-estar" }} />
    </Tab.Navigator>
  )
}

function AppNavigator() {
  const { isAuthenticated } = useAuth()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <View style={styles.container}>
            <StatusBar style="auto" />
            <AppNavigator />
          </View>
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
