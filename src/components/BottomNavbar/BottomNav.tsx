import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: 'home', label: 'Trang chủ', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { key: 'news', label: 'Tin tức', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { key: 'ai', label: 'AI', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { key: 'video', label: 'Video', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { 
      key: 'setting', 
      label: 'Cài đặt', 
      icon: 'M19.43 12.98c.04-.32.07-.66.07-1s-.03-.68-.07-1l2.11-1.65a.5.5 0 00.11-.64l-2-3.46a.5.5 0 00-.61-.22l-2.49 1a7.007 7.007 0 00-1.7-.99l-.38-2.65A.5.5 0 0014 2h-4a.5.5 0 00-.49.42l-.38 2.65c-.63.24-1.21.58-1.7.99l-2.49-1a.5.5 0 00-.61.22l-2 3.46a.5.5 0 00.11.64L4.57 10c-.04.32-.07.66-.07 1s.03.68.07 1l-2.11 1.65a.5.5 0 00-.11.64l2 3.46c.14.24.44.34.70.22l2.49-1c.49.41 1.07.75 1.7.99l.38 2.65c.05.26.26.42.49.42h4c.23 0 .44-.16.49-.42l.38-2.65c.63-.24 1.21-.58 1.7-.99l2.49 1c.26.12.56.02.70-.22l2-3.46a.5.5 0 00-.11-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z' 
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-[hsl(var(--card)/0.9)] backdrop-blur-lg rounded-t-2xl p-1.5 shadow-luxury dark:shadow-luxury-dark border-t border-white/15 dark:border-navy-800/30 transition-smooth mx-auto max-w-md">
        <div className="flex justify-around items-center">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`
                flex items-center gap-1.5 sm:gap-2.5 
                transition-smooth 
                overflow-hidden 
                rounded-full 
                px-2 py-2 sm:px-3 sm:py-3
                ${activeTab === tab.key 
                  ? 'bg-primary/20 text-primary w-auto'
                  : 'bg-transparent text-muted-foreground w-10 sm:w-12 justify-center hover:text-primary'
                }
              `}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              
              <AnimatePresence>
                {activeTab === tab.key && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="text-[10px] sm:text-[12px] font-medium whitespace-nowrap overflow-hidden"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;