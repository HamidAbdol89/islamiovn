import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Moon } from 'lucide-react';

const Setting: React.FC = () => {
  const { theme } = useTheme(); // Lấy chủ đề hiện tại từ context

  return (
    <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="flex justify-center mb-6">
        <img src="/logo.png" alt="Biểu tượng" className="h-32 w-auto" />
      </div>

      {/* Phần Tùy chỉnh */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Tùy chỉnh</h2>
        <div className="space-y-2">
          <button className={`w-full flex justify-between items-center p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
            <div className="flex items-center">
              <Moon className="mr-2 w-5 h-5" />
              <span>Chủ đề</span>
            </div>
            <ThemeToggle /> {/* Thêm nút chuyển đổi chủ đề ở đây */}
          </button>
          <button className={`w-full flex justify-between items-center p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
            <div className="flex items-center">
              <span className="mr-2">🌐</span>
              <span>Ngôn ngữ</span>
            </div>
            <span>{'>'}</span>
          </button>
        </div>
      </div>

      {/* Phần Chung */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Chung</h2>
        <div className="space-y-2">
          <button className={`w-full flex justify-between items-center p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
            <div className="flex items-center">
              <span className="mr-2">📍</span>
              <span>Vị trí & Phương pháp tính</span>
            </div>
            <span>{'>'}</span>
          </button>
          <button className={`w-full flex justify-between items-center p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
            <div className="flex items-center">
              <Moon className="mr-2 w-5 h-5" />
              <span>Điều chỉnh lịch Hồi giáo</span>
            </div>
            <span>{'>'}</span>
          </button>
          <button className={`w-full flex justify-between items-center p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
            <div className="flex items-center">
              <span className="mr-2">🔔</span>
              <span>Loại nhắc nhở</span>
            </div>
            <span className="flex items-center">
              <span>thông báo</span>
              <span className="ml-2">⏺</span>
            </span>
          </button>
          <button className={`w-full flex justify-between items-center p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
            <div className="flex items-center">
              <span className="mr-2">📱</span>
              <span>Đồng bộ Widget màn hình chính</span>
            </div>
            <span>{'>'}</span>
          </button>
        </div>
      </div>

      {/* Phần Khác */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Khác</h2>
        <div className="space-y-2">
          <button className={`w-full flex justify-between items-center p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
            <div className="flex items-center">
              <span className="mr-2">☁️</span>
              <span>Sao lưu & Khôi phục</span>
            </div>
            <span>{'>'}</span>
          </button>
          <button className={`w-full flex justify-between items-center p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              <span>Xuất thời gian cầu nguyện</span>
            </div>
            <span>{'>'}</span>
          </button>
          <button className={`w-full flex justify-between items-center p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
            <div className="flex items-center">
              <span className="mr-2">🔒</span>
              <span>Chính sách quyền riêng tư</span>
            </div>
            <span>{'>'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;