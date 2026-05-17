import React, { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNavbar/BottomNav';
import { ToolsBottomSheet } from '@/components/ToolsBottomVaul';
import { getToolRoute, isToolId, type ToolId } from '@/features/tools';
import { ROUTES, TAB_ROUTES } from '@/lib/routes';

interface MainLayoutProps {
  children: React.ReactNode;
}

function resolveActiveTab(pathname: string): string {
  if (pathname === ROUTES.SETTING || pathname.startsWith(`${ROUTES.SETTING}/`)) {
    return 'setting';
  }
  if (pathname === ROUTES.UTILITIES.QURAN_READER || pathname.startsWith(`${ROUTES.UTILITIES.QURAN_READER}/`)) {
    return 'quran';
  }
  if (pathname === ROUTES.HOME) {
    return 'home';
  }

  for (const [tab, route] of Object.entries(TAB_ROUTES)) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return tab;
    }
  }

  return 'home';
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [toolsOpen, setToolsOpen] = useState(false);

  const activeTab = useMemo(() => resolveActiveTab(location.pathname), [location.pathname]);

  const handleTabChange = useCallback(
    (tab: string) => {
      if (tab === 'tools') return;

      const route = TAB_ROUTES[tab as keyof typeof TAB_ROUTES];
      if (route) {
        navigate(route);
      }
    },
    [navigate],
  );

  const handleToolsOpen = useCallback(() => {
    setToolsOpen((prev) => !prev);
  }, []);

  const handleSelectTool = useCallback(
    (toolId: ToolId) => {
      if (!isToolId(toolId)) return;
      const route = getToolRoute(toolId);
      if (route) {
        navigate(route);
      }
    },
    [navigate],
  );

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 overflow-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">{children}</div>
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onToolsClick={handleToolsOpen}
        toolsSheetOpen={toolsOpen}
      />
      <ToolsBottomSheet open={toolsOpen} onOpenChange={setToolsOpen} onSelectTool={handleSelectTool} />
    </div>
  );
};

export default MainLayout;
