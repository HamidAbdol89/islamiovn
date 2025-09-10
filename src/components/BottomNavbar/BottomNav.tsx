import React from 'react';

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
    { key: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
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
              {activeTab === tab.key && (
                <span className="text-[10px] sm:text-[12px] font-medium whitespace-nowrap">{tab.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;