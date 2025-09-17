// Skeleton loading component for MasjidCard
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const MasjidCardSkeleton: React.FC = React.memo(() => {
  return (
    <Card className="overflow-hidden bg-card border-border">
      {/* Image Skeleton */}
      <div className="h-48 sm:h-56 bg-muted animate-pulse" />
      
      <CardContent className="p-4 sm:p-6">
        {/* Title Skeleton */}
        <div className="h-6 bg-muted rounded animate-pulse mb-3" />
        
        {/* Address Skeleton */}
        <div className="flex items-start mb-3">
          <div className="w-4 h-4 bg-muted rounded animate-pulse mr-2 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </div>
        
        {/* Capacity Skeleton */}
        <div className="flex items-center mb-3">
          <div className="w-4 h-4 bg-muted rounded animate-pulse mr-2" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
        </div>
        
        {/* Phone Skeleton */}
        <div className="flex items-center mb-3">
          <div className="w-4 h-4 bg-muted rounded animate-pulse mr-2" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
        </div>
        
        {/* Founded Year Skeleton */}
        <div className="flex items-center mb-4">
          <div className="w-4 h-4 bg-muted rounded animate-pulse mr-2" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
        </div>
        
        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
          <div className="h-3 bg-muted rounded animate-pulse w-4/6" />
        </div>
        
        {/* Badges Skeleton */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
          <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
});

MasjidCardSkeleton.displayName = 'MasjidCardSkeleton';

// Grid of skeleton cards
interface MasjidSkeletonGridProps {
  count?: number;
}

export const MasjidSkeletonGrid: React.FC<MasjidSkeletonGridProps> = React.memo(({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <MasjidCardSkeleton key={index} />
      ))}
    </div>
  );
});

MasjidSkeletonGrid.displayName = 'MasjidSkeletonGrid';

export default MasjidCardSkeleton;
