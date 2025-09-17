// Pull to refresh indicator component
import React from 'react';
import { RefreshCw, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshIndicatorProps {
  isRefreshing: boolean;
  isPulling: boolean;
  pullProgress: number;
  isReadyToRefresh: boolean;
  pullDistance: number;
}

const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = React.memo(({
  isRefreshing,
  isPulling,
  pullProgress,
  isReadyToRefresh,
  pullDistance
}) => {
  if (!isPulling && !isRefreshing) return null;

  return (
    <div 
      className="absolute top-0 left-0 right-0 flex items-center justify-center transition-transform duration-200 ease-out z-10"
      style={{
        transform: `translateY(${Math.max(pullDistance - 60, -60)}px)`,
        opacity: isPulling || isRefreshing ? 1 : 0
      }}
    >
      <div className="bg-background/90 backdrop-blur-sm border border-border rounded-full p-3 shadow-lg">
        {isRefreshing ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Đang làm mới...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <div 
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isReadyToRefresh && "rotate-180"
              )}
            >
              <ChevronDown 
                className={cn(
                  "w-4 h-4 transition-colors duration-200",
                  isReadyToRefresh 
                    ? "text-green-500" 
                    : "text-muted-foreground"
                )} 
              />
            </div>
            <span 
              className={cn(
                "transition-colors duration-200",
                isReadyToRefresh 
                  ? "text-green-600 font-medium" 
                  : "text-muted-foreground"
              )}
            >
              {isReadyToRefresh ? 'Thả để làm mới' : 'Kéo để làm mới'}
            </span>
          </div>
        )}
      </div>
      
      {/* Progress indicator */}
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-8 h-1 bg-border rounded-full overflow-hidden"
      >
        <div 
          className={cn(
            "h-full transition-all duration-200 rounded-full",
            isReadyToRefresh ? "bg-green-500" : "bg-primary"
          )}
          style={{ width: `${pullProgress * 100}%` }}
        />
      </div>
    </div>
  );
});

PullToRefreshIndicator.displayName = 'PullToRefreshIndicator';

export default PullToRefreshIndicator;
