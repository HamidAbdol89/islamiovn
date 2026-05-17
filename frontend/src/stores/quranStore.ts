import { create } from 'zustand'
import type {
  QuranBookmark,
  QuranFavorite,
} from '@/components/Utilities/Quran/utils/storage'

export type QuranAyahRef = {
  surahNumber: number
  ayahNumber: number
}

export const quranAyahKey = (surahNumber: number, ayahNumber: number) =>
  `${surahNumber}:${ayahNumber}`

export const parseQuranAyahKey = (
  key: string
): QuranAyahRef | null => {
  const [surah, ayah] = key.split(/[-:]/).map(Number)
  if (Number.isNaN(surah) || Number.isNaN(ayah)) return null
  return { surahNumber: surah, ayahNumber: ayah }
}

const dedupeFavorites = (items: QuranFavorite[]) => {
  const map = new Map<string, QuranFavorite>()
  for (const item of items) {
    map.set(quranAyahKey(item.surahNumber, item.ayahNumber), item)
  }
  return Array.from(map.values())
}

const dedupeBookmarks = (items: QuranBookmark[]) => {
  const map = new Map<string, QuranBookmark>()
  for (const item of items) {
    map.set(quranAyahKey(item.surahNumber, item.ayahNumber), item)
  }
  return Array.from(map.values())
}

interface QuranState {
  favorites: QuranFavorite[]
  bookmarks: QuranBookmark[]
  hydratedUserId: string | null
  localHydrated: boolean
  fontSize: number

  setFavorites: (items: QuranFavorite[]) => void
  setBookmarks: (items: QuranBookmark[]) => void
  setFontSize: (size: number) => void

  addFavorite: (item: Omit<QuranFavorite, 'timestamp'>) => void
  removeFavorite: (surahNumber: number, ayahNumber: number) => void
  toggleFavorite: (item: Omit<QuranFavorite, 'timestamp'>) => void

  addBookmark: (item: Omit<QuranBookmark, 'timestamp'>) => void
  removeBookmark: (surahNumber: number, ayahNumber: number) => void
  toggleBookmark: (item: Omit<QuranBookmark, 'timestamp'>) => void

  hydrateLocal: (favorites: QuranFavorite[], bookmarks: QuranBookmark[]) => void
  hydrateUserLists: (
    userId: string,
    favorites: QuranFavorite[],
    bookmarks: QuranBookmark[]
  ) => void
  resetUserData: () => void
}

const userDataInitial = {
  favorites: [] as QuranFavorite[],
  bookmarks: [] as QuranBookmark[],
  hydratedUserId: null as string | null,
}

export const useQuranStore = create<QuranState>((set, get) => ({
  ...userDataInitial,
  localHydrated: false,
  fontSize: 1,

  setFavorites: (favorites) => set({ favorites: dedupeFavorites(favorites) }),

  setBookmarks: (bookmarks) => set({ bookmarks: dedupeBookmarks(bookmarks) }),

  setFontSize: (fontSize) => set({ fontSize }),

  addFavorite: (item) =>
    set((state) => {
      const exists = state.favorites.some(
        (f) =>
          f.surahNumber === item.surahNumber && f.ayahNumber === item.ayahNumber
      )
      if (exists) return state

      return {
        favorites: dedupeFavorites([
          ...state.favorites,
          { ...item, timestamp: Date.now() },
        ]),
      }
    }),

  removeFavorite: (surahNumber, ayahNumber) =>
    set((state) => ({
      favorites: state.favorites.filter(
        (f) =>
          !(f.surahNumber === surahNumber && f.ayahNumber === ayahNumber)
      ),
    })),

  toggleFavorite: (item) => {
    const exists = get().favorites.some(
      (f) =>
        f.surahNumber === item.surahNumber && f.ayahNumber === item.ayahNumber
    )
    if (exists) {
      get().removeFavorite(item.surahNumber, item.ayahNumber)
    } else {
      get().addFavorite(item)
    }
  },

  addBookmark: (item) =>
    set((state) => {
      const exists = state.bookmarks.some(
        (b) =>
          b.surahNumber === item.surahNumber && b.ayahNumber === item.ayahNumber
      )
      if (exists) return state

      return {
        bookmarks: dedupeBookmarks([
          ...state.bookmarks,
          { ...item, timestamp: Date.now() },
        ]),
      }
    }),

  removeBookmark: (surahNumber, ayahNumber) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter(
        (b) =>
          !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)
      ),
    })),

  toggleBookmark: (item) => {
    const exists = get().bookmarks.some(
      (b) =>
        b.surahNumber === item.surahNumber && b.ayahNumber === item.ayahNumber
    )
    if (exists) {
      get().removeBookmark(item.surahNumber, item.ayahNumber)
    } else {
      get().addBookmark(item)
    }
  },

  hydrateLocal: (favorites, bookmarks) =>
    set({
      favorites: dedupeFavorites(favorites),
      bookmarks: dedupeBookmarks(bookmarks),
      localHydrated: true,
    }),

  hydrateUserLists: (userId, favorites, bookmarks) =>
    set({
      hydratedUserId: userId,
      favorites: dedupeFavorites(favorites),
      bookmarks: dedupeBookmarks(bookmarks),
    }),

  resetUserData: () =>
    set((state) => ({
      ...userDataInitial,
      localHydrated: state.localHydrated,
      fontSize: state.fontSize,
    })),
}))

export const selectIsQuranFavorite =
  (surahNumber: number, ayahNumber: number) =>
  (state: QuranState) =>
    state.favorites.some(
      (f) => f.surahNumber === surahNumber && f.ayahNumber === ayahNumber
    )

export const selectIsQuranBookmarked =
  (surahNumber: number, ayahNumber: number) =>
  (state: QuranState) =>
    state.bookmarks.some(
      (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    )
