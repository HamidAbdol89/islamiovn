// Custom hook for sharing masjid information
import { useCallback } from 'react';
import type { MasjidViet } from '../types';

export const useShare = () => {
  // Share masjid via Web Share API or fallback
  const shareMasjid = useCallback(async (masjid: MasjidViet) => {
    const shareData = {
      title: `🕌 ${masjid.ten}`,
      text: `Tìm hiểu về masjid ${masjid.ten} tại ${masjid.thanhPho}${masjid.moTa ? ` - ${masjid.moTa.slice(0, 100)}...` : ''}`,
      url: window.location.href
    };

    try {
      // Try Web Share API first (mobile browsers)
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return { success: true, method: 'native' };
      }
    } catch (error) {
      console.warn('Web Share API failed:', error);
    }

    // Fallback to clipboard
    try {
      const shareText = `🕌 ${masjid.ten}\n📍 ${masjid.diaChi}, ${masjid.thanhPho}\n${masjid.moTa ? `\n${masjid.moTa}\n` : ''}\n🔗 ${window.location.href}`;
      
      await navigator.clipboard.writeText(shareText);
      return { success: true, method: 'clipboard' };
    } catch (error) {
      console.warn('Clipboard API failed:', error);
      return { success: false, error: 'Không thể chia sẻ' };
    }
  }, []);

  // Share via specific platforms
  const shareToFacebook = useCallback((masjid: MasjidViet) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`🕌 ${masjid.ten} - ${masjid.thanhPho}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
  }, []);

  const shareToTwitter = useCallback((masjid: MasjidViet) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`🕌 ${masjid.ten} tại ${masjid.thanhPho} #MasjidVietNam`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  }, []);

  const shareToWhatsApp = useCallback((masjid: MasjidViet) => {
    const text = encodeURIComponent(`🕌 *${masjid.ten}*\n📍 ${masjid.diaChi}, ${masjid.thanhPho}\n${masjid.moTa ? `\n${masjid.moTa}\n` : ''}\n🔗 ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }, []);

  const shareToTelegram = useCallback((masjid: MasjidViet) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`🕌 ${masjid.ten} - ${masjid.thanhPho}`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  }, []);

  // Copy link to clipboard
  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Không thể sao chép link' };
    }
  }, []);

  return {
    shareMasjid,
    shareToFacebook,
    shareToTwitter,
    shareToWhatsApp,
    shareToTelegram,
    copyLink
  };
};
