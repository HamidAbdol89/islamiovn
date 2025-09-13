# Hướng dẫn tích hợp Quran JSON vào Muslim Webapp

## 🚀 Tổng quan

Dự án này tích hợp data Quran từ repository `semarketir/quranjson` vào webapp React + Vite + TypeScript + Shadcn/UI với các tính năng:

- ✅ **Stream Audio**: Audio được stream trực tiếp từ CDN, không tải về
- ✅ **Cache JSON**: Tất cả data JSON được cache trong memory
- ✅ **Multi-language**: Hỗ trợ nhiều ngôn ngữ translation
- ✅ **Audio Player**: Player hoàn chỉnh với controls
- ✅ **Responsive UI**: UI responsive với Shadcn/UI

## 📁 Cấu trúc Files

```
src/
├── types/
│   └── quran.ts           # TypeScript interfaces
├── services/
│   └── quranApi.ts        # API service với caching
├── components/
│   ├── QuranPlayer.tsx    # Audio player component  
│   └── QuranReader.tsx    # Main reader component
└── styles/
    └── globals.css        # CSS cho Arabic fonts
```

## 🔧 Cài đặt Dependencies

```bash
# Shadcn/UI components cần thiết
npx shadcn-ui@latest add button card select badge scroll-area separator slider

# Lucide icons (nếu chưa có)
npm install lucide-react
```

## 📝 Setup CSS cho Arabic Font

Thêm vào `src/styles/globals.css`:

```css
/* Arabic font support */
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap');

.font-arabic {
  font-family: 'Amiri', 'Scheherazade New', serif;
  direction: rtl;
  text-align: right;
  line-height: 2;
  font-size: 1.5rem;
}

/* Responsive Arabic text */
@media (max-width: 768px) {
  .font-arabic {
    font-size: 1.25rem;
    line-height: 1.8;
  }
}
```

## 🎯 Cách sử dụng

### 1. Import và sử dụng trong App

```tsx
// App.tsx
import { QuranReader } from './components/QuranReader';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <QuranReader />
    </div>
  );
}
```

### 2. Sử dụng API service riêng lẻ

```tsx
import { quranApi } from './services/quranApi';

// Lấy danh sách surah
const surahs = await quranApi.getAllSurah();

// Lấy nội dung surah
const surah = await quranApi.getSurah(1); // Al-Fatihah

// Lấy translation
const translation = await quranApi.getTranslation('id', 1);

// Stream audio URL
const audioUrl = quranApi.getAudioUrl(1, 1); // Surah 1, Verse 1
```

### 3. Tùy chỉnh Player

```tsx
<QuranPlayer
  surahNumber={1}
  verseNumber={1}
  surahTitle="Al-Fatihah"
  maxVerses={7}
  onVerseChange={(verse) => console.log('Changed to verse:', verse)}
/>
```

## ⚡ Tối ưu Performance

### 1. Lazy Loading Component

```tsx
// Lazy load QuranReader
import { lazy, Suspense } from 'react';

const QuranReader = lazy(() => import('./components/QuranReader'));

function App() {
  return (
    <Suspense fallback={<div>Loading Quran...</div>}>
      <QuranReader />
    </Suspense>
  );
}
```

### 2. Preload Critical Data

```tsx
// Preload trong useEffect
useEffect(() => {
  quranApi.preloadEssentialData();
}, []);
```

### 3. Audio Preloading

```tsx
// Preload next verse audio
useEffect(() => {
  const nextAudio = new Audio(
    quranApi.getAudioUrl(surahNumber, verseNumber + 1)
  );
  nextAudio.preload = 'metadata';
}, [surahNumber, verseNumber]);
```

## 🌐 Network Strategy

- **JSON Data**: Cache aggressive, load once
- **Audio Files**: Stream only, no caching (vì nặng)
- **CDN**: Sử dụng GitHub raw CDN cho reliability

## 📱 Mobile Optimization

```tsx
// Touch-friendly controls
const [touchStartX, setTouchStartX] = useState(0);

const handleTouchStart = (e: TouchEvent) => {
  setTouchStartX(e.touches[0].clientX);
};

const handleTouchEnd = (e: TouchEvent) => {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      // Swipe left - next verse
      setCurrentVerse(v => Math.min(v + 1, maxVerses));
    } else {
      // Swipe right - previous verse
      setCurrentVerse(v => Math.max(v - 1, 1));
    }
  }
};
```

## 🔒 Error Handling

