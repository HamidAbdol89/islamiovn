import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { ChevronLeft, Sun, Calendar } from 'lucide-react';

// Import các component và hooks đã tách
import LoadingSpinner from './LoadingSpinner';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import DetailPanel from './DetailPanel';
import { useCalendarData, useCalendarNavigation, useCacheManager } from './hooks';
import type { NgayLich } from './types';
import { 
  THANG_HIJRI_VI, 
  THANG_GREGORIAN_VI, 
  THU_TRONG_TUAN_VI, 
  VAN_BAN_VI 
} from './constants';

// Component nút quay lại
const BackButton = React.memo(({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick || (() => window.history.back())}
    className="w-10 h-10 rounded-2xl transition-all duration-200 bg-muted hover:bg-muted/80 active:bg-muted/60 text-muted-foreground shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
  >
    <ChevronLeft className="w-5 h-5 mx-auto" />
  </button>
));

// Component nút làm mới
const RefreshButton = React.memo(({ onClick, className = "" }: { onClick: () => void; className?: string }) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 rounded-2xl transition-all duration-200 bg-primary/10 hover:bg-primary/20 active:bg-primary/30 text-primary shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 ${className}`}
  >
    <Calendar className="w-5 h-5 mx-auto" />
  </button>
));

const LichHijri = memo(() => {
  // Sử dụng custom hooks
  const { 
    monthData, 
    loading, 
    error, 
    fetchMonthData 
  } = useCalendarData();
  
  const { 
    currentMonth, 
    currentYear, 
    isTransitioning, 
    navigateMonth, 
    goToCurrentMonth 
  } = useCalendarNavigation();

  // Sử dụng cache manager để tối ưu hiệu suất
  useCacheManager({
    enablePreloading: true,
    preloadRange: 2,
    autoCleanup: true
  });

  // State cho UI với lazy initial state
  const [selectedDay, setSelectedDay] = useState<NgayLich | null>(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  // Memoized constants tiếng Việt - không cần useMemo vì đã là constants
  const hijriMonthsVi = THANG_HIJRI_VI;
  const gregorianMonthsVi = THANG_GREGORIAN_VI;
  const weekdaysVi = THU_TRONG_TUAN_VI;

  // Memoized time formatter
  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }, []);

  // Cập nhật thời gian hiện tại
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Tải dữ liệu khi tháng/năm thay đổi
  useEffect(() => {
    fetchMonthData(currentMonth, currentYear);
  }, [currentMonth, currentYear, fetchMonthData]);

  // Memoized handlers
  const handleDaySelect = useCallback((day: NgayLich) => {
    setSelectedDay(day);
    setShowDetailPanel(true);
  }, []);

  const handleClosePanel = useCallback(() => {
    setShowDetailPanel(false);
  }, []);

  // Memoized class names for performance
  const headerTimeClasses = useMemo(() => 
    "inline-flex items-center px-4 py-2 lg:px-6 lg:py-3 rounded-2xl bg-muted/80 backdrop-blur-sm border border-border",
    []
  );

  const timeDisplayClasses = useMemo(() => 
    "font-mono font-semibold text-sm lg:text-lg text-foreground tracking-wider",
    []
  );

  const errorContainerClasses = useMemo(() => 
    "w-full min-h-screen flex items-center justify-center bg-background p-6",
    []
  );

  const errorCardClasses = useMemo(() => 
    "p-10 text-center rounded-3xl max-w-md w-full bg-card backdrop-blur-xl border border-destructive/20 shadow-luxury",
    []
  );

  // Hiển thị loading
  if (loading) return <LoadingSpinner />;

  // Hiển thị lỗi
  if (error) return (
    <div className={errorContainerClasses}>
      <div className={errorCardClasses}>
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-lg mb-6 text-destructive font-medium">
          {error}
        </p>
        <button
          onClick={() => fetchMonthData(currentMonth, currentYear)}
          className="px-8 py-3 rounded-full font-medium transition-all duration-300 bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {VAN_BAN_VI.THU_LAI}
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 lg:mb-6">
          <BackButton />
          
          <div className={headerTimeClasses}>
            <Sun className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3 text-amber-500" />
            <span className={timeDisplayClasses}>
              {formatTime(currentTime)}
            </span>
          </div>

          <RefreshButton onClick={goToCurrentMonth} className="lg:hidden" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-3 overflow-hidden">
            <CalendarHeader
              currentMonth={currentMonth}
              currentYear={currentYear}
              onNavigate={navigateMonth}
              isTransitioning={isTransitioning}
              gregorianMonthsVi={gregorianMonthsVi}
            />
            
            <CalendarGrid
              monthData={monthData}
              selectedDay={selectedDay}
              onDaySelect={handleDaySelect}
              isTransitioning={isTransitioning}
              weekdaysVi={weekdaysVi}
            />
          </div>

          {/* Detail Panel - Mobile */}
          {selectedDay && (
            <DetailPanel
              selectedDay={selectedDay}
              showDetailPanel={showDetailPanel}
              onClose={handleClosePanel}
              hijriMonthsVi={hijriMonthsVi}
              gregorianMonthsVi={gregorianMonthsVi}
            />
          )}

          {/* Detail Panel - Desktop */}
          <div className="hidden lg:block space-y-6">
            {selectedDay && (
              <div className="p-6 rounded-3xl bg-card backdrop-blur-xl border border-border shadow-luxury">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-xl bg-primary/10 mr-3">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {VAN_BAN_VI.CHI_TIET_NGAY}
                  </h3>
                </div>
                
                <div className="p-5 mb-5 rounded-2xl bg-muted/50 border border-border">
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                    {VAN_BAN_VI.LICH_GREGORIAN}
                  </h4>
                  <p className="text-3xl font-bold mb-2 text-primary">
                    {selectedDay.gregorian.day}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {gregorianMonthsVi[parseInt(selectedDay.gregorian.month.number.toString()) - 1]} {selectedDay.gregorian.year}
                  </p>
                </div>
                
                <div className="p-5 mb-5 rounded-2xl bg-teal-50/80 dark:bg-teal-900/20 border border-teal-200/50 dark:border-teal-800/50">
                  <h4 className="font-semibold mb-3 text-sm text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                    {VAN_BAN_VI.LICH_HIJRI}
                  </h4>
                  <p className="text-3xl font-bold mb-2 text-teal-600 dark:text-teal-400">
                    {selectedDay.hijri.day}
                  </p>
                  <p className="text-sm mb-2 text-foreground font-medium">
                    {hijriMonthsVi[selectedDay.hijri.month.number - 1]} {selectedDay.hijri.year}H
                  </p>
                  <p className="text-xs text-muted-foreground font-arabic">
                    {selectedDay.hijri.month.ar}
                  </p>
                </div>
                
                {selectedDay.hijri.holidays && selectedDay.hijri.holidays.length > 0 && (
                  <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50">
                    <div className="flex items-center mb-3">
                      <span className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400">⭐</span>
                      <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                        {VAN_BAN_VI.LE_DAC_BIET}
                      </h4>
                    </div>
                    {selectedDay.hijri.holidays.map((holiday: string, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center text-sm mb-2 p-3 rounded-xl bg-card/60 backdrop-blur-sm"
                      >
                        <span className="text-lg mr-3">🌙</span>
                        <span className="text-foreground font-medium">{holiday}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Current month button - Desktop */}
            <div className="text-center">
              <button
                onClick={goToCurrentMonth}
                className="px-8 py-4 font-semibold transition-all duration-300 rounded-2xl bg-luxury-gradient hover:opacity-90 active:opacity-80 text-white shadow-luxury hover:shadow-luxury-dark transform hover:-translate-y-1 active:translate-y-0 backdrop-blur-sm"
              >
                <span className="mr-2">📅</span>
                {VAN_BAN_VI.VE_THANG_HIEN_TAI}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Set display names for debugging
BackButton.displayName = 'BackButton';
RefreshButton.displayName = 'RefreshButton';
LichHijri.displayName = 'LichHijri';

export default LichHijri;