import React, { useState, useCallback } from 'react';
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
  type ViewType
} from './components';

const Setting: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const savedItemCounts = useSavedItemCounts();

  const handleViewChange = useCallback((view: ViewType) => {
    setCurrentView(view);
  }, []);

  const handleBackToMain = useCallback(() => {
    setCurrentView('main');
  }, []);

  // Render different views based on currentView
  if (currentView === 'saved-hadiths') {
    return <SavedHadithsView onBack={handleBackToMain} />;
  }

  if (currentView === 'saved-quran') {
    return <SavedQuranView onBack={handleBackToMain} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SettingHeader />
      <AccountSection />
      <CustomizationSection />
      <SavedItemsSection 
        counts={savedItemCounts} 
        onViewChange={handleViewChange} 
      />
      <GeneralSettingsSection />
      <OtherSettingsSection />
    </div>
  );
};

export default Setting;