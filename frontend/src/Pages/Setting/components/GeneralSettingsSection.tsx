import React, { useCallback } from 'react';
import { Bell, Calendar, DeviceMobile, MapPin } from 'phosphor-react';
import { Switch } from '@/components/ui/switch';
import { useSettingsStore } from '@/stores/settingsStore';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';
import { SECTION_TITLES, SETTING_LABELS } from './constants';

const NotificationRow: React.FC = () => {
  const enabled = useSettingsStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useSettingsStore(
    (s) => s.setNotificationsEnabled
  );
  const toggle = useCallback(
    () => setNotificationsEnabled(!enabled),
    [enabled, setNotificationsEnabled]
  );

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 [&+*]:border-t [&+*]:border-border">
      <span className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-shrink-0 bg-pink-500/10 text-pink-600 dark:text-pink-400">
        <Bell className="w-[18px] h-[18px]" />
      </span>
      <span className="flex-1 text-sm font-medium text-foreground">{SETTING_LABELS.REMINDER_TYPE}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{enabled ? 'Bật' : 'Tắt'}</span>
        <Switch
          checked={enabled}
          onCheckedChange={toggle}
          aria-label="Bật/tắt nhắc nhở"
        />
      </div>
    </div>
  );
};

const GeneralSettingsSection: React.FC = () => (
  <SettingSection title={SECTION_TITLES.GENERAL} delay={0.2}>
    <SettingItem
      icon={MapPin}
      label={SETTING_LABELS.LOCATION}
      iconVariant="teal"
      value="Hồ Chí Minh"
    />
    <SettingItem
      icon={Calendar}
      label={SETTING_LABELS.CALENDAR_ADJUSTMENT}
      iconVariant="green"
      value="+0 ngày"
    />
    <NotificationRow />
    <SettingItem
      icon={DeviceMobile}
      label={SETTING_LABELS.WIDGET_SYNC}
      iconVariant="blue"
    />
  </SettingSection>
);

GeneralSettingsSection.displayName = 'GeneralSettingsSection';
export default React.memo(GeneralSettingsSection);
