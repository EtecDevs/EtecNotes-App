import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

const lightTheme = {
  colors: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceSecondary: "#F8F9FA",
    primary: "#8C43FF",
    primaryLight: "#9955FF",
    text: "#1A1A1A",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#4CAF50",
    warning: "#FFC107",
    error: "#FF4D4D",
    info: "#00B2FF",
  },
}

const darkTheme = {
  colors: {
    background: "#121212",
    surface: "#1E1E1E",
    surfaceSecondary: "#2D2D2D",
    primary: "#8C43FF",
    primaryLight: "#9955FF",
    text: "#FFFFFF",
    textSecondary: "#9CA3AF",
    border: "#333333",
    success: "#4CAF50",
    warning: "#FFC107",
    error: "#FF4D4D",
    info: "#00B2FF",
  },
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme")
      if (savedTheme !== null) {
        setIsDark(savedTheme === "dark")
      }
    } catch (error) {
      console.error("Error loading theme:", error)
    }
  }

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark
      setIsDark(newTheme)
      await AsyncStorage.setItem("theme", newTheme ? "dark" : "light")
    } catch (error) {
      console.error("Error saving theme:", error)
    }
  }

  const theme = isDark ? darkTheme : lightTheme

  return <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>{children}</ThemeContext.Provider>
}
