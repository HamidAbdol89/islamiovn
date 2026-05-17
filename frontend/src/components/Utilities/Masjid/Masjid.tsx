import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import types, constants, hooks và components
import type { MasjidViet } from './types';
import { VIETNAMESE_TEXT, MAP_URLS } from './constants';
import { useGeolocation, useMasjidData } from './hooks';
import {
  MasjidHeader,
  MasjidSearch,
  MasjidCard,
  MasjidMap,
  MasjidModal,
  LoadingState,
  ErrorState,
  EmptyState
} from './components';

/**
 * Main Masjid Locator component với Vietnamese localization và React best practices
 */
const MasjidLocator = React.memo(() => {
  // State management
  const [masjidDuocChon, setMasjidDuocChon] = useState<MasjidViet | null>(null);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState<string>('');
  const [hienThiBanDo, setHienThiBanDo] = useState<boolean>(false);

  // Custom hooks
  const { viTriNguoiDung, dangTaiViTri, loi: loiViTri, layViTriHienTai } = useGeolocation();
  const { masjids, dangTai, loi: loiMasjid, timKiemMasjidGanDay, xoaLoi } = useMasjidData();

  // Tự động hiển thị bản đồ khi có vị trí người dùng
  useEffect(() => {
    if (viTriNguoiDung && !hienThiBanDo) {
      setHienThiBanDo(true);
    }
  }, [viTriNguoiDung, hienThiBanDo]);

  // Tự động tìm kiếm masjid khi có vị trí người dùng
  useEffect(() => {
    if (viTriNguoiDung) {
      timKiemMasjidGanDay(viTriNguoiDung);
    }
  }, [viTriNguoiDung, timKiemMasjidGanDay]);

  // Memoized handlers
  const handleMasjidClick = useCallback((masjid: MasjidViet) => {
    setMasjidDuocChon(masjidDuocChon?.id === masjid.id ? null : masjid);
  }, [masjidDuocChon]);

  const handleGetDirections = useCallback((masjid: MasjidViet) => {
    const url = MAP_URLS.openStreetMap(
      masjid.lat, 
      masjid.lng, 
      viTriNguoiDung?.lat, 
      viTriNguoiDung?.lng
    );
    window.open(url, '_blank');
  }, [viTriNguoiDung]);

  const handleOpenInApp = useCallback((masjid: MasjidViet, app: string) => {
    let url = '';
    
    switch (app) {
      case 'apple':
        url = MAP_URLS.appleMaps(
          masjid.lat, 
          masjid.lng, 
          viTriNguoiDung?.lat, 
          viTriNguoiDung?.lng
        );
        break;
      case 'waze':
        url = MAP_URLS.waze(masjid.lat, masjid.lng);
        break;
      default:
        url = MAP_URLS.openStreetMap(masjid.lat, masjid.lng);
    }
    
    window.open(url, '_blank');
  }, [viTriNguoiDung]);

  const handleCloseModal = useCallback(() => {
    setMasjidDuocChon(null);
  }, []);

  const handleToggleMap = useCallback(() => {
    setHienThiBanDo(!hienThiBanDo);
  }, [hienThiBanDo]);

  const handleRetry = useCallback(() => {
    xoaLoi();
    if (viTriNguoiDung) {
      timKiemMasjidGanDay(viTriNguoiDung);
    }
  }, [viTriNguoiDung, timKiemMasjidGanDay, xoaLoi]);

  // Memoized filtered masjids
  const masjidsLoc = useMemo(() => {
    return masjids.filter(masjid =>
      masjid.ten.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
      masjid.diaChi.toLowerCase().includes(tuKhoaTimKiem.toLowerCase())
    );
  }, [masjids, tuKhoaTimKiem]);

  // Memoized results text
  const ketQuaText = useMemo(() => {
    if (masjidsLoc.length === 0) return '';
    
    const soLuong = masjidsLoc.length;
    const masjidText = soLuong === 1 ? VIETNAMESE_TEXT.masjid : `${VIETNAMESE_TEXT.masjid}s`;
    const timThayText = `${VIETNAMESE_TEXT.timThay} ${soLuong} ${masjidText}`;
    
    return tuKhoaTimKiem 
      ? `${timThayText} ${VIETNAMESE_TEXT.cho} "${tuKhoaTimKiem}"`
      : timThayText;
  }, [masjidsLoc.length, tuKhoaTimKiem]);

  // Combined error state
  const loiHienTai = loiViTri || loiMasjid;

  return (
    <div className="min-h-screen bg-background transition-smooth">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <MasjidHeader />

        {/* Control Panel */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={layViTriHienTai}
              disabled={dangTaiViTri}
              className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
            >
              {dangTaiViTri ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Navigation className="h-5 w-5" />
              )}
              <span>
                {dangTaiViTri ? VIETNAMESE_TEXT.dangLayViTri : VIETNAMESE_TEXT.layViTriHienTai}
              </span>
            </Button>
          </div>

          {/* Search Bar */}
          {viTriNguoiDung && (
            <MasjidSearch 
              tuKhoa={tuKhoaTimKiem}
              onChange={setTuKhoaTimKiem}
            />
          )}
        </div>

        {/* Current Location Info */}
        {viTriNguoiDung && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-primary" />
              <span className="text-sm text-foreground">
                {VIETNAMESE_TEXT.viTriHienTai}: {viTriNguoiDung.lat.toFixed(6)}, {viTriNguoiDung.lng.toFixed(6)}
              </span>
            </div>
          </div>
        )}

        {/* Map Component */}
        <MasjidMap
          hienThi={hienThiBanDo}
          onToggle={handleToggleMap}
          masjids={masjidsLoc}
          masjidDuocChon={masjidDuocChon}
          viTriNguoiDung={viTriNguoiDung}
        />

        {/* Error State */}
        {loiHienTai && (
          <ErrorState 
            message={loiHienTai} 
            onRetry={handleRetry}
          />
        )}

        {/* Loading State */}
        {dangTai && (
          <LoadingState message={VIETNAMESE_TEXT.dangTimKiemMasjid} />
        )}

        {/* Results Counter */}
        {!dangTai && masjidsLoc.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {ketQuaText}
            </p>
          </div>
        )}

        {/* Masjid List */}
        {!dangTai && masjidsLoc.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {masjidsLoc.map((masjid) => (
              <MasjidCard
                key={masjid.id}
                masjid={masjid}
                duocChon={masjidDuocChon?.id === masjid.id}
                onClick={() => handleMasjidClick(masjid)}
                onGetDirections={handleGetDirections}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!dangTai && viTriNguoiDung && masjidsLoc.length === 0 && !loiHienTai && (
          <EmptyState
            title={VIETNAMESE_TEXT.khongTimThayMasjid}
            description={
              tuKhoaTimKiem
                ? VIETNAMESE_TEXT.thuTuKhoaKhac
                : VIETNAMESE_TEXT.khongCoMasjidTrongBanKinh
            }
          />
        )}

        {/* Welcome State */}
        {!viTriNguoiDung && !loiHienTai && (
          <div className="text-center py-14 px-4">
            <div className="p-5 bg-primary/10 rounded-full w-24 h-24 mx-auto mb-6 shadow-luxury flex items-center justify-center">
              <span className="text-4xl">🕌</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {VIETNAMESE_TEXT.assalamuAlaikum}
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto mb-4">
              {VIETNAMESE_TEXT.moTaChaoMung}
            </p>
            <p className="text-sm text-muted-foreground italic">
              {VIETNAMESE_TEXT.nguonDuLieu}
            </p>
          </div>
        )}
      </div>



      {/* Modal */}
      <MasjidModal
        masjid={masjidDuocChon}
        onClose={handleCloseModal}
        onGetDirections={handleGetDirections}
        onOpenInApp={handleOpenInApp}
        viTriNguoiDung={viTriNguoiDung}
      />
    </div>
  );
});

MasjidLocator.displayName = 'MasjidLocator';

export default MasjidLocator;
