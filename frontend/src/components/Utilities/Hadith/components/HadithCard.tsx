import { memo, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Bookmark, ChevronRight } from 'lucide-react';
import type { HadithCardProps } from '../types';
import { VIETNAMESE_TEXT } from '@/components/Utilities/Hadith/constants';

const HadithCard = memo<HadithCardProps>(({ 
  hadith, 
  isFavorite, 
  isBookmarked, 
  onClick 
}) => {
  const handleClick = useCallback(() => {
    onClick(hadith);
  }, [hadith, onClick]);

  const previewText = useMemo(() => {
    if (!hadith.hadeeth) return null;
    const text = hadith.hadeeth.substring(0, 120);
    return text + (hadith.hadeeth.length > 120 ? '...' : '');
  }, [hadith.hadeeth]);

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-border hover:border-primary/50"
      onClick={handleClick}
    >
      <CardHeader className="pb-2 sm:pb-3">
      <CardTitle className="text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors">
  {(hadith.title || VIETNAMESE_TEXT.CONTENT.NO_TITLE)?.replace(/[{}]/g, "")}
</CardTitle>

      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {previewText ? (
          <div 
            className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: previewText }}
          />
        ) : (
          <p className="text-xs sm:text-sm text-muted-foreground italic">
            {VIETNAMESE_TEXT.CONTENT.NO_PREVIEW}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline" className="text-xs px-2 py-1">
            #{hadith.id}
          </Badge>
          <div className="flex items-center gap-1">
            {isFavorite && (
              <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            )}
            {isBookmarked && (
              <Bookmark className="h-3 w-3 fill-blue-500 text-blue-500" />
            )}
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

HadithCard.displayName = 'HadithCard';

export default HadithCard;
