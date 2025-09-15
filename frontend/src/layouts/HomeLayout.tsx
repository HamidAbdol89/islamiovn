import BottomNav from '@/components/BottomNavbar/BottomNav';
import Footer from '@/components/Footer/Footer';

interface HomeLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function HomeLayout({ children, activeTab = 'home', onTabChange = () => {} }: HomeLayoutProps) {
  return (
    <>
      {children}
      <Footer />
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </>
  );
}