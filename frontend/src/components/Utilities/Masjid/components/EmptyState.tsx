import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { EmptyStateProps } from '../types';

/**
 * Empty state component với Vietnamese UI
 */
const EmptyState = React.memo<EmptyStateProps>(({ 
  title, 
  description, 
  icon 
}) => {
  const IconComponent = icon || <MapPin className="h-16 w-16 text-muted-foreground" />;

  return (
    <Card className="text-center py-12">
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          {IconComponent}
        </div>
        <h3 className="text-lg font-medium text-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {description}
        </p>
      </CardContent>
    </Card>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
