import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Import types and constants
import { DuaView, DuaSource } from './types';
import type { KetQuaTimKiem } from './types';
import { VIETNAMESE_TEXT, AUDIO_SETTINGS } from './constants';

// Import hooks
import { 
  useDuaData, 
  useDuaPlayer, 
  useDuaSettings, 
  useDuaFavorites 
} from './hooks';

// Import components
import {
  DuaHeader,
  DuaNavigation,
  DuaSearch,
  DuaCategoriesView,
  DuaFavoritesView,
  DuaContentView,
  DuaBottomControls
} from './components';
import DuaSourceSelector from './DuaSourceSelector';

const Dua: React.FC = () => {
  // Core states
  const [viewHienTai, setViewHienTai] = useState<DuaView>(DuaView.CHON_NGUON);
  const [viTriDanhMucHienTai, setViTriDanhMucHienTai] = useState<number | null>(null);
  const [viTriDuaHienTai, setViTriDuaHienTai] = useState(0);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
  const [ketQuaTimKiem, setKetQuaTimKiem] = useState<KetQuaTimKiem[]>([]);
  const [hienThiTimKiem, setHienThiTimKiem] = useState(false);
  const [hienThiCaiDat, setHienThiCaiDat] = useState(false);
  
  // Custom hooks
  const { caiDat, capNhatCaiDat } = useDuaSettings();
  const { duLieu, dangTai, loi, timKiem } = useDuaData(caiDat.nguonDuaHienTai);
  const { 
    danhSachYeuThichChiTiet, 
    soLuongYeuThich, 
    toggleYeuThich, 
    laYeuThich 
  } = useDuaFavorites(duLieu);
  const {
    audioRef,
    trangThaiPlayer,
    togglePhat,
    xuLyBatDauPhat,
    xuLyTamDung,
    xuLyKetThuc,
    xuLyCapNhatThoiGian,
    xuLyLoi
  } = useDuaPlayer();

  // Get current data
  const danhMucHienTai = viTriDanhMucHienTai !== null && duLieu ? duLieu.Vietnamese[viTriDanhMucHienTai] : null;
  const duaHienTai = danhMucHienTai?.TEXT[viTriDuaHienTai];

  // Search effect
  useEffect(() => {
    if (!tuKhoaTimKiem.trim()) {
      setKetQuaTimKiem([]);
      return;
    }
    
    const ketQua = timKiem(tuKhoaTimKiem);
    setKetQuaTimKiem(ketQua);
  }, [tuKhoaTimKiem, timKiem]);

  // Memoized handlers
  const handleChonNguonDua = useCallback((nguon: DuaSource) => {
    capNhatCaiDat({ nguonDuaHienTai: nguon });
  }, [capNhatCaiDat]);

  const handleTiepTucTuChonNguon = useCallback(() => {
    setViewHienTai(DuaView.DANH_MUC);
  }, []);

  const handleQuayLai = useCallback(() => {
    if (viewHienTai === DuaView.DUA) {
      setViewHienTai(DuaView.DANH_MUC);
    } else if (viewHienTai === DuaView.DANH_MUC || viewHienTai === DuaView.YEU_THICH) {
      setViewHienTai(DuaView.CHON_NGUON);
    }
  }, [viewHienTai]);

  const handleChuyenView = useCallback((view: DuaView) => {
    setViewHienTai(view);
  }, []);

  const handleChonDanhMuc = useCallback((viTriDanhMuc: number) => {
    setViTriDanhMucHienTai(viTriDanhMuc);
    setViTriDuaHienTai(0);
    setViewHienTai(DuaView.DUA);
  }, []);

  const handleChonDua = useCallback((viTriDanhMuc: number, viTriDua: number) => {
    setViTriDanhMucHienTai(viTriDanhMuc);
    setViTriDuaHienTai(viTriDua);
    setViewHienTai(DuaView.DUA);
    setHienThiTimKiem(false);
  }, []);

  const handleToggleYeuThich = useCallback(() => {
    if (viTriDanhMucHienTai !== null) {
      toggleYeuThich(viTriDanhMucHienTai, viTriDuaHienTai);
    }
  }, [viTriDanhMucHienTai, viTriDuaHienTai, toggleYeuThich]);

  const handleChiaSe = useCallback(() => {
    if (duaHienTai) {
      // Implement share functionality
      console.log('Chia sẻ dua:', duaHienTai.TRANSLATED_TEXT);
    }
  }, [duaHienTai]);

  const handleDiTruoc = useCallback(() => {
    if (viTriDuaHienTai > 0) {
      setViTriDuaHienTai(viTriDuaHienTai - 1);
    }
  }, [viTriDuaHienTai]);

  const handleDiTiep = useCallback(() => {
    if (danhMucHienTai && viTriDuaHienTai < danhMucHienTai.TEXT.length - 1) {
      setViTriDuaHienTai(viTriDuaHienTai + 1);
    }
  }, [danhMucHienTai, viTriDuaHienTai]);

  const handleTogglePhat = useCallback(() => {
    if (duaHienTai?.AUDIO) {
      togglePhat(duaHienTai.AUDIO);
    }
  }, [duaHienTai, togglePhat]);

  const handleKetThucAudio = useCallback(() => {
    if (caiDat.docLienTuc) {
      setTimeout(() => {
        handleDiTiep();
      }, AUDIO_SETTINGS.AUTO_NEXT_DELAY);
    }
  }, [caiDat.docLienTuc, handleDiTiep]);

  // Memoized computed values
  const coTheTruoc = useMemo(() => 
    viTriDuaHienTai > 0,
    [viTriDuaHienTai]
  );

  const coTheTiep = useMemo(() => 
    danhMucHienTai ? viTriDuaHienTai < danhMucHienTai.TEXT.length - 1 : false,
    [danhMucHienTai, viTriDuaHienTai]
  );

  const laYeuThichHienTai = useMemo(() => 
    viTriDanhMucHienTai !== null ? laYeuThich(viTriDanhMucHienTai, viTriDuaHienTai) : false,
    [viTriDanhMucHienTai, viTriDuaHienTai, laYeuThich]
  );

  // Loading state
  if (dangTai) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">{VIETNAMESE_TEXT.DANG_TAI}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loi) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="font-medium mb-2">{VIETNAMESE_TEXT.LOI_TAI_DU_LIEU}</h3>
          <p className="text-sm text-muted-foreground">{loi}</p>
        </div>
      </div>
    );
  }

  // Source selection view
  if (viewHienTai === DuaView.CHON_NGUON) {
    return (
      <DuaSourceSelector
        onChonNguon={(nguon) => {
          handleChonNguonDua(nguon);
          handleTiepTucTuChonNguon();
        }}
      />
    );
  }

  // No data available
  if (!duLieu) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="font-medium mb-2">Không có dữ liệu</h3>
          <p className="text-sm text-muted-foreground">Vui lòng kiểm tra lại nguồn dua</p>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="min-h-screen bg-background">
  <DuaHeader
  viewHienTai={viewHienTai}
  danhMucHienTai={danhMucHienTai}
  viTriDuaHienTai={viTriDuaHienTai}
  tongSoDua={danhMucHienTai?.TEXT.length || 0}
  hienThiTimKiem={hienThiTimKiem}
  hienThiCaiDat={hienThiCaiDat}
  caiDat={caiDat}                    // ← Thêm dòng này
  onQuayLai={handleQuayLai}
  onToggleTimKiem={() => setHienThiTimKiem(!hienThiTimKiem)}
  onToggleCaiDat={setHienThiCaiDat}
  onThayDoiCaiDat={capNhatCaiDat}    // ← Thêm dòng này
