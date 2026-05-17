import { useEffect, useRef } from 'react'
import { useHadithStore } from '@/stores/hadithStore'
import { hydrateHadithDetail } from '@/hydration/hadithHydration'

export const useHadithDetail = (hadithId: number | null) => {
  const hadithDetails = useHadithStore((s) => s.hadithDetails)
  const loadingId = useHadithStore((s) => s.hadithDetailLoadingId)
  const didHydrate = useRef<number | null>(null)

  useEffect(() => {
    if (!hadithId) return
    if (hadithDetails[hadithId]) return
    if (didHydrate.current === hadithId) return

    didHydrate.current = hadithId
    void hydrateHadithDetail(hadithId)
  }, [hadithId, hadithDetails])

  useEffect(() => {
    if (!hadithId) {
      didHydrate.current = null
    }
  }, [hadithId])

  return {
    data: hadithId ? hadithDetails[hadithId] : undefined,
    isLoading:
      hadithId !== null && loadingId === hadithId && !hadithDetails[hadithId],
  }
}
