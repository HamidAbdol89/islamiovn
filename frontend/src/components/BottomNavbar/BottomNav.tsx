import React from 'react';
import { motion } from 'framer-motion';
import { Home, Newspaper, MessageCircle, PlayCircle, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface TabItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }> | null;
  avatar?: string | null;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { user, isAuthenticated } = useAuth();

  const tabs: TabItem[] = [
    { key: 'home', label: 'Trang chủ', icon: Home },
    { key: 'news', label: 'Tin tức', icon: Newspaper },
    { key: 'ai', label: 'AI', icon: MessageCircle },
    { key: 'video', label: 'Video', icon: PlayCircle },
    {
      key: 'setting',
      label: isAuthenticated ? 'Hồ sơ' : 'Cài đặt',
      icon: isAuthenticated ? null : Settings,
      avatar: isAuthenticated ? user?.picture : null,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-card/95 backdrop-blur-md border-t border-border/40 mx-auto max-w-md">
        <div className="flex justify-around items-center px-2 py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.key === activeTab;
            const showAvatar = tab.key === 'setting' && isAuthenticated && tab.avatar;

            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-1 w-14 py-2 rounded-xl transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {/* Active background pill */}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative z-10"
                >
                  {showAvatar && tab.avatar ? (
                    <img
                      src={tab.avatar}
                      alt="Avatar"
                      className={cn(
                        'w-6 h-6 rounded-full object-cover transition-all duration-200',
                        isActive ? 'ring-2 ring-primary' : 'ring-1 ring-border'
                      )}
                    />
                  ) : (
                    Icon && <Icon className="w-6 h-6" />
                  )}
                </motion.div>

                {/* Label */}
                <span
                  className={cn(
                    'relative z-10 text-[10px] font-medium leading-none transition-all duration-200',
                    isActive ? 'opacity-100' : 'opacity-60'
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Safe area for iOS home indicator */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </div>
  );
};

export default BottomNav;
