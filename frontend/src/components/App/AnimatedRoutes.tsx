import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSkeleton';
import AnimatedPage from './AnimatedPage';
import MainLayout from './MainLayout';
import NotFound from './NotFound';

// Lazy load components
const Utilities = React.lazy(() => import('@/Pages/Home/Utilities'));
const News = React.lazy(() => import('@/Pages/News/News'));

const Prayers = React.lazy(() => import('@/components/Utilities/Prayers/PrayerTimes'));
const Qiblah = React.lazy(() => import('@/components/Utilities/Qiblah/QiblahFinder'));
const Calendar = React.lazy(() => import('@/components/Utilities/Calendar/HijriCalendar'));
const Masjid = React.lazy(() => import('@/components/Utilities/Masjid/Masjid'));
const Tasbih = React.lazy(() => import('@/components/Utilities/Tasbih/Tasbih'));
const Duas = React.lazy(() => import('@/components/Utilities/Duas/Dua'));
const NameAllah = React.lazy(() => import('@/components/Utilities/NameAllah/NameAllah'));
const Podcast = React.lazy(() => import('@/components/Utilities/Podcast/Podcast'));
const Zakat = React.lazy(() => import('@/components/Utilities/Zakat/ZakatCalculator'));
const Setting = React.lazy(() => import('@/Pages/Setting/Setting'));
const QuranReader = React.lazy(() => import('@/components/Utilities/Quran/QuranReader'));
const HadithApp = React.lazy(() => import('@/components/Utilities/Hadith/hadith'));
const AuthCallback = React.lazy(() => import('@/components/Auth/AuthCallback'));

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleBackToHome = () => {
    navigate(ROUTES.HOME);
  };
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Home Route - Utilities Page với BottomNav */}
        <Route path={ROUTES.HOME} element={
          <MainLayout>
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
                <Utilities />
              </Suspense>
            </AnimatedPage>
          </MainLayout>
        } />
        
        {/* News Route với BottomNav */}
        <Route path={ROUTES.NEWS} element={
          <MainLayout>
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
               <News/>
              </Suspense>
            </AnimatedPage>
          </MainLayout>
        } />
        
        {/* AI Route với BottomNav */}
        <Route path={ROUTES.AI} element={
          <MainLayout>
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold mb-4">Trợ Lý AI</h2>
                  <p className="text-muted-foreground">Tính năng AI sẽ được cập nhật sớm...</p>
                </div>
              </Suspense>
            </AnimatedPage>
          </MainLayout>
        } />
        
        {/* Video Route với BottomNav */}
        <Route path={ROUTES.VIDEO} element={
          <MainLayout>
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold mb-4">Video</h2>
                  <p className="text-muted-foreground">Trang video sẽ được cập nhật sớm...</p>
                </div>
              </Suspense>
            </AnimatedPage>
          </MainLayout>
        } />
        
        {/* Utility Routes - KHÔNG có BottomNav */}
        <Route 
          path={ROUTES.UTILITIES.PRAYERS} 
          element={
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
                <Prayers />
              </Suspense>
            </AnimatedPage>
          } 
        />
        
        <Route 
          path={ROUTES.UTILITIES.QIBLAH} 
          element={
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
                <Qiblah />
              </Suspense>
            </AnimatedPage>
          } 
        />
        
        <Route 
          path={ROUTES.UTILITIES.CALENDAR} 
          element={
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
                <Calendar />
              </Suspense>
            </AnimatedPage>
          } 
        />
        
        <Route 
          path={ROUTES.UTILITIES.MASJID} 
          element={
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
                <Masjid />
              </Suspense>
            </AnimatedPage>
          } 
        />
        
        <Route 
          path={ROUTES.UTILITIES.TASBIH} 
          element={
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
                <Tasbih />
              </Suspense>
            </AnimatedPage>
          } 
        />
        
        <Route 
          path={ROUTES.UTILITIES.DUAS} 
          element={
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
                <Duas />
              </Suspense>
            </AnimatedPage>
          } 
        />
    
        <Route 
          path={ROUTES.UTILITIES.NAMEALLAH} 
          element={
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
                <NameAllah />
              </Suspense>
            </AnimatedPage>
          } 
        />
        
        <Route 
          path={ROUTES.UTILITIES.PODCAST} 
          element={
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
                <Podcast handleBackToHome={handleBackToHome} />
              </Suspense>
            </AnimatedPage>
          } 
        />

        <Route 
          path={ROUTES.UTILITIES.QURAN_READER} 
          element={
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
                <QuranReader />
              </Suspense>
            </AnimatedPage>
          } 
        /> 
        
        <Route 
          path={ROUTES.UTILITIES.ZAKAT} 
          element={
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
                <Zakat />
              </Suspense>
            </AnimatedPage>
          } 
        />
        
        <Route 
          path={ROUTES.UTILITIES.HADITH} 
          element={
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}
              >
                <HadithApp />
              </Suspense>
            </AnimatedPage>
          } 
        />
        
        {/* Setting Route với BottomNav */}
        <Route 
          path={ROUTES.SETTING} 
          element={
            <MainLayout>
              <AnimatedPage>
                <Suspense fallback={<LoadingSpinner />}>
                  <Setting />
                </Suspense>
              </AnimatedPage>
            </MainLayout>
          } 
        />

        {/* Auth Callback Route */}
        <Route 
          path="/auth/callback" 
          element={
            <AnimatedPage>
              <Suspense fallback={<LoadingSpinner />}>
                <AuthCallback />
              </Suspense>
            </AnimatedPage>
          } 
        />

        {/* Redirect old routes */}
        <Route path="/home" element={<Navigate to={ROUTES.HOME} replace />} />
        <Route path="/utilities" element={<Navigate to={ROUTES.HOME} replace />} />
        
        {/* 404 Route */}
        <Route path="*" element={
          <AnimatedPage>
            <NotFound />
          </AnimatedPage>
        } />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;