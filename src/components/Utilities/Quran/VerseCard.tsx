// VerseCard.tsx
import React from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
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
    <Card 
      id={`verse-${index}`}
      className={`
        transition-colors duration-300
        ${isCurrentlyPlaying 
          ? 'bg-[#1a365d] text-white border-blue-600/30 shadow-lg' 
          : 'bg-card text-card-foreground border-border hover:bg-accent/5'
        }
      `}
    >
      <CardHeader className="flex flex-row items-center justify-between p-5 pb-3 space-y-0">
        <Badge 
          variant={isCurrentlyPlaying ? "secondary" : "outline"}
          className={`
            font-medium
            ${isCurrentlyPlaying 
              ? "bg-blue-500 text-white border-blue-400" 
              : ""
            }
          `}
        >
          {uiText.verse} {index + 1}
        </Badge>

        <Button
          variant={isCurrentlyPlaying ? "secondary" : "outline"}
          size="sm"
          onClick={handleToggleAudio}
          disabled={verseState?.loading}
          className={`
            ${isCurrentlyPlaying 
              ? "bg-blue-500 text-white border-blue-400 hover:bg-blue-600" 
              : ""
            }
          `}
        >
          {renderPlayButton}
        </Button>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        {/* Arabic Text */}
        <div className="mb-4 mt-4">
          {showTajweed && tajweedRules.length > 0 ? (
            <TajweedVerse 
              verse={verse.verse}
              tajweedRules={tajweedRules}
              className={`
                text-3xl leading-loose text-right font-arabic font-medium
                ${isCurrentlyPlaying 
                  ? 'text-white' 
                  : 'text-card-foreground'
                }
              `}
            />
          ) : (
            <p className={`
              text-3xl leading-loose text-right font-arabic font-medium
              ${isCurrentlyPlaying 
                ? 'text-white' 
                : 'text-card-foreground'
              }
            `}>
              {verse.verse}
            </p>
          )}
        </div>

        {/* Translation */}
        {showTranslation && translation && (
          <div className={`pt-4 border-t ${isCurrentlyPlaying ? 'border-blue-400/20' : 'border-border'}`}>
            <p className={`
              text-base leading-relaxed
              ${isCurrentlyPlaying 
                ? 'text-blue-100' 
                : 'text-muted-foreground'
              }
            `}>
              {translation}
            </p>
          </div>
        )}
      </CardContent>

      {/* Error Display */}
      {verseState?.error && (
        <CardFooter className="p-5 pt-0">
          <div className="w-full p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{verseState.error}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
});

VerseCard.displayName = 'VerseCard';

export default VerseCard;