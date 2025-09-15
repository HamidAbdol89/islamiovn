import React, { useCallback } from 'react';
import { Cloud, Download, Share2, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';
import { SECTION_TITLES, SETTING_LABELS, SHARE_DATA, MESSAGES } from './constants';

const OtherSettingsSection: React.FC = () => {
  const handleShareApp = useCallback(async () => {
    const shareData = {
      title: SHARE_DATA.title,
      text: SHARE_DATA.text,
      url: window.location.origin
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
        alert(MESSAGES.SHARE_SUCCESS);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
        alert(MESSAGES.SHARE_SUCCESS);
      } catch (clipboardError) {
        alert(MESSAGES.SHARE_ERROR);
      }
    }
  }, []);

  return (
    <SettingSection title={SECTION_TITLES.OTHER}>
      <SettingItem
        icon={Cloud}
        label={SETTING_LABELS.BACKUP_RESTORE}
      />
      <Separator />
      <SettingItem
        icon={Download}
        label={SETTING_LABELS.EXPORT_PRAYER_TIMES}
      />
      <Separator />
      <SettingItem
        icon={Share2}
        label={SETTING_LABELS.SHARE_APP}
        onClick={handleShareApp}
      />
      <Separator />
      <SettingItem
        icon={Shield}
        label={SETTING_LABELS.PRIVACY_POLICY}
      />
    </SettingSection>
  );
};

OtherSettingsSection.displayName = 'OtherSettingsSection';

export default React.memo(OtherSettingsSection);
