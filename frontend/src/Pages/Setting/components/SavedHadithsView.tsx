import { useMemo, useCallback, memo, useEffect, useRef } from 'react'
import { Heart, Bookmark } from 'lucide-react'
import { motion } from 'motion/react'

import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { toast } from '@/lib/toast'
import type { HadithDetail } from '@/components/Utilities/Hadith/types'
import { useAuth } from '@/hooks/useAuth'
import { useHadithStore } from '@/stores/hadithStore'
import { useUiStore } from '@/stores/uiStore'
import { useHadithActions } from '@/hooks/useHadithActions'
import { hydrateSavedHadithDetails } from '@/hydration/hadithHydration'

const HadithCard = memo(
  ({ hadith, isFav, isBookmarked, onOpen, onFav, onBm }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-xl p-4"
    >
      <div className="flex justify-between gap-2">
        <button
          onClick={() => onOpen(hadith)}
          className="text-left flex-1 text-sm font-medium"
        >
          {hadith.title.replace(/{/g, '')}
        </button>

        <div className="flex gap-1">
          <button onClick={() => onFav(hadith.id)}>
            <Heart
              className={`w-4 h-4 ${
                isFav ? 'text-red-500 fill-red-500' : ''
              }`}
            />
          </button>

          <button onClick={() => onBm(hadith.id)}>
            <Bookmark
              className={`w-4 h-4 ${
                isBookmarked ? 'text-blue-500 fill-blue-500' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  )
)

export default function SavedHadithsView({
  onBack,
}: {
  onBack: () => void;
}) {
  const { isAuthenticated } = useAuth()
  const { toggleFavoriteOptimistic, toggleBookmarkOptimistic } = useHadithActions()

  const favorites = useHadithStore((s) => s.favorites)
  const bookmarks = useHadithStore((s) => s.bookmarks)
  const savedHadithDetails = useHadithStore((s) => s.savedHadithDetails)

  const tab = useUiStore((s) => s.savedHadithsTab)
  const search = useUiStore((s) => s.savedHadithsSearch)
  const selectedId = useUiStore((s) => s.savedHadithDetailId)
  const setTab = useUiStore((s) => s.setSavedHadithsTab)
  const setSearch = useUiStore((s) => s.setSavedHadithsSearch)
  const setSelectedId = useUiStore((s) => s.setSavedHadithDetailId)

  const ids = tab === 'favorites' ? favorites : bookmarks
  const idsKey = ids.join(',')
  const lastFetchedIds = useRef<string | null>(null)

  useEffect(() => {
    if (ids.length === 0) {
      lastFetchedIds.current = idsKey
      return
    }
    if (lastFetchedIds.current === idsKey) return

    let cancelled = false
    lastFetchedIds.current = idsKey

    async function load() {
      try {
        await hydrateSavedHadithDetails(ids)
      } catch {
        if (!cancelled) {
          lastFetchedIds.current = null
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [idsKey, ids])

  const hadiths = useMemo(
    () =>
      ids
        .map((id) => savedHadithDetails[id])
        .filter((h): h is HadithDetail => h !== undefined),
    [ids, savedHadithDetails]
  )

  const selected = selectedId ? savedHadithDetails[selectedId] ?? null : null

  const filtered = useMemo(() => {
    if (!search) return hadiths

    return hadiths.filter((h) =>
      h.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [hadiths, search])

  const handleFav = useCallback(
    async (id: number) => {
      if (!isAuthenticated) return toast.error('login required')

      const h = hadiths.find((x) => x.id === id)
      if (!h) return

      const ok = await toggleFavoriteOptimistic(id, {
        type: 'hadith',
        itemId: id.toString(),
        title: h.title,
        content: h.hadeeth,
      })

      if (!ok) toast.error('Could not update favorite')
    },
    [hadiths, isAuthenticated, toggleFavoriteOptimistic]
  )

  const handleBm = useCallback(
    async (id: number) => {
      if (!isAuthenticated) return toast.error('login required')

      const h = hadiths.find((x) => x.id === id)
      if (!h) return

      const ok = await toggleBookmarkOptimistic(id, {
        type: 'hadith',
        itemId: id.toString(),
        title: h.title,
        content: h.hadeeth,
      })

      if (!ok) toast.error('Could not update bookmark')
    },
    [hadiths, isAuthenticated, toggleBookmarkOptimistic]
  )

  return (
    <div className="p-4">
      <div className="flex gap-3 mb-3">
        <button onClick={onBack}>←</button>
        <h1 className="font-semibold">Saved Hadiths</h1>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search hadith..."
      />

      <div className="flex gap-2 my-3">
        <button onClick={() => setTab('favorites')}>
          Favorites ({favorites.length})
        </button>

        <button onClick={() => setTab('bookmarks')}>
          Bookmarks ({bookmarks.length})
        </button>
      </div>

      <div className="space-y-2">
        {filtered.map((h) => (
          <HadithCard
            key={h.id}
            hadith={h}
            isFav={favorites.includes(h.id)}
            isBookmarked={bookmarks.includes(h.id)}
            onOpen={(hadith: HadithDetail) => setSelectedId(hadith.id)}
            onFav={handleFav}
            onBm={handleBm}
          />
        ))}
      </div>

      <Sheet
        open={selectedId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null)
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl overflow-y-auto"
        >
          {selected && (
            <div className="space-y-5 p-4">
              <SheetHeader>
                <SheetTitle>
                  {selected.title?.replace(/{/g, '')}
                </SheetTitle>
                <SheetDescription>
                  {selected.attribution}
                </SheetDescription>
              </SheetHeader>

              <div
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: selected.hadeeth,
                }}
              />

              {selected.explanation && (
                <div
                  className="text-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{
                    __html: selected.explanation,
                  }}
                />
              )}

              {selected.fawaed?.length > 0 && (
                <ul className="space-y-2">
                  {selected.fawaed.map((f, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <span
                        dangerouslySetInnerHTML={{ __html: f }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
