import { useCallback, useEffect } from 'react'
import { useAuthStore, selectIsAuthenticated } from '@/stores/authStore'
import { loginWithGoogle, logoutFromApp } from '@/lib/authActions'
import type { AuthContextType } from '@/Pages/Setting/components/types'

export function useAuth(): AuthContextType {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const error = useAuthStore((s) => s.error)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  const login = useCallback(() => loginWithGoogle(), [])
  const logout = useCallback(() => logoutFromApp(), [])

  useEffect(() => {
    const handle = () => {
      if (!useAuthStore.getState().user) {
        loginWithGoogle()
      }
    }
    window.addEventListener('triggerGoogleLogin', handle)
    return () => window.removeEventListener('triggerGoogleLogin', handle)
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    error,
  }
}
