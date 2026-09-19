import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, AuthState } from '@/shared/types/auth'

interface AuthContextType extends AuthState {
  login: () => Promise<void>
  logout: () => void
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

const AUTH_API_URL = 'https://drawapi.ajikkk.my.id'
const TOKEN_KEY = 'sketch-board-token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      fetchUser(token)
    } else {
      setState((prev) => ({ ...prev, isLoading: false }))
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'auth-success' && event.data?.token) {
        localStorage.setItem(TOKEN_KEY, event.data.token)
        fetchUser(event.data.token)
      }
      if (event.data?.type === 'auth-error') {
        console.error('Auth error:', event.data.error)
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${AUTH_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const user = await res.json()
        setState({ user, token, isAuthenticated: true, isLoading: false })
      } else {
        localStorage.removeItem(TOKEN_KEY)
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  }

  const login = useCallback(async () => {
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    window.open(
      `${AUTH_API_URL}/api/auth/login`,
      'google-auth',
      `width=${width},height=${height},left=${left},top=${top}`,
    )
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
  }, [])

  const getToken = useCallback(() => state.token, [state.token])

  return (
    <AuthContext.Provider value={{ ...state, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
