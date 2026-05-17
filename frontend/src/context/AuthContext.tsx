import React from 'react'
import { AuthSessionSync } from '@/hydration/AuthSessionSync'

export { useAuth } from '@/hooks/useAuth'
export type { AuthContextType, AppUser, GoogleUser } from '@/Pages/Setting/components/types'

/** Mounts Firebase session sync; auth state lives in authStore. */
export const AuthProvider = React.memo<{ children: React.ReactNode }>(
  ({ children }) => (
    <>
      <AuthSessionSync />
      {children}
    </>
  )
)

AuthProvider.displayName = 'AuthProvider'

export default AuthProvider
