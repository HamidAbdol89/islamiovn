// ThemeContext.tsx - Phiên bản cải thiện
import { createContext, useState, useContext, useEffect, useMemo } from "react";
import type { ReactNode } from "react";

// Theme type definition
export type ThemeName = "light" | "dark" | "auto" | "custom";

// Enhanced color palette interface với macOS/iOS aesthetics
export interface ThemeColorPalette {
  // Primary backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgQuaternary: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textQuaternary: string;
  
  // Accent colors (Islamic green palette)
  accent: string;
  accentSecondary: string;
  accentTertiary: string;
  accentGradient: string;
  accentHover: string;
  
  // Interactive elements
  buttonPrimary: string;
  buttonSecondary: string;
  buttonTertiary: string;
  buttonGradient: string;
  buttonHover: string;
  buttonText: string;
  buttonSecondaryText: string;
  
  // Cards and surfaces
  cardBg: string;
  cardHover: string;
  cardBorder: string;
  cardShadow: string;
  
  // Navigation
  navBg: string;
  navBorder: string;
  navActiveBg: string;
  navHoverBg: string;
  navText: string;
  navActiveText: string;
  
  // Form elements
  inputBg: string;
  inputBorder: string;
  inputFocus: string;
  inputPlaceholder: string;
  
  // Overlays and modals
  overlayBg: string;
  modalBg: string;
  modalBorder: string;
  modalShadow: string;
  
  // Glass morphism effects
  glassLight: string;
  glassMedium: string;
  glassDark: string;
  
  // Status colors
  success: string;
  successBg: string;
  error: string;
  errorBg: string;
  warning: string;
  warningBg: string;
  info: string;
  infoBg: string;
  
  // Special effects
  shimmer: string;
  glow: string;
  separator: string;
  shadow: string;
  
  // Islamic themed elements
  islamicGold: string;
  islamicGoldBg: string;
  prayerTimeBg: string;
  qiblaAccent: string;
  hijriCalendarBg: string;
  
  // Basic borders
  border: string;
  borderSecondary: string;
  borderHover: string;
  borderFocus: string;
  
  // Basic spacing và typography
  rounded: string;
  roundedLg: string;
  roundedFull: string;
  
  // Hover states
  hover: string;
  hoverSecondary: string;
  
  // Focus states
  focus: string;
  focusRing: string;
  
  // Disabled states
  disabled: string;
  disabledText: string;
  disabledBg: string;
  
  // Link colors
  link: string;
  linkHover: string;
  linkVisited: string;
  
  // Selection colors
  selection: string;
  selectionText: string;
  
  // Additional properties used by components
  glassEffect: string;
  buttonGlow: string;
  avatarGradient: string;
  commentBg: string;
  badgeBg: string;
}

// Utility function để tạo CSS classes từ Tailwind
const createTailwindClasses = (classes: string): string => {
  return classes.trim().replace(/\s+/g, ' ');
};

