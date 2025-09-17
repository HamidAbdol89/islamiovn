import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { ErrorStateProps } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

/**
 * Error state component với Vietnamese UI và shadcn Alert
 */
const ErrorState = React.memo<ErrorStateProps>(({ message, onRetry }) => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="ml-4"
          >
            {VIETNAMESE_TEXT.thuLai}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
});

ErrorState.displayName = 'ErrorState';

export default ErrorState;
