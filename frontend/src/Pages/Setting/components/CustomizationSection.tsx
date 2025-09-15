import React from 'react';
import { Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';
import ThemeSelector from './ThemeSelector';
import { SECTION_TITLES, SETTING_LABELS } from './constants';

const CustomizationSection: React.FC = () => {
  return (
    <SettingSection title={SECTION_TITLES.CUSTOMIZATION}>
      <ThemeSelector />
      <Separator />
      <SettingItem
        icon={Globe}
        label={SETTING_LABELS.LANGUAGE}
      />
    </SettingSection>
  );
};

CustomizationSection.displayName = 'CustomizationSection';

export default React.memo(CustomizationSection);
