import React, { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeIcon, NewspaperIcon, ChatBubbleLeftRightIcon, PlayCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
    className?: string; // <-- thêm cái này

}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: 'home', label: 'Trang chủ', icon: HomeIcon },
    { key: 'news', label: 'Tin tức', icon: NewspaperIcon },
    { key: 'ai', label: 'AI', icon: ChatBubbleLeftRightIcon },
    { key: 'video', label: 'Video', icon: PlayCircleIcon },
    { key: 'setting', label: 'Cài đặt', icon: Cog6ToothIcon },
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
            <div className="bg-[hsl(var(--card)/0.9)] backdrop-blur-lg rounded-t-3xl p-2 shadow-luxury dark:shadow-luxury-dark border-t border-white/15 dark:border-navy-800/30 transition-smooth mx-auto max-w-md">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.key === activeTab;
 
            
            return (
              <button
                key={tab.key}
                onClick={(e) => { createRipple(e); onTabChange(tab.key); }}
                className={`
                  relative overflow-hidden
                  flex items-center gap-2 sm:gap-3
                  transition-all duration-500 
                  rounded-full 
                  px-3 py-2.5 sm:px-4 sm:py-3
                  ${isActive 
                    ? 'bg-primary/10 text-primary flex-2 sm:flex-auto min-w-[56px]' 
                    : 'bg-transparent text-muted-foreground w-12 sm:w-14 justify-center hover:text-primary'
                  }
                `}
              >    
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 text-current" />
                </motion.div>
                
                <AnimatePresence mode="wait" custom={direction}>
                  {isActive && (
                    <motion.span
                      key={`active-${tab.key}`}
                      custom={direction}
                      initial={{ 
                        opacity: 0, 
                        x: 20 * direction,
                        width: 0 
                      }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        width: "auto"
                      }}
                      exit={{ 
                        opacity: 0, 
                        x: -20 * direction,
                        width: 0 
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut"
                      }}
                      className="text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Hiệu ứng highlight cho tab active */}
                {isActive && (
                  <motion.div 
                    className="absolute inset-0 bg-primary/10 rounded-full"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      <style >{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.7);
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