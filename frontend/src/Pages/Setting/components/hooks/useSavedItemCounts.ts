import { useHadithStore } from '@/stores/hadithStore'
import { useQuranStore } from '@/stores/quranStore'
import type { SavedItemCounts } from '../types'

export const useSavedItemCounts = (): SavedItemCounts => {
  const hadithFavorites = useHadithStore((s) => s.favorites.length)
  const hadithBookmarks = useHadithStore((s) => s.bookmarks.length)
  const quranFavorites = useQuranStore((s) => s.favorites.length)
  const quranBookmarks = useQuranStore((s) => s.bookmarks.length)

  return {
    hadithFavorites,
    hadithBookmarks,
    quranFavorites,
    quranBookmarks,
  }
}
