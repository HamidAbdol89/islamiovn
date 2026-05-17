import { create } from 'zustand'
import type {
  Category,
  HadithDetail,
  HadithSummary,
  ApiResponse,
} from '@/components/Utilities/Hadith/types'

type Id = number

const unique = (ids: Id[]) => Array.from(new Set(ids))

interface HadithState {
  favorites: Id[]
  bookmarks: Id[]
  hydratedUserId: string | null

  categories: Category[]
  categoriesLoading: boolean
  categoriesError: string | null
  categoriesHydrated: boolean

  hadithDetails: Record<number, HadithDetail>
  hadithDetailLoadingId: number | null

  hadithListCache: Record<string, ApiResponse<HadithSummary>>
  hadithListLoadingKey: string | null

  savedHadithDetails: Record<number, HadithDetail>
  savedDetailsLoading: boolean

  setFavorites: (ids: Id[]) => void
  setBookmarks: (ids: Id[]) => void
  toggleFavorite: (id: Id) => void
  toggleBookmark: (id: Id) => void
  hydrateUserLists: (userId: string, favoriteIds: Id[], bookmarkIds: Id[]) => void
  resetUserData: () => void

  setCategories: (categories: Category[]) => void
  setCategoriesLoading: (loading: boolean) => void
  setCategoriesError: (error: string | null) => void
  setCategoriesHydrated: (hydrated: boolean) => void

  setHadithDetail: (detail: HadithDetail) => void
  setHadithDetailLoadingId: (id: number | null) => void

  setHadithListCache: (key: string, data: ApiResponse<HadithSummary>) => void
  setHadithListLoadingKey: (key: string | null) => void

  setSavedHadithDetails: (details: HadithDetail[]) => void
  setSavedDetailsLoading: (loading: boolean) => void
}

const userDataInitial = {
  favorites: [] as Id[],
  bookmarks: [] as Id[],
  hydratedUserId: null as string | null,
  savedHadithDetails: {} as Record<number, HadithDetail>,
  savedDetailsLoading: false,
}

export const useHadithStore = create<HadithState>((set) => ({
  ...userDataInitial,

  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  categoriesHydrated: false,

  hadithDetails: {},
  hadithDetailLoadingId: null,

  hadithListCache: {},
  hadithListLoadingKey: null,

  setFavorites: (ids) => set({ favorites: unique(ids) }),

  setBookmarks: (ids) => set({ bookmarks: unique(ids) }),

  toggleFavorite: (id) =>
    set((state) => {
      const exists = state.favorites.includes(id)
      return {
        favorites: exists
          ? state.favorites.filter((i) => i !== id)
          : unique([...state.favorites, id]),
      }
    }),

  toggleBookmark: (id) =>
    set((state) => {
      const exists = state.bookmarks.includes(id)
      return {
        bookmarks: exists
          ? state.bookmarks.filter((i) => i !== id)
          : unique([...state.bookmarks, id]),
      }
    }),

  hydrateUserLists: (userId, favoriteIds, bookmarkIds) =>
    set({
      hydratedUserId: userId,
      favorites: unique(favoriteIds),
      bookmarks: unique(bookmarkIds),
    }),

  resetUserData: () => set({ ...userDataInitial }),

  setCategories: (categories) =>
    set({
      categories,
      categoriesLoading: false,
      categoriesError: null,
      categoriesHydrated: true,
    }),

  setCategoriesLoading: (categoriesLoading) => set({ categoriesLoading }),

  setCategoriesError: (categoriesError) =>
    set({ categoriesError, categoriesLoading: false }),

  setCategoriesHydrated: (categoriesHydrated) => set({ categoriesHydrated }),

  setHadithDetail: (detail) =>
    set((state) => ({
      hadithDetails: { ...state.hadithDetails, [detail.id]: detail },
      hadithDetailLoadingId: null,
    })),

  setHadithDetailLoadingId: (hadithDetailLoadingId) =>
    set({ hadithDetailLoadingId }),

  setHadithListCache: (key, data) =>
    set((state) => ({
      hadithListCache: { ...state.hadithListCache, [key]: data },
      hadithListLoadingKey: null,
    })),

  setHadithListLoadingKey: (hadithListLoadingKey) => set({ hadithListLoadingKey }),

  setSavedHadithDetails: (details) =>
    set((state) => {
      const next = { ...state.savedHadithDetails }
      for (const detail of details) {
        next[detail.id] = detail
      }
      return { savedHadithDetails: next }
    }),

  setSavedDetailsLoading: (savedDetailsLoading) => set({ savedDetailsLoading }),
}))

export const listCacheKey = (categoryId: number, page: number) =>
  `${categoryId}:${page}`
