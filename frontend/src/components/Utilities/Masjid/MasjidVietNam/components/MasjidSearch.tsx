// MasjidSearch Component with Vietnamese localization and shadcn UI
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VIETNAMESE_TEXT, VUNG_VIET_NAM } from '../constants';
import { formatText } from '../utils';

interface MasjidSearchProps {
  tuKhoa: string;
  vungDuocChon: string;
  soKetQua: number;
  onSearchChange: (tuKhoa: string) => void;
  onRegionChange: (vung: string) => void;
  onClearSearch: () => void;
}

const MasjidSearch: React.FC<MasjidSearchProps> = React.memo(({
  tuKhoa,
  vungDuocChon,
  soKetQua,
  onSearchChange,
  onRegionChange,
  onClearSearch
}) => {
  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const handleClearClick = React.useCallback(() => {
    onClearSearch();
  }, [onClearSearch]);

  const ketQuaText = React.useMemo(() => {
    return formatText(VIETNAMESE_TEXT.search.resultsCount, { count: soKetQua.toString() });
  }, [soKetQua]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder={VIETNAMESE_TEXT.search.placeholder}
            value={tuKhoa}
            onChange={handleSearchChange}
            className="pl-10 pr-10 h-12 text-base bg-background border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
          />
          {tuKhoa && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Region Filter */}
        <Select value={vungDuocChon} onValueChange={onRegionChange}>
          <SelectTrigger className="w-full sm:w-48 h-12 bg-background border-border focus:ring-2 focus:ring-primary">
            <SelectValue placeholder="Chọn vùng" />
          </SelectTrigger>
          <SelectContent>
            {VUNG_VIET_NAM.map(vung => (
              <SelectItem key={vung} value={vung}>
                {vung}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">
          {ketQuaText}
        </p>
      </div>
    </div>
  );
});

MasjidSearch.displayName = 'MasjidSearch';

export default MasjidSearch;
