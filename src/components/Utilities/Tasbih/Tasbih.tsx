import { createContext, useContext, useState, useEffect } from 'react';
import { Moon, Sun, RotateCcw, Settings, Volume2, VolumeX, Home, Trophy } from 'lucide-react';
import type { ReactNode } from "react";
import BackButton from "@/components/ui/BackButton"; 

// Types
interface TasbihItem {
  id: number;
  name: string;
  arabic: string;
  meaning: string;
  target: number;
  color: string;
}

interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

interface SavedCounts {
  [key: number]: number;
}

// Theme Context
const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
  colors: {
    background: '#f5f5f7',
    surface: '#ffffff',
    primary: '#007AFF',
    secondary: '#8E8E93',
    text: '#1d1d1f',
    textSecondary: '#86868b',
    border: '#d2d2d7',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.2)',
  },
});

// Tasbih data
const tasbihData: TasbihItem[] = [
  {
    id: 1,
    name: 'Subhan Allah',
    arabic: 'سُبْحَانَ اللَّهِ',
    meaning: 'Glory be to Allah',
    target: 33,
    color: '#34C759'
  },
  {
    id: 2,
    name: 'Alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    meaning: 'All praise is due to Allah',
    target: 33,
    color: '#007AFF'
  },
  {
    id: 3,
    name: 'Allahu Akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    meaning: 'Allah is the Greatest',
    target: 34,
    color: '#FF3B30'
  },
  {
    id: 4,
    name: 'La ilaha illa Allah',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    meaning: 'There is no god but Allah',
    target: 100,
    color: '#FF9500'
  },
  {
    id: 5,
    name: 'Astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    meaning: 'I seek forgiveness from Allah',
    target: 100,
    color: '#AF52DE'
  },
  {
    id: 6,
    name: 'Bismillah',
    arabic: 'بِسْمِ اللَّهِ',
    meaning: 'In the name of Allah',
    target: 21,
    color: '#FF2D92'
  }
];

// Theme Provider Component
const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('tasbih-theme');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleTheme = () => {
    setIsDark((prev: boolean) => {
      const newTheme = !prev;
      localStorage.setItem('tasbih-theme', JSON.stringify(newTheme));
      return newTheme;
    });
  };

  const colors: ThemeColors = isDark ? {
    background: '#1c1c1e',
    surface: '#2c2c2e',
    primary: '#0A84FF',
    secondary: '#8E8E93',
    text: '#ffffff',
    textSecondary: '#8E8E93',
    border: '#38383a',
    shadow: 'rgba(0, 0, 0, 0.3)',
  } : {
    background: '#f5f5f7',
    surface: '#ffffff',
    primary: '#007AFF',
    secondary: '#8E8E93',
    text: '#1d1d1f',
    textSecondary: '#86868b',
    border: '#d2d2d7',
    shadow: 'rgba(0, 0, 0, 0.1)',
  };

  const theme: ThemeContextType = {
    isDark,
    toggleTheme,
    colors,
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    borderRadius: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
    },
    shadows: {
      sm: `0 1px 3px ${colors.shadow}`,
      md: `0 4px 12px ${colors.shadow}`,
      lg: `0 8px 24px ${colors.shadow}`,
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook
const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Window Controls Component
const WindowControls: React.FC = () => {
  const theme = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      <div 
        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer transition-colors"
        style={{ boxShadow: theme.shadows.sm }}
      />
      <div 
        className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer transition-colors"
        style={{ boxShadow: theme.shadows.sm }}
      />
      <div 
        className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer transition-colors"
        style={{ boxShadow: theme.shadows.sm }}
      />
    </div>
  );
};

