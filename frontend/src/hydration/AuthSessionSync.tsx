import { useEffect } from 'react'
import {
  auth,
  onAuthStateChanged,
  type User as FirebaseUser,
} from '@/lib/firebase'
import { useAuthStore } from '@/stores/authStore'
import type { AppUser } from '@/Pages/Setting/components/types'

const toAppUser = (fbUser: FirebaseUser): AppUser => ({
  id: fbUser.uid,
  email: fbUser.email ?? '',
  name: fbUser.displayName ?? '',
  picture: fbUser.photoURL ?? undefined,
  verified_email: fbUser.emailVerified,
})

/** Syncs Firebase session into authStore (no UI). */
export function AuthSessionSync() {
  const setUser = useAuthStore((s) => s.setUser)
  const setLoading = useAuthStore((s) => s.setLoading)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(toAppUser(fbUser))

        try {
          const idToken = await fbUser.getIdToken()
          await fetch(
            `${import.meta.env.VITE_API_URL_USER || 'https://islamiovn-production.up.railway.app/api'}/auth/firebase`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`,
              },
            }
          )
        } catch {
          // Non-critical
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [setUser, setLoading])

  return null
}
