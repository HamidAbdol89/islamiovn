// LoadingState Component with Vietnamese localization and shadcn UI
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { VIETNAMESE_TEXT } from '../constants';

const LoadingState: React.FC = React.memo(() => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden bg-card border-border animate-pulse">
          {/* Image Skeleton */}
          <div className="h-48 sm:h-56 bg-muted" />
          
          <CardContent className="p-4 sm:p-6">
            {/* Title Skeleton */}
            <div className="h-6 bg-muted rounded mb-3" />
            
            {/* Address Skeleton */}
            <div className="flex items-start mb-3">
              <div className="w-4 h-4 bg-muted rounded mr-2 mt-0.5" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded mb-1" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
            
            {/* Capacity Skeleton */}
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 bg-muted rounded mr-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
            
            {/* Description Skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-muted rounded" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </div>
            
            {/* Badges Skeleton */}
            <div className="flex gap-2">
              <div className="h-6 bg-muted rounded-full w-16" />
              <div className="h-6 bg-muted rounded-full w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Loading Indicator */}
      <div className="col-span-full flex items-center justify-center py-8">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{VIETNAMESE_TEXT.loading}</span>
        </div>
      </div>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;
