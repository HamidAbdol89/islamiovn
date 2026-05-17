import React from 'react';
import { Globe } from 'phosphor-react';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';
import { SECTION_TITLES, SETTING_LABELS } from './constants';

const CustomizationSection: React.FC = () => (
  <SettingSection title={SECTION_TITLES.CUSTOMIZATION} delay={0.1}>
    <SettingItem
      icon={Globe}
      label={SETTING_LABELS.LANGUAGE}
      iconVariant="teal"
      value="Tiếng Việt"
    />
  </SettingSection>
);

CustomizationSection.displayName = 'CustomizationSection';
export default React.memo(CustomizationSection);
