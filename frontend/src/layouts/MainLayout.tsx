import BottomNav from '@/components/BottomNavbar/BottomNav';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function MainLayout({
  children,
  activeTab = 'home',
  onTabChange = () => {},
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-[calc(80px+env(safe-area-inset-bottom))]">
        {children}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}