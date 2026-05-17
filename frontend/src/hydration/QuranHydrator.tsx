import { useEffect, useRef } from 'react'
import { useAuthStore, selectIsAuthenticated } from '@/stores/authStore'
import { useQuranStore } from '@/stores/quranStore'
import {
  hydrateQuranFromLocal,
  hydrateQuranUserLists,
  persistQuranListsToLocal,
} from './quranHydration'

/** Hydrates Quran favorites/bookmarks from localStorage and server (when logged in). */
export function QuranHydrator() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const user = useAuthStore((s) => s.user)
  const localHydrated = useQuranStore((s) => s.localHydrated)
  const hydratedUserId = useQuranStore((s) => s.hydratedUserId)
  const resetUserData = useQuranStore((s) => s.resetUserData)
  const localDone = useRef(false)
  const inFlight = useRef(false)

  useEffect(() => {
    if (localHydrated || localDone.current) return
    localDone.current = true
    hydrateQuranFromLocal()
  }, [localHydrated])

  useEffect(() => {
    const unsub = useQuranStore.subscribe((state, prev) => {
      if (
        state.favorites !== prev.favorites ||
        state.bookmarks !== prev.bookmarks ||
        state.fontSize !== prev.fontSize
      ) {
        persistQuranListsToLocal()
      }
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !user) {
      inFlight.current = false
      if (hydratedUserId !== null) {
        resetUserData()
        hydrateQuranFromLocal()
      }
      return
    }

    const userId = user.id
    if (hydratedUserId === userId || inFlight.current) return

    let cancelled = false
    inFlight.current = true

    async function load() {
      try {
        await hydrateQuranUserLists(userId)
      } catch {
        if (!cancelled) {
          useQuranStore.getState().hydrateUserLists(userId, [], [])
        }
      } finally {
        if (!cancelled) {
          inFlight.current = false
        }
      }
    }

    load()

    return () => {
      cancelled = true
      inFlight.current = false
    }
  }, [isAuthenticated, user?.id, hydratedUserId, resetUserData])

  return null
}
