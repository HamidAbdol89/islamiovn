import { create } from 'zustand'
import type { ViewType } from '@/Pages/Setting/components/types'

type SavedItemsTab = 'favorites' | 'bookmarks'

interface UiState {
  settingsView: ViewType
  savedHadithsTab: SavedItemsTab
  savedHadithsSearch: string
  savedHadithDetailId: number | null

  savedQuranTab: SavedItemsTab
  savedQuranSearch: string
  savedQuranSelectedKey: string | null

  hadithSelectedCategoryId: number | null
  hadithSelectedHadithId: number | null
  hadithCurrentPage: number

  setSettingsView: (view: ViewType) => void
  setSavedHadithsTab: (tab: SavedItemsTab) => void
  setSavedHadithsSearch: (search: string) => void
  setSavedHadithDetailId: (id: number | null) => void

  setSavedQuranTab: (tab: SavedItemsTab) => void
  setSavedQuranSearch: (search: string) => void
  setSavedQuranSelectedKey: (key: string | null) => void

  setHadithSelectedCategoryId: (id: number | null) => void
  setHadithSelectedHadithId: (id: number | null) => void
  setHadithCurrentPage: (page: number) => void

  resetHadithBrowser: () => void
  resetSavedHadithsUi: () => void
  resetSavedQuranUi: () => void
}

export const useUiStore = create<UiState>((set) => ({
  settingsView: 'main',
  savedHadithsTab: 'favorites',
  savedHadithsSearch: '',
  savedHadithDetailId: null,

  savedQuranTab: 'favorites',
  savedQuranSearch: '',
  savedQuranSelectedKey: null,

  hadithSelectedCategoryId: null,
  hadithSelectedHadithId: null,
  hadithCurrentPage: 1,

  setSettingsView: (settingsView) => set({ settingsView }),

  setSavedHadithsTab: (savedHadithsTab) => set({ savedHadithsTab }),

  setSavedHadithsSearch: (savedHadithsSearch) => set({ savedHadithsSearch }),

  setSavedHadithDetailId: (savedHadithDetailId) => set({ savedHadithDetailId }),

  setSavedQuranTab: (savedQuranTab) => set({ savedQuranTab }),

  setSavedQuranSearch: (savedQuranSearch) => set({ savedQuranSearch }),

  setSavedQuranSelectedKey: (savedQuranSelectedKey) =>
    set({ savedQuranSelectedKey }),

  setHadithSelectedCategoryId: (hadithSelectedCategoryId) =>
    set({ hadithSelectedCategoryId }),

  setHadithSelectedHadithId: (hadithSelectedHadithId) =>
    set({ hadithSelectedHadithId }),

  setHadithCurrentPage: (hadithCurrentPage) => set({ hadithCurrentPage }),

  resetHadithBrowser: () =>
    set({
      hadithSelectedCategoryId: null,
      hadithSelectedHadithId: null,
      hadithCurrentPage: 1,
    }),

  resetSavedHadithsUi: () =>
    set({
      savedHadithsTab: 'favorites',
      savedHadithsSearch: '',
      savedHadithDetailId: null,
    }),

  resetSavedQuranUi: () =>
    set({
      savedQuranTab: 'favorites',
      savedQuranSearch: '',
      savedQuranSelectedKey: null,
    }),
}))
