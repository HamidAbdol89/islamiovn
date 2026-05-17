import { create } from 'zustand'
import type { AppUser } from '@/Pages/Setting/components/types'

interface AuthState {
  user: AppUser | null
  isLoading: boolean
  error: string | null

  setUser: (user: AppUser | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  user: null as AppUser | null,
  isLoading: true,
  error: null as string | null,
}

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () => set({ ...initialState, isLoading: false }),
}))

export const selectIsAuthenticated = (state: AuthState) => state.user !== null
