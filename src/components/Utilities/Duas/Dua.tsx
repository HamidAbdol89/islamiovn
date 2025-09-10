import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Play, Pause, Moon, Sun, RotateCcw, Heart, 
  Search, Share2, BarChart3, Type, History, Settings, BookOpen, 
  Repeat, Volume2, VolumeX, Clock, X
} from 'lucide-react';
import BackButton from "@/components/ui/BackButton";

// Type definitions
interface DuaTextItem {
  ID: number;
  ARABIC_TEXT: string;
  LANGUAGE_ARABIC_TRANSLATED_TEXT: string;
  TRANSLATED_TEXT: string;
  REPEAT: number;
  AUDIO: string;
}

interface DuaCategory {
  ID: number;
  TITLE: string;
  AUDIO_URL: string;
  TEXT: DuaTextItem[];
}

interface DuaData {
  English: DuaCategory[];
}

interface ReadingHistory {
  duaId: number;
  categoryId: number;
  timestamp: number;
  duration: number;
}

interface ReadingStats {
  [duaId: string]: {
    count: number;
    totalTime: number;
    lastRead: number;
  };
}

// Import JSON data
import duaDataJson from '@/assets/dua/husn_en.json';

const Dua: React.FC = () => {
  const duaData = duaDataJson as DuaData;
  
  // Core states
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number | null>(null);
  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Enhanced features states
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [continuousReading, setContinuousReading] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
  const [readingStats, setReadingStats] = useState<ReadingStats>({});
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentView, setCurrentView] = useState<'categories' | 'dua' | 'favorites' | 'search'>('categories');
  const [searchResults, setSearchResults] = useState<Array<{category: DuaCategory, dua: DuaTextItem, categoryIndex: number, duaIndex: number}>>([]);
  
  // Reading session tracking
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get current data
  const currentCategory = currentCategoryIndex !== null ? duaData.English[currentCategoryIndex] : null;
  const currentDua = currentCategory?.TEXT[currentDuaIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 1;
    }
  }, [isMuted]);

  // Initialize data from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('dua-theme');
    const savedFavorites = localStorage.getItem('dua-favorites');
    const savedFontSize = localStorage.getItem('dua-fontSize');
    const savedHistory = localStorage.getItem('dua-history');
    const savedStats = localStorage.getItem('dua-stats');
    const savedAutoPlay = localStorage.getItem('dua-autoPlay');
    const savedContinuous = localStorage.getItem('dua-continuous');
    const savedMuted = localStorage.getItem('dua-muted');
    
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedAutoPlay) setAutoPlay(savedAutoPlay === 'true');
    if (savedContinuous) setContinuousReading(savedContinuous === 'true');
    if (savedMuted) setIsMuted(savedMuted === 'true');
    
    if (savedFavorites) {
      try {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      } catch (err) {
        console.error('Error parsing favorites:', err);
      }
    }
    
    if (savedHistory) {
      try {
        setReadingHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Error parsing history:', err);
      }
    }
    
    if (savedStats) {
      try {
        setReadingStats(JSON.parse(savedStats));
      } catch (err) {
        console.error('Error parsing stats:', err);
      }
    }
  }, []);

  // Start reading session when dua changes
  useEffect(() => {
    if (currentDua) {
      setSessionStartTime(Date.now());
    }
  }, [currentDua]);

  // Save reading session when leaving dua
  useEffect(() => {
    return () => {
      if (currentDua && sessionStartTime) {
        saveReadingSession();
      }
    };
  }, [currentDua, sessionStartTime]);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && currentDua?.AUDIO && !isPlaying) {
      setTimeout(() => {
        toggleAudio();
      }, 1000);
    }
  }, [currentDua, autoPlay]);

  // Continuous reading functionality
  useEffect(() => {
    if (continuousReading && !isPlaying && audioRef.current) {
      const handleAudioEnd = () => {
        setTimeout(() => {
          goToNextDua();
        }, 2000);
      };
      
      audioRef.current.addEventListener('ended', handleAudioEnd);
      return () => {
        audioRef.current?.removeEventListener('ended', handleAudioEnd);
      };
    }
  }, [continuousReading, isPlaying, currentDua]);

  // Utility function for safe text comparison
  const safeStringCompare = (text: any, searchTerm: string): boolean => {
    if (text == null || typeof text !== 'string') return false;
    
    const normalizedText = text.normalize('NFC').trim();
    if (normalizedText === '') return false;

    return normalizedText.toLowerCase().includes(searchTerm);
  };

  // Search functionality
  useEffect(() => {
    if (!searchTerm || typeof searchTerm !== 'string' || !searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    if (!duaData?.English || !Array.isArray(duaData.English)) {
      console.error('Invalid data structure');
      setSearchResults([]);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase().trim();
    const results: Array<{
      category: DuaCategory;
      dua: DuaTextItem;
      categoryIndex: number;
      duaIndex: number;
    }> = [];

    try {
      duaData.English.forEach((category, categoryIndex) => {
        if (!category || !Array.isArray(category.TEXT)) return;

        category.TEXT.forEach((dua, duaIndex) => {
          if (!dua) return;

          const matchFound =
            safeStringCompare(dua.ARABIC_TEXT, searchTermLower) ||
            safeStringCompare(dua.TRANSLATED_TEXT, searchTermLower) ||
            safeStringCompare(dua.LANGUAGE_ARABIC_TRANSLATED_TEXT, searchTermLower) ||
            safeStringCompare(category.TITLE, searchTermLower);

          if (matchFound) {
            results.push({
              category,
              dua,
              categoryIndex,
              duaIndex
            });
          }
        });
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  }, [searchTerm, duaData]);

  // Save reading session
  const saveReadingSession = () => {
    if (!currentDua || !sessionStartTime) return;
    
    const duration = Date.now() - sessionStartTime;
    const session: ReadingHistory = {
      duaId: currentDua.ID,
      categoryId: currentCategory!.ID,
      timestamp: Date.now(),
      duration
    };
    
    const newHistory = [session, ...readingHistory.slice(0, 99)];
    setReadingHistory(newHistory);
    localStorage.setItem('dua-history', JSON.stringify(newHistory));
    
    // Update stats
    const duaKey = currentDua.ID.toString();
    const currentStats = readingStats[duaKey] || { count: 0, totalTime: 0, lastRead: 0 };
    const newStats = {
      ...readingStats,
      [duaKey]: {
        count: currentStats.count + 1,
        totalTime: currentStats.totalTime + duration,
        lastRead: Date.now()
      }
    };
    setReadingStats(newStats);
    localStorage.setItem('dua-stats', JSON.stringify(newStats));
  };

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('dua-theme', newTheme ? 'dark' : 'light');
  };

  // Font size controls
  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24);
    setFontSize(newSize);
    localStorage.setItem('dua-fontSize', newSize.toString());
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    localStorage.setItem('dua-fontSize', newSize.toString());
  };

  // Audio controls
  const toggleAudio = () => {
    if (!currentDua?.AUDIO || currentDua.AUDIO.trim() === '') return;
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.volume = isMuted ? 0 : 1;
        audioRef.current.play().catch(err => {
          console.error('Audio play error:', err);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('dua-muted', newMuted.toString());
    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : 1;
    }
  };

  // Navigation functions
  const goToPreviousDua = () => {
    if (!currentCategory) return;
    
    saveReadingSession();
    
    if (currentDuaIndex > 0) {
      setCurrentDuaIndex(currentDuaIndex - 1);
    } else if (currentCategoryIndex !== null && currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
      setCurrentDuaIndex(duaData.English[currentCategoryIndex - 1].TEXT.length - 1);
    } else {
      setCurrentCategoryIndex(duaData.English.length - 1);
      setCurrentDuaIndex(duaData.English[duaData.English.length - 1].TEXT.length - 1);
    }
    setIsPlaying(false);
  };

  const goToNextDua = () => {
    if (!currentCategory) return;
    
    saveReadingSession();
    
    if (currentDuaIndex < currentCategory.TEXT.length - 1) {
      setCurrentDuaIndex(currentDuaIndex + 1);
    } else if (currentCategoryIndex !== null && currentCategoryIndex < duaData.English.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentDuaIndex(0);
    } else {
      setCurrentCategoryIndex(0);
      setCurrentDuaIndex(0);
    }
    setIsPlaying(false);
  };

  // Category and dua selection
  const selectCategory = (categoryId: number) => {
    const categoryIndex = duaData.English.findIndex(cat => cat.ID === categoryId);
    if (categoryIndex !== -1) {
      setCurrentCategoryIndex(categoryIndex);
      setCurrentDuaIndex(0);
      setCurrentView('dua');
      setIsPlaying(false);
    }
  };

  const selectDuaFromSearch = (categoryIndex: number, duaIndex: number) => {
    setCurrentCategoryIndex(categoryIndex);
    setCurrentDuaIndex(duaIndex);
    setCurrentView('dua');
    setShowSearch(false);
    setIsPlaying(false);
  };

  // Favorites
  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    localStorage.setItem('dua-favorites', JSON.stringify([...newFavorites]));
  };

  // Share functionality
  const shareDua = async () => {
    if (!currentDua || !currentCategory) return;
    
    const shareText = `${currentCategory.TITLE}\n\n${currentDua.ARABIC_TEXT}\n\n${currentDua.TRANSLATED_TEXT}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentCategory.TITLE,
          text: shareText,
        });
      } catch (err) {
        console.error('Error sharing:', err);
        fallbackShare(shareText);
      }
    } else {
      fallbackShare(shareText);
    }
  };

  const fallbackShare = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to share. Please try again.');
    });
  };

  // Auto-play and continuous reading toggles
  const toggleAutoPlay = () => {
    const newAutoPlay = !autoPlay;
    setAutoPlay(newAutoPlay);
    localStorage.setItem('dua-autoPlay', newAutoPlay.toString());
  };

  const toggleContinuousReading = () => {
    const newContinuous = !continuousReading;
    setContinuousReading(newContinuous);
    localStorage.setItem('dua-continuous', newContinuous.toString());
  };

  // Get favorites list
  const getFavoritesList = () => {
    const favoritesList: Array<{category: DuaCategory, dua: DuaTextItem, categoryIndex: number, duaIndex: number}> = [];
    
    duaData.English.forEach((category, categoryIndex) => {
      category.TEXT.forEach((dua, duaIndex) => {
        if (favorites.has(dua.ID.toString())) {
          favoritesList.push({ category, dua, categoryIndex, duaIndex });
        }
      });
    });
    
    return favoritesList;
  };

  // Get recent history
  const getRecentHistory = () => {
    return readingHistory.slice(0, 20).map(session => {
      const category = duaData.English.find(cat => cat.ID === session.categoryId);
      const dua = category?.TEXT.find(d => d.ID === session.duaId);
      return { ...session, category, dua };
    }).filter(item => item.category && item.dua);
  };

  // Render header
  const renderHeader = () => (
    <div className={`sticky top-0 z-20 backdrop-blur-md border-b ${isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-2 sm:gap-4">
          <div className="flex items-center min-w-0 overflow-hidden gap-2 sm:gap-3">
            {currentView !== 'categories' && (
              <button
                onClick={() => {
                  if (currentView === 'dua') {
                    setCurrentView('categories');
                    setCurrentCategoryIndex(null);
                  } else {
                    setCurrentView('categories');
                  }
                }}
                className={`p-2 rounded-full transition-all flex-shrink-0 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            
            {currentView === 'categories' && <BackButton />}
            
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isDarkMode ? 'bg-green-600' : 'bg-green-500'}`}>
              <span className="text-white text-sm font-bold">☪</span>
            </div>
            
            <div className="min-w-0 overflow-hidden">
              <h1 className={`font-bold text-sm sm:text-lg truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {currentView === 'categories' ? 'Fortress of the Muslim' : 
                 currentView === 'favorites' ? 'Favorite Duas' :
                 currentView === 'search' ? 'Search' :
                 currentCategory?.TITLE}
              </h1>
              {currentView === 'dua' && currentCategory && (
                <p className={`text-xs sm:text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Dua {currentDuaIndex + 1} of {currentCategory.TEXT.length}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Search className="w-5 h-5" />
            </button>
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render search overlay
  const renderSearchOverlay = () => {
    if (!showSearch) return null;
    
    return (
      <div className={`fixed inset-0 z-50 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`sticky top-0 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center p-4 gap-3">
            <button
              onClick={() => setShowSearch(false)}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for duas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                autoFocus
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((result, index) => {
                const categoryTitle = result.category?.TITLE || '';
                const arabicText = result.dua?.ARABIC_TEXT || '';
                const translatedText = result.dua?.TRANSLATED_TEXT || '';

                return (
                  <button
                    key={index}
                    onClick={() => selectDuaFromSearch(result.categoryIndex, result.duaIndex)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className="mb-2">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {categoryTitle}
                      </span>
                    </div>
                    {arabicText && (
                      <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} dir="rtl">
                        {arabicText.substring(0, Math.min(arabicText.length, 100))}...
                      </p>
                    )}
                    {translatedText && (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {translatedText.substring(0, Math.min(translatedText.length, 100))}...
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-8">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No results found
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Enter keywords to search
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render settings modal
  const renderSettingsModal = () => {
    if (!showSettings) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className={`w-full max-w-md rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Settings
            </h3>
            <button
              onClick={() => setShowSettings(false)}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Font size */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Font size: {fontSize}px
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseFontSize}
                  className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <Type className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    A
                  </span>
                </div>
                <button
                  onClick={increaseFontSize}
                  className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <Type className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Auto play */}
              <div className="flex items-center justify-between gap-4">
                <label className={`text-sm md:text-base font-medium flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Auto play audio
                </label>
                <button
                  onClick={toggleAutoPlay}
                  aria-label="Toggle autoplay"
                  className={`relative inline-flex w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    autoPlay 
                      ? 'bg-green-500 focus:ring-green-500' 
                      : isDarkMode 
                        ? 'bg-gray-600 focus:ring-gray-500' 
                        : 'bg-gray-300 focus:ring-gray-400'
                  }`}
                >
                  <span
                    className={`inline-block w-5 h-5 transform rounded-full bg-white shadow-md transition-transform ${
                      autoPlay ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              
              {/* Continuous reading */}
              <div className="flex items-center justify-between gap-4">
                <label className={`text-sm md:text-base font-medium flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Continuous reading
                </label>
                <button
                  onClick={toggleContinuousReading}
                  aria-label="Toggle continuous reading"
                  className={`relative inline-flex w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    continuousReading 
                      ? 'bg-green-500 focus:ring-green-500' 
                      : isDarkMode 
                        ? 'bg-gray-600 focus:ring-gray-500' 
                        : 'bg-gray-300 focus:ring-gray-400'
                  }`}
                >
                  <span
                    className={`inline-block w-5 h-5 transform rounded-full bg-white shadow-md transition-transform ${
                      continuousReading ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setShowSettings(false);
                    setShowStats(true);
                  }}
                  className={`p-3 rounded-lg text-left ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <BarChart3 className="w-5 h-5 mb-1" />
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Statistics
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setShowSettings(false);
                    setShowHistory(true);
                  }}
                  className={`p-3 rounded-lg text-left ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <History className="w-5 h-5 mb-1" />
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    History
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render stats modal
  const renderStatsModal = () => {
    if (!showStats) return null;
    
    const totalReads = Object.values(readingStats).reduce((sum, stat) => sum + stat.count, 0);
    const totalTime = Object.values(readingStats).reduce((sum, stat) => sum + stat.totalTime, 0);
    const mostReadDuas = Object.entries(readingStats)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className={`w-full max-w-md rounded-2xl p-6 max-h-[80vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Reading Statistics
            </h3>
            <button
              onClick={() => setShowStats(false)}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Overall stats */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {totalReads}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Total reads
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {Math.round(totalTime / 60000)}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Minutes
                  </div>
                </div>
              </div>
            </div>
            
            {/* Most read duas */}
            {mostReadDuas.length > 0 && (
              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Most read duas
                </h4>
                <div className="space-y-2">
                  {mostReadDuas.map(([duaId, stats]) => {
                    const dua = duaData.English.flatMap(cat => cat.TEXT).find(d => d.ID.toString() === duaId);
                    if (!dua) return null;
                    
                    return (
                      <div key={duaId} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {dua.TRANSLATED_TEXT.substring(0, 50)}...
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {stats.count} times
                              </span>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {Math.round(stats.totalTime / 60000)} min
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render history modal
  const renderHistoryModal = () => {
    if (!showHistory) return null;
    
    const recentHistory = getRecentHistory();
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className={`w-full max-w-md rounded-2xl p-6 max-h-[80vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Recent Reading History
            </h3>
            <button
              onClick={() => setShowHistory(false)}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentHistory.length > 0 ? (
              recentHistory.map((session, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const categoryIndex = duaData.English.findIndex(cat => cat.ID === session.categoryId);
                    const duaIndex = duaData.English[categoryIndex]?.TEXT.findIndex(d => d.ID === session.duaId);
                    if (categoryIndex !== -1 && duaIndex !== -1) {
                      setCurrentCategoryIndex(categoryIndex);
                      setCurrentDuaIndex(duaIndex);
                      setCurrentView('dua');
                      setShowHistory(false);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {session.category?.TITLE}
                    </span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(session.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {session.dua?.TRANSLATED_TEXT.substring(0, 60)}...
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3" />
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Read for {Math.round(session.duration / 1000)}s
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8">
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No reading history yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
const renderNavigationTabs = () => {
  // Always visible except when in dua detail view
  if (currentView === 'dua') return null;
  
  return (
    <div className={`sticky top-16 z-10 border-b ${isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}>
      <div className="flex">
        <button
          onClick={() => {
            setCurrentView('categories');
            setSearchTerm(''); // Reset search when switching tabs
          }}
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            currentView === 'categories' && !searchTerm
              ? `border-green-500 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`
              : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Categories
        </button>
        <button
          onClick={() => {
            setCurrentView('favorites');
            setSearchTerm(''); // Reset search when switching tabs
          }}
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            currentView === 'favorites' && !searchTerm
              ? `border-green-500 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`
              : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
          }`}
        >
          <Heart className="w-4 h-4 inline mr-2" />
          Favorites ({favorites.size})
        </button>
      </div>
    </div>
  );
};

// Render categories view
const renderCategoriesView = () => {
  const filteredCategories = duaData.English.filter(category =>
    category.TITLE.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="grid gap-4">
        {filteredCategories.map((category) => (
          <button
            key={category.ID}
            onClick={() => selectCategory(category.ID)}
            className={`w-full text-left p-4 rounded-xl shadow-md transition-all ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {category.TITLE}
                </h3>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {category.TEXT.length} Duas
                </p>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Render favorites view
const renderFavoritesView = () => {
  const favoritesList = getFavoritesList();

  return (
    <div className="p-4">
      {favoritesList.length > 0 ? (
        <div className="space-y-4">
          {favoritesList.map((item, index) => (
            <button
              key={index}
              onClick={() => selectDuaFromSearch(item.categoryIndex, item.duaIndex)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
            >
              <div className="mb-2">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {item.category.TITLE}
                </span>
              </div>
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} dir="rtl">
                {item.dua.ARABIC_TEXT}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.dua.TRANSLATED_TEXT}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Heart className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No favorite duas yet
          </p>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Tap the heart icon to add duas to your favorites
          </p>
        </div>
      )}
    </div>
  );
};

// Render dua content
const renderDuaContent = () => {
  if (!currentCategory || !currentDua) return null;

  return (
    <div className="p-4 pb-24">
      <div className={`rounded-2xl shadow-xl p-6 mb-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
        {/* Arabic Text */}
        <div className="text-center mb-6">
          <p 
            className={`leading-relaxed ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
            style={{ 
              fontFamily: "'AmiriQuran', serif",
              textAlign: 'right',
              lineHeight: '2.5',
              direction: 'rtl',
              fontSize: `${fontSize + 8}px`
            }}
          >
            {currentDua.ARABIC_TEXT}
          </p>
        </div>

        {/* Transliteration */}
        {currentDua.LANGUAGE_ARABIC_TRANSLATED_TEXT && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Transliteration:
              </h3>
            </div>
            <p className={`leading-relaxed italic ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
               style={{ fontSize: `${fontSize}px` }}>
              {currentDua.LANGUAGE_ARABIC_TRANSLATED_TEXT}
            </p>
          </div>
        )}

        {/* Translation */}
        {currentDua.TRANSLATED_TEXT && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Translation:
              </h3>
            </div>
            <p className={`leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
               style={{ fontSize: `${fontSize}px` }}>
              {currentDua.TRANSLATED_TEXT}
            </p>
          </div>
        )}

        {/* Repeat count */}
        {currentDua.REPEAT > 1 && (
          <div className={`flex items-center justify-center space-x-2 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <RotateCcw className="w-4 h-4" />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Read {currentDua.REPEAT} times
            </span>
          </div>
        )}

        {/* Reading stats for current dua */}
        {readingStats[currentDua.ID.toString()] && (
          <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between text-sm">
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Read: {readingStats[currentDua.ID.toString()].count} times
              </span>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {Math.round(readingStats[currentDua.ID.toString()].totalTime / 60000)} minutes
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Render bottom controls
const renderBottomControls = () => {
  if (currentView !== 'dua' || !currentDua) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 rounded-t-2xl shadow-lg p-4 ${isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-100'}`}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousDua}
          className={`p-3 rounded-full transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-3">
          {/* Share button */}
          <button
            onClick={shareDua}
            className={`p-3 rounded-full transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Favorite button */}
          <button
            onClick={() => toggleFavorite(currentDua.ID.toString())}
            className={`p-3 rounded-full transition-all ${
              favorites.has(currentDua.ID.toString())
                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                : isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${favorites.has(currentDua.ID.toString()) ? 'fill-current' : ''}`} />
          </button>

          {/* Audio controls */}
          {currentDua.AUDIO && currentDua.AUDIO.trim() !== '' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              
              <button
                onClick={toggleAudio}
                className={`p-4 rounded-full transition-all ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white shadow-lg`}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            </div>
          )}

          {/* Continuous reading indicator */}
          {continuousReading && (
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
              <Repeat className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <button
          onClick={goToNextDua}
          className={`p-3 rounded-full transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Progress indicator */}
      <div>
        <div className={`w-full h-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className="h-1 bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentDuaIndex + 1) / currentCategory!.TEXT.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1">
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {currentDuaIndex + 1} / {currentCategory!.TEXT.length}
          </span>
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {Math.round(((currentDuaIndex + 1) / currentCategory!.TEXT.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Main render
return (
  <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'}`}>
    {renderHeader()}
    {renderNavigationTabs()}
    
    {currentView === 'categories' && renderCategoriesView()}
    {currentView === 'favorites' && renderFavoritesView()}
    {currentView === 'dua' && renderDuaContent()}
    
    {renderBottomControls()}
    {renderSearchOverlay()}
    {renderSettingsModal()}
    {renderStatsModal()}
    {renderHistoryModal()}

    {/* Audio element */}
    {currentDua?.AUDIO && currentDua.AUDIO.trim() !== '' && (
      <audio
        ref={audioRef}
        src={currentDua.AUDIO}
        onEnded={() => {
          setIsPlaying(false);
          if (continuousReading) {
            setTimeout(() => {
              goToNextDua();
            }, 2000);
          }
        }}
        onLoadStart={() => setIsPlaying(false)}
        onError={() => {
          console.error('Audio loading error');
          setIsPlaying(false);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    )}
  </div>
);
};

export default Dua;