import { create } from 'zustand'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'islamiovn-theme'

const readStoredTheme = (): Theme => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    // localStorage unavailable
  }
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark'
  }
  return 'light'
}

interface SettingsState {
  theme: Theme
  notificationsEnabled: boolean

  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setNotificationsEnabled: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: readStoredTheme(),
  notificationsEnabled: true,

  setTheme: (theme) => {
    set({ theme })
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore
    }
  },

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    get().setTheme(next)
  },

  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
}))

export const selectIsDarkTheme = (state: SettingsState) => state.theme === 'dark'
