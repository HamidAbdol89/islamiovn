import { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarHeaderProps } from './types';
import { VAN_BAN_VI } from './constants';

const CalendarHeader = memo(({ 
  currentMonth, 
  currentYear, 
  onNavigate, 
  isTransitioning, 
  gregorianMonthsVi 
}: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6 lg:mb-8">
      <button
        onClick={() => onNavigate('prev')}
        disabled={isTransitioning}
        className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl transition-all duration-200 bg-muted hover:bg-muted/80 active:bg-muted/60 text-muted-foreground shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 mx-auto" />
      </button>
      
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">
          {gregorianMonthsVi[currentMonth - 1]} {currentYear}
        </h2>
        <p className="text-xs lg:text-sm text-muted-foreground font-medium">
          {VAN_BAN_VI.LICH_GREGORIAN}
        </p>
      </div>
      
      <button
        onClick={() => onNavigate('next')}
        disabled={isTransitioning}
        className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl transition-all duration-200 bg-muted hover:bg-muted/80 active:bg-muted/60 text-muted-foreground shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 mx-auto" />
      </button>
    </div>
  );
});

CalendarHeader.displayName = 'CalendarHeader';

export default CalendarHeader;
