import React, { useCallback } from 'react';
import { AnimatePresence, cubicBezier, motion } from 'motion/react';

import SavedHadithsView from './components/SavedHadithsView';
import SavedQuranView from './components/SavedQuranView';
import {
  SettingHeader,
  AccountSection,
  CustomizationSection,
  SavedItemsSection,
  GeneralSettingsSection,
  OtherSettingsSection,
  useSavedItemCounts,
} from './components';
import { useUiStore } from '@/stores/uiStore';
import type { ViewType } from './components/types';

const easeStandard = cubicBezier(0.25, 0.46, 0.45, 0.94);

const pageVariants = {
  initial: { opacity: 0, x: 24 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.22,
      ease: easeStandard,
    },
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: {
      duration: 0.16,
      ease: easeStandard,
    },
  },
};

const Setting: React.FC = () => {
  const currentView = useUiStore((s) => s.settingsView);
  const setSettingsView = useUiStore((s) => s.setSettingsView);
  const savedItemCounts = useSavedItemCounts();

  const handleViewChange = useCallback(
    (view: ViewType) => {
      setSettingsView(view);
    },
    [setSettingsView]
  );

  const handleBackToMain = useCallback(() => {
    setSettingsView('main');
  }, [setSettingsView]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={currentView} {...pageVariants}>
        {currentView === 'main' && (
          <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-lg px-4 pb-10">
              <SettingHeader />
              <AccountSection />
              <CustomizationSection />
              <SavedItemsSection
                counts={savedItemCounts}
                onViewChange={handleViewChange}
              />
              <GeneralSettingsSection />
              <OtherSettingsSection />

              <p className="text-center text-xs text-muted-foreground pt-2 pb-4">
                Islam.io.vn · Phiên bản 2.4.1
              </p>
            </div>
          </div>
        )}

        {currentView === 'saved-hadiths' && (
          <SavedHadithsView onBack={handleBackToMain} />
        )}

        {currentView === 'saved-quran' && (
          <SavedQuranView onBack={handleBackToMain} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Setting;
