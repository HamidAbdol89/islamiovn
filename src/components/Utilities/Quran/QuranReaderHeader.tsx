// QuranReaderHeader.tsx - Header component for QuranReader
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/ui/BackButton';
import type { QuranReaderHeaderProps } from './types';

const QuranReaderHeader: React.FC<QuranReaderHeaderProps> = React.memo(({
  currentSurahInfo,
  selectedSurah,
  versesCount,
  onBackClick,
  onSettingsClick
}) => {
  const surahTitle = currentSurahInfo?.title || `Surah ${selectedSurah}`;
  const surahInfo = `${versesCount} câu • ${currentSurahInfo?.type || ''}`;

  return (
    <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton onClick={onBackClick} />
            <div>
              <h1 className="text-xl font-bold text-gradient">
                {surahTitle}
              </h1>
              <p className="text-sm text-muted-foreground">
                {surahInfo}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onSettingsClick}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

QuranReaderHeader.displayName = 'QuranReaderHeader';

export default QuranReaderHeader;
