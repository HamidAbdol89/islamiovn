// VerseCard.tsx - Individual verse card component
import React from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TajweedVerse from './TajweedVerse';
import type { VerseCardProps } from './types';

const VerseCard: React.FC<VerseCardProps> = React.memo(({
  verse,
  index,
  isCurrentlyPlaying,
  verseState,
  translation,
  tajweedRules,
  showTranslation,
  showTajweed,
  onToggleAudio,
  uiText
}) => {
  const handleToggleAudio = React.useCallback(() => {
    onToggleAudio(index);
  }, [onToggleAudio, index]);

  const cardClassName = React.useMemo(() => `
    bg-card rounded-xl p-6 border transition-all duration-300
    ${isCurrentlyPlaying 
      ? 'bg-luxury-gradient text-white shadow-luxury ring-2 ring-primary/20' 
      : 'border-border hover:shadow-lg'
    }
  `, [isCurrentlyPlaying]);

  const badgeClassName = React.useMemo(() => 
    isCurrentlyPlaying ? "bg-white/20 text-white" : "",
    [isCurrentlyPlaying]
  );

  const buttonClassName = React.useMemo(() => 
    isCurrentlyPlaying ? "bg-white/20 text-white hover:bg-white/30" : "",
    [isCurrentlyPlaying]
  );

  const arabicTextClassName = React.useMemo(() => `
    text-2xl leading-loose text-right ${
      isCurrentlyPlaying ? 'text-white' : 'text-foreground'
    }
  `, [isCurrentlyPlaying]);

  const plainArabicClassName = React.useMemo(() => `
    ${arabicTextClassName} font-arabic
  `, [arabicTextClassName]);

  const translationClassName = React.useMemo(() => `
    text-base leading-relaxed ${
      isCurrentlyPlaying ? 'text-white/90' : 'text-muted-foreground'
    }
  `, [isCurrentlyPlaying]);

  const renderPlayButton = React.useMemo(() => {
    if (verseState?.loading) {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
    return verseState?.isPlaying ? (
      <Pause className="h-4 w-4" />
    ) : (
      <Play className="h-4 w-4" />
    );
  }, [verseState?.loading, verseState?.isPlaying]);

  return (
    <div
      id={`verse-${index}`}
      className={cardClassName}
    >
      {/* Verse Header */}
      <div className="flex items-center justify-between mb-4">
        <Badge 
          variant={isCurrentlyPlaying ? "secondary" : "outline"}
          className={badgeClassName}
        >
          {uiText.verse} {index + 1}
        </Badge>
        
        <Button
          variant={isCurrentlyPlaying ? "secondary" : "ghost"}
          size="sm"
          onClick={handleToggleAudio}
          disabled={verseState?.loading}
          className={buttonClassName}
        >
          {renderPlayButton}
        </Button>
      </div>

      {/* Arabic Text */}
      <div className="mb-4">
        {showTajweed && tajweedRules.length > 0 ? (
          <TajweedVerse 
            verse={verse.verse}
            tajweedRules={tajweedRules}
            className={arabicTextClassName}
          />
        ) : (
          <p className={plainArabicClassName}>
            {verse.verse}
          </p>
        )}
      </div>

      {/* Translation */}
      {showTranslation && translation && (
        <div className="pt-4 border-t border-border/20">
          <p className={translationClassName}>
            {translation}
          </p>
        </div>
      )}

      {/* Error Display */}
      {verseState?.error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{verseState.error}</p>
        </div>
      )}
    </div>
  );
});

VerseCard.displayName = 'VerseCard';

export default VerseCard;
