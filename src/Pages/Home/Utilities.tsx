import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from "lottie-react";
import animationData from '@/assets/lottie/AnimationRobot.json';
import IconTab from '@/Pages/Home/IconTab';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNavbar/BottomNav';
  import { ROUTES, TAB_ROUTES, UTILITY_ROUTES } from '@/lib/routes';
import { ChevronRight, MessageCircle, MapPin } from 'lucide-react';

const Utilities: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const [typedText, setTypedText] = useState('');
  const fullText = 'Hỏi về Islam qua chat ngay!';

  // Lottie animation configuration
  const lottieConfig = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Determine active tab based on path
  useEffect(() => {
    const path = location.pathname;
    if (path === ROUTES.HOME) setActiveTab('home');
    else if (path.startsWith(ROUTES.NEWS)) setActiveTab('news');
    else if (path.startsWith(ROUTES.AI)) setActiveTab('ai');
    else if (path.startsWith(ROUTES.VIDEO)) setActiveTab('video');
    else if (path.startsWith(ROUTES.SETTING)) setActiveTab('setting');
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

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    
    return () => clearInterval(typingInterval);
  }, [fullText]);

  const handleNavigateToUtility = useCallback((utilityName: string) => {
    const route = UTILITY_ROUTES[utilityName as keyof typeof UTILITY_ROUTES];
    if (route) {
      navigate(route);
    }
  }, [navigate]);

  const handleExploreMasjids = () => {
    navigate(ROUTES.UTILITIES.MASJID);
  };

  const handleNavigateToChat = () => {
    navigate(ROUTES.CHAT);
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const route = TAB_ROUTES[tab as keyof typeof TAB_ROUTES];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col relative overflow-hidden pb-16">
      {/* Status bar placeholder */}
      <div className="h-6 bg-background w-full"></div>
      
      <main className="w-full flex-1 p-4 max-w-md mx-auto overflow-y-auto">
    

{/* Carousel Card - Optimized */}
        <div className="mb-5">
          <Card className="bg-white rounded-2xl overflow-hidden shadow-lg border-0 dark:bg-gray-800">
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
                    {/* Simplified gradient overlay */}
                    <div className="absolute inset-0 bg-black/40"></div>
                  </div>
                ))}
                
                {/* Carousel Indicators - Simplified */}
                <div className="absolute bottom-3 left-4 flex space-x-1.5">
                  {carouselImages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-white' 
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Content - Simplified and cleaner */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                <div className="pb-2">
  <div className="flex items-center mb-1">
    <MapPin size={14} className="mr-1.5 text-white" />
    <h3 className="text-white font-semibold text-sm">Khám phá Masjid</h3>
  </div>
  <p className="text-white/80 text-xs">Thánh đường Hồi giáo tại VN</p>
</div>

                    
                 <Button
  onClick={handleExploreMasjids}
  size="sm"
  variant="ghost"  // hợp lệ
  className="
    bg-black text-white !shadow-none !hover:bg-black !hover:text-white
    rounded-full px-3 py-1.5 text-xs font-medium
    flex items-center gap-1
  "
>
  Xem Masjid<ChevronRight size={12} />
</Button>

                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

{/* AI Assistant Card - Clean Professional Design */}
<div className="mb-5">
  <Card className="
    bg-gradient-to-br from-blue-50 to-indigo-50 
    dark:from-slate-800 dark:to-slate-700
    rounded-2xl shadow-lg border-0
    hover:shadow-xl transition-shadow duration-300
    overflow-hidden
  ">
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        {/* Left Content */}
        <div className="flex-1 mr-4">
          {/* Header */}
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Mira AI
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Trợ lý thông minh
              </span>
            </div>
          </div>

          {/* Typewriter text */}
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {typedText}
            <span className="inline-block w-0.5 h-4 bg-blue-500 ml-1 animate-pulse align-middle"></span>
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleNavigateToChat}
           className="
  bg-gradient-to-r from-emerald-600 to-teal-600
  hover:from-emerald-700 hover:to-teal-700
  hover:scale-105 active:scale-95
  text-white font-medium
  px-4 py-2.5 text-sm
  rounded-xl shadow-md hover:shadow-lg
  transition-all duration-200
  flex items-center gap-2
  relative overflow-hidden
  group
"
>

            {/* Subtle shine effect */}
            <div className="
              absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
              transform translate-x-[-100%] group-hover:translate-x-[200%]
              transition-transform duration-500 ease-out
            "></div>
            
            <MessageCircle size={16} className="relative z-10" />
            <span className="relative z-10">Bắt đầu trò chuyện</span>
          </Button>
        </div>
        
        {/* Right Animation Container - No background, with subtle effects */}
        <div className="
          relative
          hover:scale-110 transition-transform duration-300 ease-out
        ">
          {/* Subtle glow effect around robot */}
          <div className="
            absolute inset-0 rounded-full
            bg-gradient-to-r from-blue-400/20 to-indigo-400/20
            blur-xl animate-pulse
            scale-150
          "></div>
          
          <div className="pointer-events-none relative z-10" style={{ height: '85px', width: '85px' }}>
            <Lottie
              height={85}
              width={85}
              {...lottieConfig}
            />
          </div>
          
          {/* Floating sparkles */}
          <div className="absolute top-2 right-2 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute bottom-3 left-1 w-0.5 h-0.5 bg-indigo-400 rounded-full animate-pulse opacity-40"></div>
        </div>
      </div>
    </CardContent>
  </Card>
</div>

        {/* Utilities Grid */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tiện ích </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">{Object.keys(UTILITY_ROUTES).length} công cụ</span>
          </div>
          <Card className="bg-white rounded-2xl p-3 shadow-lg border-0 dark:bg-gray-800">
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

    
    </div>
  );
};

export default Utilities;