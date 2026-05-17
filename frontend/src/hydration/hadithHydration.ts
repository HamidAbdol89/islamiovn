import { hadithApi } from '@/components/Utilities/Hadith/api'
import { useHadithStore, listCacheKey } from '@/stores/hadithStore'
import { simpleFavoriteService } from '@/services/simpleFavoriteService'
import { simpleBookmarkService } from '@/services/simpleBookmarkService'
import type { ApiResponse, HadithSummary } from '@/components/Utilities/Hadith/types'

export async function hydrateHadithUserLists(userId: string): Promise<void> {
  const [favoritesData, bookmarksData] = await Promise.all([
    simpleFavoriteService.getFavorites('hadith'),
    simpleBookmarkService.getBookmarks('hadith'),
  ])

  const favoriteIds = favoritesData.map((f) => Number(f.itemId))
  const bookmarkIds = bookmarksData.map((b) => Number(b.itemId))
  useHadithStore.getState().hydrateUserLists(userId, favoriteIds, bookmarkIds)
}

export async function hydrateHadithCategories(force = false): Promise<void> {
  const state = useHadithStore.getState()
  if (state.categoriesLoading) return
  if (state.categoriesHydrated && !force) return

  state.setCategoriesLoading(true)
  state.setCategoriesError(null)

  try {
    const categories = await hadithApi.getCategories()
    useHadithStore.getState().setCategories(categories)
  } catch (err) {
    useHadithStore.getState().setCategoriesError((err as Error).message)
    if (force) {
      useHadithStore.getState().setCategoriesHydrated(false)
    }
  }
}

export async function hydrateHadithDetail(hadithId: number): Promise<void> {
  const state = useHadithStore.getState()
  if (state.hadithDetails[hadithId]) return
  if (state.hadithDetailLoadingId === hadithId) return

  state.setHadithDetailLoadingId(hadithId)

  try {
    const detail = await hadithApi.getHadithDetail(hadithId)
    useHadithStore.getState().setHadithDetail(detail)
  } catch {
    useHadithStore.getState().setHadithDetailLoadingId(null)
  }
}

export async function hydrateHadithListPage(
  categoryId: number,
  page: number
): Promise<ApiResponse<HadithSummary> | undefined> {
  const key = listCacheKey(categoryId, page)
  const state = useHadithStore.getState()
  const cached = state.hadithListCache[key]
  if (cached) return cached
  if (state.hadithListLoadingKey === key) return undefined

  state.setHadithListLoadingKey(key)

  try {
    const data = await hadithApi.getHadiths(categoryId, page)
    useHadithStore.getState().setHadithListCache(key, data)
    return data
  } catch {
    useHadithStore.getState().setHadithListLoadingKey(null)
    return undefined
  }
}

export async function hydrateSavedHadithDetails(ids: number[]): Promise<void> {
  if (ids.length === 0) return

  const store = useHadithStore.getState()
  store.setSavedDetailsLoading(true)

  try {
    const details = await Promise.all(
      ids.map((id) => hadithApi.getHadithDetail(id))
    )
    store.setSavedHadithDetails(details)
  } finally {
    useHadithStore.getState().setSavedDetailsLoading(false)
  }
}
