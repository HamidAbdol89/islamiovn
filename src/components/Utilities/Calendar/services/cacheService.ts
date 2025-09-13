import type { NgayLich } from '../types';

interface CacheEntry {
  data: NgayLich[];
  timestamp: number;
  version: string;
}

interface CacheMetadata {
  totalSize: number;
  lastCleanup: number;
  version: string;
}

class CalendarCacheService {
  private static instance: CalendarCacheService;
  private memoryCache = new Map<string, CacheEntry>();
  private readonly CACHE_VERSION = '1.0.0';
  private readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 ngày
  private readonly MAX_MEMORY_ENTRIES = 24; // 24 tháng trong memory
  private readonly STORAGE_KEY = 'hijri_calendar_cache';
  private readonly METADATA_KEY = 'hijri_calendar_metadata';

  private constructor() {
    this.loadFromStorage();
    this.scheduleCleanup();
  }

  static getInstance(): CalendarCacheService {
    if (!CalendarCacheService.instance) {
      CalendarCacheService.instance = new CalendarCacheService();
    }
    return CalendarCacheService.instance;
  }

  // Tạo cache key
  private createKey(month: number, year: number): string {
    return `${month}-${year}`;
  }

  // Kiểm tra cache entry có hợp lệ không
  private isValidEntry(entry: CacheEntry): boolean {
    const now = Date.now();
    const isNotExpired = (now - entry.timestamp) < this.CACHE_DURATION;
    const isCorrectVersion = entry.version === this.CACHE_VERSION;
    return isNotExpired && isCorrectVersion && Array.isArray(entry.data);
  }

  // Lấy dữ liệu từ cache
  async get(month: number, year: number): Promise<NgayLich[] | null> {
    const key = this.createKey(month, year);
    
    // Kiểm tra memory cache trước
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && this.isValidEntry(memoryEntry)) {
      return memoryEntry.data;
    }

    // Kiểm tra localStorage
    try {
      const storageData = localStorage.getItem(`${this.STORAGE_KEY}_${key}`);
      if (storageData) {
        const entry: CacheEntry = JSON.parse(storageData);
        if (this.isValidEntry(entry)) {
          // Đưa vào memory cache để truy cập nhanh hơn
          this.memoryCache.set(key, entry);
          return entry.data;
        } else {
          // Xóa entry không hợp lệ
          localStorage.removeItem(`${this.STORAGE_KEY}_${key}`);
        }
      }
    } catch (error) {
      console.warn('Lỗi đọc cache từ localStorage:', error);
    }

