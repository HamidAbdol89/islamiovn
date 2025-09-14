import React, { useMemo } from 'react';
import { MapPin, Calendar, Bell, Smartphone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';
import { SECTION_TITLES, SETTING_LABELS } from './constants';

const NotificationToggle = React.memo(() => {
  const toggleContent = useMemo(() => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">thông báo</span>
      <div className="relative inline-flex w-12 h-6 rounded-full bg-muted transition-colors">
        <span className="inline-block w-5 h-5 transform rounded-full bg-white shadow-md transition-transform translate-x-0.5" />
      </div>
    </div>
  ), []);

  return (
    <div className="w-full flex justify-between items-center p-4 rounded-lg">
      <div className="flex items-center">
        <Bell className="mr-3 w-5 h-5" />
        <span>{SETTING_LABELS.REMINDER_TYPE}</span>
      </div>
      {toggleContent}
    </div>
  );
});

NotificationToggle.displayName = 'NotificationToggle';

const GeneralSettingsSection: React.FC = () => {
  return (
    <SettingSection title={SECTION_TITLES.GENERAL}>
      <SettingItem
        icon={MapPin}
        label={SETTING_LABELS.LOCATION}
      />
      <Separator />
      <SettingItem
        icon={Calendar}
        label={SETTING_LABELS.CALENDAR_ADJUSTMENT}
      />
      <Separator />
      <NotificationToggle />
      <Separator />
      <SettingItem
        icon={Smartphone}
        label={SETTING_LABELS.WIDGET_SYNC}
      />
    </SettingSection>
  );
};

GeneralSettingsSection.displayName = 'GeneralSettingsSection';

export default React.memo(GeneralSettingsSection);
