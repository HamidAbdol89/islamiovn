// LoadingState.tsx - Loading state component
import React from 'react';
import { RefreshCw } from 'lucide-react';
import type { LoadingStateProps } from './types';

const LoadingState: React.FC<LoadingStateProps> = React.memo(({ message }) => {
  return (
    <div className="text-center py-12">
      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;
