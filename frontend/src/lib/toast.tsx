import { toast } from 'sonner';

export { toast };

// Common toast patterns cho app
export const toastPatterns = {
  loginRequired: () =>
    toast('🔐 Đăng nhập để sử dụng tính năng này', {
      duration: 8000,
      action: {
        label: 'Đăng nhập',
        onClick: () => window.dispatchEvent(new CustomEvent('triggerGoogleLogin')),
      },
    }),

  loginSuccess: (userName?: string) =>
    toast.success(`🌟 Assalamu alaikum ${userName || 'bạn'}!`, {
      description: 'Chào mừng bạn trở lại Islam.io.vn',
      duration: 3000,
    }),

  logoutSuccess: () =>
    toast.info('👋 Đã đăng xuất thành công', {
      description: 'Hẹn gặp lại bạn!',
      duration: 2000,
    }),

  favoriteAdded: (itemName: string) =>
    toast.success(`❤️ Đã thêm ${itemName} vào yêu thích`, {
      description: 'Bạn có thể xem lại trong danh sách yêu thích',
      duration: 2000,
    }),

  favoriteRemoved: (itemName: string) =>
    toast.info(`💔 Đã bỏ ${itemName} khỏi yêu thích`, { duration: 1500 }),

  prayerTime: (prayer: string) =>
    toast.info(`🕌 Đến giờ ${prayer}`, {
      description: 'Hãy dành thời gian để cầu nguyện',
      duration: 5000,
    }),

  apiError: (message?: string) =>
    toast.error('⚠️ Có lỗi xảy ra', {
      description: message || 'Vui lòng thử lại sau',
      duration: 4000,
    }),

  saveSuccess: () =>
    toast.success('✅ Đã lưu thành công!', {
      description: 'Thông tin đã được cập nhật',
      duration: 2000,
    }),

  copySuccess: () =>
    toast.success('📋 Đã sao chép vào clipboard', {
      description: 'Bạn có thể dán ở nơi khác',
      duration: 1500,
    }),

  shareSuccess: () =>
    toast.success('🔗 Đã chia sẻ thành công', {
      description: 'Link đã được tạo và sao chép',
      duration: 2000,
    }),

  loading: (message = 'Đang xử lý...') =>
    toast.loading(`⏳ ${message}`, {
      description: 'Vui lòng chờ trong giây lát',
    }),

  networkError: () =>
    toast.error('🌐 Lỗi kết nối mạng', {
      description: 'Vui lòng kiểm tra kết nối internet của bạn',
      duration: 5000,
    }),

  offline: () =>
    toast.warning('📱 Bạn đang offline', {
      description: 'Một số tính năng có thể không hoạt động',
      duration: 5000,
    }),

  bookmarkAdded: () =>
    toast.success('🔖 Đã thêm bookmark', {
      description: 'Bạn có thể xem lại trong mục đã lưu',
      duration: 2000,
    }),

  duaCompleted: () =>
    toast.success('🤲 Đã hoàn thành dua', {
      description: 'Mong Allah chấp nhận lời cầu nguyện của bạn',
      duration: 3000,
    }),

  qiblaFound: () =>
    toast.success('🧭 Đã tìm thấy hướng Qibla', {
      description: 'Hướng về Kaaba để cầu nguyện',
      duration: 3000,
    }),
};
