import React, { useState, useMemo, useCallback } from 'react';

import prayerIcon from '@/assets/icon/prayer.png';
import compassIcon from '@/assets/icon/compass.png';
import bookIcon from '@/assets/icon/book.png';
import buildingIcon from '@/assets/icon/building.png';
import tasbihIcon from '@/assets/icon/tasbih.png';
import doaIcon from '@/assets/icon/doa.png';
import hadihIcon from '@/assets/icon/hadih.png';
import nameIcon from '@/assets/icon/99.png';
import podcastIcon from '@/assets/icon/podcast.png';
import studyIcon from '@/assets/icon/study.png';
import zakatIcon from '@/assets/icon/zakat.png';
import scheduleIcon from '@/assets/icon/schedule.png';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type UtilityId = 
  | 'prayers' 
  | 'qiblah' 
  | 'calendar' 
  | 'quran' 
  | 'masjid' 
  | 'tasbih' 
  | 'dua' 
  | 'hadith' 
  | 'nameallah' 
  | 'podcast' 
  | 'study' 
  | 'zakat';

interface UtilityItem {
  id: UtilityId;
  label: string;
  gradient: string;
  iconUrl: string;
  route: string;
  isAvailable: boolean; 
  description?: string; 
  accentColor: string;
}

interface IconTabProps {
  onUtilityClick: (utilityId: string) => void;
  activeUtility?: string; 
  mode?: 'compact' | 'grid' | 'expanded'; 
}

