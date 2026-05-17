import { useSettingsStore, selectIsDarkTheme, type Theme } from '@/stores/settingsStore'

interface ThemeHook {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDark: boolean
}

export function useTheme(): ThemeHook {
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const toggleTheme = useSettingsStore((s) => s.toggleTheme)
  const isDark = useSettingsStore(selectIsDarkTheme)

  return { theme, setTheme, toggleTheme, isDark }
}