    return null;
  }

  // Lưu dữ liệu vào cache
  async set(month: number, year: number, data: NgayLich[]): Promise<void> {
    const key = this.createKey(month, year);
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      version: this.CACHE_VERSION
    };

    // Lưu vào memory cache
    this.memoryCache.set(key, entry);
    this.cleanupMemoryCache();

    // Lưu vào localStorage
    try {
      const serialized = JSON.stringify(entry);
      localStorage.setItem(`${this.STORAGE_KEY}_${key}`, serialized);
      this.updateMetadata();
    } catch (error) {
      console.warn('Lỗi lưu cache vào localStorage:', error);
      // Nếu localStorage đầy, dọn dẹp và thử lại
      await this.cleanupStorage();
      try {
        localStorage.setItem(`${this.STORAGE_KEY}_${key}`, JSON.stringify(entry));
      } catch (retryError) {
        console.error('Không thể lưu cache sau khi dọn dẹp:', retryError);
      }
    }
  }

  // Preload các tháng liền kề
  async preloadAdjacentMonths(currentMonth: number, currentYear: number, range: number = 2): Promise<void> {
    const monthsToPreload = this.getAdjacentMonths(currentMonth, currentYear, range);
    
    const preloadPromises = monthsToPreload.map(async ({ month, year }) => {
      const cached = await this.get(month, year);
      
      if (!cached) {
        try {
          const response = await fetch(
            `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`
          );
          if (response.ok) {
            const result = await response.json();
            if (result?.data) {
              await this.set(month, year, result.data);
            }
          }
        } catch (error) {
          console.log(`Không thể preload tháng ${month}/${year}:`, error);
        }
      }
    });

    // Chạy song song nhưng không chờ tất cả hoàn thành
    Promise.allSettled(preloadPromises);
  }

  // Lấy danh sách các tháng liền kề
  private getAdjacentMonths(month: number, year: number, range: number = 1): Array<{month: number, year: number}> {
    const months: Array<{month: number, year: number}> = [];
    
    for (let i = -range; i <= range; i++) {
      if (i === 0) continue; // Bỏ qua tháng hiện tại
      
      let targetMonth = month + i;
      let targetYear = year;
      
      if (targetMonth > 12) {
        targetMonth -= 12;
        targetYear += 1;
      } else if (targetMonth < 1) {
        targetMonth += 12;
        targetYear -= 1;
      }
      
      months.push({ month: targetMonth, year: targetYear });
    }
    
    return months;
  }

  // Dọn dẹp memory cache
  private cleanupMemoryCache(): void {
    if (this.memoryCache.size <= this.MAX_MEMORY_ENTRIES) return;

    // Sắp xếp theo timestamp và xóa các entry cũ nhất
    const entries = Array.from(this.memoryCache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);
    
    const toDelete = entries.slice(0, entries.length - this.MAX_MEMORY_ENTRIES);
    toDelete.forEach(([key]) => this.memoryCache.delete(key));
  }

  // Dọn dẹp localStorage
  private async cleanupStorage(): Promise<void> {
    try {
      const keysToCheck: string[] = [];
      
      // Tìm tất cả cache keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_KEY)) {
          keysToCheck.push(key);
        }
      }

      // Xóa các entry không hợp lệ hoặc cũ
      for (const key of keysToCheck) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const entry: CacheEntry = JSON.parse(data);
            if (!this.isValidEntry(entry)) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          localStorage.removeItem(key);
        }
      }

      this.updateMetadata();
    } catch (error) {
      console.error('Lỗi dọn dẹp localStorage:', error);
    }
  }

  // Cập nhật metadata
  private updateMetadata(): void {
    const metadata: CacheMetadata = {
      totalSize: this.calculateStorageSize(),
      lastCleanup: Date.now(),
      version: this.CACHE_VERSION
    };
    
    try {
      localStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.warn('Không thể cập nhật metadata:', error);
    }
  }

  // Tính kích thước storage
  private calculateStorageSize(): number {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.STORAGE_KEY)) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }
    }
    return totalSize;
  }

  // Load cache từ localStorage khi khởi tạo
  private loadFromStorage(): void {
    try {
      // Load một số entry gần đây vào memory
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      const recentMonths = this.getAdjacentMonths(currentMonth, currentYear, 3);
      recentMonths.push({ month: currentMonth, year: currentYear });

      for (const { month, year } of recentMonths) {
        const key = this.createKey(month, year);
        const storageData = localStorage.getItem(`${this.STORAGE_KEY}_${key}`);
        if (storageData) {
          try {
            const entry: CacheEntry = JSON.parse(storageData);
            if (this.isValidEntry(entry)) {
              this.memoryCache.set(key, entry);
            }
          } catch {
            localStorage.removeItem(`${this.STORAGE_KEY}_${key}`);
          }
        }
      }
    } catch (error) {
      console.warn('Lỗi load cache từ localStorage:', error);
    }
  }

  // Lên lịch dọn dẹp định kỳ
  private scheduleCleanup(): void {
    // Dọn dẹp mỗi 30 phút
    setInterval(() => {
      this.cleanupStorage();
    }, 30 * 60 * 1000);
  }

  // Xóa toàn bộ cache
  async clearAll(): Promise<void> {
    this.memoryCache.clear();
    
    try {
      const keysToDelete: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_KEY) || key === this.METADATA_KEY) {
          keysToDelete.push(key);
        }
      }
      
      keysToDelete.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Lỗi xóa cache:', error);
    }
  }

  // Lấy thống kê cache
  getStats(): {
    memoryEntries: number;
    storageSize: number;
    version: string;
  } {
    return {
      memoryEntries: this.memoryCache.size,
      storageSize: this.calculateStorageSize(),
      version: this.CACHE_VERSION
    };
  }
}

export default CalendarCacheService;