/>
      <DuaNavigation
        viewHienTai={viewHienTai}
        soLuongDanhMuc={duLieu?.Vietnamese?.length || 0}
        soLuongYeuThich={soLuongYeuThich}
        onChuyenView={handleChuyenView}
      />
      
      {viewHienTai === DuaView.DANH_MUC && duLieu && (
        <DuaCategoriesView
          danhSachDanhMuc={duLieu.Vietnamese}
          onChonDanhMuc={handleChonDanhMuc}
        />
      )}
      
      {viewHienTai === DuaView.YEU_THICH && (
        <DuaFavoritesView
          danhSachYeuThich={danhSachYeuThichChiTiet}
          onChonDua={handleChonDua}
        />
      )}
      
      {viewHienTai === DuaView.DUA && duaHienTai && (
        <DuaContentView
          dua={duaHienTai}
          coChuPhong={caiDat.coChuPhong}
          laYeuThich={laYeuThichHienTai}
          onToggleYeuThich={handleToggleYeuThich}
          onChiaSe={handleChiaSe}
        />
      )}
      
      {viewHienTai === DuaView.DUA && (
        <DuaBottomControls
          trangThaiPlayer={trangThaiPlayer}
          coTheTruoc={coTheTruoc}
          coTheTiep={coTheTiep}
          docLienTuc={caiDat.docLienTuc}
          onTruoc={handleDiTruoc}
          onTiep={handleDiTiep}
          onTogglePhat={handleTogglePhat}
          onToggleTatTieng={() => {}}
          onToggleDocLienTuc={() => capNhatCaiDat({ docLienTuc: !caiDat.docLienTuc })}
        />
      )}
      
      <DuaSearch
        hienThi={hienThiTimKiem}
        tuKhoaTimKiem={tuKhoaTimKiem}
        ketQuaTimKiem={ketQuaTimKiem}
        onDong={() => setHienThiTimKiem(false)}
        onThayDoiTuKhoa={setTuKhoaTimKiem}
        onChonKetQua={handleChonDua}
      />

      {/* Audio Element */}
      {duaHienTai?.AUDIO && duaHienTai.AUDIO.trim() !== '' && (
        <audio
          ref={audioRef}
          src={duaHienTai.AUDIO}
          onEnded={() => xuLyKetThuc(handleKetThucAudio)}
          onLoadStart={() => {}}
          onError={xuLyLoi}
          onPlay={xuLyBatDauPhat}
          onPause={xuLyTamDung}
          onTimeUpdate={xuLyCapNhatThoiGian}
        />
      )}
    </div>
  );
};

export default Dua;
