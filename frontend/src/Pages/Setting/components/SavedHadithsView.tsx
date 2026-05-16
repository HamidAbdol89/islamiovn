import  { useState, useMemo, useCallback, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Heart, Bookmark, Share2, Copy, MessageCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
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
import { toast } from '@/lib/toast';
import { ROUTES } from '@/lib/routes';
import { useSimpleBookmarkService } from '@/services/simpleBookmarkService';
import { useSimpleFavoriteService } from '@/services/simpleFavoriteService';
import { hadithApi } from '@/components/Utilities/Hadith/api';
import type { HadithDetail } from '@/components/Utilities/Hadith/types';
import { useAuth } from '@/context/AuthContext';

interface SavedHadithsViewProps {
  onBack: () => void;
}

type ViewType = 'favorites' | 'bookmarks';

const SavedHadithsView = memo<SavedHadithsViewProps>(({ onBack }) => {
  const [viewType, setViewType] = useState<ViewType>('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHadith, setSelectedHadith] = useState<HadithDetail | null>(null);
  const { isAuthenticated } = useAuth();
  
  // Use simple services
  const favoriteService = useSimpleFavoriteService();
  const bookmarkService = useSimpleBookmarkService();

  // Get saved data (only for authenticated users)
  const { data: favorites = [], isLoading: loadingFavorites, error: favoritesError } = useQuery({
    queryKey: ['hadith-favorites', isAuthenticated],
    queryFn: () => favoriteService.getFavorites('hadith'),
    retry: 1,
    retryDelay: 1000,
    enabled: isAuthenticated,
  });

  const { data: bookmarks = [], isLoading: loadingBookmarks, error: bookmarksError } = useQuery({
    queryKey: ['hadith-bookmarks', isAuthenticated],
    queryFn: () => bookmarkService.getBookmarks('hadith'),
    retry: 1,
    retryDelay: 1000,
    enabled: isAuthenticated,
  });

  const currentData = viewType === 'favorites' ? favorites : bookmarks;
  
  // Ensure currentData is an array
  const safeCurrentData = Array.isArray(currentData) ? currentData : [];
  const currentIds = safeCurrentData.map(item => parseInt(item.itemId));

  // Fetch hadith details for saved IDs
  const { data: savedHadiths, isLoading, error } = useQuery({
    queryKey: ['saved-hadiths', viewType, currentIds],
    queryFn: async () => {
      if (currentIds.length === 0) return [];
      
      const promises = currentIds.map(id => hadithApi.getHadithDetail(id));
      const results = await Promise.allSettled(promises);
      
      return results
        .filter((result): result is PromiseFulfilledResult<HadithDetail> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value);
    },
    enabled: currentIds.length > 0,
    initialData: [],
  });

  // Filter hadiths based on search query
  const filteredHadiths = useMemo(() => {
    if (!savedHadiths || !searchQuery.trim()) return savedHadiths || [];
    
    const query = searchQuery.toLowerCase();
    return savedHadiths.filter(hadith => 
      hadith.title.toLowerCase().includes(query) ||
      hadith.hadeeth.toLowerCase().includes(query) ||
      hadith.attribution.toLowerCase().includes(query)
    );
  }, [savedHadiths, searchQuery]);

  // Share functionality
  const shareHadith = useCallback(async (hadith: HadithDetail, method: 'copy' | 'whatsapp' | 'telegram') => {
    const shareText = `📖 ${hadith.title}\n\n${hadith.hadeeth.replace(/<[^>]*>/g, '')}\n\n📚 ${hadith.attribution}\n\n🔗 Từ islam.io.vn`;
    
    try {
      switch (method) {
        case 'copy':
          await navigator.clipboard.writeText(shareText);
          toast.success('Đã sao chép hadith vào clipboard');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
      }
    } catch (error) {
      toast.error('Không thể chia sẻ hadith');
    }
  }, []);

  const handleHadithClick = useCallback((hadith: HadithDetail) => {
    setSelectedHadith(hadith);
  }, []);

  const toggleFavorite = useCallback(async (hadithId: number) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng chức năng yêu thích');
      return;
    }
    
    try {
      const hadith = savedHadiths?.find(h => h.id === hadithId);
      if (!hadith) return;

      const hadithData = {
        type: 'hadith' as const,
        itemId: hadithId.toString(),
        title: hadith.title,
        content: hadith.hadeeth,
        metadata: {
          hadithNumber: hadithId.toString(),
          attribution: hadith.attribution
        }
      };

      await favoriteService.toggleFavorite(hadithData);
      
      // Refetch data
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      if (error instanceof Error && error.message.includes('đăng nhập')) {
        toast.error(error.message);
      } else {
        toast.error('Không thể cập nhật yêu thích');
      }
    }
  }, [savedHadiths, isAuthenticated]);

  const toggleBookmark = useCallback(async (hadithId: number) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng chức năng đánh dấu');
      return;
    }
    
    try {
      const hadith = savedHadiths?.find(h => h.id === hadithId);
      if (!hadith) return;

      const hadithData = {
        type: 'hadith' as const,
        itemId: hadithId.toString(),
        title: hadith.title,
        content: hadith.hadeeth,
        category: 'Unknown', // We don't have category info here
        metadata: {
          hadithNumber: hadithId.toString()
        }
      };

      await bookmarkService.toggleBookmark(hadithData);
      
      // Refetch data
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      if (error instanceof Error && error.message.includes('đăng nhập')) {
        toast.error(error.message);
      } else {
        toast.error('Không thể cập nhật đánh dấu');
      }
    }
  }, [savedHadiths, isAuthenticated]);

  const HadithCard = memo(({ hadith }: { hadith: HadithDetail }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle 
            className="text-sm font-medium line-clamp-2 flex-1"
            onClick={() => handleHadithClick(hadith)}
          >
            {hadith.title.replace(/{/g, "")}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(hadith.id);
              }}
              className="h-8 w-8 p-0"
            >
              <Heart 
                className={`h-4 w-4 ${
                  currentIds.includes(hadith.id) && viewType === 'favorites'
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
                toggleBookmark(hadith.id);
              }}
              className="h-8 w-8 p-0"
            >
              <Bookmark 
                className={`h-4 w-4 ${
                  currentIds.includes(hadith.id) && viewType === 'bookmarks'
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
                <DropdownMenuItem onClick={() => shareHadith(hadith, 'copy')}>
                  <Copy className="mr-2 h-4 w-4" />
                  Sao chép
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareHadith(hadith, 'whatsapp')}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareHadith(hadith, 'telegram')}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Telegram
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p 
          className="text-sm text-muted-foreground line-clamp-3 mb-3 cursor-pointer"
          onClick={() => handleHadithClick(hadith)}
          dangerouslySetInnerHTML={{ 
            __html: hadith.hadeeth.length > 150 
              ? hadith.hadeeth.substring(0, 150) + '...' 
              : hadith.hadeeth 
          }}
        />
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {hadith.attribution}
          </Badge>
        </div>
      </CardContent>
    </Card>
  ));

  HadithCard.displayName = 'HadithCard';

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
              <h1 className="text-xl font-semibold">Hadith đã lưu</h1>
              <p className="text-sm text-muted-foreground">
                Xem lại các hadith bạn đã yêu thích và đánh dấu
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
            Yêu thích ({(favorites || []).length})
          </Button>
          <Button
            variant={viewType === 'bookmarks' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('bookmarks')}
            className="flex items-center gap-2"
          >
            <Bookmark className="h-4 w-4" />
            Đánh dấu ({(bookmarks || []).length})
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm hadith..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Vui lòng đăng nhập</h3>
            <p className="text-muted-foreground mb-4">
              Bạn cần đăng nhập để xem các hadith đã lưu
            </p>
            <Button onClick={() => window.location.href = ROUTES.SETTING}>
              Đăng nhập ngay
            </Button>
          </div>
        ) : (loadingFavorites || loadingBookmarks || isLoading) ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (favoritesError || bookmarksError) ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Lỗi tải dữ liệu</h3>
            <p className="text-muted-foreground mb-4">
              Không thể tải danh sách hadith đã lưu. Vui lòng thử lại sau.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Thử lại
            </Button>
          </div>
        ) : safeCurrentData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              {viewType === 'favorites' ? (
                <Heart className="h-8 w-8 text-muted-foreground" />
              ) : (
                <Bookmark className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-medium mb-2">
              {viewType === 'favorites' ? 'Chưa có hadith yêu thích' : 'Chưa có hadith đánh dấu'}
            </h3>
            <p className="text-muted-foreground">
              {viewType === 'favorites' 
                ? 'Hãy thêm hadith vào danh sách yêu thích để xem lại sau'
                : 'Hãy đánh dấu hadith để đọc lại sau'
              }
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full mb-3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Có lỗi xảy ra khi tải hadith</p>
            <Button onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        ) : filteredHadiths.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? 'Không tìm thấy hadith phù hợp' : 'Không có hadith nào'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredHadiths.map((hadith) => (
                <HadithCard key={hadith.id} hadith={hadith} />
              ))}
            </div>
            
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                Hiển thị {filteredHadiths.length} hadith
                {searchQuery && ` cho "${searchQuery}"`}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Hadith Detail Sheet */}
      <Sheet open={!!selectedHadith} onOpenChange={() => setSelectedHadith(null)}>
        <SheetContent
          side="right"
          className="w-screen h-screen max-w-none sm:w-[800px] md:w-[1024px] lg:w-[1280px] p-4 sm:p-6 overflow-y-auto"
        >
          <SheetHeader className="pt-8 pb-4">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-lg sm:text-xl line-clamp-3 mb-2 pr-2 mt-2">
                  {selectedHadith?.title?.replace(/{/g, "")}
                </SheetTitle>
                {selectedHadith?.attribution && (
                  <SheetDescription className="text-sm sm:text-base">
                    {selectedHadith.attribution}
                  </SheetDescription>
                )}
              </div>
              <div className="flex gap-2 self-start">
                {selectedHadith && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(selectedHadith.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          Array.isArray(favorites) ? favorites.some(fav => fav.itemId === selectedHadith.id.toString()) : false
                            ? 'fill-red-500 text-red-500' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(selectedHadith.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Bookmark 
                        className={`h-4 w-4 ${
                          Array.isArray(bookmarks) ? bookmarks.some(bm => bm.itemId === selectedHadith.id.toString()) : false
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
                        <DropdownMenuItem onClick={() => shareHadith(selectedHadith, 'copy')}>
                          <Copy className="mr-2 h-4 w-4" />
                          Sao chép
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareHadith(selectedHadith, 'whatsapp')}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareHadith(selectedHadith, 'telegram')}>
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
          
          {selectedHadith && (
            <div className="flex-1 space-y-6 mt-4">
              {/* Hadith Content */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm sm:text-base">
                  Nội dung Hadith
                </h3>
                <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border-l-4 border-primary">
                  <div 
                    className="text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedHadith.hadeeth }}
                  />
                </div>
              </div>

              {selectedHadith.explanation && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm sm:text-base">
                      Giải thích
                    </h3>
                    <div 
                      className="text-muted-foreground leading-relaxed bg-card p-3 sm:p-4 rounded-lg border"
                      dangerouslySetInnerHTML={{ __html: selectedHadith.explanation }}
                    />
                  </div>
                </>
              )}

              {selectedHadith.fawaed && selectedHadith.fawaed.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm sm:text-base">
                      Lợi ích
                    </h3>
                    <div className="bg-accent/50 p-3 sm:p-4 rounded-lg border">
                      <ul className="space-y-2 sm:space-y-3">
                        {selectedHadith.fawaed.map((fayda, index) => (
                          <li 
                            key={index} 
                            className="text-accent-foreground leading-relaxed flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <div dangerouslySetInnerHTML={{ __html: fayda }} />
                          </li>
                        ))}
                      </ul>
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

SavedHadithsView.displayName = 'SavedHadithsView';

export default SavedHadithsView;
