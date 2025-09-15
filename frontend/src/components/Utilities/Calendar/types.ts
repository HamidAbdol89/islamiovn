// Giao diện cho dữ liệu lịch Hijri
export interface NgayHijri {
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

// Giao diện cho dữ liệu lịch Gregorian
export interface NgayGregorian {
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

// Giao diện cho một ngày trong lịch
export interface NgayLich {
  hijri: NgayHijri;
  gregorian: NgayGregorian;
}

// Giao diện cho dữ liệu tháng từ API
export interface DuLieuThang {
  code: number;
  status: string;
  data: NgayLich[];
}

// Props cho các component
export interface CalendarDayButtonProps {
  day: NgayLich;
  isSelected: boolean;
  isToday: boolean;
  hasHoliday: boolean;
  onSelect: (day: NgayLich) => void;
}

export interface DetailPanelProps {
  selectedDay: NgayLich;
  showDetailPanel: boolean;
  onClose: () => void;
  hijriMonthsVi: readonly string[];
  gregorianMonthsVi: readonly string[];
}

export interface CalendarHeaderProps {
  currentMonth: number;
  currentYear: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  isTransitioning: boolean;
  gregorianMonthsVi: readonly string[];
}

export interface CalendarGridProps {
  monthData: NgayLich[];
  selectedDay: NgayLich | null;
  onDaySelect: (day: NgayLich) => void;
  isTransitioning: boolean;
  weekdaysVi: readonly string[];
}

// Hook return types
export interface UseCalendarDataReturn {
  monthData: NgayLich[];
  loading: boolean;
  error: string | null;
  fetchMonthData: (month: number, year: number) => Promise<void>;
  dataCache: Map<string, NgayLich[]>;
}

export interface UseCalendarNavigationReturn {
  currentMonth: number;
  currentYear: number;
  isTransitioning: boolean;
  navigateMonth: (direction: 'prev' | 'next') => void;
  goToCurrentMonth: () => void;
}
