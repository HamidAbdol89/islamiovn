# Google Authentication Setup Guide

## Tổng quan
Ứng dụng Muslim Việt đã được tích hợp tính năng đăng nhập Google với giao diện tiếng Việt và tối ưu hóa hiệu suất.

## Tính năng đã triển khai

### 🔐 **AuthContext & Hooks**
- **AuthProvider**: Context provider quản lý trạng thái authentication
- **useAuth**: Hook để sử dụng authentication trong components
- **Mock Google Auth**: Hệ thống mô phỏng cho development

### 🎨 **UI Components**
- **GoogleLogin**: Component chính với giao diện tiếng Việt
- **UserProfile**: Hiển thị thông tin user đã đăng nhập
- **AccountSection**: Section tài khoản trong Setting page

### 📱 **Tính năng**
- Đăng nhập/đăng xuất Google
- Lưu trữ thông tin user trong localStorage
- Hiển thị avatar, tên, email
- Xác thực email với badge
- Toast notifications tiếng Việt
- Responsive design

## Cấu trúc Files

```
src/
├── context/
│   └── AuthContext.tsx           # Authentication context
├── Pages/Setting/components/
│   ├── GoogleLogin.tsx          # Google login component
│   ├── AccountSection.tsx       # Account section
│   ├── types.ts                 # Authentication types
│   └── constants.ts             # Vietnamese constants
└── main.tsx                     # AuthProvider integration
```

## Cách sử dụng

### 1. Trong Setting Page
```tsx
import { AccountSection } from './components';

// AccountSection đã được tích hợp vào Setting.tsx
<AccountSection />
```

### 2. Sử dụng useAuth Hook
```tsx
import { useAuth } from '@/context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Xin chào, {user?.name}!</p>
      ) : (
        <button onClick={login}>Đăng nhập</button>
      )}
    </div>
  );
};
```

## Cấu hình Production

### Environment Variables (.env)
```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
```

### Google Cloud Console Setup
1. Tạo project tại [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Tạo OAuth 2.0 credentials
4. Thêm authorized redirect URIs
5. Copy Client ID và Client Secret vào .env

### Production Implementation
Thay thế `mockGoogleAuth` trong `AuthContext.tsx` bằng Google Auth Library:

```tsx
import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
  scopes: ['profile', 'email'],
  credentials: {
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  }
});
```

## Tính năng hiện tại

### ✅ **Đã hoàn thành**
- [x] Authentication context với TypeScript
- [x] Google login component với UI tiếng Việt
- [x] User profile display
- [x] localStorage persistence
- [x] Toast notifications
- [x] Responsive design
- [x] Error handling
- [x] Loading states
- [x] Integration với Setting page

### 🔄 **Development Mode**
- Mock authentication cho testing
- Fake user data
- Simulated API delays
- Local storage persistence

### 🚀 **Production Ready**
- Cấu trúc sẵn sàng cho Google OAuth thật
- Environment variables support
- Error handling comprehensive
- Performance optimized với React.memo
- Vietnamese localization hoàn chỉnh

## Testing

Để test tính năng:
1. Mở Setting page
2. Scroll đến section "Tài khoản"
3. Click "Đăng nhập Google"
4. Xem thông tin user hiển thị
5. Test đăng xuất

## Notes

- Hiện tại sử dụng mock data cho development
- Cần cấu hình Google OAuth cho production
- Tất cả text đã được Việt hóa
- Tối ưu performance với memoization
- Tương thích với theme system hiện tại
