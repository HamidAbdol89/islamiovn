import { useEffect, useRef } from 'react'
import { useAuthStore, selectIsAuthenticated } from '@/stores/authStore'
import { useHadithStore } from '@/stores/hadithStore'
import { hydrateHadithUserLists } from './hadithHydration'

/** One-time per-user hydration of hadith favorites/bookmarks. */
export function HadithUserHydrator() {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const hydratedUserId = useHadithStore((s) => s.hydratedUserId)
  const resetUserData = useHadithStore((s) => s.resetUserData)
  const inFlight = useRef(false)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      inFlight.current = false
      if (hydratedUserId !== null) {
        resetUserData()
      }
      return
    }

    const userId = user.id
    if (hydratedUserId === userId || inFlight.current) return

    let cancelled = false
    inFlight.current = true

    async function load() {
      try {
        await hydrateHadithUserLists(userId)
      } catch {
        if (!cancelled) {
          useHadithStore.getState().hydrateUserLists(userId, [], [])
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
