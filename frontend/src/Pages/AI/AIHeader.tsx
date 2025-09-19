import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { Heart, Trash2, Share2, ArrowLeft, Download, MoreVertical } from 'lucide-react';
import { useTheme } from '@/Pages/AI/context-custom/ThemeContext';
import Lottie from 'lottie-react';
import animationData from '@/assets/lottie/AnimationRobot.json';
import { useNavigate } from 'react-router-dom';
import type { 
  AIHeaderProps, 
  UserPreferences, 
  FavoriteQuestion
} from '@/Pages/AI/types/ai.types';
import { createPortal } from 'react-dom';

const AIHeader: React.FC<Omit<AIHeaderProps, 'themeColors'>> = React.memo(({
  messages,
  onClearChat,
  userPreferences,
  onLearningStyleChange,
  favorites,
  onFavoriteToggle,
  onShare,
  onExport
}) => {
  const { themeColors } = useTheme();
  const navigate = useNavigate();
  const [showFavorites, setShowFavorites] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Memoize learning style options để tránh re-render
  const learningStyleOptions = useMemo(() => [
    { value: 'simple', label: 'Đơn giản', desc: 'Câu trả lời ngắn gọn' },
    { value: 'balanced', label: 'Cân bằng', desc: 'Vừa phải, dễ hiểu' },
    { value: 'detailed', label: 'Chi tiết', desc: 'Giải thích đầy đủ' }
  ], []);

  const learningStyleLabels = useMemo(() => ({
    simple: 'Đơn giản',
    balanced: 'Cân bằng', 
    detailed: 'Chi tiết'
  }), []);

  // Sử dụng useCallback để tránh re-render không cần thiết
  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(prev => !prev);
  }, []);

  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleClearChat = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClearChat?.();
    setShowMenu(false);
  }, [onClearChat]);

  const handleExport = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onExport?.();
    setShowMenu(false);
  }, [onExport]);

  const handleShowFavorites = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowFavorites(true);
    setShowMenu(false);
  }, []);

  const handleLearningStyleChange = useCallback((style: UserPreferences['learningStyle']) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onLearningStyleChange(style);
      setShowMenu(false);
    };
  }, [onLearningStyleChange]);

  // Optimized click outside handler với passive listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Batch state updates để tránh multiple re-renders
      let shouldUpdateMenu = false;
      let shouldUpdateFavorites = false;
      
      if (menuRef.current && !menuRef.current.contains(target)) {
        shouldUpdateMenu = true;
      }
      
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        shouldUpdateFavorites = true;
      }

      if (shouldUpdateMenu || shouldUpdateFavorites) {
        requestAnimationFrame(() => {
          if (shouldUpdateMenu) setShowMenu(false);
          if (shouldUpdateFavorites) setShowFavorites(false);
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleShareClick = useCallback(async (favorite: FavoriteQuestion) => {
    const message = messages.find(m => m.id === favorite.id);
    if (message) {
      await onShare?.(message);
    }
    setShowFavorites(false);
  }, [messages, onShare]);

  // Memoize favorites count để tránh re-calculate
  const favoritesCount = useMemo(() => favorites?.length || 0, [favorites?.length]);

  // Memoize menu dropdown để tránh re-render khi không cần thiết
  const menuDropdown = useMemo(() => {
    if (!showMenu) return null;
    
    return createPortal(
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9999] flex items-center justify-center"
        onClick={() => setShowMenu(false)}
      >
        <div 
          className="w-full max-w-sm mx-4 bg-white/80 dark:bg-gray-900/80 border border-gray-200/30 dark:border-gray-700/30 rounded-2xl shadow-xl backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            {/* Learning Style */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${themeColors.textSecondary} mb-3`}>
                Chế độ học tập
              </label>
              <div className="space-y-2">
                {learningStyleOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-200 cursor-pointer flex items-center touch-manipulation ${
                      userPreferences.learningStyle === option.value
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                        : `hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent active:bg-gray-100 dark:active:bg-gray-700`
                    }`}
                    onClick={handleLearningStyleChange(option.value as UserPreferences['learningStyle'])}
                  >
                    <input
                      type="radio"
                      name="learningStyle"
                      value={option.value}
                      checked={userPreferences.learningStyle === option.value}
                      onChange={() => {}}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className={`text-base font-medium ${
                          userPreferences.learningStyle === option.value 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : themeColors.textPrimary
                        }`}>
                          {option.label}
                        </div>
                        <div className={`text-sm ${themeColors.textSecondary}`}>
                          {option.desc}
                        </div>
                      </div>
                      {userPreferences.learningStyle === option.value && (
                        <div className="w-3 h-3 bg-emerald-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Menu Actions */}
            <div className="space-y-1">
              <button
                onClick={handleShowFavorites}
                className={`w-full px-4 py-3 text-left transition-colors duration-200 flex items-center justify-between rounded-xl
                  ${themeColors.textPrimary} hover:bg-pink-50 dark:hover:bg-pink-900/20 active:bg-pink-100 dark:active:bg-pink-800/30`}
              >
                <div className="flex items-center">
                  <Heart className="w-5 h-5 mr-3 text-pink-500 flex-shrink-0" fill="currentColor" />
                  <span className="text-base">Mục yêu thích</span>
                </div>
                {favoritesCount > 0 && (
                  <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-sm rounded-full min-w-[1.5rem] h-6 flex items-center justify-center font-medium px-1.5">
                    {favoritesCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleExport}
                className={`w-full px-4 py-3 text-left transition-colors duration-200 flex items-center rounded-xl
                  ${themeColors.textPrimary} hover:bg-emerald-50 dark:hover:bg-emerald-900/20 active:bg-emerald-100 dark:active:bg-emerald-800/30`}
              >
                <Download className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" />
                <span className="text-base">Tải xuống lịch sử</span>
              </button>

              <button
                onClick={handleClearChat}
                className={`w-full px-4 py-3 text-left transition-colors duration-200 flex items-center rounded-xl
                  ${themeColors.textPrimary} hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 dark:active:bg-red-800/30`}
                >
                  <Trash2 className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" />
                  <span className="text-base">Xóa toàn bộ chat</span>
                </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }, [showMenu, themeColors, learningStyleOptions, userPreferences.learningStyle, favoritesCount, messages.length, handleShowFavorites, handleExport, handleClearChat, handleLearningStyleChange]);

  // Memoize favorites modal
  const favoritesModal = useMemo(() => {
    if (!showFavorites || !favorites) return null;
    
    return (
      <div 
        ref={dropdownRef}
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[9999] flex items-start justify-center pt-16 md:pt-20 px-4`}
        onClick={() => setShowFavorites(false)}
      >
        <div 
          className={`w-full max-w-md max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-10rem)] overflow-y-auto 
            ${themeColors.glassEffect} border ${themeColors.border} rounded-xl shadow-xl`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl md:text-lg font-semibold text-pink-500">
                Mục yêu thích
              </h3>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-pink-100 dark:bg-pink-900/20 text-pink-500">
                {favoritesCount} mục
              </span>
            </div>
            
            {favoritesCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 md:py-12 space-y-3">
                <Heart className="w-20 h-20 md:w-16 md:h-16 text-gray-300 dark:text-gray-600" />
                <p className={`text-base md:text-sm ${themeColors.textSecondary} text-center leading-relaxed`}>
                  Chưa có câu trả lời nào được lưu.<br />
                  Nhấn vào biểu tượng ❤️ để lưu câu trả lời hữu ích.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className={`p-4 rounded-xl ${themeColors.cardBg} border ${themeColors.border} hover:shadow-md active:shadow-lg transition-shadow`}
                  >
                    <div className={`text-base md:text-sm font-medium ${themeColors.textPrimary} line-clamp-2 leading-relaxed`}>
                      {favorite.question}
                    </div>
                    <div className={`text-sm md:text-xs ${themeColors.textSecondary} mt-2`}>
                      {new Date(favorite.timestamp).toLocaleString('vi-VN')}
                    </div>
                    {favorite.categories && favorite.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 md:gap-1 mt-2">
                        {favorite.categories.map((cat: string, index: number) => (
                          <span
                            key={index}
                            className="px-2.5 py-1.5 md:px-2 md:py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-sm md:text-xs font-medium text-gray-600 dark:text-gray-300"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className={`flex items-center space-x-2 mt-3 pt-3 border-t ${themeColors.border}`}>
                      <button
                        onClick={() => onFavoriteToggle?.(favorite)}
                        className="p-3 md:p-2 rounded-lg text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 active:bg-pink-100 dark:active:bg-pink-800/30 transition-colors touch-manipulation"
                        title="Bỏ lưu"
                      >
                        <Heart className="w-5 h-5 md:w-4 md:h-4" fill="currentColor" />
                      </button>
                      <button
                        onClick={() => handleShareClick(favorite)}
                        className={`p-3 md:p-2 rounded-lg ${themeColors.textSecondary} hover:${themeColors.textPrimary} active:bg-gray-100 dark:active:bg-gray-800 transition-colors touch-manipulation`}
                        title="Chia sẻ"
                      >
                        <Share2 className="w-5 h-5 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [showFavorites, favorites, favoritesCount, themeColors, onFavoriteToggle, handleShareClick]);

  return (
    <div className="relative">
      <div className="fixed top-2 md:top-3 left-1/2 -translate-x-1/2 z-50 w-auto min-w-[280px] max-w-[400px] bg-white/40 dark:bg-gray-900/40 border border-gray-200/30 dark:border-gray-700/30 px-3 py-2 rounded-full transition-all duration-300 ease-in-out shadow-sm hover:shadow-md backdrop-blur-md">
        <div className="flex items-center justify-between">
          {/* Left side - Navigation + AI Info */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBackClick}
              className={`${themeColors.textPrimary} hover:opacity-70 active:opacity-50 transition-all duration-200 ease-in-out p-1.5 rounded-full touch-manipulation hover:bg-gray-100 dark:hover:bg-gray-800`}
              title="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex-shrink-0 relative transition-transform duration-300 ease-in-out hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-sm animate-pulse" />
                <Lottie
                  animationData={animationData}
                  loop={true}
                  className="relative z-10 w-8 h-8"
                  rendererSettings={{
                    preserveAspectRatio: 'xMidYMid slice',
                    progressiveLoad: true
                  }}
                />
              </div>
              <div className="transition-all duration-300 ease-in-out">
                <h1 className={`text-sm font-semibold ${themeColors.textPrimary} transition-colors duration-300`}>
                  Mira AI
                </h1>
                <div className={`text-xs ${themeColors.textSecondary} transition-colors duration-300`}>
                  {learningStyleLabels[userPreferences.learningStyle]}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Menu */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={handleMenuClick}
                className={`p-1.5 rounded-full transition-all duration-300 ease-in-out touch-manipulation ${
                  showMenu 
                    ? `${themeColors.buttonGradient} ${themeColors.buttonText} shadow-md` 
                    : `${themeColors.textPrimary} hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 hover:shadow-sm`
                }`}
                title="Menu và cài đặt"
              >
                <MoreVertical className="w-4 h-4 transition-transform duration-300 ease-in-out" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuDropdown}
      {favoritesModal}
    </div>
  );
});

AIHeader.displayName = 'AIHeader';

export default AIHeader;