import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from "lottie-react";
import animationData from '@/assets/lottie/AnimationRobot.json';
import IconTab from '@/Pages/Home/IconTab';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/BottomNavbar/BottomNav';
import { ROUTES, TAB_ROUTES, UTILITY_ROUTES } from '@/lib/routes';
import { ChevronRight, MessageCircle, MapPin, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen w-full bg-background flex flex-col relative overflow-hidden pb-16">
      {/* Status bar placeholder */}
      <div className="h-6 bg-background w-full"></div>
      
      <main className="w-full flex-1 p-4 max-w-md mx-auto overflow-y-auto">
        {/* Carousel Card */}
        <div className="mb-5">
          <Card className="overflow-hidden">
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
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                  </div>
                ))}
                
                {/* Carousel Indicators */}
                <div className="absolute bottom-3 left-4 flex space-x-1.5">
                  {carouselImages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-primary' 
                          : 'bg-muted-foreground/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <div className="pb-2">
                      <div className="flex items-center mb-1">
                        <MapPin size={14} className="mr-1.5 text-primary" />
                        <h3 className="text-primary font-semibold text-sm">Khám phá Masjid</h3>
                      </div>
                      <p className="text-muted-foreground text-xs">Thánh đường Hồi giáo tại VN</p>
                    </div>
                    
                    <Button
                      onClick={handleExploreMasjids}
                      size="sm"
                      className="rounded-full flex items-center gap-1"
                    >
                      Xem Masjid<ChevronRight size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Card */}
        <div className="mb-5">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                {/* Left Content */}
                <div className="flex-1 mr-4">
                  {/* Header */}
                  <div className="flex items-center mb-3">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Mira AI</h3>
                      <span className="text-xs text-muted-foreground">Trợ lý thông minh</span>
                    </div>
                  </div>

                  {/* Typewriter text */}
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {typedText}
                    <span className="inline-block w-0.5 h-4 bg-primary ml-1 animate-pulse align-middle"></span>
                  </p>

                  {/* CTA Button */}
                  <Button
                    onClick={handleNavigateToChat}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle size={16} />
                    <span>Bắt đầu trò chuyện</span>
                  </Button>
                </div>
                
                {/* Right Animation Container */}
                <div className="relative hover:scale-110 transition-transform duration-300 ease-out">
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse scale-150"></div>
                  
                  <div className="pointer-events-none relative z-10" style={{ height: '85px', width: '85px' }}>
                    <Lottie
                      height={85}
                      width={85}
                      {...lottieConfig}
                    />
                  </div>
                  
                  {/* Floating sparkles */}
                  <Sparkles className="absolute top-2 right-2 w-3 h-3 text-primary animate-ping opacity-60" />
                  <Sparkles className="absolute bottom-3 left-1 w-2 h-2 text-primary animate-pulse opacity-40" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Utilities Grid */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Tiện ích</h2>
            <Badge variant="secondary">{Object.keys(UTILITY_ROUTES).length} công cụ</Badge>
          </div>
          <Card>
            <CardContent className="p-3">
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