// Header Component
interface HeaderProps {
  currentTasbih: TasbihItem | null;
  onBack: () => void;
  onSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentTasbih, onBack, onSettings }) => {
  const theme = useTheme();
  
  return (
    <div 
      className="flex items-center justify-between p-4 backdrop-blur-md border-b"
      style={{ 
        backgroundColor: theme.colors.surface + '95',
        borderColor: theme.colors.border,
        borderRadius: `${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0`
      }}
    >
      <BackButton />  
      <WindowControls />
      
      <div className="flex items-center space-x-2">
        {currentTasbih && (
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-opacity-80 transition-all"
            style={{ backgroundColor: theme.colors.primary + '20' }}
          >
            <Home size={18} style={{ color: theme.colors.primary }} />
          </button>
        )}
        <button
          onClick={onSettings}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-opacity-80 transition-all"
          style={{ backgroundColor: theme.colors.secondary + '20' }}
        >
          <Settings size={18} style={{ color: theme.colors.secondary }} />
        </button>
        <button
          onClick={theme.toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-opacity-80 transition-all"
          style={{ backgroundColor: theme.colors.secondary + '20' }}
        >
          {theme.isDark ? 
            <Sun size={18} style={{ color: theme.colors.secondary }} /> : 
            <Moon size={18} style={{ color: theme.colors.secondary }} />
          }
        </button>
      </div>
    </div>
  );
};

// Tasbih List Component
interface TasbihListProps {
  onSelectTasbih: (tasbih: TasbihItem) => void;
  savedCounts: SavedCounts;
}

const TasbihList: React.FC<TasbihListProps> = ({ onSelectTasbih, savedCounts }) => {
  const theme = useTheme();
  
  return (
    <div className="p-6">
      <div 
        className="text-center mb-8 p-6 rounded-xl"
        style={{ 
          backgroundColor: theme.colors.surface,
          boxShadow: theme.shadows.md,
          borderRadius: theme.borderRadius.xl
        }}
      >
        <h2 
          className="text-2xl font-bold mb-2"
          style={{ color: theme.colors.text }}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h2>
        <p 
          className="text-sm"
          style={{ color: theme.colors.textSecondary }}
        >
          In the name of Allah, the Most Gracious, the Most Merciful
        </p>
      </div>

      <div className="grid gap-4">
        {tasbihData.map((tasbih) => {
          const currentCount = savedCounts[tasbih.id] || 0;
          const progress = (currentCount / tasbih.target) * 100;
          
          return (
            <button
              key={tasbih.id}
              onClick={() => onSelectTasbih(tasbih)}
              className="text-left p-6 rounded-xl transition-all hover:scale-102 active:scale-98"
              style={{ 
                backgroundColor: theme.colors.surface,
                boxShadow: theme.shadows.md,
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tasbih.color }}
                />
                <div className="text-right">
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {currentCount}/{tasbih.target}
                  </span>
                </div>
              </div>
              
              <h3 
                className="font-semibold text-lg mb-1"
                style={{ color: theme.colors.text }}
              >
                {tasbih.name}
              </h3>
              
              <p 
                className="text-xl mb-2 font-arabic"
                style={{ color: tasbih.color }}
              >
                {tasbih.arabic}
              </p>
              
              <p 
                className="text-sm mb-3"
                style={{ color: theme.colors.textSecondary }}
              >
                {tasbih.meaning}
              </p>
              
              <div 
                className="w-full h-2 rounded-full"
                style={{ backgroundColor: theme.colors.border }}
              >
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: tasbih.color,
                    width: `${Math.min(progress, 100)}%`
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Counter Component
interface CounterProps {
  tasbih: TasbihItem;
}

const Counter: React.FC<CounterProps> = ({ tasbih }) => {
  const theme = useTheme();
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem(`tasbih-count-${tasbih.id}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('tasbih-sound');
    return saved ? JSON.parse(saved) : true;
  });
  const [showCelebration, setShowCelebration] = useState(false);

  // Save count to localStorage
  useEffect(() => {
    localStorage.setItem(`tasbih-count-${tasbih.id}`, count.toString());
  }, [count, tasbih.id]);

  // Save sound preference
  useEffect(() => {
    localStorage.setItem('tasbih-sound', JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    // Play sound effect (if enabled)
    if (isSoundEnabled) {
      try {
        // Create audio context for click sound
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (error) {
        // Silently fail if audio context is not supported
        console.warn('Audio context not supported:', error);
      }
    }
    
    // Check if target reached
    if (newCount === tasbih.target) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const reset = () => {
    setCount(0);
  };

  const progress = (count / tasbih.target) * 100;
  const isComplete = count >= tasbih.target;

  return (
    <div className="flex flex-col h-full">
      {/* Arabic Text Display */}
      <div 
        className="text-center p-8 m-6 rounded-xl"
        style={{ 
          backgroundColor: theme.colors.surface,
          boxShadow: theme.shadows.md,
          borderRadius: theme.borderRadius.xl
        }}
      >
        <p 
          className="text-4xl mb-4 font-arabic leading-relaxed"
          style={{ color: tasbih.color }}
        >
          {tasbih.arabic}
        </p>
        <p 
          className="text-lg font-semibold mb-2"
          style={{ color: theme.colors.text }}
        >
          {tasbih.name}
        </p>
        <p 
          className="text-sm"
          style={{ color: theme.colors.textSecondary }}
        >
          {tasbih.meaning}
        </p>
      </div>

      {/* Counter Display */}
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div 
          className="relative mb-8 p-8 rounded-full"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: theme.shadows.lg,
            minWidth: '200px',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Progress Ring */}
          <svg 
            className="absolute inset-0 w-full h-full transform -rotate-90" 
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={theme.colors.border}
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={tasbih.color}
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-300"
            />
          </svg>
          
          <div className="text-center">
            <div 
              className="text-5xl font-bold mb-2"
              style={{ color: theme.colors.text }}
            >
              {count}
            </div>
            <div 
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              / {tasbih.target}
            </div>
          </div>
          
          {isComplete && (
            <div 
              className="absolute -top-2 -right-2 p-2 rounded-full"
              style={{ backgroundColor: '#34C759' }}
            >
              <Trophy size={16} color="white" />
            </div>
          )}
        </div>

        {/* Main Counter Button */}
        <button
          onClick={increment}
          className="w-32 h-32 rounded-full transition-all hover:scale-105 active:scale-95 mb-6"
          style={{ 
            backgroundColor: tasbih.color,
            boxShadow: theme.shadows.lg 
          }}
        >
          <span className="text-white text-xl font-semibold">Count</span>
        </button>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={reset}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:bg-opacity-80"
            style={{ backgroundColor: theme.colors.secondary + '20' }}
          >
            <RotateCcw size={16} style={{ color: theme.colors.secondary }} />
            <span style={{ color: theme.colors.secondary }}>Reset</span>
          </button>
          
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:bg-opacity-80"
            style={{ backgroundColor: theme.colors.secondary + '20' }}
          >
            {isSoundEnabled ? 
              <Volume2 size={16} style={{ color: theme.colors.secondary }} /> :
              <VolumeX size={16} style={{ color: theme.colors.secondary }} />
            }
            <span style={{ color: theme.colors.secondary }}>
              {isSoundEnabled ? 'Mute' : 'Unmute'}
            </span>
          </button>
        </div>
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div 
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 1000 }}
        >
          <div 
            className="text-center p-8 rounded-xl animate-pulse"
            style={{ backgroundColor: theme.colors.surface }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: theme.colors.text }}
            >
              Completed!
            </h2>
            <p 
              className="text-lg"
              style={{ color: theme.colors.textSecondary }}
            >
              You've completed {tasbih.target} {tasbih.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
const TasbihApp: React.FC = () => {
  const [currentTasbih, setCurrentTasbih] = useState<TasbihItem | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [savedCounts, setSavedCounts] = useState<SavedCounts>(() => {
    const counts: SavedCounts = {};
    tasbihData.forEach(tasbih => {
      const saved = localStorage.getItem(`tasbih-count-${tasbih.id}`);
      counts[tasbih.id] = saved ? parseInt(saved, 10) : 0;
    });
    return counts;
  });

  const theme = useTheme();

  // Update saved counts when localStorage changes
  useEffect(() => {
    const interval = setInterval(() => {
      const counts: SavedCounts = {};
      tasbihData.forEach(tasbih => {
        const saved = localStorage.getItem(`tasbih-count-${tasbih.id}`);
        counts[tasbih.id] = saved ? parseInt(saved, 10) : 0;
      });
      setSavedCounts(counts);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="min-h-screen font-sans"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div 
        className="max-w-md mx-auto shadow-2xl min-h-screen"
        style={{ 
          backgroundColor: theme.colors.surface,
          boxShadow: theme.shadows.lg,
          borderRadius: theme.borderRadius.xl
        }}
      >
        <Header 
          currentTasbih={currentTasbih}
          onBack={() => setCurrentTasbih(null)}
          onSettings={() => setShowSettings(!showSettings)}
        />
        
        <div className="h-full">
          {currentTasbih ? (
            <Counter 
              tasbih={currentTasbih} 
            />
          ) : (
            <TasbihList 
              onSelectTasbih={setCurrentTasbih}
              savedCounts={savedCounts}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <TasbihApp />
    </ThemeProvider>
  );
};

export default App;