import React, { useState, useMemo, useCallback, memo } from 'react';
import { APP_TOOLS, type AppTool } from '@/features/tools';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface IconTabProps {
  onUtilityClick: (utilityId: string) => void;
  activeUtility?: string;
  mode?: 'compact' | 'grid' | 'expanded';
}

const UtilityButton = memo<{
  utility: AppTool;
  isActive: boolean;
  onUtilityClick: (utility: AppTool) => void;
}>(({ utility, isActive, onUtilityClick }) => {
  const isDisabled = !utility.isAvailable;
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDisabled) return;
      e.stopPropagation();
      onUtilityClick(utility);
    },
    [isDisabled, utility, onUtilityClick],
  );

  const handleTouchStart = useCallback(() => {
    if (isDisabled) return;
    setIsPressed(true);
  }, [isDisabled]);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
  }, []);

  const buttonClasses = useMemo(
    () =>
      cn(
        'group relative flex h-auto w-full flex-col items-center rounded-lg p-1.5',
        'transition-all duration-150 ease-out',
        isPressed ? 'scale-95 opacity-80' : '',
        isDisabled && 'cursor-not-allowed opacity-50',
        isActive && 'bg-primary/10',
      ),
    [isPressed, isDisabled, isActive],
  );

  const iconContainerClasses = useMemo(
    () =>
      cn(
        'relative mb-1 flex h-11 w-11 items-center justify-center rounded-xl',
        'transition-all duration-150',
        isActive && 'ring-2 ring-primary/50',
        isDisabled ? 'bg-muted' : 'bg-transparent',
      ),
    [isActive, isDisabled],
  );

  const iconClasses = useMemo(
    () => cn('h-8 w-8 object-contain transition-transform duration-150', isDisabled && 'grayscale opacity-70'),
    [isDisabled],
  );

  const labelClasses = useMemo(
    () =>
      cn(
        'max-w-14 text-center text-xs font-medium leading-tight',
        isActive ? 'font-semibold text-primary' : isDisabled ? 'text-muted-foreground' : 'text-foreground',
      ),
    [isActive, isDisabled],
  );

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
            <div className={iconContainerClasses}>
              <img
                src={utility.iconUrl}
                alt={utility.label}
                className={iconClasses}
                loading="lazy"
                draggable={false}
              />
              {isDisabled && (
                <Badge variant="secondary" className="absolute -right-1 -top-1 h-4 px-1 py-0 text-[8px]">
                  !
                </Badge>
              )}
            </div>
            <span className={labelClasses}>{utility.label}</span>
            {isActive && <div className="absolute -bottom-0.5 h-0.5 w-2 rounded-full bg-primary" />}
            {isDisabled && (
              <span className="absolute -bottom-2 text-[8px] font-medium text-muted-foreground">Sắp ra mắt</span>
            )}
          </Button>
        </TooltipTrigger>
        {utility.description && (
          <TooltipContent side="bottom" className="hidden max-w-[140px] text-center text-xs md:block">
            <p>{utility.description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.utility.id === nextProps.utility.id &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.utility.isAvailable === nextProps.utility.isAvailable &&
    prevProps.onUtilityClick === nextProps.onUtilityClick
  );
});

UtilityButton.displayName = 'UtilityButton';

const IconTab: React.FC<IconTabProps> = ({ onUtilityClick, activeUtility }) => {
  const handleUtilityClick = useCallback(
    (utility: AppTool) => {
      if (!utility.isAvailable) return;
      onUtilityClick(utility.id);
    },
    [onUtilityClick],
  );

  return (
    <div className="grid grid-cols-4 gap-2 p-1">
      {APP_TOOLS.map((utility) => (
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

export default memo(IconTab, (prevProps, nextProps) => {
  return (
    prevProps.activeUtility === nextProps.activeUtility &&
    prevProps.onUtilityClick === nextProps.onUtilityClick
  );
});
