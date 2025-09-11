import React, { useState } from 'react';
import { useRssNews } from '@/hooks/useRssNews';
import { useTheme } from '@/context/ThemeContext';
import Lottie from 'lottie-react';
import AnimationWorld from '@/assets/lottie/AnimationWorld.json';
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const NewsFeed: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { theme } = useTheme();
  
  // Xác định theme colors dựa trên theme hiện tại
  const isDark = theme === 'dark';
  const themeColors = {
    bgPrimary: isDark ? 'bg-gray-900' : 'bg-white',
    textPrimary: isDark ? 'text-white' : 'text-black',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    textTertiary: isDark ? 'text-gray-400' : 'text-gray-500',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    accent: isDark ? 'text-blue-400' : 'text-blue-600',
    accentGradient: isDark ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-blue-400 to-purple-500',
    buttonGradient: isDark ? 'bg-gradient-to-r from-blue-600 to-purple-700' : 'bg-gradient-to-r from-blue-500 to-purple-600',
    buttonText: 'text-white',
    inputBg: isDark ? 'bg-gray-700' : 'bg-gray-100',
  };
  
  const { 
    news, 
    loading, 
    error,  
    pagination, 
    refetch,
  } = useRssNews(currentPage, limit);
  
  const containerClass = isDark
    ? `w-full bg-gray-900 min-h-screen transition-all duration-300`
    : `w-full ${themeColors.bgPrimary} min-h-screen transition-all duration-300`;

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
      <div className="w-full">
        {/* Tiêu đề chính */}
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-10 px-4 max-w-4xl mx-auto">
            <BackButton className="absolute top-4 left-4 px-4 py-3" />

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 relative">
                <Lottie 
                  animationData={AnimationWorld} 
                  loop={true}
                  autoplay={true}
                  style={{ 
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    width: '250%',
                    height: '250%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>
            </div>
            
            <div className="relative pt-9"> 
              <h1 className={`text-3xl md:text-4xl font-bold tracking-tight leading-snug ${themeColors.textPrimary}`}>
                Tin Tức Hồi Giáo Toàn Cầu
              </h1>
            </div>
          </div>
  
          <div className={`h-1 w-16 sm:w-24 md:w-32 ${themeColors.accentGradient} mx-auto rounded-full`}></div>
        </div>
        
        {/* Thanh điều khiển */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <label className={`text-sm font-medium ${themeColors.textSecondary} flex items-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Số bài viết mỗi trang
                </label>
                
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => handleLimitChange(Number(value))}
                >
                  <SelectTrigger className="w-full sm:w-auto">
                    <SelectValue placeholder="Chọn số lượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {pagination.total > 0 && (
                <div className={`flex items-center text-xs sm:text-sm ${themeColors.textSecondary} ${isDark ? 'bg-gray-800' : 'bg-gray-100'} px-3 py-2 rounded-full`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="whitespace-nowrap">
                    {pagination.limit * (pagination.currentPage - 1) + 1} - {Math.min(pagination.limit * pagination.currentPage, pagination.total)} / {pagination.total}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Trạng thái tải */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: themeColors.accent }}>
              Đang cập nhật tin tức...
            </h3>
            <div className="flex space-x-2 mt-4">
              <div className="h-4 w-4 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="h-4 w-4 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="h-4 w-4 rounded-full bg-gray-300 animate-pulse"></div>
            </div>
          </div>
        ) : error ? (
          /* Trạng thái lỗi */
          <Card className="rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-pink-600">Vui lòng làm mới!</h3>
              <p className={`${themeColors.textSecondary} mb-6 text-sm sm:text-base`}>
                {error || 'Vui lòng nhấn "Làm mới" để thử lại.'}
              </p>
              <div className="flex justify-center">
                <Button 
                  onClick={handleRefreshData}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm sm:text-base font-semibold">Làm mới</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Danh sách tin tức */}
            {Array.isArray(news) && news.length > 0 ? (
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {news.map((item, idx) => {
                  const title = item.title;
                  const link = item.link;
                  const sourceStr = typeof item.source === 'string' ? item.source : '';
                  const pubDate = item.pubDate || '';
                  const contentSnippet = item.contentSnippet;
                  const hasImage = !!item.image && item.image !== '/default-news.jpg';
                  
                  // Định dạng ngày tháng
                  const formattedDate = (() => {
                    try {
                      const date = new Date(pubDate);
                      const options: Intl.DateTimeFormatOptions = { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      };
                      return date.toLocaleDateString('vi-VN', options);
                    } catch {
                      return pubDate;
                    }
                  })();
                  
                  return (
                    <Card 
                      key={`news-${idx}-${title.substring(0, 20)}`} 
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Phần hình ảnh */}
                        <div className={`relative ${hasImage ? 'md:w-2/5 lg:w-1/3' : 'h-48 sm:h-56 md:h-auto md:w-1/4'} overflow-hidden flex-shrink-0`}>
                          <img
                            src={item.image}
                            alt={title}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/default-news.jpg';
                            }}
                            className="w-full h-full object-cover"
                            style={{minHeight: '200px'}}
                            loading={idx < 3 ? 'eager' : 'lazy'}
                          />
                          {/* Badge nguồn tin */}
                          {sourceStr && (
                            <div className="absolute top-3 left-3">
                              <Badge variant="secondary" className="backdrop-blur-sm">
                                {sourceStr}
                              </Badge>
                            </div>
                          )}
                          {/* Badge ngày tháng */}
                          {pubDate && (
                            <div className="absolute bottom-3 left-3">
                              <Badge variant="secondary" className="backdrop-blur-sm flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="truncate max-w-32">{formattedDate}</span>
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        {/* Phần nội dung */}
                        <div className={`p-4 sm:p-6 md:p-8 w-full ${hasImage ? 'md:w-3/5 lg:w-2/3' : 'md:w-3/4'} flex flex-col justify-between`}>
                          <div className="flex-1">
                            <h2 className={`font-bold text-lg sm:text-xl md:text-2xl ${themeColors.textPrimary} mb-3 sm:mb-4 line-clamp-2 leading-tight`}>
                              {title}
                            </h2>
                            <p className={`${themeColors.textSecondary} text-sm sm:text-base line-clamp-3 mb-4 sm:mb-6 leading-relaxed`}>
                              {contentSnippet}
                            </p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                            {/* Chỉ báo trạng thái - Ẩn trên mobile, hiện trên desktop */}
                            <div className="hidden md:block">
                              <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-500'} mr-2`}></div>
                                <span className={`text-sm ${themeColors.textTertiary}`}>
                                  Tin tức đã xác minh
                                </span>
                              </div>
                            </div>
                            
                            {/* Nút Đọc thêm */}
                            <Button asChild variant="outline" className="group">
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <span className="transition-all duration-300 group-hover:tracking-wider">Đọc thêm</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="ml-2 h-4 w-4 flex-shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* Trạng thái trống */
              <Card className="text-center py-12 sm:py-16">
                <CardContent className="px-4 py-6 sm:py-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">Vui lòng chờ một chút!</h3>
                  <Button 
                    onClick={handleRefreshData}
                    className="flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-sm sm:text-base">Thử lại</span>
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Phân trang */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 sm:mt-10 mb-4 sm:mb-6">
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    {/* Thông tin trang */}
                    <div className={`flex justify-between items-center mb-3 sm:mb-4 ${themeColors.textSecondary} text-xs sm:text-sm`}>
                      <span>Trang {currentPage} / {pagination.totalPages}</span>
                      <span className="hidden xs:inline sm:hidden">{pagination.total} Bài viết</span>
                      <span className="hidden sm:inline">{pagination.total} Bài viết</span>
                      <span className="xs:hidden text-xs">{pagination.total}</span>
                    </div>
                    
                    {/* Điều khiển phân trang */}
                    <div className="space-y-4">
                      {/* Phân trang desktop */}
                      <div className="hidden sm:flex flex-wrap justify-center gap-2">
                        {/* Trang đầu */}
                        <Button
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                          variant="outline"
                          size="icon"
                          aria-label="Trang đầu"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                          </svg>
                        </Button>
                        
                        {/* Trang trước */}
                        <Button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          variant="outline"
                          size="icon"
                          aria-label="Trang trước"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </Button>
                        
                        {/* Các trang */}
                        <div className="flex gap-2">
                          {getPageNumbers().map((pageNum, index) => (
                            <Button
                              key={`page-${index}-${pageNum}`}
                              onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : undefined}
                              disabled={typeof pageNum === 'string'}
                              variant={pageNum === currentPage ? "default" : "outline"}
                              className={`min-w-10 h-10 px-3 ${typeof pageNum === 'string' ? 'cursor-default' : ''}`}
                              aria-label={typeof pageNum === 'number' ? `Trang ${pageNum}` : 'Nhiều trang hơn'}
                            >
                              {pageNum}
                            </Button>
                          ))}
                        </div>
                        
                        {/* Trang sau */}
                        <Button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === pagination.totalPages}
                          variant="outline"
                          size="icon"
                          aria-label="Trang sau"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Button>
                        
                        {/* Trang cuối */}
                        <Button
                          onClick={() => handlePageChange(pagination.totalPages)}
                          disabled={currentPage === pagination.totalPages}
                          variant="outline"
                          size="icon"
                          aria-label="Trang cuối"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                        </Button>
                      </div>
                      
                      {/* Phân trang mobile */}
                      <div className="sm:hidden">
                        <div className="flex items-center justify-between mb-3">
                          <Button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            variant="outline"
                            className="flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="hidden xs:inline">Trước</span>
                          </Button>
                          
                          <Button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.totalPages}
                            variant="outline"
                            className="flex items-center"
                          >
                            <span className="hidden xs:inline">Sau</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <div className={`flex items-center gap-2 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg px-4 py-2`}>
                            <span className={`text-sm ${themeColors.textSecondary}`}>Trang</span>
                            <div className={`px-3 py-1 rounded-md ${themeColors.accentGradient} text-white text-sm font-semibold min-w-8 text-center shadow-sm`}>
                              {currentPage}
                            </div>
                            <span className={`text-sm ${themeColors.textSecondary}`}>/ {pagination.totalPages}</span>
                          </div>
                        </div>
                      </div>
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