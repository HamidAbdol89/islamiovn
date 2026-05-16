import React, { useCallback, useState, useEffect, useMemo, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import IconTab from '@/Pages/Home/IconTab';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/BottomNavbar/BottomNav';
import { ROUTES, TAB_ROUTES, UTILITY_ROUTES } from '@/lib/routes';
import { ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Memoized carousel images to prevent recreation on each render
const CAROUSEL_IMAGES = [
  '/assets/masjiddemo/thanh-duong-Mubarak.jpg',
  '/assets/masjiddemo/jamiul-muslimin.webp',
  '/assets/masjiddemo/al-noor.webp',
] as const;

const CAROUSEL_INTERVAL = 5000;

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

const Utilities: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('home');

  // Determine active tab based on path
  useEffect(() => {
    const path = location.pathname;
    if (path === ROUTES.HOME) setActiveTab('home');
    else if (path.startsWith(ROUTES.NEWS)) setActiveTab('news');
    else if (path.startsWith(ROUTES.CHAT)) setActiveTab('chat');
    else if (path.startsWith(ROUTES.VIDEO)) setActiveTab('video');
    else if (path.startsWith(ROUTES.SETTING)) setActiveTab('setting');
  }, [location]);

  // Auto-advance carousel
  const carouselLength = useMemo(() => CAROUSEL_IMAGES.length, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselLength);
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(interval);
  }, [carouselLength]);

  // Memoized navigation handlers
  const handleNavigateToUtility = useCallback((utilityName: string) => {
    const route = UTILITY_ROUTES[utilityName as keyof typeof UTILITY_ROUTES];
    if (route) {
      navigate(route);
    }
  }, [navigate]);

  const handleExploreMasjids = useCallback(() => {
    navigate(ROUTES.UTILITIES.MASJID_VIET_NAM);
  }, [navigate]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    const route = TAB_ROUTES[tab as keyof typeof TAB_ROUTES];
    if (route) {
      navigate(route);
    }
  }, [navigate]);

  const utilityCount = useMemo(() => Object.keys(UTILITY_ROUTES).length, []);

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative pb-16">
      {/* Status bar placeholder */}
      <div className="h-6 bg-background w-full"></div>

      <main className="w-full flex-1 p-4 max-w-md mx-auto">
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
                      <p className="text-xs">Thánh đường Hồi giáo tại VN</p>
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
