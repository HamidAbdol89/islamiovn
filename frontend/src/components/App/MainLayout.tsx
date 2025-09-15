import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNavbar/BottomNav';
import { TAB_ROUTES } from '@/lib/routes';

interface MainLayoutProps {
  children: React.ReactNode;
}
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getActiveTab = () => {
    const path = location.pathname;
    for (const [tab, route] of Object.entries(TAB_ROUTES)) {
      if (path === route) return tab;
    }
    return 'home';
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tab: string) => {
    if (TAB_ROUTES[tab as keyof typeof TAB_ROUTES]) {
      navigate(TAB_ROUTES[tab as keyof typeof TAB_ROUTES]);
    }
  };

return (
  <div className="flex flex-col min-h-screen">
<div className="flex-1 overflow-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">
  {children}
</div>
    <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
  </div>
);
};

export default MainLayout;