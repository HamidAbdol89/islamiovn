import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'

/** Applies theme class to document root when settingsStore.theme changes. */
export function ThemeSync() {
  const theme = useSettingsStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return null
}
