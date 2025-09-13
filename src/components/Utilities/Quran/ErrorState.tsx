// ErrorState.tsx - Error state component
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ErrorStateProps } from './types';

const ErrorState: React.FC<ErrorStateProps> = React.memo(({ 
  error, 
  onRefresh, 
  refreshText 
}) => {
  return (
    <div className="text-center py-12">
      <p className="text-destructive mb-4">{error}</p>
      <Button onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        {refreshText}
      </Button>
    </div>
  );
});

ErrorState.displayName = 'ErrorState';

export default ErrorState;
