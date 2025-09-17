import React, { useCallback, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { DuaYeuThich } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

interface DuaFavoritesViewProps {
  danhSachYeuThich: DuaYeuThich[];
  onChonDua: (viTriDanhMuc: number, viTriDua: number) => void;
}

// Memoized Favorite Item Component
const FavoriteItem = React.memo<{
  item: DuaYeuThich;
  onChon: () => void;
}>(({ item, onChon }) => {
  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors shadow-luxury dark:shadow-luxury-dark"
      onClick={onChon}
    >
      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-sm font-medium text-primary">
            {item.danhMuc.TITLE}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {item.dua.TRANSLATED_TEXT}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Heart className="w-3 h-3 text-red-500 fill-current" />
          <span className="text-xs text-muted-foreground">
            Đã thêm vào yêu thích
          </span>
        </div>
      </CardContent>
    </Card>
  );
});

FavoriteItem.displayName = 'FavoriteItem';

const DuaFavoritesView = React.memo<DuaFavoritesViewProps>(({
  danhSachYeuThich,
  onChonDua
}) => {
  // Memoized handler
  const handleChonDua = useCallback((viTriDanhMuc: number, viTriDua: number) => {
    onChonDua(viTriDanhMuc, viTriDua);
  }, [onChonDua]);

  // Memoized favorites list
  const danhSachItem = useMemo(() => 
    danhSachYeuThich.map((item, index) => (
      <FavoriteItem
        key={`${item.viTriDanhMuc}-${item.viTriDua}-${index}`}
        item={item}
        onChon={() => handleChonDua(item.viTriDanhMuc, item.viTriDua)}
      />
    )),
    [danhSachYeuThich, handleChonDua]
  );

  // Memoized empty state
  const trangThaiTrong = useMemo(() => (
    <div className="text-center py-12">
      <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
      <h3 className="font-medium mb-3 text-lg">{VIETNAMESE_TEXT.KHONG_CO_YEU_THICH}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
        {VIETNAMESE_TEXT.HUONG_DAN_YEU_THICH}
      </p>
    </div>
  ), []);

  return (
    <div className="p-4 space-y-4">
      {danhSachYeuThich.length > 0 ? (
        <>
          {/* Header Info */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {danhSachYeuThich.length} dua yêu thích
            </p>
          </div>
          
          {/* Favorites Grid */}
          <div className="grid gap-3">
            {danhSachItem}
          </div>
        </>
      ) : (
        trangThaiTrong
      )}
    </div>
  );
});

DuaFavoritesView.displayName = 'DuaFavoritesView';

export default DuaFavoritesView;
