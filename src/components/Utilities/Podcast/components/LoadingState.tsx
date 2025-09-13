import React from 'react';
import { RefreshCw, AlertCircle, FileX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {}

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

interface EmptyStateProps {
  message: string;
}

// Vietnamese UI text constants
const UI_TEXT = {
  LOADING: 'Đang tải danh sách bài giảng...',
  TRY_AGAIN: 'Thử lại',
  EMPTY_MESSAGE: 'Chưa có bài giảng nào',
} as const;

export const LoadingState: React.FC<LoadingStateProps> = React.memo(() => (
  <Card className="bg-card border-border shadow-luxury dark:shadow-luxury-dark transition-smooth">
    <CardContent className="p-8 text-center">
      <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
      <p className="text-muted-foreground">
        {UI_TEXT.LOADING}
      </p>
    </CardContent>
  </Card>
));

export const ErrorState: React.FC<ErrorStateProps> = React.memo(({ error, onRetry }) => (
  <Card className="bg-card border-border shadow-luxury dark:shadow-luxury-dark transition-smooth">
    <CardContent className="p-6 text-center">
      <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
      <p className="mb-4 text-muted-foreground">
        {error}
      </p>
      <Button
        onClick={onRetry}
        variant="default"
        className="bg-luxury-gradient hover:opacity-90 text-white transition-smooth"
      >
        {UI_TEXT.TRY_AGAIN}
      </Button>
    </CardContent>
  </Card>
));

export const EmptyState: React.FC<EmptyStateProps> = React.memo(({ message }) => (
  <Card className="bg-card border-border shadow-luxury dark:shadow-luxury-dark transition-smooth">
    <CardContent className="p-8 text-center">
      <FileX className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
      <p className="text-muted-foreground">
        {message}
      </p>
    </CardContent>
  </Card>
));

LoadingState.displayName = 'LoadingState';
ErrorState.displayName = 'ErrorState';
EmptyState.displayName = 'EmptyState';
