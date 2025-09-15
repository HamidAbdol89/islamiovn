import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Database } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';
import type { HadithHeaderProps } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

const HadithHeader = memo<HadithHeaderProps>(({ 
  selectedCategory, 
  currentPage, 
  totalPages, 
  onBack,
  onLoadAll,
  isLoadingAll = false,
  cachedCount = 0,
  isFullyCached = false
}) => {
  // Categories view header
  if (!selectedCategory) {
    return (
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-background">
        <BackButton />
        <h1 className="text-lg font-semibold">{VIETNAMESE_TEXT.HEADER.TITLE}</h1>
        <div className="w-8" /> {/* giữ cân đối */}
      </div>
    );
  }

  // Hadith list view header
  return (
    <div className="flex flex-col gap-4 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <BackButton onClick={onBack} />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight line-clamp-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {selectedCategory.title}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              {selectedCategory.hadeeths_count} {VIETNAMESE_TEXT.HEADER.AVAILABLE_HADITHS}
              {cachedCount > 0 && (
                <span className="ml-2 text-green-600">
                  • {cachedCount} đã cache
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onLoadAll && !isFullyCached && (
            <Button
              onClick={onLoadAll}
              disabled={isLoadingAll}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isLoadingAll ? 'Đang tải...' : 'Tải tất cả'}
            </Button>
          )}
          
          {isFullyCached && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded-md text-xs text-green-700 dark:text-green-400">
              <Database className="h-3 w-3" />
              Đã cache đầy đủ
            </div>
          )}
          
          {currentPage && totalPages && (
            <div className="px-3 py-1.5 bg-muted rounded-md text-xs sm:text-sm font-medium">
              {VIETNAMESE_TEXT.HEADER.PAGE_INFO} {currentPage}/{totalPages}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

HadithHeader.displayName = 'HadithHeader';

export default HadithHeader;
