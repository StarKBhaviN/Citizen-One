"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"

interface User {
  _id: string
  name: string
  email: string
  role: "citizen" | "officer" | "supervisor" | "admin"
  status: "active" | "inactive" | "suspended"
  department?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (userData: any) => Promise<void>
  updatePassword: (passwordData: any) => Promise<void>
  clearError: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Load user on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          setLoading(false)
          return
        }

        const res = await authAPI.getProfile()
        setUser(res.data.data)
        setIsAuthenticated(true)
      } catch (err) {
        localStorage.removeItem("token")
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Login user
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const res = await authAPI.login({ email, password })

      localStorage.setItem("token", res.data.token)
      setUser(res.data.user)
      setIsAuthenticated(true)

      // Redirect based on role
      if (res.data.user.role === "admin" || res.data.user.role === "supervisor" || res.data.user.role === "officer") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Register user
  const register = async (userData: any) => {
    try {
      setLoading(true)
      setError(null)

      const res = await authAPI.register(userData)

      localStorage.setItem("token", res.data.token)
      setUser(res.data.user)
      setIsAuthenticated(true)

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      localStorage.removeItem("token")
      setUser(null)
      setIsAuthenticated(false)
      router.push("/login")
    }
  }

  // Update user profile
  const updateProfile = async (userData: any) => {
    try {
      setLoading(true)
      setError(null)

      const res = await authAPI.updateProfile(userData)
      setUser(res.data.data)

      return res.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update password
  const updatePassword = async (passwordData: any) => {
    try {
      setLoading(true)
      setError(null)

      await authAPI.updatePassword(passwordData)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update password.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        clearError,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

