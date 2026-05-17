import { useCallback } from 'react'
import { useQuranStore, quranAyahKey } from '@/stores/quranStore'
import { useAuthStore, selectIsAuthenticated } from '@/stores/authStore'
import { simpleFavoriteService } from '@/services/simpleFavoriteService'
import { simpleBookmarkService } from '@/services/simpleBookmarkService'
import type {
  QuranBookmark,
  QuranFavorite,
} from '@/components/Utilities/Quran/utils/storage'

type AyahPayload = Omit<QuranFavorite, 'timestamp'>

const buildApiPayload = (item: AyahPayload) => ({
  type: 'quran' as const,
  itemId: quranAyahKey(item.surahNumber, item.ayahNumber),
  title: `${item.surahName} - Ayah ${item.ayahNumber}`,
  content: item.ayahText,
  metadata: {
    surahNumber: item.surahNumber,
    ayahNumber: item.ayahNumber,
    surahName: item.surahName,
    translation: item.translation,
    ayahText: item.ayahText,
  },
})

export function useQuranActions() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  const toggleFavoriteOptimistic = useCallback(
    async (item: AyahPayload) => {
      const store = useQuranStore.getState()
      const previous = [...store.favorites]
      store.toggleFavorite(item)

      if (!isAuthenticated) return true

      try {
        await simpleFavoriteService.toggleFavorite(buildApiPayload(item))
        return true
      } catch {
        store.setFavorites(previous)
        return false
      }
    },
    [isAuthenticated]
  )

  const toggleBookmarkOptimistic = useCallback(
    async (item: AyahPayload) => {
      const store = useQuranStore.getState()
      const previous = [...store.bookmarks]
      store.toggleBookmark(item)

      if (!isAuthenticated) return true

      try {
        await simpleBookmarkService.toggleBookmark(buildApiPayload(item))
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

export type { AyahPayload, QuranBookmark, QuranFavorite }
