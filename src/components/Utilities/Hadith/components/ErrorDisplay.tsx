import { memo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { VIETNAMESE_TEXT } from '../constants';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const ErrorDisplay = memo<ErrorDisplayProps>(({ error, onRetry }) => (
  <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
    <Alert className="border-destructive bg-destructive/10">
      <Info className="h-4 w-4" />
      <AlertDescription className="text-destructive">
        {error}
      </AlertDescription>
    </Alert>
    <div className="mt-6 text-center">
      <Button onClick={onRetry} variant="outline">
        {VIETNAMESE_TEXT.ACTIONS.RETRY}
      </Button>
    </div>
  </div>
));

ErrorDisplay.displayName = 'ErrorDisplay';

export default ErrorDisplay;