// Memoized utility button component
const UtilityButton = React.memo<{ 
  utility: UtilityItem; 
  isActive: boolean;
  onUtilityClick: (utility: UtilityItem) => void;
}>(({ utility, isActive, onUtilityClick }) => {
  const isDisabled = !utility.isAvailable;
  const [isPressed, setIsPressed] = useState(false);

  // Simplified click handler
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isDisabled) return;
    e.stopPropagation();
    onUtilityClick(utility);
  }, [isDisabled, utility, onUtilityClick]);

  // Touch handlers for better mobile experience
  const handleTouchStart = useCallback(() => {
    if (isDisabled) return;
    setIsPressed(true);
  }, [isDisabled]);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            disabled={isDisabled}
            variant="ghost"
            size="icon"
            className={cn(
              "group relative flex flex-col items-center w-full h-auto p-1.5 rounded-xl",
              "transition-all duration-150 ease-out",
              "focus:outline-none focus:ring-1 focus:ring-blue-500",
              isPressed ? 'scale-95 opacity-80' : '',
              isDisabled && 'cursor-not-allowed opacity-50',
              isActive && 'bg-blue-50 dark:bg-blue-950/20'
            )}
          >
            {/* Icon Container */}
            <div className={cn(
              "relative w-10 h-10 rounded-lg flex items-center justify-center mb-1",
              "transition-all duration-150",
              isActive && 'ring-1 ring-blue-400/50',
              isDisabled 
                ? 'bg-gray-100 dark:bg-gray-700' 
                : `bg-gradient-to-br ${utility.gradient}`
            )}>
              <img
                src={utility.iconUrl} 
                alt={utility.label}
                className={cn(
                  "w-5 h-5 object-contain transition-transform duration-150",
                  isDisabled && 'grayscale opacity-70'
                )}
                loading="lazy"
                draggable={false}
              />
              
              {/* Coming Soon Badge */}
              {isDisabled && (
                <Badge className="absolute -top-1 -right-1 px-1 py-0 h-3 text-[8px] bg-gray-500">
                  !
                </Badge>
              )}
            </div>
            
            {/* Label */}
            <span className={cn(
              "text-[10px] font-medium text-center leading-tight max-w-14",
              isActive 
                ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                : isDisabled
                  ? 'text-gray-500 dark:text-gray-400'
                  : 'text-slate-700 dark:text-slate-300'
            )}>
              {utility.label}
            </span>
            
            {/* Active Indicator */}
            {isActive && (
              <div className="absolute -bottom-0.5 w-2 h-0.5 bg-blue-500 rounded-full" />
            )}
            
            {/* Coming Soon Label */}
            {isDisabled && (
              <span className="absolute -bottom-2 text-[7px] text-gray-500 dark:text-gray-400 font-medium">
                Sắp ra mắt
              </span>
            )}
          </Button>
        </TooltipTrigger>
        {/* Only show tooltip on non-touch devices */}
        {utility.description && (
          <TooltipContent 
            side="bottom" 
            className="text-xs max-w-[140px] text-center hidden md:block"
          >
            <p>{utility.description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
});

UtilityButton.displayName = 'UtilityButton';

const IconTab: React.FC<IconTabProps> = ({
  onUtilityClick,
  activeUtility,
}) => {
  
  // Memoized utilities array with Vietnamese labels
  const utilities = useMemo((): UtilityItem[] => [
    {
      id: 'prayers',
      label: 'Cầu Nguyện',
      gradient: 'from-emerald-400 to-teal-600',
      iconUrl: prayerIcon,
      route: '/utilities/prayers',
      isAvailable: true,
      description: 'Giờ cầu nguyện hàng ngày và lịch trình',
      accentColor: 'emerald'
    },
    {
      id: 'qiblah',
      label: 'Qiblah',
      gradient: 'from-purple-400 to-indigo-600',
      iconUrl: compassIcon,
      route: '/utilities/qiblah',
      isAvailable: true,
      description: 'Tìm hướng Qiblah để cầu nguyện',
      accentColor: 'purple'
    },
    {
      id: 'calendar',
      label: 'Lịch Hijri',
      gradient: 'from-orange-400 to-red-500',
      iconUrl: scheduleIcon,
      route: '/utilities/calendar',
      isAvailable: true,
      description: 'Lịch Hijri và các sự kiện quan trọng',
      accentColor: 'orange'
    },
    {
      id: 'quran',
      label: 'Kinh Qur\'an',
      gradient: 'from-cyan-400 to-blue-600',
      iconUrl: bookIcon,
      route: '/utilities/quran',
      isAvailable: true,
      description: 'Đọc và nghe Kinh Qur\'an',
      accentColor: 'cyan'
    },
    {
      id: 'masjid',
      label: 'Masjid',
      gradient: 'from-rose-400 to-red-600',
      iconUrl: buildingIcon,
      route: '/utilities/masjid',
      isAvailable: true,
      description: 'Tìm nhà thờ Hồi giáo gần bạn',
      accentColor: 'rose'
    },
    {
      id: 'tasbih',
      label: 'Tasbih',
      gradient: 'from-yellow-400 to-orange-600',
      iconUrl: tasbihIcon,
      route: '/utilities/tasbih',
      isAvailable: true,
      description: 'Đếm tràng hạt Tasbih kỹ thuật số',
      accentColor: 'yellow'
    },
    {
      id: 'dua',
      label: 'Dua',
      gradient: 'from-violet-400 to-fuchsia-600',
      iconUrl: doaIcon,
      route: '/utilities/dua',
      isAvailable: true,
      description: 'Bộ sưu tập các lời cầu nguyện',
      accentColor: 'violet'
    },
    {
      id: 'hadith',
      label: 'Hadith',
      gradient: 'from-blue-400 to-purple-600',
      iconUrl: hadihIcon,
      route: '/utilities/hadith',
      isAvailable: false,
      description: 'Đọc và tìm hiểu Hadith',
      accentColor: 'blue'
    },
    {
      id: 'nameallah',
      label: '99 Tên Allah',
      gradient: 'from-emerald-400 to-cyan-600',
      iconUrl: nameIcon,
      route: '/utilities/nameallah',
      isAvailable: true,
      description: '99 tên đẹp nhất của Allah',
      accentColor: 'emerald'
    },
    {
      id: 'podcast',
      label: 'Podcast',
      gradient: 'from-sky-400 to-indigo-600',
      iconUrl: podcastIcon,
      route: '/utilities/podcast',
      isAvailable: true,
      description: 'Nghe podcast Hồi giáo',
      accentColor: 'sky'
    },
    {
      id: 'study',
      label: 'Học Tập',
      gradient: 'from-pink-400 to-red-600',
      iconUrl: studyIcon,
      route: '/utilities/study',
      isAvailable: false,
      description: 'Tài liệu học tập Hồi giáo',
      accentColor: 'pink'
    },
    {
      id: 'zakat',
      label: 'Zakat',
      gradient: 'from-lime-400 to-emerald-600',
      iconUrl: zakatIcon,
      route: '/utilities/zakat',
      isAvailable: true,
      description: 'Tính toán Zakat của bạn',
      accentColor: 'lime'
    }
  ], []);

  // Memoized click handler
  const handleUtilityClick = useCallback((utility: UtilityItem) => {
    if (!utility.isAvailable) {
      console.log(`Tính năng ${utility.label} đang được phát triển`);
      return;
    }
    
    onUtilityClick(utility.id);
  }, [onUtilityClick]);

  // Memoized grid classes
  const gridClasses = useMemo(() => {
    return `grid grid-cols-4 gap-2 p-1`;
  }, []);

  return (
    <div className={gridClasses}>
      {utilities.map((utility) => (
        <UtilityButton
          key={utility.id}
          utility={utility}
          isActive={activeUtility === utility.id}
          onUtilityClick={handleUtilityClick}
        />
      ))}
    </div>
  );
};

export default React.memo(IconTab);