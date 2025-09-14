import { memo, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from "@/components/ui/separator";
import { BookOpen, Heart, Bookmark, Info, Star, ZoomIn, ZoomOut, Type, Share2, Copy, MessageCircle } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { HadithDetailSheetProps } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

const HadithDetailSheet = memo<HadithDetailSheetProps>(({
  selectedHadith,
  isLoading,
  favorites,
  bookmarks,
  onClose,
  onToggleFavorite,
  onToggleBookmark,
}) => {
  const [fontSize, setFontSize] = useState<number>(1); // 1 = 100%, 1.1 = 110%, etc.

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 0.1, 1.5)); // Max 150%
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 0.1, 0.8)); // Min 80%
  };

  const resetFontSize = () => {
    setFontSize(1); // Reset to 100%
  };

  // Share functionality
  const shareHadith = async (method: 'copy' | 'whatsapp' | 'telegram') => {
    if (!selectedHadith) return;
    
    const shareText = `📖 ${selectedHadith.title.replace(/{/g, "")}

${selectedHadith.hadeeth.replace(/<[^>]*>/g, '')}

📚 ${selectedHadith.attribution}

🔗 Từ ứng dụng Muslim Việt`;
    
    try {
      switch (method) {
        case 'copy':
          await navigator.clipboard.writeText(shareText);
          // You can add toast notification here when available
          console.log('Đã sao chép hadith vào clipboard');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
      }
    } catch (error) {
      console.error('Không thể chia sẻ hadith:', error);
    }
  };

  return (
    <Sheet open={!!selectedHadith} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="
          w-screen h-screen max-w-none 
          sm:w-[800px] md:w-[1024px] lg:w-[1280px] 
          p-4 sm:p-6 overflow-y-auto
        "
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
              {/* Font size controls */}
              <div className="flex items-center gap-1 mr-2 bg-muted rounded-md p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decreaseFontSize}
                  className="h-7 w-7 p-0"
                  title="Giảm cỡ chữ"
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFontSize}
                  className="h-7 w-7 p-0"
                  title="Cỡ chữ mặc định"
                >
                  <Type className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={increaseFontSize}
                  className="h-7 w-7 p-0"
                  title="Tăng cỡ chữ"
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </div>
              
              {selectedHadith && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFavorite(selectedHadith.id)}
                    className="h-8 w-8 p-0"
                    title="Thêm vào yêu thích"
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.includes(selectedHadith.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleBookmark(selectedHadith.id)}
                    className="h-8 w-8 p-0"
                    title="Đánh dấu"
                  >
                    <Bookmark 
                      className={`h-4 w-4 ${
                        bookmarks.includes(selectedHadith.id) 
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
                        className="h-8 w-8 p-0"
                        title="Chia sẻ hadith"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => shareHadith('copy')}>
                        <Copy className="mr-2 h-4 w-4" />
                        Sao chép
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => shareHadith('whatsapp')}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => shareHadith('telegram')}>
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
        
        <div className="flex-1 space-y-6 mt-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : selectedHadith && (
            <div className="space-y-6">
              {/* Hadith Content */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <BookOpen className="h-4 w-4 flex-shrink-0" />
                  {VIETNAMESE_TEXT.CONTENT.HADITH_CONTENT}
                </h3>
                <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border-l-4 border-primary">
                  <div 
                    className="text-foreground leading-relaxed"
                    style={{ fontSize: `${fontSize}rem` }}
                    dangerouslySetInnerHTML={{ 
                      __html: selectedHadith.hadeeth || VIETNAMESE_TEXT.CONTENT.NO_CONTENT
                    }}
                  />
                </div>
              </div>

              {selectedHadith.explanation && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <Info className="h-4 w-4 flex-shrink-0" />
                      {VIETNAMESE_TEXT.CONTENT.EXPLANATION}
                    </h3>
                    <div 
                      className="text-muted-foreground leading-relaxed bg-card p-3 sm:p-4 rounded-lg border"
                      style={{ fontSize: `${fontSize}rem` }}
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
                      <Star className="h-4 w-4 flex-shrink-0" />
                      {VIETNAMESE_TEXT.CONTENT.BENEFITS}
                    </h3>
                    <div className="bg-accent/50 p-3 sm:p-4 rounded-lg border">
                      <ul className="space-y-2 sm:space-y-3">
                        {selectedHadith.fawaed.map((fayda, index) => (
                          <li 
                            key={index} 
                            className="text-accent-foreground leading-relaxed flex items-start gap-2"
                            style={{ fontSize: `${fontSize}rem` }}
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
        </div>
      </SheetContent>
    </Sheet>
  );
});

HadithDetailSheet.displayName = 'HadithDetailSheet';

export default HadithDetailSheet;