```tsx
// Retry mechanism
const fetchWithRetry = async (url: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

## 📈 Monitoring & Analytics

```tsx
// Track usage
const trackVersePlay = (surah: number, verse: number) => {
  // Analytics tracking
  gtag('event', 'verse_play', {
    surah_number: surah,
    verse_number: verse
  });
};
```

## 🚀 Production Tips

1. **CDN Fallback**: Có backup CDN nếu GitHub raw down
```tsx
const CDN_URLS = [
  'https://raw.githubusercontent.com/semarketir/quranjson/master/source',
  'https://rawgit.com/semarketir/quranjson/master/source',
  'https://cdn.jsdelivr.net/gh/semarketir/quranjson/source'
];
```

2. **Service Worker**: Cache JSON files offline
```js
// sw.js
const CACHE_NAME = 'quran-cache-v1';
const CACHE_URLS = [
  '/api/surah.json',
  '/api/juz.json'
];

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('.json')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
```

3. **Bundle Optimization**: Code splitting theo surah
```tsx
const SurahComponent = lazy(() => 
  import(`./surah/Surah${surahNumber}`)
);
```

## 🎨 Customization Options

### Theme Integration
```tsx
// Dark/Light mode support
const QuranReader = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`quran-reader ${theme}`}>
      {/* Content */}
    </div>
  );
};
```

### Custom Audio Player Skins
```tsx
interface PlayerTheme {
  primary: string;
  secondary: string;
  accent: string;
}

const playerThemes: Record<string, PlayerTheme> = {
  classic: { primary: '#8B5A3C', secondary: '#F5E6D3', accent: '#D4AF37' },
  modern: { primary: '#1E3A8A', secondary: '#E0F2FE', accent: '#06B6D4' },
  green: { primary: '#15803D', secondary: '#F0FDF4', accent: '#22C55E' }
};
```

## 🔧 Advanced Features

### 1. Bookmarks System
```tsx
const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  
  const addBookmark = (surah: number, verse: number) => {
    const bookmark = {
      id: Date.now(),
      surah,
      verse,
      timestamp: new Date(),
      note: ''
    };
    setBookmarks(prev => [...prev, bookmark]);
  };
  
  return { bookmarks, addBookmark };
};
```

### 2. Reading Progress Tracking
```tsx
const useReadingProgress = () => {
  const [progress, setProgress] = useState<ReadingProgress>({});
  
  const markAsRead = (surah: number, verse: number) => {
    setProgress(prev => ({
      ...prev,
      [`${surah}-${verse}`]: {
        readAt: new Date(),
        duration: 0
      }
    }));
  };
  
  return { progress, markAsRead };
};
```

### 3. Search Functionality
```tsx
const useQuranSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  
  const search = async (query: string, language = 'id') => {
    // Search trong cached data
    const results = await quranApi.searchVerses(query, language);
    setSearchResults(results);
  };
  
  return { searchResults, search };
};
```

## 📊 Performance Metrics

### Monitoring Loading Times
```tsx
const usePerformanceMetrics = () => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('quran')) {
          console.log(`${entry.name}: ${entry.duration}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['measure'] });
  }, []);
};
```

### Memory Usage Tracking
```tsx
const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log({
      used: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      total: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB'
    });
  }
};
```

## 🌍 Internationalization

### RTL Support
```css
[dir="rtl"] .quran-verse {
  text-align: right;
  direction: rtl;
}

[dir="ltr"] .quran-translation {
  text-align: left;
  direction: ltr;
}
```

### Language Detection
```tsx
const useLanguageDetection = () => {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('quran-language');
    if (stored) return stored;
    
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['id', 'en', 'ms', 'ar'];
    
    return supportedLangs.includes(browserLang) ? browserLang : 'en';
  });
  
  return { language, setLanguage };
};
```

## 🔐 Security Considerations

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="media-src https://raw.githubusercontent.com https://rawgit.com;">
```

### HTTPS Only
```tsx
// Force HTTPS cho audio URLs
const getSecureAudioUrl = (surah: number, verse: number) => {
  const url = quranApi.getAudioUrl(surah, verse);
  return url.replace('http://', 'https://');
};
```

## 📱 PWA Integration

### Manifest Configuration
```json
{
  "name": "Muslim Webapp - Quran Reader",
  "short_name": "Quran Reader",
  "description": "Read and listen to the Holy Quran",
  "icons": [
    {
      "src": "/icons/quran-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ],
  "start_url": "/quran",
  "display": "standalone",
  "theme_color": "#8B5A3C",
  "background_color": "#F5E6D3"
}
```

### Offline Support
```tsx
const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};
```

## 🎯 Next Steps

1. **Testing**: Implement unit tests cho components
2. **E2E Testing**: Cypress tests cho user flows
3. **Accessibility**: ARIA labels và keyboard navigation
4. **Analytics**: Track user engagement metrics
5. **Feedback System**: User ratings và comments
6. **Social Features**: Share verses, community features

## 📞 Support & Resources

- **Documentation**: [Quran JSON Repo](https://github.com/semarketir/quranjson)
- **Shadcn/UI**: [Component Library](https://ui.shadcn.com)
- **Islamic Typography**: [Best Practices](https://typography.islamicdesign.org)
- **Arabic Fonts**: [Google Fonts Arabic](https://fonts.google.com/?subset=arabic)

## 🏁 Kết luận

Với setup này bạn có thể:
- ✅ Stream audio mượt mà không lag
- ✅ Cache JSON data hiệu quả
- ✅ UI responsive và đẹp mắt
- ✅ Hỗ trợ nhiều ngôn ngữ
- ✅ Performance tối ưu
- ✅ Dễ dàng customize và mở rộng

Happy coding! 🚀