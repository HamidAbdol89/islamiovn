import { memo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, CheckCircle } from 'lucide-react';

interface BatchProgress {
  current: number;
  total: number;
  percentage: number;
}

interface BatchLoadingProgressProps {
  progress: BatchProgress | null;
  isLoading: boolean;
  onCancel: () => void;
  hadithCount?: number;
}

const BatchLoadingProgress = memo<BatchLoadingProgressProps>(({
  progress,
  isLoading,
  onCancel,
  hadithCount = 0
}) => {
  if (!isLoading && !progress) return null;

  const isComplete = progress?.percentage === 100;

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isComplete ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Download className="h-5 w-5 text-primary animate-pulse" />
            )}
            <span className="font-medium text-sm">
              {isComplete 
                ? `Đã tải xong ${hadithCount} hadith` 
                : 'Đang tải toàn bộ hadith...'
              }
            </span>
          </div>
          {!isComplete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {progress && (
          <>
            <Progress 
              value={progress.percentage} 
              className="mb-2 h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Trang {progress.current}/{progress.total}</span>
              <span>{progress.percentage}%</span>
            </div>
          </>
        )}
        
        {isComplete && hadithCount > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Tất cả hadith đã được tải và lưu cache để truy cập nhanh
          </p>
        )}
      </CardContent>
    </Card>
  );
});

BatchLoadingProgress.displayName = 'BatchLoadingProgress';

export default BatchLoadingProgress;
