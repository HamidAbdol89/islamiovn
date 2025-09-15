import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import BackButton from '@/components/ui/BackButton';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onBack: () => void;
  title: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isEpisodeList?: boolean;
}

const Header: React.FC<HeaderProps> = React.memo(({ 
  title, 
  onBack, 
  searchTerm, 
  onSearchChange,
  isEpisodeList = false
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Memoized callbacks
  const handleSearchClose = useCallback(() => {
    setIsSearchExpanded(false);
    onSearchChange('');
  }, [onSearchChange]);

  const handleSearchIconClick = useCallback(() => {
    setIsSearchExpanded(true);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleSearchClose();
    }
  }, [handleSearchClose]);

  // Auto focus
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isSearchExpanded]);

  // Handle outside clicks - Only close if not clicking on search results
  useEffect(() => {
    if (!isSearchExpanded) return;

    const handleOutsideInteraction = (event: Event) => {
      const target = event.target as Node;
      
      // Don't close if clicking on search results or search overlay
      if (target instanceof Element) {
        // Check if clicking on search overlay or search results
        const isClickingOnSearchOverlay = target.closest('[data-search-overlay="true"]');
        const isClickingOnSearchResult = target.closest('[data-search-result="true"]');
        
        if (isClickingOnSearchOverlay || isClickingOnSearchResult) {
          return; // Don't close search
        }
      }
      
      if (headerRef.current && !headerRef.current.contains(target)) {
        handleSearchClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideInteraction, true);
    document.addEventListener('touchstart', handleOutsideInteraction, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction, true);
      document.removeEventListener('touchstart', handleOutsideInteraction, true);
    };
  }, [isSearchExpanded, handleSearchClose]);

  // Handle ESC key
  useEffect(() => {
    if (!isSearchExpanded) return;

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleSearchClose();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSearchExpanded, handleSearchClose]);

  // Memoized placeholder text
  const placeholderText = useMemo(() => 
    isEpisodeList ? "Tìm kiếm bài giảng..." : "Tìm kiếm học giả...",
    [isEpisodeList]
  );

  // Memoized styles - Title thu lại và biến mất từ từ
  const titleStyles = useMemo(() => ({
    opacity: isSearchExpanded ? 0 : 1,
    transform: isSearchExpanded 
      ? 'scale(0.8) translateX(-20px)' 
      : 'scale(1) translateX(0)',
    transition: 'all 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)',
    transformOrigin: 'center',
    pointerEvents: isSearchExpanded ? 'none' as const : 'auto' as const
  }), [isSearchExpanded]);

  // Memoized styles - Search icon biến mất từ từ
  const searchIconStyles = useMemo(() => ({
    opacity: isSearchExpanded ? 0 : 1,
    transform: isSearchExpanded 
      ? 'scale(0.6)' 
      : 'scale(1)',
    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
    transformOrigin: 'center',
    pointerEvents: isSearchExpanded ? 'none' as const : 'auto' as const
  }), [isSearchExpanded]);

  // Memoized styles - Search container mở dần
  const searchContainerStyles = useMemo(() => ({
    width: isSearchExpanded ? '280px' : '0px',
    opacity: isSearchExpanded ? 1 : 0,
    transform: isSearchExpanded 
      ? 'translateX(0) scaleX(1)' 
      : 'translateX(20px) scaleX(0.8)',
    transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
    transformOrigin: 'right center',
    overflow: 'hidden'
  }), [isSearchExpanded]);

  // Memoized styles - Search box content
  const searchBoxStyles = useMemo(() => ({
    transform: isSearchExpanded 
      ? 'scale(1) translateX(0)' 
      : 'scale(0.9) translateX(10px)',
    opacity: isSearchExpanded ? 1 : 0,
    transition: 'all 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)',
    transitionDelay: isSearchExpanded ? '0.1s' : '0s'
  }), [isSearchExpanded]);

  // Memoized styles - Close button
  const closeButtonStyles = useMemo(() => ({
    opacity: isSearchExpanded ? 1 : 0,
    transform: isSearchExpanded 
      ? 'scale(1) rotate(0deg)' 
      : 'scale(0.7) rotate(-90deg)',
    transition: 'all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
    transitionDelay: isSearchExpanded ? '0.2s' : '0s'
  }), [isSearchExpanded]);

  // Memoized class names
  const headerClasses = useMemo(() => 
    'sticky top-0 z-50 border-b backdrop-blur-md bg-background/95 border-border shadow-sm',
    []
  );

  const searchIconClasses = useMemo(() =>
    'text-muted-foreground hover:text-foreground w-5 h-5 cursor-pointer touch-manipulation transition-colors duration-200',
    []
  );

  const inputClasses = useMemo(() =>
    'border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-6 text-sm w-full placeholder:text-muted-foreground/70',
    []
  );

  const closeButtonClasses = useMemo(() =>
    'ml-2 p-1.5 rounded-full hover:bg-muted/80 active:bg-muted transition-colors duration-200 flex-shrink-0 touch-manipulation',
    []
  );

  return (
    <div className={headerClasses} ref={headerRef}>
      <div className="relative h-14">
        {/* Fixed layout grid system */}
        <div className="absolute inset-0 flex items-center">
          
          {/* Left: Back button - Fixed 56px */}
          <div className="w-14 flex justify-center flex-shrink-0">
            <BackButton onClick={onBack} />
          </div>

          {/* Center: Title - Fixed position, animated opacity/scale */}
          <div className="flex-1 flex justify-center items-center px-4 min-w-0">
            <h1 
              className="text-base font-semibold truncate select-none"
              style={titleStyles}
            >
              {title}
            </h1>
          </div>

          {/* Right: Search area - Fixed 56px base width */}
          <div className="w-14 flex justify-center flex-shrink-0 relative">
            {/* Search icon - Always in same position */}
            <Search 
              className={searchIconClasses}
              onClick={handleSearchIconClick}
              style={searchIconStyles}
            />
          </div>
        </div>

        {/* Search overlay - Absolute positioned, doesn't affect layout */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <div 
            className="relative"
            style={searchContainerStyles}
          >
            <div 
              className="bg-card/95 backdrop-blur-sm rounded-full shadow-xl border border-border/50 w-full"
              style={searchBoxStyles}
            >
              <div className="flex items-center px-4 py-2.5">
                <Search className="text-muted-foreground w-4 h-4 mr-3 flex-shrink-0" />
                
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder={placeholderText}
                  className={inputClasses}
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                
                <div style={closeButtonStyles}>
                  <button
                    onClick={handleSearchClose}
                    className={closeButtonClasses}
                    aria-label="Đóng tìm kiếm"
                    type="button"
                  >
                    <X className="text-muted-foreground hover:text-foreground w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Header.displayName = 'Header';

export default Header;