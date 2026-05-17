import { useMemo, useCallback, memo } from 'react';
import {
  ArrowLeft, Bookmark, ChatTeardrop, Copy, Heart,
  MagnifyingGlass, ShareNetwork,
} from 'phosphor-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { QuranFavorite, QuranBookmark } from '@/components/Utilities/Quran/utils/storage';
import { motion } from 'motion/react';
import { useQuranStore, selectIsQuranFavorite, selectIsQuranBookmarked, quranAyahKey } from '@/stores/quranStore';
import { useUiStore } from '@/stores/uiStore';
import { useQuranActions } from '@/hooks/useQuranActions';
import { toast } from '@/lib/toast';

interface Props { onBack: () => void }
type QuranItem = QuranFavorite | QuranBookmark;

async function shareAyah(item: QuranItem, method: 'copy' | 'whatsapp' | 'telegram') {
  const text = `🕌 ${item.surahName} - Ayah ${item.ayahNumber}\n\n${item.ayahText}${item.translation ? `\n\n📖 ${item.translation}` : ''}\n\n🔗 islam.io.vn`;
  if (method === 'copy')     { await navigator.clipboard.writeText(text); }
  if (method === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  if (method === 'telegram') window.open(`https://t.me/share/url?text=${encodeURIComponent(text)}`, '_blank');
}

const EmptyState = ({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) => (
  <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
    <motion.div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
      <Icon className="w-7 h-7 text-muted-foreground" />
    </motion.div>
    <motion.div>
      <p className="font-semibold text-foreground text-sm">{title}</p>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
    </motion.div>
  </div>
);

const QuranCard = memo(({
  item, onOpen, onToggleFav, onToggleBm,
}: {
  item: QuranItem;
  onOpen: (i: QuranItem) => void;
  onToggleFav: (surah: number, ayah: number) => void;
  onToggleBm:  (surah: number, ayah: number) => void;
}) => {
  const isFav = useQuranStore(selectIsQuranFavorite(item.surahNumber, item.ayahNumber));
  const isBm  = useQuranStore(selectIsQuranBookmarked(item.surahNumber, item.ayahNumber));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-[var(--radius)] overflow-hidden hover:shadow-md transition-shadow"
    >
      <motion.div className="px-4 pt-4 pb-2 flex items-start gap-2">
        <button type="button" onClick={() => onOpen(item)} className="flex-1 text-left text-sm font-semibold text-foreground">
          {item.surahName}
          <span className="font-normal text-muted-foreground ml-1">· Ayah {item.ayahNumber}</span>
        </button>
        <motion.div className="flex gap-0.5 flex-shrink-0">
          <button type="button" onClick={() => onToggleFav(item.surahNumber, item.ayahNumber)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted">
            <Heart className={`w-4 h-4 ${isFav ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
          </button>
          <button type="button" onClick={() => onToggleBm(item.surahNumber, item.ayahNumber)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted">
            <Bookmark className={`w-4 h-4 ${isBm ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted">
                <ShareNetwork className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => shareAyah(item, 'copy')}><Copy className="mr-2 w-4 h-4" />Sao chép</DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareAyah(item, 'whatsapp')}><ChatTeardrop className="mr-2 w-4 h-4" />WhatsApp</DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareAyah(item, 'telegram')}><ChatTeardrop className="mr-2 w-4 h-4" />Telegram</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </motion.div>

      <button type="button" onClick={() => onOpen(item)} className="w-full text-left px-4 pb-4">
        <p
          className="text-right font-arabic text-xl leading-loose text-foreground line-clamp-2 mb-2"
          style={{ fontSize: 'var(--quran-font-size, 1.5rem)' }}
        >
          {item.ayahText}
        </p>
        {item.translation && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.translation}</p>
        )}
        <Badge variant="secondary" className="mt-2 text-[11px]">
          {new Date(item.timestamp).toLocaleDateString('vi-VN')}
        </Badge>
      </button>
    </motion.div>
  );
});
QuranCard.displayName = 'QuranCard';