// macOS/iOS Light theme với Islamic aesthetics
const lightTheme: ThemeColorPalette = {
  // Primary backgrounds - macOS style
  bgPrimary: createTailwindClasses("bg-gray-50/80"),
  bgSecondary: createTailwindClasses("bg-white/90"),
  bgTertiary: createTailwindClasses("bg-gray-100/50"),
  bgQuaternary: createTailwindClasses("bg-gray-200/30"),
  
  // Text hierarchy
  textPrimary: createTailwindClasses("text-gray-900"),
  textSecondary: createTailwindClasses("text-gray-700"),
  textTertiary: createTailwindClasses("text-gray-500"),
  textQuaternary: createTailwindClasses("text-gray-400"),
  
  // Islamic green accent system
  accent: createTailwindClasses("text-emerald-600"),
  accentSecondary: createTailwindClasses("text-emerald-500"),
  accentTertiary: createTailwindClasses("text-emerald-400"),
  accentGradient: createTailwindClasses("bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"),
  accentHover: createTailwindClasses("bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600"),
  
  // Button system - iOS style
  buttonPrimary: createTailwindClasses("bg-emerald-500"),
  buttonSecondary: createTailwindClasses("bg-gray-100"),
  buttonTertiary: createTailwindClasses("bg-transparent"),
  buttonGradient: createTailwindClasses("bg-gradient-to-r from-emerald-500 to-teal-500"),
  buttonHover: createTailwindClasses("hover:bg-emerald-600 active:scale-95 transition-all duration-200"),
  buttonText: createTailwindClasses("text-white font-medium"),
  buttonSecondaryText: createTailwindClasses("text-gray-700 font-medium"),
  
  // Cards với shadow như macOS
  cardBg: createTailwindClasses("bg-white/70 backdrop-blur-xl"),
  cardHover: createTailwindClasses("hover:bg-white/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"),
  cardBorder: createTailwindClasses("border border-gray-200/50"),
  cardShadow: createTailwindClasses("shadow-sm hover:shadow-md"),
  
  // Navigation - iOS/macOS style
  navBg: createTailwindClasses("bg-white/80 backdrop-blur-2xl"),
  navBorder: createTailwindClasses("border-b border-gray-200/50"),
  navActiveBg: createTailwindClasses("bg-emerald-50/80"),
  navHoverBg: createTailwindClasses("hover:bg-gray-50/60 transition-all duration-200"),
  navText: createTailwindClasses("text-gray-600"),
  navActiveText: createTailwindClasses("text-emerald-600 font-medium"),
  
  // Form elements
  inputBg: createTailwindClasses("bg-white/60 backdrop-blur-sm"),
  inputBorder: createTailwindClasses("border border-gray-200"),
  inputFocus: createTailwindClasses("focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"),
  inputPlaceholder: createTailwindClasses("placeholder-gray-400"),
  
  // Overlays và modals
  overlayBg: createTailwindClasses("bg-black/20 backdrop-blur-sm"),
  modalBg: createTailwindClasses("bg-white/90 backdrop-blur-2xl"),
  modalBorder: createTailwindClasses("border border-gray-200/50"),
  modalShadow: createTailwindClasses("shadow-2xl shadow-gray-500/10"),
  
  // Glass morphism
  glassLight: createTailwindClasses("bg-white/30 backdrop-blur-xl"),
  glassMedium: createTailwindClasses("bg-white/50 backdrop-blur-xl"),
  glassDark: createTailwindClasses("bg-white/70 backdrop-blur-xl"),
  
  // Status colors - iOS style
  success: createTailwindClasses("text-green-600"),
  successBg: createTailwindClasses("bg-green-50 border-green-200"),
  error: createTailwindClasses("text-red-600"),
  errorBg: createTailwindClasses("bg-red-50 border-red-200"),
  warning: createTailwindClasses("text-amber-600"),
  warningBg: createTailwindClasses("bg-amber-50 border-amber-200"),
  info: createTailwindClasses("text-blue-600"),
  infoBg: createTailwindClasses("bg-blue-50 border-blue-200"),
  
  // Effects
  shimmer: createTailwindClasses("animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"),
  glow: createTailwindClasses("shadow-lg shadow-emerald-500/20"),
  separator: createTailwindClasses("border-gray-200/60"),
  shadow: createTailwindClasses("shadow-sm shadow-gray-500/5"),
  
  // Islamic themed
  islamicGold: createTailwindClasses("text-amber-600"),
  islamicGoldBg: createTailwindClasses("bg-gradient-to-r from-amber-400 to-yellow-500"),
  prayerTimeBg: createTailwindClasses("bg-gradient-to-br from-emerald-50 to-teal-50"),
  qiblaAccent: createTailwindClasses("text-emerald-700"),
  hijriCalendarBg: createTailwindClasses("bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"),
  
  // Basic borders
  border: createTailwindClasses("border-gray-200"),
  borderSecondary: createTailwindClasses("border-gray-300"),
  borderHover: createTailwindClasses("hover:border-gray-400"),
  borderFocus: createTailwindClasses("focus:border-emerald-500"),
  
  rounded: createTailwindClasses("rounded-lg"),
  roundedLg: createTailwindClasses("rounded-xl"),
  roundedFull: createTailwindClasses("rounded-full"),
  
  hover: createTailwindClasses("hover:bg-gray-50"),
  hoverSecondary: createTailwindClasses("hover:bg-gray-100"),
  
  focus: createTailwindClasses("focus:outline-none"),
  focusRing: createTailwindClasses("focus:ring-2 focus:ring-emerald-500/20"),
  
  disabled: createTailwindClasses("disabled:opacity-50 disabled:cursor-not-allowed"),
  disabledText: createTailwindClasses("text-gray-400"),
  disabledBg: createTailwindClasses("bg-gray-100"),
  
  link: createTailwindClasses("text-emerald-600"),
  linkHover: createTailwindClasses("hover:text-emerald-700 hover:underline"),
  linkVisited: createTailwindClasses("visited:text-emerald-800"),
  
  selection: createTailwindClasses("selection:bg-emerald-100"),
  selectionText: createTailwindClasses("selection:text-emerald-900"),
  
  // Additional properties for components
  glassEffect: createTailwindClasses("bg-white/30 backdrop-blur-xl border border-white/20"),
  buttonGlow: createTailwindClasses("shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30"),
  avatarGradient: createTailwindClasses("bg-gradient-to-br from-emerald-400 to-teal-500"),
  commentBg: createTailwindClasses("bg-white/60 backdrop-blur-sm border border-gray-200/50"),
  badgeBg: createTailwindClasses("bg-emerald-100 text-emerald-700")
};

