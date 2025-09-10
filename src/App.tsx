import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ROUTES } from '@/lib/routes'; 

// Import main components
const Utilities = lazy(() => import('@/Pages/Home/Utilities'));

// Import utility components
const Prayers = lazy(() => import('@/components/Utilities/Prayers/PrayerTimes'));
const Qiblah = lazy(() => import('@/components/Utilities/Qiblah/QiblahFinder'));
const Calendar = lazy(() => import('@/components/Utilities/Calendar/HijriCalendar'));
//const Quran = lazy(() => import('@/components/Utilities/Quran/Quran'));
const Masjid = lazy(() => import('@/components/Utilities/Masjid/Masjid'));
const Tasbih = lazy(() => import('@/components/Utilities/Tasbih/Tasbih'));
const Duas = lazy(() => import('@/components/Utilities/Duas/Dua'));
//const Hadith = lazy(() => import('@/components/Utilities/Hadith/Hadith'));
const NameAllah = lazy(() => import('@/components/Utilities/NameAllah/NameAllah'));
const Podcast = lazy(() => import('@/components/Utilities/Podcast/Podcast'));
//const Study = lazy(() => import('@/components/Utilities/Study/Study'));
const Zakat = lazy(() => import('@/components/Utilities/Zakat/ZakatCalculator'));

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
        Loading...
      </p>
    </div>
  </div>
);

// 404 Not Found Component
const NotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900 p-4">
    <div className="text-center max-w-md mx-auto">
      <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">404</div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
        Page Not Found
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mr-4"
      >
        Go Back
      </button>
      <a
        href="/"
        className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors inline-block"
      >
        Home
      </a>
    </div>
  </div>
);


// Main App Component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Home Route - Utilities Page */}
              <Route path={ROUTES.HOME} element={<Utilities />} />
              
              {/* Utility Routes */}
              <Route 
                path={ROUTES.UTILITIES.PRAYERS} 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Prayers />
                  </Suspense>
                } 
              />
              
              <Route 
                path={ROUTES.UTILITIES.QIBLAH} 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Qiblah />
                  </Suspense>
                } 
              />
              
              <Route 
                path={ROUTES.UTILITIES.CALENDAR} 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Calendar />
                  </Suspense>
                } 
              />
              
          
              
              <Route 
                path={ROUTES.UTILITIES.MASJID} 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Masjid />
                  </Suspense>
                } 
              />
              
              <Route 
                path={ROUTES.UTILITIES.TASBIH} 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Tasbih />
                  </Suspense>
                } 
              />
              
              <Route 
                path={ROUTES.UTILITIES.DUAS} 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Duas />
                  </Suspense>
                } 
              />
          
              <Route 
                path={ROUTES.UTILITIES.NAMEALLAH} 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <NameAllah />
                  </Suspense>
                } 
              />
              
              <Route 
                path={ROUTES.UTILITIES.PODCAST} 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Podcast />
                  </Suspense>
                } 
              />
              
             
              
              <Route 
                path={ROUTES.UTILITIES.ZAKAT} 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Zakat />
                  </Suspense>
                } 
              />
              
              {/* Redirect old routes */}
              <Route path="/home" element={<Navigate to={ROUTES.HOME} replace />} />
              <Route path="/utilities" element={<Navigate to={ROUTES.HOME} replace />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          
          {/* Toast Notifications */}
          <Toaster />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;