import { useState, useMemo, useCallback, memo } from 'react';
import { ArrowLeft, Heart, Bookmark, Share2, Copy, MessageCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { quranStorageUtils, type QuranFavorite, type QuranBookmark } from '@/components/Utilities/Quran/utils/storage';

interface SavedQuranViewProps {
  onBack: () => void;
}

type ViewType = 'favorites' | 'bookmarks';

const SavedQuranView = memo<SavedQuranViewProps>(({ onBack }) => {
  const [viewType, setViewType] = useState<ViewType>('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<QuranFavorite | QuranBookmark | null>(null);

  // Get saved items from localStorage
  const favorites = quranStorageUtils.getFavorites();
  const bookmarks = quranStorageUtils.getBookmarks();
  const currentItems = viewType === 'favorites' ? favorites : bookmarks;

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return currentItems;
    
    const query = searchQuery.toLowerCase();
    return currentItems.filter(item => 
      item.surahName.toLowerCase().includes(query) ||
      item.ayahText.toLowerCase().includes(query) ||
      (item.translation && item.translation.toLowerCase().includes(query))
    );
  }, [currentItems, searchQuery]);

  // Share functionality
  const shareAyah = useCallback(async (item: QuranFavorite | QuranBookmark, method: 'copy' | 'whatsapp' | 'telegram') => {
    const shareText = `🕌 ${item.surahName} - Ayah ${item.ayahNumber}

${item.ayahText}

${item.translation ? `📖 ${item.translation}

` : ''}🔗 Từ islam.io.vn`;
    
    try {
      switch (method) {
        case 'copy':
          await navigator.clipboard.writeText(shareText);
          console.log('Đã sao chép ayah vào clipboard');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
      }
    } catch (error) {
      console.error('Không thể chia sẻ ayah:', error);
    }
  }, []);

  const handleItemClick = useCallback((item: QuranFavorite | QuranBookmark) => {
    setSelectedItem(item);
  }, []);

  const toggleFavorite = useCallback((surahNumber: number, ayahNumber: number) => {
    if (quranStorageUtils.isFavorite(surahNumber, ayahNumber)) {
      quranStorageUtils.removeFavorite(surahNumber, ayahNumber);
    }
    // Refresh by reloading (simple approach)
    if (viewType === 'favorites') {
      window.location.reload();
    }
  }, [viewType]);

  const toggleBookmark = useCallback((surahNumber: number, ayahNumber: number) => {
    if (quranStorageUtils.isBookmarked(surahNumber, ayahNumber)) {
      quranStorageUtils.removeBookmark(surahNumber, ayahNumber);
    }
    // Refresh by reloading (simple approach)
    if (viewType === 'bookmarks') {
      window.location.reload();
    }
  }, [viewType]);

  const QuranItemCard = memo(({ item }: { item: QuranFavorite | QuranBookmark }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle 
            className="text-sm font-medium line-clamp-2 flex-1"
            onClick={() => handleItemClick(item)}
          >
            {item.surahName} - Ayah {item.ayahNumber}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item.surahNumber, item.ayahNumber);
              }}
              className="h-8 w-8 p-0"
            >
              <Heart 
                className={`h-4 w-4 ${
                  quranStorageUtils.isFavorite(item.surahNumber, item.ayahNumber)
                    ? 'fill-red-500 text-red-500' 
                    : 'text-muted-foreground'
                }`} 
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(item.surahNumber, item.ayahNumber);
              }}
              className="h-8 w-8 p-0"
            >
              <Bookmark 
                className={`h-4 w-4 ${
                  quranStorageUtils.isBookmarked(item.surahNumber, item.ayahNumber)
                    ? 'fill-blue-500 text-blue-500' 
                    : 'text-muted-foreground'
                }`} 
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="h-8 w-8 p-0"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => shareAyah(item, 'copy')}>
                  <Copy className="mr-2 h-4 w-4" />
                  Sao chép
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareAyah(item, 'whatsapp')}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareAyah(item, 'telegram')}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Telegram
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div 
          className="text-2xl text-right font-arabic font-medium mb-3 cursor-pointer line-clamp-2"
          onClick={() => handleItemClick(item)}
          style={{ fontSize: 'var(--quran-font-size, 2rem)' }}
        >
          {item.ayahText}
        </div>
        {item.translation && (
          <p 
            className="text-sm text-muted-foreground line-clamp-2 cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            {item.translation}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <Badge variant="secondary" className="text-xs">
            {new Date(item.timestamp).toLocaleDateString('vi-VN')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  ));

  QuranItemCard.displayName = 'QuranItemCard';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-9 w-9 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Quran đã lưu</h1>
              <p className="text-sm text-muted-foreground">
                Xem lại các ayah bạn đã yêu thích và đánh dấu
              </p>
            </div>
          </div>
        </div>

        {/* View Type Tabs */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={viewType === 'favorites' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('favorites')}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Yêu thích ({favorites.length})
          </Button>
          <Button
            variant={viewType === 'bookmarks' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('bookmarks')}
            className="flex items-center gap-2"
          >
            <Bookmark className="h-4 w-4" />
            Đánh dấu ({bookmarks.length})
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm ayah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content */}
        {currentItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              {viewType === 'favorites' ? (
                <Heart className="h-8 w-8 text-muted-foreground" />
              ) : (
                <Bookmark className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-medium mb-2">
              {viewType === 'favorites' ? 'Chưa có ayah yêu thích' : 'Chưa có ayah đánh dấu'}
            </h3>
            <p className="text-muted-foreground">
              {viewType === 'favorites' 
                ? 'Hãy thêm ayah vào danh sách yêu thích để xem lại sau'
                : 'Hãy đánh dấu ayah để đọc lại sau'
              }
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? 'Không tìm thấy ayah phù hợp' : 'Không có ayah nào'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item, index) => (
                <QuranItemCard key={`${item.surahNumber}-${item.ayahNumber}-${index}`} item={item} />
              ))}
            </div>
            
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                Hiển thị {filteredItems.length} ayah
                {searchQuery && ` cho "${searchQuery}"`}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Ayah Detail Sheet */}
      <Sheet open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <SheetContent
          side="right"
          className="w-screen h-screen max-w-none sm:w-[800px] md:w-[1024px] lg:w-[1280px] p-4 sm:p-6 overflow-y-auto"
        >
          <SheetHeader className="pt-8 pb-4">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-lg sm:text-xl line-clamp-3 mb-2 pr-2 mt-2">
                  {selectedItem?.surahName} - Ayah {selectedItem?.ayahNumber}
                </SheetTitle>
                <SheetDescription className="text-sm sm:text-base">
                  {new Date(selectedItem?.timestamp || 0).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </SheetDescription>
              </div>
              <div className="flex gap-2 self-start">
                {selectedItem && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(selectedItem.surahNumber, selectedItem.ayahNumber)}
                      className="h-8 w-8 p-0"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          quranStorageUtils.isFavorite(selectedItem.surahNumber, selectedItem.ayahNumber)
                            ? 'fill-red-500 text-red-500' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(selectedItem.surahNumber, selectedItem.ayahNumber)}
                      className="h-8 w-8 p-0"
                    >
                      <Bookmark 
                        className={`h-4 w-4 ${
                          quranStorageUtils.isBookmarked(selectedItem.surahNumber, selectedItem.ayahNumber)
                            ? 'fill-blue-500 text-blue-500' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => shareAyah(selectedItem, 'copy')}>
                          <Copy className="mr-2 h-4 w-4" />
                          Sao chép
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareAyah(selectedItem, 'whatsapp')}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareAyah(selectedItem, 'telegram')}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Telegram
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </div>
          </SheetHeader>
          
          {selectedItem && (
            <div className="flex-1 space-y-6 mt-4">
              {/* Arabic Text */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm sm:text-base">
                  Nội dung Ayah
                </h3>
                <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border-l-4 border-primary">
                  <div 
                    className="text-foreground leading-loose text-right font-arabic font-medium"
                    style={{ fontSize: 'var(--quran-font-size, 2.5rem)' }}
                  >
                    {selectedItem.ayahText}
                  </div>
                </div>
              </div>

              {selectedItem.translation && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm sm:text-base">
                      Bản dịch
                    </h3>
                    <div className="text-muted-foreground leading-relaxed bg-card p-3 sm:p-4 rounded-lg border">
                      {selectedItem.translation}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
});

SavedQuranView.displayName = 'SavedQuranView';

export default SavedQuranView;
