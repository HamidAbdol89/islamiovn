import React, { useState, useMemo, useCallback, memo } from 'react';

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
  | 'quranreader' 
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

// Memoized utility button component with optimized re-renders
const UtilityButton = memo<{ 
  utility: UtilityItem; 
  isActive: boolean;
  onUtilityClick: (utility: UtilityItem) => void;
}>(({ utility, isActive, onUtilityClick }) => {
  const isDisabled = !utility.isAvailable;
  const [isPressed, setIsPressed] = useState(false);

  // Memoized click handler to prevent recreation
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isDisabled) return;
    e.stopPropagation();
    onUtilityClick(utility);
  }, [isDisabled, utility, onUtilityClick]);

  // Memoized touch handlers for better mobile experience
  const handleTouchStart = useCallback(() => {
    if (isDisabled) return;
    setIsPressed(true);
  }, [isDisabled]);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
  }, []);

  // Memoized class names to prevent recalculation
  const buttonClasses = useMemo(() => cn(
    "group relative flex flex-col items-center w-full h-auto p-1.5 rounded-lg",
    "transition-all duration-150 ease-out",
    "focus:outline-none focus:ring-2 focus:ring-primary",
    isPressed ? 'scale-95 opacity-80' : '',
    isDisabled && 'cursor-not-allowed opacity-50',
    isActive && 'bg-primary/10'
  ), [isPressed, isDisabled, isActive]);

  const iconContainerClasses = useMemo(() => cn(
    "relative w-11 h-11 rounded-xl flex items-center justify-center mb-1",
    "transition-all duration-150",
    isActive && 'ring-2 ring-primary/50',
    isDisabled 
      ? 'bg-muted' 
      : `bg-gradient-to-br ${utility.gradient}`
  ), [isActive, isDisabled, utility.gradient]);
  
  

  const iconClasses = useMemo(() => cn(
    "w-5 h-5 object-contain transition-transform duration-150",
    isDisabled && 'grayscale opacity-70'
  ), [isDisabled]);

  const labelClasses = useMemo(() => cn(
    "text-xs font-medium text-center leading-tight max-w-14",
    isActive 
      ? 'text-primary font-semibold' 
      : isDisabled
        ? 'text-muted-foreground'
        : 'text-foreground'
  ), [isActive, isDisabled]);

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
            className={buttonClasses}
          >
            {/* Icon Container */}
            <div className={iconContainerClasses}>
              <img
                src={utility.iconUrl} 
                alt={utility.label}
                className={iconClasses}
                loading="lazy"
                draggable={false}
              />
              
              {/* Coming Soon Badge */}
              {isDisabled && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-1 -right-1 px-1 py-0 h-4 text-[8px]"
                >
                  !
                </Badge>
              )}
            </div>
            
            {/* Label */}
            <span className={labelClasses}>
              {utility.label}
            </span>
            
            {/* Active Indicator */}
            {isActive && (
              <div className="absolute -bottom-0.5 w-2 h-0.5 bg-primary rounded-full" />
            )}
            
            {/* Coming Soon Label */}
            {isDisabled && (
              <span className="absolute -bottom-2 text-[8px] text-muted-foreground font-medium">
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
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  return (
    prevProps.utility.id === nextProps.utility.id &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.utility.isAvailable === nextProps.utility.isAvailable &&
    prevProps.onUtilityClick === nextProps.onUtilityClick
  );
});

UtilityButton.displayName = 'UtilityButton';

// Memoized utilities data to prevent recreation
const UTILITIES_DATA: UtilityItem[] = [
  {
    id: 'prayers',
    label: 'Cầu Nguyện',
    gradient: 'from-primary/80 to-primary',
    iconUrl: prayerIcon,
    route: '/utilities/prayers',
    isAvailable: true,
    description: 'Giờ cầu nguyện hàng ngày và lịch trình',
    accentColor: 'primary'
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
    id: 'quranreader',
    label: 'Kinh Qur\'an',
    gradient: 'from-cyan-400 to-blue-600',
    iconUrl: bookIcon,
    route: '/utilities/quranreader',
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
    isAvailable: true,
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
];

const IconTab: React.FC<IconTabProps> = ({
  onUtilityClick,
  activeUtility,
}) => {

  // Memoized click handler with better error handling
  const handleUtilityClick = useCallback((utility: UtilityItem) => {
    if (!utility.isAvailable) {
      // Could add toast notification here instead of console.log
      console.log(`Tính năng ${utility.label} đang được phát triển`);
      return;
    }
    
    onUtilityClick(utility.id);
  }, [onUtilityClick]);

  // Memoized grid classes - static so no need for useMemo
  const gridClasses = "grid grid-cols-4 gap-2 p-1";

  return (
    <div className={gridClasses}>
      {UTILITIES_DATA.map((utility) => (
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

// Memoize the entire component with custom comparison
export default memo(IconTab, (prevProps, nextProps) => {
  return (
    prevProps.activeUtility === nextProps.activeUtility &&
    prevProps.onUtilityClick === nextProps.onUtilityClick
  );
});