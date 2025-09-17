import React, { useCallback, useMemo } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import type { KetQuaTimKiem } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

interface DuaSearchProps {
  hienThi: boolean;
  tuKhoaTimKiem: string;
  ketQuaTimKiem: KetQuaTimKiem[];
  onDong: () => void;
  onThayDoiTuKhoa: (tuKhoa: string) => void;
  onChonKetQua: (viTriDanhMuc: number, viTriDua: number) => void;
}

// Memoized Search Result Item
const SearchResultItem = React.memo<{
  ketQua: KetQuaTimKiem;
  onChon: () => void;
}>(({ ketQua, onChon }) => {
  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={onChon}
    >
      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-sm font-medium text-primary">
            {ketQua.danhMuc.TITLE}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {ketQua.dua.TRANSLATED_TEXT}
        </p>
      </CardContent>
    </Card>
  );
});

SearchResultItem.displayName = 'SearchResultItem';

const DuaSearch = React.memo<DuaSearchProps>(({
  hienThi,
  tuKhoaTimKiem,
  ketQuaTimKiem,
  onDong,
  onThayDoiTuKhoa,
  onChonKetQua
}) => {
  // Memoized handlers
  const handleDong = useCallback(() => {
    onDong();
  }, [onDong]);

  const handleThayDoiInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onThayDoiTuKhoa(e.target.value);
  }, [onThayDoiTuKhoa]);

  const handleChonKetQua = useCallback((viTriDanhMuc: number, viTriDua: number) => {
    onChonKetQua(viTriDanhMuc, viTriDua);
  }, [onChonKetQua]);

  // Memoized search results
  const danhSachKetQua = useMemo(() => 
    ketQuaTimKiem.map((ketQua, index) => (
      <SearchResultItem
        key={`${ketQua.viTriDanhMuc}-${ketQua.viTriDua}-${index}`}
        ketQua={ketQua}
        onChon={() => handleChonKetQua(ketQua.viTriDanhMuc, ketQua.viTriDua)}
      />
    )),
    [ketQuaTimKiem, handleChonKetQua]
  );

  // Memoized empty state
  const trangThaiTrong = useMemo(() => {
    if (!tuKhoaTimKiem) return null;
    
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{VIETNAMESE_TEXT.KHONG_TIM_THAY}</p>
      </div>
    );
  }, [tuKhoaTimKiem]);

  if (!hienThi) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Search Header */}
      <Card className="sticky top-0 rounded-none border-x-0 border-t-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDong}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Input
                type="text"
                placeholder={VIETNAMESE_TEXT.TIM_KIEM_DUA}
                value={tuKhoaTimKiem}
                onChange={handleThayDoiInput}
                className="pl-10"
                autoFocus
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Search Results */}
      <div className="p-4 space-y-3">
        {ketQuaTimKiem.length > 0 ? (
          <>
            <div className="mb-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                {VIETNAMESE_TEXT.KET_QUA_TIM_KIEM} ({ketQuaTimKiem.length})
              </h2>
            </div>
            {danhSachKetQua}
          </>
        ) : (
          trangThaiTrong
        )}
      </div>
    </div>
  );
});

DuaSearch.displayName = 'DuaSearch';

export default DuaSearch;
