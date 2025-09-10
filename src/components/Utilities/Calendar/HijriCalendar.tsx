import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sun, Star, ChevronDown } from 'lucide-react';

// Interfaces
interface HijriDay {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
    ar: string;
  };
  month: {
    number: number;
    en: string;
    ar: string;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
  holidays: string[];
}

interface GregorianDay {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
  };
  month: {
    number: number;
    en: string;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
}

interface CalendarDay {
  hijri: HijriDay;
  gregorian: GregorianDay;
}

interface MonthData {
  code: number;
  status: string;
  data: CalendarDay[];
}

// Memoized components
const LoadingSpinner = memo(() => (
  <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="flex flex-col items-center p-16 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin" />
      </div>
      <span className="font-medium text-lg text-gray-600 dark:text-gray-300 tracking-wide">
        Loading Hijri Calendar...
      </span>
    </div>
  </div>
));

const CalendarDayButton = memo(({ 
  day, 
  isSelected, 
  isToday, 
  hasHoliday, 
  onSelect 
}: {
  day: CalendarDay;
  isSelected: boolean;
  isToday: boolean;
  hasHoliday: boolean;
  onSelect: (day: CalendarDay) => void;
}) => {
  const handleClick = useCallback(() => {
    onSelect(day);
  }, [day, onSelect]);

  const buttonClass = useMemo(() => {
    let classes = "relative py-4 px-2 text-center transition-colors duration-200 ";
    
    if (isSelected) {
      classes += "bg-blue-500 text-white";
    } else if (isToday) {
      classes += "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200";
    } else if (hasHoliday) {
      classes += "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200";
    } else {
      classes += "hover:bg-gray-100 dark:hover:bg-gray-800";
    }
    
    return classes;
  }, [isSelected, isToday, hasHoliday]);

  return (
    <button onClick={handleClick} className={buttonClass}>
      <div className="text-sm font-medium">
        {day.gregorian.day}
      </div>
      <div className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
        {day.hijri.day}
      </div>
      {hasHoliday && (
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
      )}
      {isToday && !isSelected && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
      )}
    </button>
  );
});

