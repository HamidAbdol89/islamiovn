import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { MasjidSearchProps } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

/**
 * Search component cho Masjid với Vietnamese UI và shadcn Input
 */
const MasjidSearch = React.memo<MasjidSearchProps>(({ 
  tuKhoa, 
  onChange, 
  placeholder = VIETNAMESE_TEXT.timKiemPlaceholder 
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={tuKhoa}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-background border-border focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
});

MasjidSearch.displayName = 'MasjidSearch';

export default MasjidSearch;
