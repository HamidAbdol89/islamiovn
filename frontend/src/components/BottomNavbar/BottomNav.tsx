import React, { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeIcon, NewspaperIcon, ChatBubbleLeftRightIcon, PlayCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useAuth } from '@/context/AuthContext';

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
    { key: 'home', label: 'Trang chủ', icon: HomeIcon },
    { key: 'news', label: 'Tin tức', icon: NewspaperIcon },
    { key: 'ai', label: 'AI', icon: ChatBubbleLeftRightIcon },
    { key: 'video', label: 'Video', icon: PlayCircleIcon },
    { 
      key: 'setting', 
      label: isAuthenticated ? 'Hồ sơ' : 'Cài đặt', 
      icon: isAuthenticated ? null : Cog6ToothIcon,
      avatar: isAuthenticated ? user?.picture : null
    },
  ];
  
  const [previousTab, setPreviousTab] = useState(activeTab);
  const [direction, setDirection] = useState(0);
  
  useEffect(() => {
    const currentIndex = tabs.findIndex(tab => tab.key === activeTab);
    const prevIndex = tabs.findIndex(tab => tab.key === previousTab);
    
    setDirection(currentIndex > prevIndex ? 1 : -1);
    setPreviousTab(activeTab);
  }, [activeTab]);

  const createRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 ">
<div className="bg-card rounded-t-3xl p-2 border-t border-border/50 transition-all duration-300 mx-auto max-w-md">
<div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.key === activeTab;
            const isSettingTab = tab.key === 'setting';
            const showAvatar = isSettingTab && isAuthenticated && tab.avatar;
 
            
            return (
              <button
              key={tab.key}
              onClick={(e) => { createRipple(e); onTabChange(tab.key); }}
              className="relative overflow-hidden flex items-center gap-2 sm:gap-3 transition-all duration-500 rounded-full px-3 py-2.5 sm:px-4 sm:py-3"
            >
              {/* Hiệu ứng highlight bao quanh button */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-primary/10 rounded-full"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {showAvatar && tab.avatar ? (
                  <img 
                    src={tab.avatar} 
                    alt="User Avatar" 
                    className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 rounded-full object-cover border border-border/30"
                  />
                ) : (
                  Icon && <Icon className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 text-current" />
                )}
              </motion.div>
            
              <AnimatePresence mode="wait" custom={direction}>
                {isActive && (
                  <motion.span
                    key={`active-${tab.key}`}
                    custom={direction}
                    initial={{ opacity: 0, x: 20 * direction, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: "auto" }}
                    exit={{ opacity: 0, x: -20 * direction, width: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            
            );
          })}
        </div>
      </div>
      
      <style >{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: var(--primary);
          opacity: 0.2;
          transform: scale(0);
          animation: ripple 0.6s linear;
        }
        
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BottomNav;