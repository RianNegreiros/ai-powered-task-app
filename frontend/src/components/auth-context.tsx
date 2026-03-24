import { createContext, useState, useCallback, useEffect, type ReactNode, useContext } from 'react'
import { apiFetch, API_BASE } from '@/lib/api'

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
        setUser(await res.json())
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
      }
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  }, [])

  // Fix 4: shared helper eliminates duplicated try/catch/finally in login + register
  const authPost = useCallback(
    async (endpoint: string, body: Record<string, string>, fallbackMsg: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/api/auth/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.message ?? fallbackMsg)
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

  const login = useCallback(
    (email: string, password: string) =>
      authPost('login', { email, password }, 'Invalid email or password'),
    [authPost]
  )

  const register = useCallback(
    (name: string, email: string, password: string) =>
      authPost('register', { name, email, password }, 'Registration failed'),
    [authPost]
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
