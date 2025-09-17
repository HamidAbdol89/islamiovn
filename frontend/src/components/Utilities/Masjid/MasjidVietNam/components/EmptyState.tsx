// EmptyState Component with Vietnamese localization and shadcn UI
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VIETNAMESE_TEXT } from '../constants';

interface EmptyStateProps {
  onClearSearch: () => void;
  hasActiveFilters: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = React.memo(({ onClearSearch, hasActiveFilters }) => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Không tìm thấy kết quả
        </h3>
        
        <p className="text-muted-foreground mb-6">
          {VIETNAMESE_TEXT.search.noResults}
        </p>
        
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={onClearSearch}
            className="transition-smooth"
          >
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
