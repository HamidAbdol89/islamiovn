import React, { useState, useMemo, useCallback, memo } from 'react';
import { useRssNews } from '@/hooks/useRssNews';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Constants moved outside component to prevent recreation
const DEFAULT_IMAGE = "/logo.png";

// Memoized NewsCard component
const NewsCard = memo(({ item, index }: { item: any; index: number }) => {
  const handleCardClick = useCallback(() => {
    window.open(item.link, "_blank");
  }, [item.link]);

  const formattedDate = useMemo(() => {
    try {
      const date = new Date(item.pubDate);
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  }, [item.pubDate]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = DEFAULT_IMAGE;
  }, []);

  const sourceStr = typeof item.source === 'string' ? item.source : '';

  return (
    <Card
      key={`news-${index}-${item.title.substring(0, 20)}`}
      className="overflow-hidden transition-all duration-200 hover:shadow-md active:scale-[0.98] cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          onError={handleImageError}
          className="w-full h-full object-cover"
          loading={index < 3 ? "eager" : "lazy"}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
            {sourceStr && (
              <Badge
                variant="secondary"
                className="max-w-[202px] sm:max-w-[200px] truncate"
                title={sourceStr}
              >
                {sourceStr}
              </Badge>
            )}
            
            {formattedDate && (
              <Badge
                variant="outline"
                className="text-white border-white/30 bg-black/30 backdrop-blur-sm"
              >
                {formattedDate}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-3">
        <h2 className="font-bold text-base text-foreground mb-1.5 line-clamp-2 leading-tight">
          {item.title}
        </h2>
        
        <p className="text-muted-foreground text-xs line-clamp-2 mb-3 leading-relaxed">
          {item.contentSnippet}
        </p>
      </CardContent>
    </Card>
  );
});

NewsCard.displayName = 'NewsCard';


const NewsFeed: React.FC = () => {
  const [limit, setLimit] = useState(30); // Use cached limit from backend
  
  const { 
    news, 
    loading, 
    error,  
    pagination, 
    refetch,
    hasMore,
    loadingMore,
    loadMore
  } = useRssNews(1, limit);
  
  // Memoized class names
  const containerClass = useMemo(() => 
    "w-full min-h-screen bg-background text-foreground transition-all duration-300", 
    []
  );

  // Infinite scroll integration
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    loading: loadingMore,
    onLoadMore: loadMore,
    rootMargin: '200px'
  });

  // Memoized handlers to prevent unnecessary re-renders
  const handleRefreshData = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLimitChange = useCallback((newLimit: number) => {
    if (newLimit !== limit) {
      setLimit(newLimit);
    }
  }, [limit]);

  // Loading indicator component for infinite scroll
  const LoadingIndicator = memo(() => (
    <div className="flex justify-center items-center py-8">
      <div className="flex space-x-2">
        <div className="h-4 w-4 rounded-full bg-primary animate-pulse"></div>
        <div className="h-4 w-4 rounded-full bg-primary animate-pulse delay-75"></div>
        <div className="h-4 w-4 rounded-full bg-primary animate-pulse delay-150"></div>
      </div>
      <span className="ml-3 text-muted-foreground">Đang tải thêm tin tức...</span>
    </div>
  ));
  
  LoadingIndicator.displayName = 'LoadingIndicator';

  return (
    <div className={containerClass}>
      <div className="w-full max-w-sm mx-auto px-3 py-4 sm:max-w-2xl lg:max-w-4xl">
        {/* Header - Mobile First */}
        <div className="mb-4">
          <div className="text-center">
            <h1 className="text-xl sm:text-3xl font-bold mb-1 text-foreground">
              Tin Tức Hồi Giáo
            </h1>
            <p className="text-xs text-muted-foreground">
              Cập nhật tin tức mới nhất
            </p>
          </div>
        </div>
        
        {/* Controls - Simplified for mobile */}
        <Card className="mb-4">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm font-medium text-muted-foreground">
                  Bài viết/trang
                </span>
              </div>
              <Select
                value={limit.toString()}
                onValueChange={(value) => handleLimitChange(Number(value))}
              >
                <SelectTrigger className="w-16 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {pagination.total > 0 && (
              <Badge variant="secondary" className="text-xs">
                {pagination.limit * (pagination.currentPage - 1) + 1}-{Math.min(pagination.limit * pagination.currentPage, pagination.total)} / {pagination.total}
              </Badge>
            )}
          </CardContent>
        </Card>
        
        {/* Loading & Error States */}
        {loading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-xl font-bold mb-2 text-primary">
                Đang cập nhật tin tức...
              </h3>
              <div className="flex space-x-2 mt-4">
                <div className="h-4 w-4 rounded-full bg-muted animate-pulse"></div>
                <div className="h-4 w-4 rounded-full bg-muted animate-pulse"></div>
                <div className="h-4 w-4 rounded-full bg-muted animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-3 text-destructive">Vui lòng làm mới!</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                {error || 'Vui lòng nhấn "Làm mới" để thử lại.'}
              </p>
              <Button onClick={handleRefreshData} variant="outline">
                <span className="font-semibold">Làm mới</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* News List - Infinite Scroll Design */}
            {Array.isArray(news) && news.length > 0 ? (
              <>
                <div className="space-y-3">
                  {news.map((item, idx) => (
                    <NewsCard key={`news-${idx}-${item.title.substring(0, 20)}`} item={item} index={idx} />
                  ))}
                </div>
                
                {/* Loading More Indicator */}
                {loadingMore && <LoadingIndicator />}
                
                {/* Infinite Scroll Sentinel */}
                {hasMore && !loadingMore && (
                  <div ref={sentinelRef} className="h-4 w-full" />
                )}
                
                {/* End of Results */}
                {!hasMore && news.length > 0 && (
                  <div className="text-center py-8">
                    <Badge variant="secondary" className="text-xs">
                      Đã hiển thị tất cả {pagination.total} bài viết
                    </Badge>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-xl font-bold mb-3 text-foreground">Vui lòng chờ một chút!</h3>
                  <Button onClick={handleRefreshData} variant="outline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Thử lại</span>
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;