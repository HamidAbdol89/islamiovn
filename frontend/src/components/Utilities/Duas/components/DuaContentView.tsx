import React, { useCallback, useMemo } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DuaTextViet } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

interface DuaContentViewProps {
  dua: DuaTextViet;
  coChuPhong: number;
  laYeuThich: boolean;
  onToggleYeuThich: () => void;
  onChiaSe: () => void;
}

const DuaContentView = React.memo<DuaContentViewProps>(({
  dua,
  coChuPhong,
  laYeuThich,
  onToggleYeuThich,
  onChiaSe
}) => {
  // Memoized handlers
  const handleToggleYeuThich = useCallback(() => {
    onToggleYeuThich();
  }, [onToggleYeuThich]);

  const handleChiaSe = useCallback(() => {
    onChiaSe();
  }, [onChiaSe]);

  // Memoized styles
  const styleTextArabic = useMemo(() => ({
    fontSize: `${coChuPhong + 8}px`
  }), [coChuPhong]);

  const styleTextThuong = useMemo(() => ({
    fontSize: `${coChuPhong}px`
  }), [coChuPhong]);

  // Memoized favorite button class
  const classFavoriteButton = useMemo(() => 
    laYeuThich 
      ? "text-red-600 bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900"
      : "",
    [laYeuThich]
  );

  return (
    <div className="p-4 space-y-6">
      {/* Arabic Text */}
      <Card className="shadow-luxury dark:shadow-luxury-dark">
        <CardContent className="p-6">
          <div 
            className="text-right leading-loose font-arabic"
            style={styleTextArabic}
          >
            {dua.ARABIC_TEXT}
          </div>
        </CardContent>
      </Card>

      {/* Transliteration */}
      {dua.LANGUAGE_ARABIC_TRANSLATED_TEXT && (
        <Card className="shadow-luxury dark:shadow-luxury-dark">
          <CardHeader>
            <CardTitle className="text-sm text-gradient">{VIETNAMESE_TEXT.PHIEN_AM}</CardTitle>
          </CardHeader>
          <CardContent>
            <p 
              className="italic text-muted-foreground leading-relaxed"
              style={styleTextThuong}
            >
              {dua.LANGUAGE_ARABIC_TRANSLATED_TEXT}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Translation */}
      <Card className="shadow-luxury dark:shadow-luxury-dark">
        <CardHeader>
          <CardTitle className="text-sm text-gradient">{VIETNAMESE_TEXT.BAN_DICH}</CardTitle>
        </CardHeader>
        <CardContent>
          <p 
            className="leading-relaxed"
            style={styleTextThuong}
          >
            {dua.TRANSLATED_TEXT}
          </p>
        </CardContent>
      </Card>

      {/* Repeat Information */}
      {dua.REPEAT > 1 && (
        <Card className="bg-primary/5 border-primary/20 shadow-luxury dark:shadow-luxury-dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <p className="text-sm font-medium">
                Đọc {dua.REPEAT} lần
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-3">
        <Button
          variant={laYeuThich ? "secondary" : "outline"}
          size="default"
          onClick={handleToggleYeuThich}
          className={`transition-smooth ${classFavoriteButton}`}
        >
          <Heart className={`w-4 h-4 mr-2 ${laYeuThich ? "fill-current" : ""}`} />
          {laYeuThich ? VIETNAMESE_TEXT.DA_YEU_THICH : VIETNAMESE_TEXT.THEM_YEU_THICH}
        </Button>
        
        <Button 
          variant="outline" 
          size="default"
          onClick={handleChiaSe}
          className="transition-smooth"
        >
          <Share2 className="w-4 h-4 mr-2" />
          {VIETNAMESE_TEXT.CHIA_SE}
        </Button>
      </div>
    </div>
  );
});

DuaContentView.displayName = 'DuaContentView';

export default DuaContentView;