// macOS/iOS Dark theme với Islamic aesthetics
const darkTheme: ThemeColorPalette = {
  // Primary backgrounds - macOS dark style
  bgPrimary: createTailwindClasses("bg-gray-950/95"),
  bgSecondary: createTailwindClasses("bg-gray-900/90"),
  bgTertiary: createTailwindClasses("bg-gray-800/50"),
  bgQuaternary: createTailwindClasses("bg-gray-700/30"),
  
  // Text hierarchy cho dark mode
  textPrimary: createTailwindClasses("text-white"),
  textSecondary: createTailwindClasses("text-gray-200"),
  textTertiary: createTailwindClasses("text-gray-400"),
  textQuaternary: createTailwindClasses("text-gray-500"),
  
  // Islamic green accent cho dark mode
  accent: createTailwindClasses("text-emerald-400"),
  accentSecondary: createTailwindClasses("text-emerald-300"),
  accentTertiary: createTailwindClasses("text-emerald-200"),
  accentGradient: createTailwindClasses("bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"),
  accentHover: createTailwindClasses("bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"),
  
  // Button system cho dark mode
  buttonPrimary: createTailwindClasses("bg-emerald-500"),
  buttonSecondary: createTailwindClasses("bg-gray-800"),
  buttonTertiary: createTailwindClasses("bg-transparent"),
  buttonGradient: createTailwindClasses("bg-gradient-to-r from-emerald-500 to-teal-500"),
  buttonHover: createTailwindClasses("hover:bg-emerald-600 active:scale-95 transition-all duration-200"),
  buttonText: createTailwindClasses("text-white font-medium"),
  buttonSecondaryText: createTailwindClasses("text-gray-200 font-medium"),
  
  // Cards với glass effect
  cardBg: createTailwindClasses("bg-gray-900/70 backdrop-blur-xl"),
  cardHover: createTailwindClasses("hover:bg-gray-800/80 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"),
  cardBorder: createTailwindClasses("border border-gray-700/50"),
  cardShadow: createTailwindClasses("shadow-lg shadow-black/20"),
  
  // Navigation dark
  navBg: createTailwindClasses("bg-gray-900/80 backdrop-blur-2xl"),
  navBorder: createTailwindClasses("border-b border-gray-700/50"),
  navActiveBg: createTailwindClasses("bg-emerald-900/30"),
  navHoverBg: createTailwindClasses("hover:bg-gray-800/60 transition-all duration-200"),
  navText: createTailwindClasses("text-gray-300"),
  navActiveText: createTailwindClasses("text-emerald-400 font-medium"),
  
  // Form elements dark
  inputBg: createTailwindClasses("bg-gray-800/60 backdrop-blur-sm"),
  inputBorder: createTailwindClasses("border border-gray-700"),
  inputFocus: createTailwindClasses("focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400"),
  inputPlaceholder: createTailwindClasses("placeholder-gray-500"),
  
  // Overlays dark
  overlayBg: createTailwindClasses("bg-black/40 backdrop-blur-sm"),
  modalBg: createTailwindClasses("bg-gray-900/90 backdrop-blur-2xl"),
  modalBorder: createTailwindClasses("border border-gray-700/50"),
  modalShadow: createTailwindClasses("shadow-2xl shadow-black/30"),
  
  // Glass morphism dark
  glassLight: createTailwindClasses("bg-gray-900/30 backdrop-blur-xl"),
  glassMedium: createTailwindClasses("bg-gray-900/50 backdrop-blur-xl"),
  glassDark: createTailwindClasses("bg-gray-900/70 backdrop-blur-xl"),
  
  // Status colors dark
  success: createTailwindClasses("text-green-400"),
  successBg: createTailwindClasses("bg-green-900/30 border-green-700/50"),
  error: createTailwindClasses("text-red-400"),
  errorBg: createTailwindClasses("bg-red-900/30 border-red-700/50"),
  warning: createTailwindClasses("text-amber-400"),
  warningBg: createTailwindClasses("bg-amber-900/30 border-amber-700/50"),
  info: createTailwindClasses("text-blue-400"),
  infoBg: createTailwindClasses("bg-blue-900/30 border-blue-700/50"),
  
  // Effects dark
  shimmer: createTailwindClasses("animate-pulse bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"),
  glow: createTailwindClasses("shadow-xl shadow-emerald-500/30"),
  separator: createTailwindClasses("border-gray-700/60"),
  shadow: createTailwindClasses("shadow-lg shadow-black/10"),
  
  // Islamic themed dark
  islamicGold: createTailwindClasses("text-amber-400"),
  islamicGoldBg: createTailwindClasses("bg-gradient-to-r from-amber-500 to-yellow-400"),
  prayerTimeBg: createTailwindClasses("bg-gradient-to-br from-emerald-900/30 to-teal-900/30"),
  qiblaAccent: createTailwindClasses("text-emerald-300"),
  hijriCalendarBg: createTailwindClasses("bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/20"),
  
  // Basic borders
  border: createTailwindClasses("border-gray-700"),
  borderSecondary: createTailwindClasses("border-gray-600"),
  borderHover: createTailwindClasses("hover:border-gray-500"),
  borderFocus: createTailwindClasses("focus:border-emerald-400"),
  
  rounded: createTailwindClasses("rounded-lg"),
  roundedLg: createTailwindClasses("rounded-xl"),
  roundedFull: createTailwindClasses("rounded-full"),
  
  hover: createTailwindClasses("hover:bg-gray-800"),
  hoverSecondary: createTailwindClasses("hover:bg-gray-700"),
  
  focus: createTailwindClasses("focus:outline-none"),
  focusRing: createTailwindClasses("focus:ring-2 focus:ring-emerald-400/30"),
  
  disabled: createTailwindClasses("disabled:opacity-50 disabled:cursor-not-allowed"),
  disabledText: createTailwindClasses("text-gray-500"),
  disabledBg: createTailwindClasses("bg-gray-800"),
  
  link: createTailwindClasses("text-emerald-400"),
  linkHover: createTailwindClasses("hover:text-emerald-300 hover:underline"),
  linkVisited: createTailwindClasses("visited:text-emerald-500"),
  
  selection: createTailwindClasses("selection:bg-emerald-800/50"),
  selectionText: createTailwindClasses("selection:text-emerald-200"),
  
  // Additional properties for components
  glassEffect: createTailwindClasses("bg-gray-900/30 backdrop-blur-xl border border-gray-700/20"),
  buttonGlow: createTailwindClasses("shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"),
  avatarGradient: createTailwindClasses("bg-gradient-to-br from-emerald-500 to-teal-400"),
  commentBg: createTailwindClasses("bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"),
  badgeBg: createTailwindClasses("bg-emerald-900/30 text-emerald-300")
};

