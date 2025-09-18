// Toast utilities for easy usage across the app
// This provides a clean API similar to Sonner but using shadcn/ui Toast

import { toastSonnerCompat } from '@/hooks/use-toast';

// Default duration for toasts (5 seconds)
const DEFAULT_TOAST_DURATION = 5000;

// Export the main toast function with all helpers
export const toast = toastSonnerCompat;

// Helper functions to match Sonner API
const toastHelpers = {
  success: (title: string, options?: { description?: string; duration?: number }) => {
    const toastInstance = toast({
      title,
      description: options?.description,
      variant: "success",
    });
    
    // Handle custom duration
    if (options?.duration && options.duration !== DEFAULT_TOAST_DURATION) {
      setTimeout(() => {
        toastInstance.dismiss();
      }, options.duration);
    }
    
    return toastInstance;
  },
  
  error: (title: string, options?: { description?: string; duration?: number }) => {
    const toastInstance = toast({
      title,
      description: options?.description,
      variant: "destructive",
    });
    
    // Handle custom duration
    if (options?.duration && options.duration !== DEFAULT_TOAST_DURATION) {
      setTimeout(() => {
        toastInstance.dismiss();
      }, options.duration);
    }
    
    return toastInstance;
  },
  
  info: (title: string, options?: { description?: string; duration?: number }) => {
    const toastInstance = toast({
      title,
      description: options?.description,
      variant: "info",
    });
    
    // Handle custom duration
    if (options?.duration && options.duration !== DEFAULT_TOAST_DURATION) {
      setTimeout(() => {
        toastInstance.dismiss();
      }, options.duration);
    }
    
    return toastInstance;
  },
  
  warning: (title: string, options?: { description?: string; duration?: number }) => {
    const toastInstance = toast({
      title,
      description: options?.description,
      variant: "warning",
    });
    
    // Handle custom duration
    if (options?.duration && options.duration !== DEFAULT_TOAST_DURATION) {
      setTimeout(() => {
        toastInstance.dismiss();
      }, options.duration);
    }
    
    return toastInstance;
  }
};

// Also export individual helpers for convenience
export const {
  success: toastSuccess,
  error: toastError,
  info: toastInfo,
  warning: toastWarning
} = toastHelpers;

// Export useToast hook for components that need more control
export { useToast } from '@/hooks/use-toast';

// Common toast patterns for the app
export const toastPatterns = {
  // Authentication toasts
  loginRequired: () => toast.error('🔐 Vui lòng đăng nhập để sử dụng tính năng này', {
    description: 'Đăng nhập để trải nghiệm đầy đủ tính năng',
    duration: 4000
  }),
  
  loginSuccess: (userName?: string) => toast.success(
    `🌟 Assalamu alaikum ${userName || 'bạn'}!`, 
    { description: 'Chào mừng bạn trở lại Muslim Việt', duration: 3000 }
  ),
  
  logoutSuccess: () => toast.info('👋 Đã đăng xuất thành công', { 
    description: 'Hẹn gặp lại bạn!', 
    duration: 2000 
  }),
  
  // Islamic-themed toasts
  favoriteAdded: (itemName: string) => toast.success(`❤️ Đã thêm ${itemName} vào yêu thích`, {
    description: 'Bạn có thể xem lại trong danh sách yêu thích',
    duration: 2000
  }),
  
  favoriteRemoved: (itemName: string) => toast.info(`💔 Đã bỏ ${itemName} khỏi yêu thích`, {
    duration: 1500
  }),
  
  prayerTime: (prayer: string) => toast.info(`🕌 Đến giờ ${prayer}`, {
    description: 'Hãy dành thời gian để cầu nguyện',
    duration: 5000
  }),
  
  // API toasts
  apiError: (message?: string) => toast.error(
    '⚠️ Có lỗi xảy ra', 
    { description: message || 'Vui lòng thử lại sau', duration: 4000 }
  ),
  
  saveSuccess: () => toast.success('✅ Đã lưu thành công!', { 
    description: 'Thông tin đã được cập nhật',
    duration: 2000 
  }),
  
  copySuccess: () => toast.success('📋 Đã sao chép vào clipboard', { 
    description: 'Bạn có thể dán ở nơi khác',
    duration: 1500 
  }),
  
  shareSuccess: () => toast.success('🔗 Đã chia sẻ thành công', { 
    description: 'Link đã được tạo và sao chép',
    duration: 2000 
  }),
  
  // Loading toasts (for long operations)
  loading: (message: string = 'Đang xử lý...') => toast.info(`⏳ ${message}`, { 
    description: 'Vui lòng chờ trong giây lát',
    duration: 10000 
  }),
  
  // Network toasts
  networkError: () => toast.error('🌐 Lỗi kết nối mạng', {
    description: 'Vui lòng kiểm tra kết nối internet của bạn',
    duration: 5000
  }),
  
  offline: () => toast.warning('📱 Bạn đang offline', {
    description: 'Một số tính năng có thể không hoạt động',
    duration: 5000
  }),
  
  // Islamic content toasts
  bookmarkAdded: () => toast.success('🔖 Đã thêm bookmark', {
    description: 'Bạn có thể xem lại trong mục đã lưu',
    duration: 2000
  }),
  
  duaCompleted: () => toast.success('🤲 Đã hoàn thành dua', {
    description: 'Mong Allah chấp nhận lời cầu nguyện của bạn',
    duration: 3000
  }),
  
  qiblaFound: () => toast.success('🧭 Đã tìm thấy hướng Qibla', {
    description: 'Hướng về Kaaba để cầu nguyện',
    duration: 3000
  })
};
