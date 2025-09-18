import { useCallback } from 'react';
import type { MasjidViet } from '../types';

export const useShare = () => {

  // Tạo URL với masjid ID
  const createMasjidUrl = useCallback((masjid: MasjidViet) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('masjid', masjid.id);
    return `${baseUrl}?${searchParams.toString()}`;
  }, []);

  // Main share function
  const shareMasjid = useCallback(async (masjid: MasjidViet) => {
    const masjidUrl = createMasjidUrl(masjid);
    
    const shareData: ShareData = {
      title: `🕌 ${masjid.ten}`,
      text: `Tìm hiểu về masjid ${masjid.ten} tại ${masjid.thanhPho}${masjid.moTa ? ` - ${masjid.moTa.slice(0, 100)}...` : ''}`,
      url: masjidUrl,
    };

    // Web Share API (mobile-first)
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return { success: true, method: 'native' };
      }
    } catch (error) {
      console.warn('Web Share API failed:', error);
    }

    // Fallback clipboard + toast
    try {
      const fallbackText = `🕌 ${masjid.ten}\n📍 ${masjid.diaChi}, ${masjid.thanhPho}${masjid.moTa ? `\n${masjid.moTa}` : ''}\n🔗 ${masjidUrl}`;
      await navigator.clipboard.writeText(fallbackText);
      return { success: true, method: 'clipboard' };
    } catch (error) {
      console.warn('Clipboard API failed:', error);
      return { success: false, error: 'Không thể chia sẻ' };
    }
  }, [createMasjidUrl]);

  // Generic share window helper
  const openShareWindow = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  }, []);

  const shareToFacebook = useCallback((masjid: MasjidViet) => {
    const url = encodeURIComponent(createMasjidUrl(masjid));
    const quote = encodeURIComponent(`🕌 ${masjid.ten} - ${masjid.thanhPho}`);
    openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`);
  }, [openShareWindow, createMasjidUrl]);

  const shareToTwitter = useCallback((masjid: MasjidViet) => {
    const url = encodeURIComponent(createMasjidUrl(masjid));
    const text = encodeURIComponent(`🕌 ${masjid.ten} tại ${masjid.thanhPho} #MasjidVietNam`);
    openShareWindow(`https://twitter.com/intent/tweet?url=${url}&text=${text}`);
  }, [openShareWindow, createMasjidUrl]);

  const shareToWhatsApp = useCallback((masjid: MasjidViet) => {
    const masjidUrl = createMasjidUrl(masjid);
    const text = encodeURIComponent(`🕌 *${masjid.ten}*\n📍 ${masjid.diaChi}, ${masjid.thanhPho}${masjid.moTa ? `\n${masjid.moTa}` : ''}\n🔗 ${masjidUrl}`);
    openShareWindow(`https://wa.me/?text=${text}`);
  }, [openShareWindow, createMasjidUrl]);

  const shareToTelegram = useCallback((masjid: MasjidViet) => {
    const url = encodeURIComponent(createMasjidUrl(masjid));
    const text = encodeURIComponent(`🕌 ${masjid.ten} - ${masjid.thanhPho}`);
    openShareWindow(`https://t.me/share/url?url=${url}&text=${text}`);
  }, [openShareWindow, createMasjidUrl]);

  const shareToLinkedIn = useCallback((masjid: MasjidViet) => {
    const url = encodeURIComponent(createMasjidUrl(masjid));
    openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
  }, [openShareWindow, createMasjidUrl]);

  const shareViaEmail = useCallback((masjid: MasjidViet) => {
    const masjidUrl = createMasjidUrl(masjid);
    const subject = encodeURIComponent(`🕌 ${masjid.ten} tại ${masjid.thanhPho}`);
    const body = encodeURIComponent(`Tìm hiểu về masjid ${masjid.ten} tại ${masjid.thanhPho}\n${masjidUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [createMasjidUrl]);

  const copyLink = useCallback(async (masjid?: MasjidViet) => {
    try {
      const url = masjid ? createMasjidUrl(masjid) : window.location.href;
      await navigator.clipboard.writeText(url);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Không thể sao chép link' };
    }
  }, [createMasjidUrl]);


  return {
    shareMasjid,
    shareToFacebook,
    shareToTwitter,
    shareToWhatsApp,
    shareToTelegram,
    shareToLinkedIn,
    shareViaEmail,
    copyLink,
    createMasjidUrl,
  };
};