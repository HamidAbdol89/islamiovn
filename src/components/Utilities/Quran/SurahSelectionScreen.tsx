// SurahSelectionScreen.tsx - Component for selecting Surah
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SurahSelectionProps } from './types';

const SurahSelectionScreen: React.FC<SurahSelectionProps> = React.memo(({
  surahList,
  onSurahSelect,
  uiText
}) => {
  const handleSurahClick = React.useCallback((surahIndex: string) => {
    onSurahSelect(parseInt(surahIndex));
  }, [onSurahSelect]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">{uiText.title}</h1>
          <p className="text-muted-foreground">{uiText.selectSurah}</p>
        </div>
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid gap-3 max-w-2xl mx-auto">
            {surahList.map((surah) => (
              <Button
                key={surah.index}
                variant="outline"
                className="h-auto p-4 justify-between hover:bg-luxury-gradient hover:text-white transition-all duration-300"
                onClick={() => handleSurahClick(surah.index)}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="min-w-[3rem]">
                    {surah.index}
                  </Badge>
                  <div className="text-left">
                    <div className="font-semibold">{surah.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {surah.count} {uiText.verses} • {surah.type}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5" />
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
});

SurahSelectionScreen.displayName = 'SurahSelectionScreen';

export default SurahSelectionScreen;
