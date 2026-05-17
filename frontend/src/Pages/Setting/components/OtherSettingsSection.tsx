import React, { useCallback } from 'react';
import { Cloud, Download, ShareNetwork, Shield } from 'phosphor-react';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';
import { SECTION_TITLES, SETTING_LABELS, SHARE_DATA, MESSAGES } from './constants';

const OtherSettingsSection: React.FC = () => {
  const handleShareApp = useCallback(async () => {
    const shareData = {
      title: SHARE_DATA.title,
      text: SHARE_DATA.text,
      url: window.location.origin,
    };
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
        );
        alert(MESSAGES.SHARE_SUCCESS);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(
          `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
        );
        alert(MESSAGES.SHARE_SUCCESS);
      } catch {
        alert(MESSAGES.SHARE_ERROR);
      }
    }
  }, []);

  return (
    <SettingSection title={SECTION_TITLES.OTHER} delay={0.25}>
      <SettingItem icon={Cloud}     label={SETTING_LABELS.BACKUP_RESTORE}       iconVariant="teal" />
      <SettingItem icon={Download}  label={SETTING_LABELS.EXPORT_PRAYER_TIMES}  iconVariant="green" />
      <SettingItem icon={ShareNetwork} label={SETTING_LABELS.SHARE_APP}            iconVariant="amber" onClick={handleShareApp} />
      <SettingItem icon={Shield}    label={SETTING_LABELS.PRIVACY_POLICY}       iconVariant="gray" />
    </SettingSection>
  );
};

OtherSettingsSection.displayName = 'OtherSettingsSection';
export default React.memo(OtherSettingsSection);
