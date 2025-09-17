import React, { useCallback, useState, useEffect, useMemo, memo, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import IconTab from '@/Pages/Home/IconTab';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/BottomNavbar/BottomNav';
import { ROUTES, TAB_ROUTES, UTILITY_ROUTES } from '@/lib/routes';
import { ChevronRight, MessageCircle, MapPin } from 'lucide-react';

// Lazy load Lottie for better performance
const Lottie = lazy(() => import('lottie-react'));

// Import animation data directly instead of lazy loading
import animationData from '@/assets/lottie/AnimationRobot.json';

// Memoized carousel images to prevent recreation on each render
const CAROUSEL_IMAGES = [
  '/assets/masjiddemo/thanh-duong-Mubarak.jpg',
  '/assets/masjiddemo/jamiul-muslimin.webp',
  '/assets/masjiddemo/al-noor.webp',
] as const;

const FULL_TEXT = 'Hỏi về Islam qua chat ngay!' as const;
const CAROUSEL_INTERVAL = 5000;
const TYPING_SPEED = 40;

// Memoized carousel component
const CarouselSlide = memo<{ image: string; index: number; isActive: boolean }>(({ image, index, isActive }) => (
  <div
    className={`absolute inset-0 transition-opacity duration-500 ${
      isActive ? 'opacity-100' : 'opacity-0'
    }`}
  >
    <img
      src={image}
      alt={`Masjid ${index + 1}`}
      className="w-full h-full object-cover"
      loading={index === 0 ? 'eager' : 'lazy'}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
  </div>
));

CarouselSlide.displayName = 'CarouselSlide';

// Memoized Lottie component with intersection observer
const LottieAnimation = memo(() => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const lottieConfig = useMemo(() => ({
    loop: true,
    autoplay: isVisible,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }), [isVisible]);

  return (
    <div ref={ref} className="pointer-events-none relative z-10" style={{ height: '85px', width: '85px' }}>
      {isVisible && (
        <Suspense fallback={<div className="w-[85px] h-[85px] bg-primary/10 rounded-full animate-pulse" />}>
          <Lottie
            height={85}
            width={85}
            {...lottieConfig}
          />
        </Suspense>
      )}
    </div>
  );
});

LottieAnimation.displayName = 'LottieAnimation';

const Utilities: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const [typedText, setTypedText] = useState('');

  // Determine active tab based on path
  useEffect(() => {
    const path = location.pathname;
    if (path === ROUTES.HOME) setActiveTab('home');
    else if (path.startsWith(ROUTES.NEWS)) setActiveTab('news');
    else if (path.startsWith(ROUTES.AI)) setActiveTab('ai');
    else if (path.startsWith(ROUTES.VIDEO)) setActiveTab('video');
    else if (path.startsWith(ROUTES.SETTING)) setActiveTab('setting');
  }, [location]);

  // Auto-advance carousel with memoized length
  const carouselLength = useMemo(() => CAROUSEL_IMAGES.length, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselLength);
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(interval);
  }, [carouselLength]);

  // Optimized typewriter effect
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < FULL_TEXT.length) {
        setTypedText(FULL_TEXT.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, TYPING_SPEED);

    return () => clearInterval(typingInterval);
  }, []);

  // Memoized navigation handlers
  const handleNavigateToUtility = useCallback((utilityName: string) => {
    const route = UTILITY_ROUTES[utilityName as keyof typeof UTILITY_ROUTES];
    if (route) {
      navigate(route);
    }
  }, [navigate]);

  const handleExploreMasjids = useCallback(() => {
    navigate(ROUTES.UTILITIES.MASJID);
  }, [navigate]);

  const handleNavigateToChat = useCallback(() => {
    navigate(ROUTES.CHAT);
  }, [navigate]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    const route = TAB_ROUTES[tab as keyof typeof TAB_ROUTES];
    if (route) {
      navigate(route);
    }
  }, [navigate]);

  // Memoized utility routes count
  const utilityCount = useMemo(() => Object.keys(UTILITY_ROUTES).length, []);

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative overflow-hidden pb-16">
      {/* Status bar placeholder */}
      <div className="h-6 bg-background w-full"></div>

      <main className="w-full flex-1 p-4 max-w-md mx-auto overflow-y-auto">
        {/* Carousel Card */}
        <div className="mb-5">
        <Card className="relative overflow-hidden">
  <CardContent className="p-0 relative">
    <div className="relative h-40 overflow-hidden">
      {CAROUSEL_IMAGES.map((image, index) => (
        <CarouselSlide
          key={image}
          image={image}
          index={index}
          isActive={index === currentSlide}
        />
      ))}

      {/* Light mode: hạ tông card bằng overlay mờ */}
{/* Overlay mạnh cho cả light & dark */}
<div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Carousel Indicators */}
      <div className="absolute bottom-3 left-4 flex space-x-1.5">
        {CAROUSEL_IMAGES.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-primary' : 'bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>

{/* Content */}
<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
  <div className="flex items-center justify-between">
    <div className="pb-2">
      <div className="flex items-center mb-1">
        <MapPin size={14} className="mr-1.5 text-primary" />
        <h3 className="font-semibold text-sm">Khám phá Masjid</h3>
      </div>
      <p className="text-xs">
        Thánh đường Hồi giáo tại VN
      </p>
    </div>

    <Button
      onClick={handleExploreMasjids}
      variant="default"
      size="sm"
      className="rounded-full flex items-center gap-1"
    >
      Xem <ChevronRight size={12} />
    </Button>
  </div>
</div>

    </div>
  </CardContent>
</Card>

        </div>

        {/* AI Assistant Card */}
        <div className="mb-5">
          <Card >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                {/* Left Content */}
                <div className="flex-1 mr-4">
                  {/* Header */}
                  <div className="flex items-center mb-3">
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
                  variant= "default"
                  size="sm"
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

                  <LottieAnimation />


                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Utilities Grid */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Tiện ích</h2>
            <Badge variant="secondary">{utilityCount} công cụ</Badge>
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