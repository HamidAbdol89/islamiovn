import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
} from '@/lib/firebase'
import { toastPatterns, toast } from '@/lib/toast'
import { AUTH_MESSAGES } from '@/Pages/Setting/components/constants'
import { useAuthStore } from '@/stores/authStore'

export async function loginWithGoogle(): Promise<void> {
  const { setError } = useAuthStore.getState()
  setError(null)

  try {
    const result = await signInWithPopup(auth, googleProvider)
    toastPatterns.loginSuccess(result.user.displayName ?? 'bạn')
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string }
    if (error?.code === 'auth/popup-closed-by-user') return
    const msg = error?.message ?? AUTH_MESSAGES.LOGIN_ERROR
    setError(msg)
    toast.error(msg)
  }
}

export async function logoutFromApp(): Promise<void> {
  const { setError } = useAuthStore.getState()

  try {
    await signOut(auth)
    toastPatterns.logoutSuccess()
  } catch (err: unknown) {
    const error = err as { message?: string }
    const msg = error?.message ?? AUTH_MESSAGES.LOGOUT_ERROR
    setError(msg)
    toast.error(msg)
  }
}
