import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { 
  Moon, 
  Sun,
  Globe, 
  MapPin, 
  Calendar,
  Bell,
  Smartphone,
  Cloud,
  Download,
  Shield,
  ChevronRight,
  Check,
  Heart,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SavedHadithsView from './components/SavedHadithsView';
import { storageUtils } from '@/components/Utilities/Hadith/utils';

const Setting: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [currentView, setCurrentView] = useState<'main' | 'saved-hadiths'>('main');
  
  // Get counts for badges
  const favoritesCount = storageUtils.getFavorites().length;
  const bookmarksCount = storageUtils.getBookmarks().length;

  const themeOptions = [
    { id: 'light', name: 'Sáng', icon: Sun },
    { id: 'dark', name: 'Tối', icon: Moon },
    { id: 'islamic', name: 'Hồi giáo', icon: Globe }
  ];

  // Handle navigation
  const handleViewChange = (view: 'main' | 'saved-hadiths') => {
    setCurrentView(view);
  };

  // Handle share app
  const handleShareApp = async () => {
    const shareData = {
      title: 'Muslim Việt - Ứng dụng Hồi giáo',
      text: 'Khám phá ứng dụng Muslim Việt với đầy đủ tính năng: Lịch Hijri, Hadith, Tin tức Hồi giáo và nhiều hơn nữa!',
      url: window.location.origin
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
        alert('Đã sao chép thông tin ứng dụng vào clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
        alert('Đã sao chép thông tin ứng dụng vào clipboard!');
      } catch (clipboardError) {
        alert('Không thể chia sẻ ứng dụng');
      }
    }
  };

  // Show SavedHadithsView if selected
  if (currentView === 'saved-hadiths') {
    return (
      <SavedHadithsView onBack={() => setCurrentView('main')} />
    );
  }

  return (
    <div className="min-h-screen p-4 bg-background text-foreground">
      <div className="flex justify-center mb-6">
        <img src="/logo.png" alt="Biểu tượng" className="h-32 w-auto" />
      </div>

      {/* Phần Tùy chỉnh */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Tùy chỉnh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-0">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <Moon className="mr-3 w-5 h-5" />
              <span>Chủ đề</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setTheme(option.id as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      theme === option.id
                        ? 'border-primary bg-primary/10'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    <span className="text-xs">{option.name}</span>
                    {theme === option.id && (
                      <Check className="w-4 h-4 text-primary absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <Separator />
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-4 rounded-lg"
          >
            <div className="flex items-center">
              <Globe className="mr-3 w-5 h-5" />
              <span>Ngôn ngữ</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Button>
        </CardContent>
      </Card>

      {/* Phần Hadith */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Hadith</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-0">
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-4 rounded-lg"
            onClick={() => handleViewChange('saved-hadiths')}
          >
            <div className="flex items-center">
              <Heart className="mr-3 w-5 h-5" />
              <span>Hadith đã lưu</span>
            </div>
            <div className="flex items-center gap-2">
              {(favoritesCount > 0 || bookmarksCount > 0) && (
                <div className="flex items-center gap-1">
                  {favoritesCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {favoritesCount}
                    </span>
                  )}
                  {bookmarksCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {bookmarksCount}
                    </span>
                  )}
                </div>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Button>
          <Separator />
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-4 rounded-lg"
            onClick={handleShareApp}
          >
            <div className="flex items-center">
              <Share2 className="mr-3 w-5 h-5" />
              <span>Chia sẻ ứng dụng</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Button>
        </CardContent>
      </Card>

      {/* Phần Chung */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Chung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-0">
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-4 rounded-lg"
          >
            <div className="flex items-center">
              <MapPin className="mr-3 w-5 h-5" />
              <span>Vị trí & Phương pháp tính</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Separator />
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-4 rounded-lg"
          >
            <div className="flex items-center">
              <Calendar className="mr-3 w-5 h-5" />
              <span>Điều chỉnh lịch Hồi giáo</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Separator />
          <div className="w-full flex justify-between items-center p-4 rounded-lg">
            <div className="flex items-center">
              <Bell className="mr-3 w-5 h-5" />
              <span>Loại nhắc nhở</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">thông báo</span>
              <div className="relative inline-flex w-12 h-6 rounded-full bg-muted transition-colors">
                <span className="inline-block w-5 h-5 transform rounded-full bg-white shadow-md transition-transform translate-x-0.5" />
              </div>
            </div>
          </div>
          <Separator />
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-4 rounded-lg"
          >
            <div className="flex items-center">
              <Smartphone className="mr-3 w-5 h-5" />
              <span>Đồng bộ Widget màn hình chính</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Button>
        </CardContent>
      </Card>

      {/* Phần Khác */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Khác</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-0">
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-4 rounded-lg"
          >
            <div className="flex items-center">
              <Cloud className="mr-3 w-5 h-5" />
              <span>Sao lưu & Khôi phục</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Separator />
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-4 rounded-lg"
          >
            <div className="flex items-center">
              <Download className="mr-3 w-5 h-5" />
              <span>Xuất thời gian cầu nguyện</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Separator />
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-4 rounded-lg"
          >
            <div className="flex items-center">
              <Shield className="mr-3 w-5 h-5" />
              <span>Chính sách quyền riêng tư</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Setting;