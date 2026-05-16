// VerseCard.tsx
import React, { useState, useCallback } from 'react';
import { Play, Pause, RefreshCw, Heart, Bookmark, Share2, Copy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TajweedVerse from './TajweedVerse';
import type { VerseCardProps } from './types';
import { quranStorageUtils } from './utils/storage';

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
  uiText,
  surahNumber,
  surahName
}) => {
  const [showActions, setShowActions] = useState(false);
  const ayahNumber = index + 1;
  
  // Check if current ayah is favorited or bookmarked
  const isFavorited = quranStorageUtils.isFavorite(surahNumber || 1, ayahNumber);
  const isBookmarked = quranStorageUtils.isBookmarked(surahNumber || 1, ayahNumber);
  const handleToggleAudio = React.useCallback(() => {
    onToggleAudio(index);
  }, [onToggleAudio, index]);

  // Handle favorite toggle
  const handleToggleFavorite = useCallback(() => {
    if (!surahNumber || !surahName) return;
    
    if (isFavorited) {
      quranStorageUtils.removeFavorite(surahNumber, ayahNumber);
    } else {
      quranStorageUtils.addFavorite({
        surahNumber,
        ayahNumber,
        surahName,
        ayahText: verse.verse,
        translation
      });
    }
    // Force re-render by toggling state
    setShowActions(prev => !prev);
    setTimeout(() => setShowActions(prev => !prev), 10);
  }, [isFavorited, surahNumber, ayahNumber, surahName, verse.verse, translation]);

  // Handle bookmark toggle
  const handleToggleBookmark = useCallback(() => {
    if (!surahNumber || !surahName) return;
    
    if (isBookmarked) {
      quranStorageUtils.removeBookmark(surahNumber, ayahNumber);
    } else {
      quranStorageUtils.addBookmark({
        surahNumber,
        ayahNumber,
        surahName,
        ayahText: verse.verse,
        translation
      });
    }
    // Force re-render by toggling state
    setShowActions(prev => !prev);
    setTimeout(() => setShowActions(prev => !prev), 10);
  }, [isBookmarked, surahNumber, ayahNumber, surahName, verse.verse, translation]);

  // Handle share
  const handleShare = useCallback(async (method: 'copy' | 'whatsapp' | 'telegram') => {
    if (!surahName) return;
    
    const shareText = `🕌 ${surahName} - Ayah ${ayahNumber}

${verse.verse}

${translation ? `📖 ${translation}

` : ''}🔗 Từ islam.io.vn`;
    
    try {
      switch (method) {
        case 'copy':
          await navigator.clipboard.writeText(shareText);
          console.log('Đã sao chép ayah vào clipboard');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
      }
    } catch (error) {
      console.error('Không thể chia sẻ ayah:', error);
    }
  }, [surahName, ayahNumber, verse.verse, translation]);

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
        relative transition-colors duration-300 group
        ${isCurrentlyPlaying 
          ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800/50 shadow-lg shadow-emerald-100/50 dark:shadow-emerald-900/20' 
          : 'bg-card text-card-foreground border-border hover:bg-accent/5'
        }
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardHeader className="flex flex-row items-center justify-between p-5 pb-3 space-y-0">
        <Badge 
          variant={isCurrentlyPlaying ? "secondary" : "outline"}
          className={`
            font-medium
            ${isCurrentlyPlaying 
              ? "bg-emerald-600 text-white border-emerald-500 shadow-sm" 
              : ""
            }
          `}
        >
          {uiText.verse} {index + 1}
        </Badge>

        <div className="flex items-center gap-2">
          <Button
            variant={isCurrentlyPlaying ? "secondary" : "outline"}
            size="sm"
            onClick={handleToggleAudio}
            disabled={verseState?.loading}
            className={`
              ${isCurrentlyPlaying 
                ? "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700 shadow-md shadow-emerald-200 dark:shadow-emerald-900/30" 
                : ""
              }
            `}
          >
            {renderPlayButton}
          </Button>
        </div>
      </CardHeader>


      <CardContent className="p-5 pt-0">
        {/* Arabic Text */}
        <div className="mb-4 mt-4">
          {showTajweed && tajweedRules.length > 0 ? (
            <div style={{ fontSize: 'var(--quran-font-size, 3rem)' }}>
              <TajweedVerse 
                verse={verse.verse}
                tajweedRules={tajweedRules}
                className={`
                  leading-loose text-right font-arabic font-medium
                  ${isCurrentlyPlaying 
                    ? 'text-emerald-900 dark:text-emerald-100' 
                    : 'text-card-foreground'
                  }
                `}
              />
            </div>
          ) : (
            <p 
              className={`
                leading-loose text-right font-arabic font-medium
                ${isCurrentlyPlaying 
                  ? 'text-emerald-900 dark:text-emerald-100' 
                  : 'text-card-foreground'
                }
              `}
              style={{ fontSize: 'var(--quran-font-size, 3rem)' }}
            >
              {verse.verse}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`
          flex justify-right gap-2 py-3 transition-opacity duration-200
          ${(showActions || isCurrentlyPlaying) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className={`
              h-8 w-8 p-0 backdrop-blur-sm
              ${isCurrentlyPlaying 
                ? 'bg-emerald-100/50 hover:bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-200' 
                : 'bg-background/80 hover:bg-background'
              }
            `}
            title="Thêm vào yêu thích"
          >
            <Heart 
              className={`h-4 w-4 ${
                isFavorited 
                  ? 'fill-destructive text-destructive' 
                  : isCurrentlyPlaying ? 'text-emerald-700 dark:text-emerald-200' : 'text-muted-foreground'
              }`} 
            />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleBookmark}
            className={`
              h-8 w-8 p-0 backdrop-blur-sm
              ${isCurrentlyPlaying 
                ? 'bg-emerald-100/50 hover:bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-200' 
                : 'bg-background/80 hover:bg-background'
              }
            `}
            title="Đánh dấu"
          >
            <Bookmark 
              className={`h-4 w-4 ${
                isBookmarked 
                  ? 'fill-emerald-600 text-emerald-600' 
                  : isCurrentlyPlaying ? 'text-emerald-700 dark:text-emerald-200' : 'text-muted-foreground'
              }`} 
            />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`
                  h-8 w-8 p-0 backdrop-blur-sm
                  ${isCurrentlyPlaying 
                    ? 'bg-emerald-100/50 hover:bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-200' 
                    : 'bg-background/80 hover:bg-background'
                  }
                `}
                title="Chia sẻ ayah"
              >
                <Share2 className={`h-4 w-4 ${isCurrentlyPlaying ? 'text-emerald-700 dark:text-emerald-200' : 'text-muted-foreground'}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem onClick={() => handleShare('copy')}>
                <Copy className="mr-2 h-4 w-4" />
                Sao chép
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('telegram')}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Telegram
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Translation */}
        {showTranslation && translation && (
          <div className={`pt-4 border-t ${isCurrentlyPlaying ? 'border-emerald-200/50 dark:border-emerald-800/30' : 'border-border'}`}>
            <p className={`
              text-base leading-relaxed
              ${isCurrentlyPlaying 
                ? 'text-emerald-800 dark:text-emerald-200/90' 
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