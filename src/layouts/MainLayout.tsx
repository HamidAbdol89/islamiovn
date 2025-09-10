import BottomNav from '@/components/BottomNavbar/BottomNav';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function MainLayout({ children, activeTab = 'home', onTabChange = () => {} }: MainLayoutProps) {
  return (
    <>
      {children}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </>
  );
}