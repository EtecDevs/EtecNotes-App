import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem("user")
      if (userData) {
        // Carrega os dados do usuário, mas NÃO marca como autenticado.
        setUser(JSON.parse(userData))
        // NÃO chamar setIsAuthenticated(true) aqui para evitar login automático.
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      // Simulate login - in real app, this would be an API call
      if (username && password) {
        const userData = {
          id: 1,
          name: "Gustavo Rodrigues Silva",
          email: "gustavo.silva@email.com",
          school: "Etec de Peruíbe",
          identification: "266",
          rm: "04617",
          year: "3º ano do ensino médio, 2025",
          course: "Desenvolvimento de Sistemas",
        }

        await AsyncStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
        setIsAuthenticated(true)
        return { success: true }
      }
      return { success: false, error: "Credenciais inválidas" }
    } catch (error) {
      return { success: false, error: "Erro ao fazer login" }
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user")
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
