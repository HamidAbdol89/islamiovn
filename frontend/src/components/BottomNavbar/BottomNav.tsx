'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  House,
  Book,
  Compass,
  Plus,
  User,
} from "phosphor-react";

import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

// ────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────

interface Tab {
  key: string;
  label: string;
  icon: any;
  isOrb?: boolean;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onToolsClick?: () => void;
  toolsSheetOpen?: boolean;
  badgeTabs?: string[];
  className?: string;
}

// ────────────────────────────────────────────────
// CONFIG
// ────────────────────────────────────────────────

const TABS: Tab[] = [
  { key: 'home', label: 'Trang chủ', icon: House },
  { key: 'quran', label: "Qur'an", icon: Book },
  { key: 'tools', label: 'Tiện ích', icon: Plus, isOrb: true },
  { key: 'community', label: 'Khám phá', icon: Compass },
  { key: 'setting', label: 'Hồ sơ', icon: User },
];

const NAV_H = 64;

const ORB_D = 48;
const ORB_FLOAT = ORB_D / 2 - 2;

const ISLAMIC_GREEN = 'oklch(0.44 0.15 142.5)';

// ────────────────────────────────────────────────
// TAB ITEM
// ────────────────────────────────────────────────

function NavTab({
  tab,
  isActive,
  hasBadge,
  onClick,
  avatarUrl = null,
}: any) {
  const Icon = tab.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-1 h-full flex-col items-center justify-center',
        'bg-transparent border-none outline-none',
        'active:scale-90 transition-transform duration-150'
      )}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          className="h-[24px] w-[24px] rounded-full object-cover"
          style={{ opacity: isActive ? 1 : 0.5 }}
        />
      ) : (
        <Icon
          size={22}
          weight={isActive ? "fill" : "regular"}
          className={cn(
            'transition-colors duration-200',
            isActive ? 'text-primary' : 'text-muted-foreground'
          )}
        />
      )}

      {/* underline */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="underline"
            className="absolute bottom-[8px] h-[4px] w-[22px] rounded-full bg-primary"
          />
        )}
      </AnimatePresence>

      {/* badge */}
      {hasBadge && (
        <span className="absolute top-3 right-[calc(50%-14px)] h-[7px] w-[7px] rounded-full bg-red-500" />
      )}
    </button>
  );
}

// ────────────────────────────────────────────────
// ORB BUTTON
// ────────────────────────────────────────────────

function NavOrb({
  tab,
  isActive,
  hasBadge,
  onClick,
}: any) {
  const Icon = tab.icon;

  return (
    <div className="relative flex flex-1 justify-center items-center">
   <motion.button
  onClick={onClick}
  className="absolute flex items-center justify-center rounded-full bg-primary left-1/2"
  style={{
    width: ORB_D,
    height: ORB_D,
    top: -ORB_FLOAT,
    x: '-50%',
    boxShadow:
      `0 10px 25px ${ISLAMIC_GREEN}40, 0 0 40px ${ISLAMIC_GREEN}25`,
  }}
  whileTap={{ scale: 0.88 }}
>
        {/* ICON (IMAGE OR PHOSPHOR) */}
        {tab.imgUrl ? (
          <img 
            src={tab.imgUrl} 
            alt={tab.label}
            className="w-[28px] h-[28px] object-contain drop-shadow-sm filter brightness-0 invert" 
          />
        ) : (
          <Icon
            size={18}
            weight="fill"
            className="text-primary-foreground"
          />
        )}

        {/* glow pulse */}
        {isActive && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: ISLAMIC_GREEN }}
            initial={{ scale: 0.8, opacity: 0.4 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: 'easeOut',
            }}
          />
        )}

        {/* badge */}
        {hasBadge && (
          <span className="absolute top-0 right-0 h-[7px] w-[7px] rounded-full bg-red-500" />
        )}
      </motion.button>
    </div>
  );
}

// ────────────────────────────────────────────────
// MAIN
// ────────────────────────────────────────────────

const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onToolsClick,
  toolsSheetOpen = false,
  badgeTabs = [],
  className,
}) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 px-4',
        className
      )}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="relative w-full pt-[24px]">

        {/* background bar */}
        <div className="absolute inset-x-0 bottom-0 h-[64px] bg-card rounded-t-2xl" />

        {/* nav */}
        <nav className="relative flex w-full" style={{ height: NAV_H }}>
          {TABS.map((tab) => {
            const isActive =
              tab.key === 'tools' ? toolsSheetOpen : activeTab === tab.key;
            const hasBadge = badgeTabs.includes(tab.key);

            const onClick = () => {
              if (tab.key === 'tools' && onToolsClick) {
                onToolsClick();
                return;
              }
              onTabChange(tab.key);
            };

            if (tab.isOrb) {
              return (
                <NavOrb
                  key={tab.key}
                  tab={tab}
                  isActive={isActive}
                  hasBadge={hasBadge}
                  onClick={onClick}
                />
              );
            }

            return (
              <NavTab
                key={tab.key}
                tab={tab}
                isActive={isActive}
                hasBadge={hasBadge}
                onClick={onClick}
                avatarUrl={
                  tab.key === 'setting' && isAuthenticated
                    ? user?.picture
                    : null
                }
              />
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;