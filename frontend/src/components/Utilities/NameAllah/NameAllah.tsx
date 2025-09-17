import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BackButton from "@/components/ui/BackButton";
import nameAllahData from '@/assets/NameAllah.json';

// Vietnamese Constants
const VIETNAMESE_TEXT = {
  title: '99 Tên Đẹp Của Allah',
  description: 'Asma ul-Husna - 99 Tên Đẹp Nhất Của Allah SWT',
  searchPlaceholder: 'Tìm kiếm tên Allah...',
  loading: 'Đang tải...',
  error: 'Không thể tải dữ liệu',
  noResults: 'Không tìm thấy kết quả cho',
  showingResults: 'Hiển thị',
  of: 'trên',
  names: 'tên'
} as const;

// Types
interface AsmaName {
  number: number;
  arabic: string;
  transliteration: string;
  vietnamese: string;
}

interface AsmaData {
  title: string;
  description: string;
  names: AsmaName[];
}

// Memoized Search Component
const SearchBar = React.memo<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
}>(({ searchTerm, onSearchChange }) => {
  const handleClear = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
      <Input
        type="text"
        placeholder={VIETNAMESE_TEXT.searchPlaceholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-10 py-3 h-12 text-base bg-card border-border focus:ring-primary"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

// Memoized Name Card Component
const NameCard = React.memo<{ name: AsmaName }>(({ name }) => {
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-card border-border">
      <CardContent className="p-4 sm:p-6 text-center">
        <Badge 
          variant="secondary" 
          className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full mb-3 text-sm sm:text-base font-bold bg-primary/10 text-primary hover:bg-primary/20"
        >
          {name.number}
        </Badge>
        
        <div className="text-2xl sm:text-3xl lg:text-4xl font-arabic text-primary mb-2 group-hover:text-primary/80 transition-colors">
          {name.arabic}
        </div>
        
        <div className="text-sm sm:text-base font-medium text-foreground mb-1">
          {name.transliteration}
        </div>
        
        <div className="text-xs sm:text-sm text-muted-foreground font-medium">
          {name.vietnamese}
        </div>
      </CardContent>
    </Card>
  );
});

NameCard.displayName = 'NameCard';

// Main Component
const AsmaUlHusnaComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [data, setData] = useState<AsmaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setData(nameAllahData as AsmaData);
    setLoading(false);
  }, []);

  // Memoized search handler
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Memoized filtered names
  const filteredNames = useMemo(() => {
    if (!data?.names) return [];
    if (!searchTerm.trim()) return data.names;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.names.filter(name => 
      name.arabic.includes(searchTerm) ||
      name.transliteration.toLowerCase().includes(lowerSearchTerm) ||
      name.vietnamese.toLowerCase().includes(lowerSearchTerm) ||
      name.number.toString().includes(searchTerm)
    );
  }, [data?.names, searchTerm]);

  // Memoized results text
  const resultsText = useMemo(() => {
    if (!data?.names) return '';
    return `${VIETNAMESE_TEXT.showingResults} ${filteredNames.length} ${VIETNAMESE_TEXT.of} ${data.names.length} ${VIETNAMESE_TEXT.names}`;
  }, [filteredNames.length, data?.names.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{VIETNAMESE_TEXT.loading}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">{VIETNAMESE_TEXT.error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 flex items-center justify-between">
          <BackButton />
          
          <div className="flex-1 mx-2">
         
            <p className="text-md sm:text-base text-muted-foreground">
              {VIETNAMESE_TEXT.description}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-1  sm:px-2 lg:px-2 py-2 sm:py-2">
        <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        
        {/* Results count */}
        <div className="mb-2">
          <p className="text-sm text-muted-foreground">
            {resultsText}
          </p>
        </div>

        {/* Names Grid */}
  
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {filteredNames.map((name) => (
 <Card>
 <div 
 key={name.number}
 className="p-3 sm:p-6 text-center 
            hover:bg-accent/30 active:bg-accent/50 transition select-none"
>
 <div className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 
                 rounded-full mb-2 text-xs sm:text-sm font-bold 
                 bg-primary/10 text-primary">
   {name.number}
 </div>
 
 <div className="text-2xl sm:text-3xl font-arabic text-primary mb-1">
   {name.arabic}
 </div>
 
 <div className="text-sm sm:text-base text-foreground">{name.transliteration}</div>
 <div className="text-xs sm:text-sm text-muted-foreground">{name.vietnamese}</div>
</div>
</Card>
  ))}

</div>

      </main>
    </div>
  );
};

AsmaUlHusnaComponent.displayName = 'AsmaUlHusnaComponent';

// Main Export - No theme provider needed, uses system theme
export default AsmaUlHusnaComponent;