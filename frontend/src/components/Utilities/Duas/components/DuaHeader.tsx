import React, { useCallback, useMemo } from 'react';
import { ChevronLeft, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { DuaCategoryViet } from '../types';
import { DuaView } from '../types';
import { VIETNAMESE_TEXT } from '../constants';
import DuaSettings from './DuaSettings';

interface DuaHeaderProps {
  viewHienTai: DuaView;
  danhMucHienTai: DuaCategoryViet | null;
  viTriDuaHienTai: number;
  tongSoDua: number;
  hienThiTimKiem: boolean;
  hienThiCaiDat: boolean;
  caiDat?: any; // Settings object
  onQuayLai: () => void;
  onToggleTimKiem: () => void;
  onToggleCaiDat: (show: boolean) => void;
  onThayDoiCaiDat?: (caiDat: any) => void;
}

const DuaHeader = React.memo<DuaHeaderProps>(({
  viewHienTai,
  danhMucHienTai,
  viTriDuaHienTai,
  tongSoDua,
  // hienThiTimKiem, // unused for now
  hienThiCaiDat,
  caiDat,
  onQuayLai,
  onToggleTimKiem,
  onToggleCaiDat,
  onThayDoiCaiDat
}) => {
  // Memoized handlers
  const handleQuayLai = useCallback(() => {
    onQuayLai();
  }, [onQuayLai]);

  const handleToggleTimKiem = useCallback(() => {
    onToggleTimKiem();
  }, [onToggleTimKiem]);

  const handleToggleCaiDat = useCallback((show: boolean) => {
    onToggleCaiDat(show);
  }, [onToggleCaiDat]);

  const handleCloseCaiDat = useCallback(() => {
    onToggleCaiDat(false);
  }, [onToggleCaiDat]);

  // Memoized title and subtitle
  const { tieuDe, phuDe } = useMemo(() => {
    switch (viewHienTai) {
      case DuaView.CHON_NGUON:
        return {
          tieuDe: VIETNAMESE_TEXT.TIEU_DE_CHON_NGUON,
          phuDe: null
        };
      case DuaView.DANH_MUC:
        return {
          tieuDe: VIETNAMESE_TEXT.TIEU_DE_DANH_MUC,
          phuDe: null
        };
      case DuaView.YEU_THICH:
        return {
          tieuDe: VIETNAMESE_TEXT.TIEU_DE_YEU_THICH,
          phuDe: null
        };
      case DuaView.TIM_KIEM:
        return {
          tieuDe: VIETNAMESE_TEXT.TIEU_DE_TIM_KIEM,
          phuDe: null
        };
      case DuaView.DUA:
        return {
          tieuDe: danhMucHienTai?.TITLE || VIETNAMESE_TEXT.TIEU_DE_CHINH,
          phuDe: tongSoDua > 0 ? `${viTriDuaHienTai + 1} ${VIETNAMESE_TEXT.TRANG} ${tongSoDua}` : null
        };
      default:
        return {
          tieuDe: VIETNAMESE_TEXT.TIEU_DE_CHINH,
          phuDe: null
        };
    }
  }, [viewHienTai, danhMucHienTai, viTriDuaHienTai, tongSoDua]);


  return (
    <Card className="sticky top-0 z-20 rounded-none border-x-0 border-t-0">
      <CardContent className="p-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuayLai}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            
           
            
            <div className="min-w-0">
              <h1 className="font-medium text-base truncate">
                {tieuDe}
              </h1>
              {phuDe && (
                <p className="text-xs text-muted-foreground truncate">
                  {phuDe}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleTimKiem}
            >
              <Search className="w-5 h-5" />
            </Button>
            
            <Sheet open={hienThiCaiDat} onOpenChange={handleToggleCaiDat}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>{VIETNAMESE_TEXT.TIEU_DE_CAI_DAT}</SheetTitle>
                </SheetHeader>
                <DuaSettings 
                  caiDat={caiDat}
                  onThayDoiCaiDat={onThayDoiCaiDat}
                  onClose={handleCloseCaiDat} 
                />              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

DuaHeader.displayName = 'DuaHeader';

export default DuaHeader;