// Theme context interface
interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  isDark: boolean;
  themeColors: ThemeColorPalette;
  availableThemes: ThemeName[];
  isSystemPreference: boolean;
  systemTheme: "light" | "dark";
  // Helper functions
  getThemeClass: (property: keyof ThemeColorPalette) => string;
  combineClasses: (...classes: (string | undefined | null | false)[]) => string;
}

// Theme palettes
const themeColorPalettes: Record<ThemeName, ThemeColorPalette> = {
  light: lightTheme,
  dark: darkTheme,
  auto: lightTheme, // Will be determined dynamically
  custom: { ...lightTheme }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Constants
const THEME_TRANSITION_DURATION = 250;
const STORAGE_KEY = "hamidverse-theme";

// System theme detection hook
const useSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? 'dark' : 'light');
      };
      
      // Sử dụng addEventListener thay vì addListener (deprecated)
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback cho browsers cũ
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, []);

  return systemTheme;
};

// Smooth theme transitions
const setupThemeTransitions = () => {
  if (typeof document === 'undefined') return;
  
  // Kiểm tra xem style đã tồn tại chưa
  const existingStyle = document.getElementById('theme-transitions');
  if (existingStyle) return;
  
  const style = document.createElement('style');
  style.id = 'theme-transitions';
  style.innerHTML = `
    * {
      transition: background-color ${THEME_TRANSITION_DURATION}ms cubic-bezier(0.4, 0.0, 0.2, 1),
                 border-color ${THEME_TRANSITION_DURATION}ms cubic-bezier(0.4, 0.0, 0.2, 1),
                 color ${THEME_TRANSITION_DURATION}ms cubic-bezier(0.4, 0.0, 0.2, 1),
                 box-shadow ${THEME_TRANSITION_DURATION}ms cubic-bezier(0.4, 0.0, 0.2, 1) !important;
    }
    
    .theme-transition-disable * {
      transition: none !important;
    }
  `;
  document.head.appendChild(style);
};

