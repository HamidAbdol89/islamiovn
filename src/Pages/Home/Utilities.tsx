import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import IconTab from '@/Pages/Home/IconTab';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNavbar/BottomNav';
import Footer from '@/components/Footer/Footer';
import { ROUTES, TAB_ROUTES, UTILITY_ROUTES } from '@/lib/routes'; 
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const Utilities: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  
  // Xác định tab hiện tại dựa trên đường dẫn
  useEffect(() => {
    const path = location.pathname;
    if (path === ROUTES.HOME) setActiveTab('home');
    else if (path.startsWith(ROUTES.NEWS)) setActiveTab('news');
    else if (path.startsWith(ROUTES.AI)) setActiveTab('ai');
    else if (path.startsWith(ROUTES.VIDEO)) setActiveTab('video');
    else if (path.startsWith(ROUTES.PROFILE)) setActiveTab('profile');
  }, [location]);

  // Sample images for the carousel
  const carouselImages = [
    '/assets/masjiddemo/thanh-duong-Mubarak.jpg',
    '/assets/masjiddemo/jamiul-muslimin.webp',
    '/assets/masjiddemo/al-noor.webp',
  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleNavigateToUtility = useCallback((utilityName: string) => {
    const route = UTILITY_ROUTES[utilityName as keyof typeof UTILITY_ROUTES];
    if (route) {
      navigate(route);
    }
  }, [navigate]);

  const handleExploreMasjids = () => {
    navigate(ROUTES.UTILITIES.MASJID);
  };

  // Xử lý chuyển tab
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const route = TAB_ROUTES[tab as keyof typeof TAB_ROUTES];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative overflow-hidden pb-16">
      {/* Status bar placeholder (giống React Native) */}
      <div className="h-6 bg-background w-full"></div>
      
      <main className="w-full flex-1 p-3 max-w-md mx-auto overflow-y-auto">
        {/* Carousel Card */}
        <div className="mb-4">
          <Card className="bg-card rounded-xl overflow-hidden shadow-sm border-0">
            <CardContent className="p-0 relative">
              {/* Carousel Container */}
              <div className="relative h-40 overflow-hidden">
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Masjid ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                ))}
                
                {/* Carousel Indicators */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1.5">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${
                        index === currentSlide 
                          ? 'bg-white' 
                          : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h2 className="text-lg font-semibold mb-1">Khám phá các Masjid</h2>
                <p className="text-xs mb-2 opacity-90">Những thánh đường Hồi giáo tại Việt Nam</p>
                <Button
                  onClick={handleExploreMasjids}
                  className="
                    bg-white text-gray-900
                    rounded-full
                    hover:bg-white/90
                    active:opacity-80
                    transition-all
                    px-3 py-1.5
                    text-xs
                    font-medium
                    flex items-center gap-1
                    shadow
                  "
                >
                  Khám phá ngay <span className="text-xs">→</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <ThemeToggle />

        {/* IconTab */}
        <div className="mb-4">
          <Card className="bg-card rounded-xl p-2 shadow-sm border-0">
            <CardContent className="p-0">
              <IconTab
                onUtilityClick={handleNavigateToUtility}
                activeUtility={undefined}
                mode="grid"
              />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Utilities;