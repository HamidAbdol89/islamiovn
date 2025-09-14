import React, { useMemo, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SettingItemProps } from './types';

const SettingItem = React.memo<SettingItemProps>(({ 
  icon: Icon, 
  label, 
  onClick, 
  rightContent, 
  showChevron = true 
}) => {
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const buttonClassName = useMemo(() => 
    "w-full flex justify-between items-center p-4 rounded-lg",
    []
  );

  return (
    <Button
      variant="ghost"
      className={buttonClassName}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <Icon className="mr-3 w-5 h-5" />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {rightContent}
        {showChevron && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </div>
    </Button>
  );
});

SettingItem.displayName = 'SettingItem';

export default SettingItem;
