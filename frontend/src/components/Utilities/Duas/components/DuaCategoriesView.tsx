import React, { useCallback, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { DuaCategoryViet } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

interface DuaCategoriesViewProps {
  danhSachDanhMuc: DuaCategoryViet[];
  onChonDanhMuc: (viTriDanhMuc: number) => void;
}

// Memoized Category Card Component
const CategoryCard = React.memo<{
  danhMuc: DuaCategoryViet;
  onChon: () => void;
}>(({ danhMuc, onChon }) => {
  const soLuongDua = useMemo(() => danhMuc.TEXT?.length || 0, [danhMuc.TEXT]);

  return (
    <Card
      className="w-full cursor-pointer hover:bg-accent/50 transition-colors shadow-luxury dark:shadow-luxury-dark"
      onClick={onChon}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate text-gradient">{danhMuc.TITLE}</h3>
            <p className="text-sm text-muted-foreground">
              {soLuongDua} {VIETNAMESE_TEXT.SO_DUA}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
});

CategoryCard.displayName = 'CategoryCard';

const DuaCategoriesView = React.memo<DuaCategoriesViewProps>(({ danhSachDanhMuc, onChonDanhMuc }) => {
  const handleChonDanhMuc = useCallback((viTri: number) => {
    onChonDanhMuc(viTri);
  }, [onChonDanhMuc]);

  const danhSachCard = useMemo(
    () =>
      danhSachDanhMuc.map((danhMuc, index) => (
        <CategoryCard key={danhMuc.ID} danhMuc={danhMuc} onChon={() => handleChonDanhMuc(index)} />
      )),
    [danhSachDanhMuc, handleChonDanhMuc]
  );

  const trangThaiTrong = useMemo(() => {
    if (danhSachDanhMuc.length > 0) return null;

    return (
      <div className="text-center py-8 px-4">
        <div className="text-4xl mb-4">📖</div>
        <h3 className="font-medium mb-2">Không có danh mục</h3>
        <p className="text-sm text-muted-foreground">Không tìm thấy danh mục dua nào</p>
      </div>
    );
  }, [danhSachDanhMuc.length]);

  return (
    <div className="p-4 space-y-4">
      {danhSachDanhMuc.length > 0 ? (
        <>
          {/* Header Info */}
          <div className="mb-4 px-2 sm:px-0">
            <p className="text-sm text-muted-foreground">{danhSachDanhMuc.length} danh mục có sẵn</p>
          </div>

          {/* Categories Grid */}
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {danhSachCard}
          </div>
        </>
      ) : (
        trangThaiTrong
      )}
    </div>
  );
});

DuaCategoriesView.displayName = 'DuaCategoriesView';

export default DuaCategoriesView;
