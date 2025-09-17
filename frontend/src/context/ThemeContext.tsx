// src/context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Khôi phục theme từ localStorage nếu có
    const savedTheme = localStorage.getItem('prayer-theme') as Theme;
    if (savedTheme && ['dark', 'light', 'islamic'].includes(savedTheme)) {
      return savedTheme;
    }
    
    // Kiểm tra system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('prayer-theme', newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prevTheme => {
      let newTheme: Theme;
      switch (prevTheme) {
        case 'light':
          newTheme = 'dark';
          break;
        case 'dark':
          newTheme = 'light';
          break;
        default:
          newTheme = 'dark';
      }
      localStorage.setItem('prayer-theme', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Xóa tất cả các class theme cũ
    root.classList.remove('light', 'dark');
    
    // Thêm class theme mới
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};