import React, { useCallback, useMemo, useState } from 'react';
import { Plus, Minus, BarChart3, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { DuaSettings as DuaSettingsType } from '../types';
import { VIETNAMESE_TEXT, FONT_SIZE, STORAGE_KEYS } from '../constants';
import DuaStats from './DuaStats';
import DuaHistory from './DuaHistory';

interface DuaSettingsProps {
  caiDat?: DuaSettingsType;
  onThayDoiCaiDat?: (caiDat: Partial<DuaSettingsType>) => void;
  onClose?: () => void;
}

const DuaSettings = React.memo<DuaSettingsProps>(({
  caiDat,
  onThayDoiCaiDat,
}) => {
  // Dialog states
  const [hienThiThongKe, setHienThiThongKe] = useState(false);
  const [hienThiLichSu, setHienThiLichSu] = useState(false);
  // Get settings from localStorage if not provided
  const caiDatHienTai = useMemo(() => {
    if (caiDat) return caiDat;
    
    return {
      coChuPhong: parseInt(localStorage.getItem(STORAGE_KEYS.CO_CHU_PHONG) || FONT_SIZE.DEFAULT.toString()),
      tuDongPhat: localStorage.getItem(STORAGE_KEYS.TU_DONG_PHAT) === 'true',
      docLienTuc: localStorage.getItem(STORAGE_KEYS.DOC_LIEN_TUC) === 'true',
      amThanh: localStorage.getItem(STORAGE_KEYS.TAT_TIENG) !== 'true'
    } as DuaSettingsType;
  }, [caiDat]);

  // Memoized handlers
  const handleThayDoiCoChu = useCallback((coChuMoi: number) => {
    localStorage.setItem(STORAGE_KEYS.CO_CHU_PHONG, coChuMoi.toString());
    onThayDoiCaiDat?.({ coChuPhong: coChuMoi });
  }, [onThayDoiCaiDat]);

  const handleGiamCoChu = useCallback(() => {
    const coChutMoi = Math.max(FONT_SIZE.MIN, caiDatHienTai.coChuPhong - FONT_SIZE.STEP);
    handleThayDoiCoChu(coChutMoi);
  }, [caiDatHienTai.coChuPhong, handleThayDoiCoChu]);

  const handleTangCoChu = useCallback(() => {
    const coChutMoi = Math.min(FONT_SIZE.MAX, caiDatHienTai.coChuPhong + FONT_SIZE.STEP);
    handleThayDoiCoChu(coChutMoi);
  }, [caiDatHienTai.coChuPhong, handleThayDoiCoChu]);

  const handleThayDoiTuDongPhat = useCallback((tuDongPhat: boolean) => {
    localStorage.setItem(STORAGE_KEYS.TU_DONG_PHAT, tuDongPhat.toString());
    onThayDoiCaiDat?.({ tuDongPhat });
  }, [onThayDoiCaiDat]);

  const handleThayDoiDocLienTuc = useCallback((docLienTuc: boolean) => {
    localStorage.setItem(STORAGE_KEYS.DOC_LIEN_TUC, docLienTuc.toString());
    onThayDoiCaiDat?.({ docLienTuc });
  }, [onThayDoiCaiDat]);

  const handleSliderChange = useCallback((value: number[]) => {
    handleThayDoiCoChu(value[0]);
  }, [handleThayDoiCoChu]);

  // Memoized disabled states
  const coTheGiamCoChu = useMemo(() => 
    caiDatHienTai.coChuPhong > FONT_SIZE.MIN,
    [caiDatHienTai.coChuPhong]
  );

  const coTheTangCoChu = useMemo(() => 
    caiDatHienTai.coChuPhong < FONT_SIZE.MAX,
    [caiDatHienTai.coChuPhong]
  );

  return (
    <>
      <ScrollArea className="h-[calc(100vh-120px)] pr-4">
        <div className="space-y-6 p-4">
      {/* Font Size Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-base font-medium">{VIETNAMESE_TEXT.CO_CHU_PHONG}</Label>
          <p className="text-sm text-muted-foreground">
            {VIETNAMESE_TEXT.DIEU_CHINH_CO_CHU}
          </p>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleGiamCoChu}
                disabled={!coTheGiamCoChu}
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <div className="flex-1 space-y-2">
                <Slider
                  value={[caiDatHienTai.coChuPhong]}
                  onValueChange={handleSliderChange}
                  max={FONT_SIZE.MAX}
                  min={FONT_SIZE.MIN}
                  step={FONT_SIZE.STEP}
                  className="w-full"
                />
                <div className="text-center">
                  <span className="text-sm font-medium">{caiDatHienTai.coChuPhong}px</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleTangCoChu}
                disabled={!coTheTangCoChu}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Audio Settings */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-base font-medium">{VIETNAMESE_TEXT.CAI_DAT_AM_THANH}</Label>
          <p className="text-sm text-muted-foreground">
            {VIETNAMESE_TEXT.CAU_HINH_PHAT_AM_THANH}
          </p>
        </div>
        
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">{VIETNAMESE_TEXT.TU_DONG_PHAT}</Label>
                <p className="text-xs text-muted-foreground">
                  Tự động phát âm thanh khi dua được tải
                </p>
              </div>
              <Switch
                checked={caiDatHienTai.tuDongPhat}
                onCheckedChange={handleThayDoiTuDongPhat}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">{VIETNAMESE_TEXT.DOC_LIEN_TUC}</Label>
                <p className="text-xs text-muted-foreground">
                  Tự động chuyển sang dua tiếp theo sau khi âm thanh kết thúc
                </p>
              </div>
              <Switch
                checked={caiDatHienTai.docLienTuc}
                onCheckedChange={handleThayDoiDocLienTuc}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Quick Actions */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-base font-medium">{VIETNAMESE_TEXT.HANH_DONG_NHANH}</Label>
          <p className="text-sm text-muted-foreground">
            {VIETNAMESE_TEXT.TRUY_CAP_TINH_NANG_BO_SUNG}
          </p>
          </div>
        
        <div className="grid grid-cols-1 gap-3">
<Button
  variant="outline"
  onClick={() => setHienThiThongKe(true)}
  className="h-auto p-4 justify-start"
>
  <BarChart3 className="w-5 h-5 mr-3" />
  <div className="text-left">
    <div className="font-medium">{VIETNAMESE_TEXT.THONG_KE_DOC}</div>
    <div className="text-sm text-muted-foreground">{VIETNAMESE_TEXT.XEM_TIEN_DO_DOC}</div>
  </div>
</Button>

<Button
  variant="outline"
  onClick={() => setHienThiLichSu(true)}
  className="h-auto p-4 justify-start"
>
  <History className="w-5 h-5 mr-3" />
  <div className="text-left">
    <div className="font-medium">{VIETNAMESE_TEXT.LICH_SU_DOC}</div>
    <div className="text-sm text-muted-foreground">{VIETNAMESE_TEXT.XEM_DUA_DA_DOC}</div>
  </div>
</Button>

        </div>
      </div>
        </div>
      </ScrollArea>

      {/* Stats Dialog */}
      <Dialog open={hienThiThongKe} onOpenChange={setHienThiThongKe}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thống kê đọc</DialogTitle>
          </DialogHeader>
          <DuaStats />
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={hienThiLichSu} onOpenChange={setHienThiLichSu}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lịch sử đọc</DialogTitle>
          </DialogHeader>
          <DuaHistory />
        </DialogContent>
      </Dialog>
    </>
  );
});

DuaSettings.displayName = 'DuaSettings';

export default DuaSettings;
