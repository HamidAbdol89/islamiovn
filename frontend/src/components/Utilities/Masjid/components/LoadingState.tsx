import React from 'react';
import { Loader } from 'lucide-react';
import type { LoadingStateProps } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

/**
 * Loading state component với Vietnamese UI
 */
const LoadingState = React.memo<LoadingStateProps>(({ 
  message = VIETNAMESE_TEXT.dangTimKiemMasjid 
}) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;
