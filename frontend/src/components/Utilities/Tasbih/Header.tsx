import { Settings } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';
// Use global theme classes; no local theme hook
import WindowControls from './WindowControls';

interface HeaderProps {
  onSettings: () => void;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettings, onBack }) => {
  return (
    <div className="flex items-center justify-between p-4 backdrop-blur-md border-b bg-card/95 border-border rounded-t-2xl">
      <BackButton variant="ghost" size="icon" className="rounded-full" onClick={onBack} />
      <WindowControls />

      <div className="flex items-center space-x-2">
        <button
          onClick={onSettings}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:opacity-80 bg-muted/40 text-muted-foreground"
          aria-label="Cài đặt"
          title="Cài đặt"
        >
          <Settings size={18} />
        </button>
        {/* Đã bỏ nút đổi theme: dùng theme hệ thống */}
      </div>
    </div>
  );
};

export default Header;