const DetailPanel = memo(({ 
  selectedDay, 
  showDetailPanel, 
  onClose, 
  hijriMonthsEn, 
  gregorianMonthsEn 
}: {
  selectedDay: CalendarDay;
  showDetailPanel: boolean;
  onClose: () => void;
  hijriMonthsEn: string[];
  gregorianMonthsEn: string[];
}) => {
  if (!selectedDay) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-10 lg:hidden transition-opacity duration-300 ${
          showDetailPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <div className={`fixed bottom-0 left-0 right-0 z-20 p-6 rounded-t-3xl bg-white dark:bg-gray-900 shadow-2xl lg:hidden transition-transform duration-300 ${
        showDetailPanel ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 mr-3">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Day Details
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50">
            <h4 className="font-semibold mb-2 text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Gregorian Calendar
            </h4>
            <p className="text-2xl font-bold mb-1 text-blue-600 dark:text-blue-400">
              {selectedDay.gregorian.day}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {gregorianMonthsEn[parseInt(selectedDay.gregorian.month.number.toString()) - 1]} {selectedDay.gregorian.year}
            </p>
          </div>
          
          <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-900/20 border border-teal-200/50 dark:border-teal-800/50">
            <h4 className="font-semibold mb-2 text-xs text-teal-600 dark:text-teal-400 uppercase tracking-wide">
              Hijri Calendar
            </h4>
            <p className="text-2xl font-bold mb-1 text-teal-600 dark:text-teal-400">
              {selectedDay.hijri.day}
            </p>
            <p className="text-xs mb-1 text-gray-700 dark:text-gray-300 font-medium">
              {hijriMonthsEn[selectedDay.hijri.month.number - 1]} {selectedDay.hijri.year}H
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 font-arabic">
              {selectedDay.hijri.month.ar}
            </p>
          </div>
          
          {selectedDay.hijri.holidays && selectedDay.hijri.holidays.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50">
              <div className="flex items-center mb-2">
                <Star className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
                <h4 className="font-semibold text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                  Special Holidays
                </h4>
              </div>
              {selectedDay.hijri.holidays.map((holiday, index) => (
                <div 
                  key={index}
                  className="flex items-center text-xs mb-1 p-2 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm"
                >
                  <span className="text-base mr-2">🌙</span>
                  <span className="text-gray-900 dark:text-white font-medium">{holiday}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
});

const RefreshButton = memo(({ onClick, className = "" }: { onClick: () => void; className?: string }) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 rounded-2xl transition-all duration-200 bg-blue-100 hover:bg-blue-200 active:bg-blue-300 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 dark:active:bg-blue-700/50 text-blue-600 dark:text-blue-400 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 ${className}`}
  >
    <Calendar className="w-5 h-5 mx-auto" />
  </button>
));

const BackButton = memo(({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick || (() => window.history.back())}
    className="w-10 h-10 rounded-2xl transition-all duration-200 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 text-gray-600 dark:text-gray-400 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
  >
    <ChevronLeft className="w-5 h-5 mx-auto" />
  </button>
));

const HijriCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [monthData, setMonthData] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Cache for loaded data
  const [dataCache, setDataCache] = useState<Map<string, CalendarDay[]>>(new Map());

  // Memoized constants
  const hijriMonthsEn = useMemo(() => [
    'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ], []);

  const gregorianMonthsEn = useMemo(() => [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ], []);

  const weekdaysEn = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], []);

  // Memoized cache key
  const cacheKey = useMemo(() => `${currentMonth}-${currentYear}`, [currentMonth, currentYear]);

  // Debounced API call
  const fetchMonthData = useCallback(async (month: number, year: number) => {
    const key = `${month}-${year}`;
    
    // Check cache first
    if (dataCache.has(key)) {
      setMonthData(dataCache.get(key)!);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to load Hijri calendar data');
      }
      
      const data: MonthData = await response.json();
      
      if (data && data.data && Array.isArray(data.data)) {
        setMonthData(data.data);
        
        // Save to cache
        setDataCache(prev => new Map(prev).set(key, data.data));
        
        // Auto-select today if viewing current month
        const today = new Date();
        if (month === today.getMonth() + 1 && year === today.getFullYear()) {
          const todayData = data.data.find(day => {
            if (day && day.gregorian && day.gregorian.day) {
              return parseInt(day.gregorian.day) === today.getDate();
            }
            return false;
          });
          if (todayData) {
            setSelectedDay(todayData);
          }
        }
      } else {
        throw new Error('Invalid API data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error loading Hijri data:', err);
    } finally {
      setLoading(false);
    }
  }, [dataCache]);

  // Preload adjacent months
  const preloadAdjacentMonths = useCallback(async (month: number, year: number) => {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    const prevKey = `${prevMonth}-${prevYear}`;
    const nextKey = `${nextMonth}-${nextYear}`;

    // Preload previous month
    if (!dataCache.has(prevKey)) {
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/gToHCalendar/${prevMonth}/${prevYear}`
        );
        if (response.ok) {
          const data: MonthData = await response.json();
          if (data && data.data) {
            setDataCache(prev => new Map(prev).set(prevKey, data.data));
          }
        }
      } catch (err) {
        console.log('Preload failed for previous month:', err);
      }
    }

    // Preload next month
    if (!dataCache.has(nextKey)) {
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/gToHCalendar/${nextMonth}/${nextYear}`
        );
        if (response.ok) {
          const data: MonthData = await response.json();
          if (data && data.data) {
            setDataCache(prev => new Map(prev).set(nextKey, data.data));
          }
        }
      } catch (err) {
        console.log('Preload failed for next month:', err);
      }
    }
  }, [dataCache]);

  // Timer for current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch data when month/year changes
  useEffect(() => {
    fetchMonthData(currentMonth, currentYear);
  }, [currentMonth, currentYear, fetchMonthData]);

  // Preload adjacent months after loading current month
  useEffect(() => {
    if (!loading && monthData.length > 0) {
      const timer = setTimeout(() => {
        preloadAdjacentMonths(currentMonth, currentYear);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, monthData, currentMonth, currentYear, preloadAdjacentMonths]);

  // Optimized navigation with smooth transitions
  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setSelectedDay(null);
    
    setTimeout(() => {
      if (direction === 'prev') {
        if (currentMonth === 1) {
          setCurrentMonth(12);
          setCurrentYear(currentYear - 1);
        } else {
          setCurrentMonth(currentMonth - 1);
        }
      } else {
        if (currentMonth === 12) {
          setCurrentMonth(1);
          setCurrentYear(currentYear + 1);
        } else {
          setCurrentMonth(currentMonth + 1);
        }
      }
      setIsTransitioning(false);
    }, 150);
  }, [currentMonth, currentYear, isTransitioning]);

  // Memoized today check
const isToday = useCallback((day: CalendarDay): boolean => {
  if (!day || !day.gregorian || !day.gregorian.day) return false;
  
  const today = new Date();
  return (
    parseInt(day.gregorian.day) === today.getDate() &&
    parseInt(day.gregorian.month.number.toString()) === today.getMonth() + 1 &&
    parseInt(day.gregorian.year) === today.getFullYear()
  );
}, []);

  // Memoized time formatter
  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }, []);

  // Optimized day selection
  const handleDaySelect = useCallback((day: CalendarDay) => {
    setSelectedDay(day);
    setShowDetailPanel(true);
  }, []);

  const handleClosePaneel = useCallback(() => {
    setShowDetailPanel(false);
  }, []);

  const handleRefresh = useCallback(() => {
    const now = new Date();
    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
  }, []);

  // Memoized calendar days
  const calendarDays = useMemo(() => {
    return monthData.map((day, index) => {
      if (!day || !day.gregorian || !day.hijri) {
        return null;
      }
      
      const isSelected = selectedDay?.gregorian?.date === day.gregorian.date;
      const isTodayDay = isToday(day);
      const hasHoliday = day.hijri.holidays && day.hijri.holidays.length > 0;
      
      return (
        <CalendarDayButton
          key={`${day.gregorian.date}-${index}`}
          day={day}
          isSelected={isSelected}
          isToday={isTodayDay}
          hasHoliday={hasHoliday}
          onSelect={handleDaySelect}
        />
      );
    });
  }, [monthData, selectedDay, isToday, handleDaySelect]);

  if (loading && !dataCache.has(cacheKey)) return <LoadingSpinner />;
  
  if (error) return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
      <div className="p-10 text-center rounded-3xl max-w-md w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-red-200/50 dark:border-red-800/50 shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-lg mb-6 text-red-700 dark:text-red-400 font-medium">
          {error}
        </p>
        <button
          onClick={() => fetchMonthData(currentMonth, currentYear)}
          className="px-8 py-3 rounded-full font-medium transition-all duration-300 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 lg:mb-6">
          <BackButton />
          
          <div className="inline-flex items-center px-4 py-2 lg:px-6 lg:py-3 rounded-2xl bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <Sun className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3 text-amber-500 dark:text-amber-400" />
            <span className="font-mono font-semibold text-sm lg:text-lg text-gray-700 dark:text-gray-300 tracking-wider">
              {formatTime(currentTime)}
            </span>
          </div>

          <RefreshButton onClick={handleRefresh} className="lg:hidden" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-3 overflow-hidden">
            <div className={`p-4 sm:p-6 lg:p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl transition-opacity duration-300 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}>
              {/* Navigation Header */}
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <button
                  onClick={() => navigateMonth('prev')}
                  disabled={isTransitioning}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl transition-all duration-200 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 text-gray-600 dark:text-gray-400 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 mx-auto" />
                </button>
                
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {gregorianMonthsEn[currentMonth - 1]} {currentYear}
                  </h2>
                  <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Gregorian Calendar
                  </p>
                </div>
                
                <button
                  onClick={() => navigateMonth('next')}
                  disabled={isTransitioning}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl transition-all duration-200 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 text-gray-600 dark:text-gray-400 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 mx-auto" />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 lg:gap-2 mb-4 lg:mb-6">
                {weekdaysEn.map((day, index) => (
                  <div 
                    key={index}
                    className="text-center py-2 lg:py-4 font-semibold text-xs lg:text-sm rounded-xl lg:rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-0.5 w-full">
                {calendarDays}
              </div>
            </div>
          </div>

          {/* Detail Panel - Mobile */}
          {selectedDay && (
            <DetailPanel
              selectedDay={selectedDay}
              showDetailPanel={showDetailPanel}
              onClose={handleClosePaneel}
              hijriMonthsEn={hijriMonthsEn}
              gregorianMonthsEn={gregorianMonthsEn}
            />
          )}

          {/* Detail Panel - Desktop */}
          <div className="hidden lg:block space-y-6">
            {selectedDay && (
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 mr-3">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Day Details
                  </h3>
                </div>
                
                <div className="p-5 mb-5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50">
                  <h4 className="font-semibold mb-3 text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Gregorian Calendar
                  </h4>
                  <p className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                    {selectedDay.gregorian.day}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {gregorianMonthsEn[parseInt(selectedDay.gregorian.month.number.toString()) - 1]} {selectedDay.gregorian.year}
                  </p>
                </div>
                
                <div className="p-5 mb-5 rounded-2xl bg-teal-50/80 dark:bg-teal-900/20 border border-teal-200/50 dark:border-teal-800/50">
                  <h4 className="font-semibold mb-3 text-sm text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                    Hijri Calendar
                  </h4>
                  <p className="text-3xl font-bold mb-2 text-teal-600 dark:text-teal-400">
                    {selectedDay.hijri.day}
                  </p>
                  <p className="text-sm mb-2 text-gray-700 dark:text-gray-300 font-medium">
                    {hijriMonthsEn[selectedDay.hijri.month.number - 1]} {selectedDay.hijri.year}H
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 font-arabic">
                    {selectedDay.hijri.month.ar}
                  </p>
                </div>
                
                {selectedDay.hijri.holidays && selectedDay.hijri.holidays.length > 0 && (
                  <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50">
                    <div className="flex items-center mb-3">
                      <Star className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
                      <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                        Special Holidays
                      </h4>
                    </div>
                    {selectedDay.hijri.holidays.map((holiday, index) => (
                      <div 
                        key={index}
                        className="flex items-center text-sm mb-2 p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm"
                      >
                        <span className="text-lg mr-3">🌙</span>
                        <span className="text-gray-900 dark:text-white font-medium">{holiday}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Current month button - Desktop */}
            <div className="text-center">
              <button
                onClick={() => {
                  const now = new Date();
                  setCurrentMonth(now.getMonth() + 1);
                  setCurrentYear(now.getFullYear());
                }}
                className="px-8 py-4 font-semibold transition-all duration-300 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:from-blue-700 active:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 backdrop-blur-sm"
              >
                <span className="mr-2">📅</span>
                Go to Current Month
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HijriCalendar;