// Helper function để combine classes
const combineClasses = (...classes: (string | undefined | null | false)[]): string => {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ');
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemTheme = useSystemTheme();
  
  const getSavedTheme = (): ThemeName => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
        if (saved && Object.keys(themeColorPalettes).includes(saved)) {
          return saved;
        }
      } catch (error) {
        console.warn('Unable to access localStorage:', error);
      }
    }
    return "auto";
  };

  const [theme, setThemeState] = useState<ThemeName>(getSavedTheme);
  
  const isDark = useMemo(() => {
    if (theme === "dark") return true;
    if (theme === "auto") return systemTheme === "dark";
    return false;
  }, [theme, systemTheme]);

  const isSystemPreference = theme === "auto";

  // Setup transitions
  useEffect(() => {
    setupThemeTransitions();
  }, []);

  // Apply theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      // Temporarily disable transitions for immediate theme change
      root.classList.add('theme-transition-disable');
      
      // Remove all theme classes
      root.classList.remove("light", "dark");
      
      // Add current theme
      root.classList.add(isDark ? "dark" : "light");
      
      // Re-enable transitions after a frame
      requestAnimationFrame(() => {
        root.classList.remove('theme-transition-disable');
      });
      
      // Save preference
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (error) {
        console.warn('Unable to save theme preference:', error);
      }
    }
  }, [theme, isDark]);

  const availableThemes = useMemo(() => {
    return Object.keys(themeColorPalettes) as ThemeName[];
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    if (Object.keys(themeColorPalettes).includes(newTheme)) {
      setThemeState(newTheme);
    }
  };

  const toggleTheme = () => {
    setThemeState(prevTheme => {
      switch (prevTheme) {
        case "light":
          return "dark";
        case "dark":
          return "light";
        case "auto":
          return systemTheme === "light" ? "dark" : "light";
        default:
          return "auto";
      }
    });
  };

  const themeColors = useMemo(() => {
    if (theme === "auto") {
      return systemTheme === "dark" ? themeColorPalettes.dark : themeColorPalettes.light;
    }
    return themeColorPalettes[theme] || themeColorPalettes.light;
  }, [theme, systemTheme]);

  // Helper function để lấy theme class
  const getThemeClass = (property: keyof ThemeColorPalette): string => {
    return themeColors[property] || '';
  };

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme,
    isDark,
    themeColors,
    availableThemes,
    isSystemPreference,
    systemTheme,
    getThemeClass,
    combineClasses
  }), [theme, isDark, themeColors, availableThemes, isSystemPreference, systemTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme phải được sử dụng trong ThemeProvider");
  }
  return context;
};

// Utility hooks
export const useThemeClass = (property: keyof ThemeColorPalette): string => {
  const { getThemeClass } = useTheme();
  return getThemeClass(property);
};

export const useCombineClasses = (...classes: (string | undefined | null | false)[]): string => {
  const { combineClasses } = useTheme();
  return combineClasses(...classes);
};

export default ThemeContext;