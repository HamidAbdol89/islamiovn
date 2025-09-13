import { memo, useCallback, useMemo } from 'react';
import type { CalendarDayButtonProps } from './types';

const CalendarDayButton = memo(({ 
  day, 
  isSelected, 
  isToday, 
  hasHoliday, 
  onSelect 
}: CalendarDayButtonProps) => {
  const handleClick = useCallback(() => {
    onSelect(day);
  }, [day, onSelect]);

  const buttonClass = useMemo(() => {
    let classes = "relative py-4 px-2 text-center transition-smooth ";
    
    if (isSelected) {
      classes += "bg-primary text-primary-foreground";
    } else if (isToday) {
      classes += "bg-primary/10 text-primary";
    } else if (hasHoliday) {
      classes += "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200";
    } else {
      classes += "hover:bg-muted text-foreground";
    }
    
    return classes;
  }, [isSelected, isToday, hasHoliday]);

  return (
    <button onClick={handleClick} className={buttonClass}>
      <div className="text-sm font-medium">
        {day.gregorian.day}
      </div>
      <div className={`text-xs ${isSelected ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
        {day.hijri.day}
      </div>
      {hasHoliday && (
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
      )}
      {isToday && !isSelected && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
      )}
    </button>
  );
});

CalendarDayButton.displayName = 'CalendarDayButton';

export default CalendarDayButton;
