import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from '@/components/App/ErrorBoundary';
import LoadingSkeleton from '@/components/App/LoadingSkeleton';
import AnimatedRoutes from '@/components/App/AnimatedRoutes';

// Preload components để tránh khựng khi chuyển tab
const preloadComponents = () => {
  const components = [
    import('@/Pages/Home/Utilities'),
    import('@/Pages/Setting/Setting'),


    import('@/components/Utilities/Prayers/PrayerTimes'),
    import('@/components/Utilities/Qiblah/QiblahFinder'),
    import('@/components/Utilities/Calendar/HijriCalendar'),
    import('@/components/Utilities/Masjid/Masjid'),
    import('@/components/Utilities/Tasbih/Tasbih'),
    import('@/components/Utilities/Duas/Dua'),
    import('@/components/Utilities/NameAllah/NameAllah'),
    import('@/components/Utilities/Podcast/Podcast'),
    import('@/components/Utilities/Zakat/ZakatCalculator'),
    import('@/components/Utilities/Quran/QuranReader'),
    import('@/components/Utilities/Hadith/hadith'),
    import('@/components/Utilities/Masjid/MasjidVietNam/MasjidVietnam'),
    
  ];
  
  // Preload tất cả components
  components.forEach(component => component.catch(() => {}));
};

// Gọi preload khi app khởi chạy
if (typeof window !== 'undefined') {
  // Preload sau một khoảng thời gian ngắn để không ảnh hưởng đến initial load
  setTimeout(preloadComponents, 1000);
}

// Main App Component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Suspense fallback={<LoadingSkeleton />}>
            <AnimatedRoutes />
          </Suspense>

        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;