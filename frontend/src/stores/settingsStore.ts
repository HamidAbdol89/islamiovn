import { create } from 'zustand'

interface SettingsState {
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  notificationsEnabled: true,
  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
}))
