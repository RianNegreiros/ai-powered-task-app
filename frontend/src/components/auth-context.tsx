import { createContext, useState, useCallback, useEffect, type ReactNode, useContext } from 'react'
import { apiFetch } from '@/lib/api'

export interface User {
  id: string
  name: string
  email: string
}

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await apiFetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
      }
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.message ?? 'Invalid email or password')
        }
        const data = await res.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)
        await fetchUser()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUser]
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name, email, password }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.message ?? 'Registration failed')
        }
        const data = await res.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)
        await fetchUser()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUser]
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {})
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
