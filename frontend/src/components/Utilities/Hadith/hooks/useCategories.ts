import { useEffect, useRef } from 'react'
import { useHadithStore } from '@/stores/hadithStore'
import { hydrateHadithCategories } from '@/hydration/hadithHydration'

export const useCategories = () => {
  const categories = useHadithStore((s) => s.categories)
  const isLoading = useHadithStore((s) => s.categoriesLoading)
  const errorMessage = useHadithStore((s) => s.categoriesError)
  const categoriesHydrated = useHadithStore((s) => s.categoriesHydrated)
  const didHydrate = useRef(false)

  useEffect(() => {
    if (categoriesHydrated || didHydrate.current) return
    didHydrate.current = true
    void hydrateHadithCategories()
  }, [categoriesHydrated])

  return {
    data: categories,
    isLoading,
    error: errorMessage ? new Error(errorMessage) : null,
    refetch: () => hydrateHadithCategories(true),
  }
}
