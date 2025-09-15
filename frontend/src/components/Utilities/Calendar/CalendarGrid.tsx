import { memo, useMemo, useCallback } from 'react';
import type { CalendarGridProps } from './types';
import CalendarDayButton from './CalendarDayButton';

const CalendarGrid = memo(({ 
  monthData, 
  selectedDay, 
  onDaySelect, 
  isTransitioning, 
  weekdaysVi 
}: CalendarGridProps) => {
  // Kiểm tra ngày hôm nay
  const isToday = useCallback((day: any): boolean => {
    if (!day || !day.gregorian || !day.gregorian.day) return false;
    
    const today = new Date();
    return (
      parseInt(day.gregorian.day) === today.getDate() &&
      parseInt(day.gregorian.month.number.toString()) === today.getMonth() + 1 &&
      parseInt(day.gregorian.year) === today.getFullYear()
    );
  }, []);

  // Tạo các nút ngày trong lịch
  const calendarDays = useMemo(() => {
    return monthData.map((day, index) => {
      if (!day || !day.gregorian || !day.hijri) {
        return null;
      }
      
      const isSelected = selectedDay?.gregorian?.date === day.gregorian.date;
      const isTodayDay = isToday(day);
      const hasHoliday = day.hijri.holidays && day.hijri.holidays.length > 0;
      
      return (
        <CalendarDayButton
          key={`${day.gregorian.date}-${index}`}
          day={day}
          isSelected={isSelected}
          isToday={isTodayDay}
          hasHoliday={hasHoliday}
          onSelect={onDaySelect}
        />
      );
    });
  }, [monthData, selectedDay, isToday, onDaySelect]);

  return (
    <div className={`p-4 sm:p-6 lg:p-8 rounded-3xl bg-card backdrop-blur-xl border border-border shadow-luxury transition-opacity duration-300 ${
      isTransitioning ? 'opacity-50' : 'opacity-100'
    }`}>
      {/* Tiêu đề các ngày trong tuần */}
      <div className="grid grid-cols-7 gap-1 lg:gap-2 mb-4 lg:mb-6">
        {weekdaysVi.map((day, index) => (
          <div 
            key={index}
            className="text-center py-2 lg:py-4 font-semibold text-xs lg:text-sm rounded-xl lg:rounded-2xl bg-muted text-muted-foreground border border-border"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Lưới lịch */}
      <div className="grid grid-cols-7 gap-0.5 w-full">
        {calendarDays}
      </div>
    </div>
  );
});

CalendarGrid.displayName = 'CalendarGrid';

export default CalendarGrid;
