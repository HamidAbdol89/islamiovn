import { useCallback } from 'react'
import { useHadithStore } from '@/stores/hadithStore'
import { useAuthStore, selectIsAuthenticated } from '@/stores/authStore'
import { simpleFavoriteService } from '@/services/simpleFavoriteService'
import { simpleBookmarkService } from '@/services/simpleBookmarkService'

type HadithTogglePayload = {
  type: 'hadith'
  itemId: string
  title: string
  content: string
  metadata?: Record<string, string>
  category?: string
}

export function useHadithActions() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  const toggleFavoriteOptimistic = useCallback(
    async (id: number, payload: HadithTogglePayload) => {
      if (!isAuthenticated) return false

      const store = useHadithStore.getState()
      const previous = [...store.favorites]
      store.toggleFavorite(id)

      try {
        await simpleFavoriteService.toggleFavorite(payload)
        return true
      } catch {
        store.setFavorites(previous)
        return false
      }
    },
    [isAuthenticated]
  )

  const toggleBookmarkOptimistic = useCallback(
    async (id: number, payload: HadithTogglePayload) => {
      if (!isAuthenticated) return false

      const store = useHadithStore.getState()
      const previous = [...store.bookmarks]
      store.toggleBookmark(id)

      try {
        await simpleBookmarkService.toggleBookmark(payload)
        return true
      } catch {
        store.setBookmarks(previous)
        return false
      }
    },
    [isAuthenticated]
  )

  return {
    toggleFavoriteOptimistic,
    toggleBookmarkOptimistic,
  }
}
