import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onBack: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = React.memo(({
  isDarkMode,
  onToggleTheme,
  onBack,
  title
}) => {
  return (
    <div className={`sticky top-0 z-50 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-b backdrop-blur-sm bg-opacity-95`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          {/* Always visible Back button */}
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h1 className="text-xl font-bold">
            {title}
          </h1>
        </div>
        
        {/* Improved toggle button */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={isDarkMode}
            onChange={onToggleTheme}
            aria-label="Toggle dark/light mode"
          />
          <div className={`w-12 h-6 rounded-full peer ${
            isDarkMode 
              ? 'bg-indigo-600'  // Indigo color for dark mode
              : 'bg-gray-300'    // Light gray for light mode
          } transition-colors duration-300 peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm`}>
          
          </div>
        </label>
      </div>
    </div>
  );
});

Header.displayName = 'Header';

export default Header;
