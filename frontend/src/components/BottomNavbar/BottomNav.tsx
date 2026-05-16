'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Home, BookOpen, Sparkles, Compass, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tab {
  key: string;
  label: string;
  icon: LucideIcon;
  /** Đây là action chính của app — hiển thị dạng orb to ở giữa */
  isPrimary?: boolean;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  /** Keys của các tab đang có thông báo chưa đọc */
  badgeTabs?: string[];
  className?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TABS: Tab[] = [
  { key: 'home',      label: 'Trang chủ', icon: Home },
  { key: 'quran',     label: "Qur'an",    icon: BookOpen },
  { key: 'tools',     label: 'Tiện ích',  icon: Sparkles, isPrimary: true },
  { key: 'community', label: 'Khám phá',  icon: Compass },
  { key: 'setting',   label: 'Hồ sơ',     icon: User },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Icon button thường — smear effect khi active */
function NavIcon({
  tab,
  isActive,
  hasBadge,
  onClick,
  avatarUrl = null,
}: {
  tab: Tab;
  isActive: boolean;
  hasBadge: boolean;
  onClick: () => void;
  avatarUrl?: string | null;
}) {
  const Icon = tab.icon;

  return (
    <button
      aria-label={tab.label}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
      className={cn(
        'relative flex h-14 w-14 items-center justify-center',
        'rounded-full border-none bg-transparent outline-none',
        'transition-transform duration-150 active:scale-75',
        'focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
      )}
    >
      {/* Smear — vòng sáng mờ lan ra khi active */}
      <motion.span
        animate={isActive
          ? { width: 52, height: 52, opacity: 1 }
          : { width: 0,  height: 0,  opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20"
        aria-hidden
      />

      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={tab.label}
          className={cn(
            'relative z-10 h-6 w-6 rounded-full object-cover transition-all duration-200',
            isActive ? 'ring-2 ring-white' : 'ring-1 ring-white/20',
          )}
        />
      ) : (
        <Icon
          className={cn(
            'relative z-10 h-[22px] w-[22px] transition-colors duration-300',
            isActive ? 'text-white' : 'text-white/55',
          )}
          strokeWidth={isActive ? 1.75 : 1.5}
        />
      )}

      {/* Badge dot */}
      <AnimatePresence>
        {hasBadge && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 600, damping: 22 }}
            aria-label="Có thông báo mới"
            className="absolute right-2.5 top-2.5 h-[7px] w-[7px] rounded-full bg-red-500 ring-[1.5px] ring-black"
          />
        )}
      </AnimatePresence>
    </button>
  );
}

/** Orb — action chính, to hơn, nổi bật hơn */
function NavOrb({
  tab,
  isActive,
  hasBadge,
  onClick,
}: {
  tab: Tab;
  isActive: boolean;
  hasBadge: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon;

  return (
    <button
      aria-label={tab.label}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
      className={cn(
        'relative mx-1 flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center',
        'rounded-full border-none outline-none',
        'transition-transform duration-150 active:scale-85',
        'focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        isActive
          ? 'bg-[#AFA9EC]'   // lavender khi active
          : 'bg-white',
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <Icon
        className={cn(
          'h-[20px] w-[20px] transition-colors duration-200',
          isActive ? 'text-[#26215C]' : 'text-black',
        )}
        strokeWidth={1.75}
      />

      <AnimatePresence>
        {hasBadge && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 600, damping: 22 }}
            aria-label="Có thông báo mới"
            className="absolute right-2 top-2 h-[7px] w-[7px] rounded-full bg-red-500 ring-[1.5px] ring-black"
          />
        )}
      </AnimatePresence>
    </button>
  );
}

/** Scrubber dots — chỉ thị vị trí trang hiện tại */
function ScrubberDots({
  total,
  activeIndex,
  onDotClick,
}: {
  total: number;
  activeIndex: number;
  onDotClick: (i: number) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Chuyển trang"
      className="flex items-center justify-center gap-1.5 pb-3 pt-1"
    >
      {Array.from({ length: total }).map((_, i) => (
        <motion.button
          key={i}
          role="tab"
          aria-selected={i === activeIndex}
          aria-label={TABS[i].label}
          onClick={() => onDotClick(i)}
          animate={i === activeIndex
            ? { width: 20, backgroundColor: '#ffffff' }
            : { width: 4,  backgroundColor: '#1e1e1e' }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className="h-1 rounded-full border-none outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          style={{ flexShrink: 0 }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  badgeTabs = [],
  className,
}) => {
  const { user, isAuthenticated } = useAuth();
  const activeIndex = TABS.findIndex((t) => t.key === activeTab);

  const handleChange = (key: string) => {
    onTabChange(key);
  };

  return (
    /**
     * Wrapper không có nền, không có border — nav "không tồn tại" như một thanh riêng biệt.
     * pointer-events-none để vùng trống hai bên orb vẫn click-through được.
     */
    <div
      className={cn(
        'pointer-events-none fixed bottom-0 left-0 right-0 z-50',
        className,
      )}
    >
      <div className="pointer-events-auto pb-[max(8px,env(safe-area-inset-bottom))]">
        {/* Scrubber dots */}
        <ScrubberDots
          total={TABS.length}
          activeIndex={activeIndex}
          onDotClick={(i) => handleChange(TABS[i].key)}
        />

        {/* Icon row — không có container, không có nền */}
        <nav
          aria-label="Điều hướng chính"
          className="flex items-center justify-center"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const hasBadge = badgeTabs.includes(tab.key);

            /**
             * Khi badge tab được chọn → xóa khỏi badgeTabs.
             * Trong thực tế bạn quản lý state này ở parent và truyền vào.
             */
            const handleClick = () => handleChange(tab.key);

            return tab.isPrimary ? (
              <NavOrb
                key={tab.key}
                tab={tab}
                isActive={isActive}
                hasBadge={hasBadge}
                onClick={handleClick}
              />
            ) : (
              <NavIcon
                key={tab.key}
                tab={tab}
                isActive={isActive}
                hasBadge={hasBadge}
                onClick={handleClick}
                avatarUrl={tab.key === 'setting' && isAuthenticated ? (user?.picture ?? null) : null}
              />
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;

// ─── Usage example ────────────────────────────────────────────────────────────
//
// const [tab, setTab] = useState('home');
// const [badges, setBadges] = useState(['tools']);
//
// <BottomNav
//   activeTab={tab}
//   onTabChange={(key) => {
//     setTab(key);
//     setBadges((prev) => prev.filter((b) => b !== key)); // xóa badge khi vào tab
//   }}
//   badgeTabs={badges}
// />
//
// Lưu ý: component này dùng dark background (#080808 hoặc tương đương).
// Nếu app dùng light mode, đổi màu icon từ text-white/20 → text-black/15
// và smear từ bg-white → bg-black.