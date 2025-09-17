import React, { useCallback, useMemo } from 'react';
import { BookOpen, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DuaView } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

interface DuaNavigationProps {
  viewHienTai: DuaView;
  soLuongYeuThich: number;
  onChuyenView: (view: DuaView) => void;
}

const DuaNavigation = React.memo<DuaNavigationProps>(({
  viewHienTai,
  soLuongYeuThich,
  onChuyenView
}) => {
  const handleChuyenDanhMuc = useCallback(() => onChuyenView(DuaView.DANH_MUC), [onChuyenView]);
  const handleChuyenYeuThich = useCallback(() => onChuyenView(DuaView.YEU_THICH), [onChuyenView]);

  const classDanhMuc = useMemo(() => 
    `flex-1 h-9 font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1`,
    []
  );

  const classYeuThich = useMemo(() => 
    `flex-1 h-9 font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1`,
    []
  );

  if (viewHienTai === DuaView.DUA) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-background border-t px-2 py-2">
      <div className="flex gap-2">
        <Button
          variant={viewHienTai === DuaView.DANH_MUC ? 'default' : 'ghost'}
          onClick={handleChuyenDanhMuc}
          className={classDanhMuc}
          size="sm"
        >
          <BookOpen className="w-4 h-4" />
          {VIETNAMESE_TEXT.DANH_MUC}
        </Button>

        <Button
          variant={viewHienTai === DuaView.YEU_THICH ? 'default' : 'ghost'}
          onClick={handleChuyenYeuThich}
          className={classYeuThich}
          size="sm"
        >
          <Heart className="w-4 h-4" />
          {VIETNAMESE_TEXT.YEU_THICH}
          {soLuongYeuThich > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-primary/20 rounded-full">
              {soLuongYeuThich}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
});

DuaNavigation.displayName = 'DuaNavigation';

export default DuaNavigation;
