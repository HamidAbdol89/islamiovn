import React, { useState } from 'react';
import { useRssNews } from '@/hooks/useRssNews';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const NewsFeed: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { 
    news, 
    loading, 
    error,  
    pagination, 
    refetch,
  } = useRssNews(currentPage, limit);
  
  const containerClass = "w-full min-h-screen bg-background text-foreground transition-all duration-300";

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefreshData = () => {
    refetch();
  };

  const handleLimitChange = (newLimit: number) => {
    if (newLimit !== limit) {
      setLimit(newLimit);
      setCurrentPage(1);
    }
  };

  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    const pageNumbers: (number | string)[] = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      if (currentPage > 3) {
        pageNumbers.push('...');
      }
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        end = Math.min(4, totalPages - 1);
      }
      if (currentPage >= totalPages - 2) {
        start = Math.max(totalPages - 3, 2);
      }
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }
      
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

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
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
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
            {/* News List - Mobile First Design */}
            {Array.isArray(news) && news.length > 0 ? (
              <div className="space-y-3">
                {news.map((item, idx) => {
                  const title = item.title;
                  const link = item.link;
                  const sourceStr = typeof item.source === 'string' ? item.source : '';
                  const pubDate = item.pubDate || '';
                  const contentSnippet = item.contentSnippet;
                  
                  // Định dạng ngày tháng ngắn gọn
                  const formattedDate = (() => {
                    try {
                      const date = new Date(pubDate);
                      return date.toLocaleDateString('vi-VN', { 
                        day: '2-digit', 
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                    } catch {
                      return '';
                    }
                  })();
                  
                  return (
                    <Card
                    key={`news-${idx}-${title.substring(0, 20)}`}
                    className="overflow-hidden transition-all duration-200 hover:shadow-md active:scale-[0.98] cursor-pointer"
                    onClick={() => window.open(link, "_blank")} // Nhấn card mở link
                  >
                    {/* Image Section */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={item.image}
                        alt={title}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "/default-news.jpg";
                        }}
                        className="w-full h-full object-cover"
                        loading={idx < 3 ? "eager" : "lazy"}
                      />
                  
                      {/* Overlay with source and date */}
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
                  
                    {/* Content Section */}
                    <CardContent className="p-3">
                      <h2 className="font-bold text-base text-foreground mb-1.5 line-clamp-2 leading-tight">
                        {title}
                      </h2>
                  
                      <p className="text-muted-foreground text-xs line-clamp-2 mb-3 leading-relaxed">
                        {contentSnippet}
                      </p>
                    </CardContent>
                  </Card>
                  
                  );
                })}
              </div>
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
            
            {/* Pagination - Mobile First */}
            {pagination.totalPages > 1 && (
              <div className="mt-4">
                <Card>
                  <CardContent className="p-3">
                    {/* Page Info */}
                    <div className="text-center mb-3 text-muted-foreground text-xs">
                      Trang {currentPage} / {pagination.totalPages} • {pagination.total} bài
                    </div>
                    
                    <Separator className="mb-3" />
                    
                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between gap-3">
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Trước
                      </Button>
                      
                      <Badge variant="default" className="px-3 py-2 font-bold text-xs min-w-12 text-center">
                        {currentPage}
                      </Badge>
                      
                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Sau
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                    
                    {/* Quick Jump (Desktop only) */}
                    <div className="hidden sm:flex justify-center mt-4 gap-1">
                      {getPageNumbers().slice(0, 7).map((pageNum, index) => (
                        <Button
                          key={`page-${index}-${pageNum}`}
                          onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : undefined}
                          disabled={typeof pageNum === 'string'}
                          variant={pageNum === currentPage ? "default" : "ghost"}
                          size="sm"
                          className="min-w-8 h-8 text-xs"
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;