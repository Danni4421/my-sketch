import { useCallback } from 'react'
import { useAuth } from '@/features/auth'

const API_URL = 'https://drawapi.ajikkk.my.id'

export function useAuthenticatedFetch() {
  const { getToken, isAuthenticated } = useAuth()

  const authenticatedFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const token = getToken()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      }

      return fetch(`${API_URL}${path}`, {
        ...options,
        headers,
      })
    },
    [getToken, isAuthenticated],
  )

  return { authenticatedFetch, isAuthenticated }
}
