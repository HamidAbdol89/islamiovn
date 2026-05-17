import React from 'react'
import { ThemeSync } from '@/hydration/ThemeSync'

export { useTheme } from '@/hooks/useTheme'
export type { Theme } from '@/stores/settingsStore'

/** Mounts DOM theme sync; theme state lives in settingsStore. */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <>
    <ThemeSync />
    {children}
  </>
)
