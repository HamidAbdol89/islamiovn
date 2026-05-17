import React, { useCallback, useMemo } from 'react';
import { BookOpen, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { DuaView } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

interface DuaNavigationProps {
  viewHienTai: DuaView;
  soLuongDanhMuc: number;
  soLuongYeuThich: number;
  onChuyenView: (view: DuaView) => void;
}

const DuaNavigation = React.memo<DuaNavigationProps>(({
  viewHienTai,
  soLuongDanhMuc,
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
          <span className="relative pr-5">
            {VIETNAMESE_TEXT.DANH_MUC}
            <AnimatePresence>
              {soLuongDanhMuc > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 180 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                    duration: 0.6
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute -top-1 right-0 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg"
                >
                  {soLuongDanhMuc}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </Button>

        <Button
          variant={viewHienTai === DuaView.YEU_THICH ? 'default' : 'ghost'}
          onClick={handleChuyenYeuThich}
          className={classYeuThich}
          size="sm"
        >
          <Heart className="w-4 h-4" />
          <span className="relative pr-5">
            {VIETNAMESE_TEXT.YEU_THICH}
            <AnimatePresence>
              {soLuongYeuThich > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 180 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                    duration: 0.6
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute -top-1 right-0 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg"
                >
                  {soLuongYeuThich}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </Button>
      </div>
    </div>
  );
});

DuaNavigation.displayName = 'DuaNavigation';

export default DuaNavigation;
