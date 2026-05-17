import { useEffect, useRef, useState } from 'react'
import { useHadithStore, listCacheKey } from '@/stores/hadithStore'
import { hydrateHadithListPage } from '@/hydration/hadithHydration'
import type { ApiResponse, HadithSummary } from '../types'

export const useHadiths = (categoryId: number | null, page: number) => {
  const hadithListCache = useHadithStore((s) => s.hadithListCache)
  const hadithListLoadingKey = useHadithStore((s) => s.hadithListLoadingKey)
  const [error, setError] = useState<Error | null>(null)
  const didHydrate = useRef<string | null>(null)

  const cacheKey =
    categoryId !== null ? listCacheKey(categoryId, page) : null
  const data = cacheKey ? hadithListCache[cacheKey] : undefined
  const isLoading =
    cacheKey !== null && hadithListLoadingKey === cacheKey && !data

  useEffect(() => {
    if (categoryId === null) return
    const key = listCacheKey(categoryId, page)
    if (hadithListCache[key] || didHydrate.current === key) return

    didHydrate.current = key
    setError(null)

    void hydrateHadithListPage(categoryId, page).then((result) => {
      if (!result) {
        setError(new Error('Failed to load hadiths'))
      }
    })
  }, [categoryId, page, hadithListCache])

  return {
    data: data as ApiResponse<HadithSummary> | undefined,
    isLoading,
    error,
    isError: !!error,
  }
}
