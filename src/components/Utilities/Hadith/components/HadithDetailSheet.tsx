import { memo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from "@/components/ui/separator";
import { BookOpen, Heart, Bookmark, Info, Star } from 'lucide-react';
import type { HadithDetailSheetProps } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

const HadithDetailSheet = memo<HadithDetailSheetProps>(({
  selectedHadith,
  isLoading,
  favorites,
  bookmarks,
  onClose,
  onToggleFavorite,
  onToggleBookmark,
}) => {
  return (
    <Sheet open={!!selectedHadith} onOpenChange={onClose}>
      <SheetContent className="w-[95vw] sm:w-[540px] max-w-none p-4 sm:p-6 overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg sm:text-xl line-clamp-3 mb-2 pr-2">
                {selectedHadith?.title}
              </SheetTitle>
              {selectedHadith?.attribution && (
                <SheetDescription className="text-sm sm:text-base">
                  {selectedHadith.attribution}
                </SheetDescription>
              )}
            </div>
            <div className="flex gap-2 self-start">
              {selectedHadith && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFavorite(selectedHadith.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.includes(selectedHadith.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleBookmark(selectedHadith.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Bookmark 
                      className={`h-4 w-4 ${
                        bookmarks.includes(selectedHadith.id) 
                          ? 'fill-blue-500 text-blue-500' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetHeader>
        
        <div className="flex-1 space-y-6 mt-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : selectedHadith && (
            <div className="space-y-6">
              {/* Hadith Content */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <BookOpen className="h-4 w-4 flex-shrink-0" />
                  {VIETNAMESE_TEXT.CONTENT.HADITH_CONTENT}
                </h3>
                <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border-l-4 border-primary">
                  <div 
                    className="text-foreground leading-relaxed text-sm sm:text-base"
                    dangerouslySetInnerHTML={{ 
                      __html: selectedHadith.hadeeth || VIETNAMESE_TEXT.CONTENT.NO_CONTENT
                    }}
                  />
                </div>
              </div>

              {selectedHadith.explanation && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <Info className="h-4 w-4 flex-shrink-0" />
                      {VIETNAMESE_TEXT.CONTENT.EXPLANATION}
                    </h3>
                    <div 
                      className="text-muted-foreground leading-relaxed bg-card p-3 sm:p-4 rounded-lg border text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: selectedHadith.explanation }}
                    />
                  </div>
                </>
              )}

              {selectedHadith.fawaed && selectedHadith.fawaed.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <Star className="h-4 w-4 flex-shrink-0" />
                      {VIETNAMESE_TEXT.CONTENT.BENEFITS}
                    </h3>
                    <div className="bg-accent/50 p-3 sm:p-4 rounded-lg border">
                      <ul className="space-y-2 sm:space-y-3">
                        {selectedHadith.fawaed.map((fayda, index) => (
                          <li 
                            key={index} 
                            className="text-accent-foreground leading-relaxed flex items-start gap-2 text-sm sm:text-base"
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <div dangerouslySetInnerHTML={{ __html: fayda }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
});

HadithDetailSheet.displayName = 'HadithDetailSheet';

export default HadithDetailSheet;