const SavedQuranView = memo<Props>(({ onBack }) => {
  const { toggleFavoriteOptimistic, toggleBookmarkOptimistic } = useQuranActions();

  const favorites = useQuranStore((s) => s.favorites);
  const bookmarks = useQuranStore((s) => s.bookmarks);

  const tab = useUiStore((s) => s.savedQuranTab);
  const search = useUiStore((s) => s.savedQuranSearch);
  const selectedKey = useUiStore((s) => s.savedQuranSelectedKey);
  const setTab = useUiStore((s) => s.setSavedQuranTab);
  const setSearch = useUiStore((s) => s.setSavedQuranSearch);
  const setSelectedKey = useUiStore((s) => s.setSavedQuranSelectedKey);

  const currentItems = tab === 'favorites' ? favorites : bookmarks;

  const selected = useMemo(() => {
    if (!selectedKey) return null;
    return (
      favorites.find((f) => quranAyahKey(f.surahNumber, f.ayahNumber) === selectedKey) ??
      bookmarks.find((b) => quranAyahKey(b.surahNumber, b.ayahNumber) === selectedKey) ??
      null
    );
  }, [selectedKey, favorites, bookmarks]);

  const filtered = useMemo(() => {
    if (!search.trim()) return currentItems;
    const q = search.toLowerCase();
    return currentItems.filter(i =>
      i.surahName.toLowerCase().includes(q) ||
      i.ayahText.toLowerCase().includes(q) ||
      (i.translation?.toLowerCase().includes(q) ?? false)
    );
  }, [currentItems, search]);

  const handleToggleFav = useCallback(
    async (surah: number, ayah: number) => {
      const item = currentItems.find(
        (i) => i.surahNumber === surah && i.ayahNumber === ayah
      );
      if (!item) return;

      const ok = await toggleFavoriteOptimistic({
        surahNumber: surah,
        ayahNumber: ayah,
        surahName: item.surahName,
        ayahText: item.ayahText,
        translation: item.translation,
      });
      if (!ok) toast.error('Không thể cập nhật yêu thích');
    },
    [currentItems, toggleFavoriteOptimistic]
  );

  const handleToggleBm = useCallback(
    async (surah: number, ayah: number) => {
      const item = currentItems.find(
        (i) => i.surahNumber === surah && i.ayahNumber === ayah
      );
      if (!item) return;

      const ok = await toggleBookmarkOptimistic({
        surahNumber: surah,
        ayahNumber: ayah,
        surahName: item.surahName,
        ayahText: item.ayahText,
        translation: item.translation,
      });
      if (!ok) toast.error('Không thể cập nhật đánh dấu');
    },
    [currentItems, toggleBookmarkOptimistic]
  );

  return (
    <motion.div className="min-h-screen bg-background">
      <motion.div className="mx-auto max-w-2xl px-4 pb-10">

        <motion.div className="flex items-center gap-3 pt-6 pb-5">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <motion.div>
            <h1 className="text-lg font-semibold text-foreground">Quran đã lưu</h1>
            <p className="text-xs text-muted-foreground">Yêu thích và đánh dấu</p>
          </motion.div>
        </motion.div>

        <motion.div className="flex gap-2 mb-4">
          {(['favorites', 'bookmarks'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={[
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                tab === t
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {t === 'favorites' ? <Heart className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              {t === 'favorites' ? `Yêu thích (${favorites.length})` : `Đánh dấu (${bookmarks.length})`}
            </button>
          ))}
        </motion.div>

        <motion.div className="relative mb-5">
          <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm ayah..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </motion.div>

        {currentItems.length === 0 ? (
          <EmptyState
            icon={tab === 'favorites' ? Heart : Bookmark}
            title={tab === 'favorites' ? 'Chưa có ayah yêu thích' : 'Chưa có ayah đánh dấu'}
            desc={tab === 'favorites' ? 'Thêm ayah vào yêu thích để xem lại sau' : 'Đánh dấu ayah để đọc lại sau'}
          />
        ) : filtered.length === 0 ? (
          <EmptyState icon={MagnifyingGlass} title="Không tìm thấy" desc={`Không có kết quả cho "${search}"`} />
        ) : (
          <motion.div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((item) => (
              <QuranCard
                key={quranAyahKey(item.surahNumber, item.ayahNumber)}
                item={item}
                onOpen={(i) => setSelectedKey(quranAyahKey(i.surahNumber, i.ayahNumber))}
                onToggleFav={handleToggleFav}
                onToggleBm={handleToggleBm}
              />
            ))}
          </motion.div>
        )}
        {filtered.length > 0 && (
          <p className="text-center text-xs text-muted-foreground pt-6">
            {filtered.length} ayah{search ? ` cho "${search}"` : ''}
          </p>
        )}
      </motion.div>

      <Sheet
        open={selectedKey !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedKey(null);
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="pt-6 pb-4">
            <SheetTitle>{selected?.surahName} · Ayah {selected?.ayahNumber}</SheetTitle>
            <SheetDescription>
              {selected && new Date(selected.timestamp).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </SheetDescription>
          </SheetHeader>

          {selected && (
            <motion.div className="space-y-5 pb-8">
              <motion.div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nội dung Ayah</p>
                <motion.div className="bg-muted/50 rounded-xl p-4 border-l-2 border-primary">
                  <p
                    className="text-right font-arabic leading-loose text-foreground"
                    style={{ fontSize: 'var(--quran-font-size, 2rem)' }}
                  >
                    {selected.ayahText}
                  </p>
                </motion.div>
              </motion.div>

              {selected.translation && (
                <>
                  <Separator />
                  <motion.div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bản dịch</p>
                    <p className="text-sm text-muted-foreground leading-relaxed bg-card p-4 rounded-xl border">
                      {selected.translation}
                    </p>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
});

SavedQuranView.displayName = 'SavedQuranView';
export default SavedQuranView;
