import { useQuranStore, parseQuranAyahKey } from '@/stores/quranStore'
import { quranStorageUtils } from '@/components/Utilities/Quran/utils/storage'
import type {
  QuranBookmark,
  QuranFavorite,
} from '@/components/Utilities/Quran/utils/storage'
import { simpleFavoriteService } from '@/services/simpleFavoriteService'
import { simpleBookmarkService } from '@/services/simpleBookmarkService'
import type { SimpleFavorite } from '@/services/simpleFavoriteService'
import type { SimpleBookmark } from '@/services/simpleBookmarkService'

const parseItemId = (itemId: string) => parseQuranAyahKey(itemId.replace('-', ':'))

const mapFavorite = (fav: SimpleFavorite): QuranFavorite | null => {
  const ref = parseItemId(fav.itemId)
  if (!ref) return null

  const meta = fav as SimpleFavorite & {
    metadata?: {
      surahName?: string
      translation?: string
      ayahText?: string
    }
  }

  return {
    surahNumber: ref.surahNumber,
    ayahNumber: ref.ayahNumber,
    surahName: meta.metadata?.surahName ?? fav.title.split(' - ')[0] ?? fav.title,
    ayahText: meta.metadata?.ayahText ?? fav.content,
    translation: meta.metadata?.translation,
    timestamp: new Date(fav.createdAt).getTime() || Date.now(),
  }
}

const mapBookmark = (bm: SimpleBookmark): QuranBookmark | null => {
  const ref = parseItemId(bm.itemId)
  if (!ref) return null

  return {
    surahNumber: ref.surahNumber,
    ayahNumber: ref.ayahNumber,
    surahName: bm.title.split(' - ')[0] ?? bm.title,
    ayahText: bm.content,
    translation: undefined,
    timestamp: new Date(bm.createdAt).getTime() || Date.now(),
  }
}

export function persistQuranListsToLocal(): void {
  const { favorites, bookmarks, fontSize } = useQuranStore.getState()
  quranStorageUtils.setFavorites(favorites)
  quranStorageUtils.setBookmarks(bookmarks)
  quranStorageUtils.setFontSize(fontSize)
}

export function hydrateQuranFromLocal(): void {
  const state = useQuranStore.getState()
  if (state.localHydrated) return

  useQuranStore.getState().hydrateLocal(
    quranStorageUtils.getFavorites(),
    quranStorageUtils.getBookmarks()
  )
  useQuranStore.setState({ fontSize: quranStorageUtils.getFontSize() })
}

export async function hydrateQuranUserLists(userId: string): Promise<void> {
  const [favoritesData, bookmarksData] = await Promise.all([
    simpleFavoriteService.getFavorites('quran'),
    simpleBookmarkService.getBookmarks('quran'),
  ])

  const favorites = favoritesData
    .map(mapFavorite)
    .filter((f): f is QuranFavorite => f !== null)
  const bookmarks = bookmarksData
    .map(mapBookmark)
    .filter((b): b is QuranBookmark => b !== null)

  useQuranStore.getState().hydrateUserLists(userId, favorites, bookmarks)
  persistQuranListsToLocal()
}
