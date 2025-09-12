import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { 
  Moon, 
  Globe, 
  MapPin, 
  Calendar,
  Bell,
  Smartphone,
  Cloud,
  Download,
  Shield,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const Setting: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

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
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-4 rounded-lg"
            onClick={toggleTheme}
          >
            <div className="flex items-center">
              <Moon className="mr-3 w-5 h-5" />
              <span>Chủ đề</span>
            </div>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </Button>
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
              <Switch defaultChecked />
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