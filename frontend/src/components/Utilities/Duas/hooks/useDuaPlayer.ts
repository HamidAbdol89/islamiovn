import { useState, useRef, useCallback, useEffect } from 'react';
import type { AudioPlayerState } from '../types';
import { AUDIO_SETTINGS } from '../constants';

export const useDuaPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trangThaiPlayer, setTrangThaiPlayer] = useState<AudioPlayerState>({
    dangPhat: false,
    amLuong: AUDIO_SETTINGS.VOLUME_DEFAULT,
    tatTieng: false,
    thoiGianHienTai: 0,
    tongThoiGian: 0
  });

  // Update audio volume when muted state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = trangThaiPlayer.tatTieng ? AUDIO_SETTINGS.VOLUME_MUTED : trangThaiPlayer.amLuong;
    }
  }, [trangThaiPlayer.tatTieng, trangThaiPlayer.amLuong]);

  // Play/Pause toggle
  const togglePhat = useCallback((urlAmThanh?: string) => {
    if (!audioRef.current) return;

    if (trangThaiPlayer.dangPhat) {
      audioRef.current.pause();
      setTrangThaiPlayer(prev => ({ ...prev, dangPhat: false }));
    } else {
      if (urlAmThanh && audioRef.current.src !== urlAmThanh) {
        audioRef.current.src = urlAmThanh;
      }
      audioRef.current.play().catch(error => {
        console.error('Lỗi phát âm thanh:', error);
        setTrangThaiPlayer(prev => ({ ...prev, dangPhat: false }));
      });
    }
  }, [trangThaiPlayer.dangPhat]);

  // Stop audio
  const dung = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setTrangThaiPlayer(prev => ({ 
        ...prev, 
        dangPhat: false, 
        thoiGianHienTai: 0 
      }));
    }
  }, []);

  // Toggle mute
  const toggleTatTieng = useCallback(() => {
    setTrangThaiPlayer(prev => ({ ...prev, tatTieng: !prev.tatTieng }));
  }, []);

  // Set volume
  const datAmLuong = useCallback((amLuong: number) => {
    const amLuongMoi = Math.max(0, Math.min(1, amLuong));
    setTrangThaiPlayer(prev => ({ ...prev, amLuong: amLuongMoi }));
    if (audioRef.current) {
      audioRef.current.volume = amLuongMoi;
    }
  }, []);

  // Load new audio
  const taiAmThanh = useCallback((urlAmThanh: string) => {
    if (audioRef.current) {
      audioRef.current.src = urlAmThanh;
      setTrangThaiPlayer(prev => ({ 
        ...prev, 
        dangPhat: false, 
        thoiGianHienTai: 0,
        tongThoiGian: 0
      }));
    }
  }, []);

  // Audio event handlers
  const xuLyBatDauPhat = useCallback(() => {
    setTrangThaiPlayer(prev => ({ ...prev, dangPhat: true }));
  }, []);

  const xuLyTamDung = useCallback(() => {
    setTrangThaiPlayer(prev => ({ ...prev, dangPhat: false }));
  }, []);

  const xuLyKetThuc = useCallback((onKetThuc?: () => void) => {
    setTrangThaiPlayer(prev => ({ 
      ...prev, 
      dangPhat: false,
      thoiGianHienTai: 0
    }));
    onKetThuc?.();
  }, []);

  const xuLyCapNhatThoiGian = useCallback(() => {
    if (audioRef.current) {
      setTrangThaiPlayer(prev => ({
        ...prev,
        thoiGianHienTai: audioRef.current?.currentTime || 0,
        tongThoiGian: audioRef.current?.duration || 0
      }));
    }
  }, []);

  const xuLyLoi = useCallback(() => {
    console.error('Lỗi tải âm thanh');
    setTrangThaiPlayer(prev => ({ ...prev, dangPhat: false }));
  }, []);

  return {
    audioRef,
    trangThaiPlayer,
    togglePhat,
    dung,
    toggleTatTieng,
    datAmLuong,
    taiAmThanh,
    xuLyBatDauPhat,
    xuLyTamDung,
    xuLyKetThuc,
    xuLyCapNhatThoiGian,
    xuLyLoi
  };
};
