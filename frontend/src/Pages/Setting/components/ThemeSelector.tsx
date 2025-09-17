import React, { useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/context/ThemeContext';
import { SETTING_LABELS } from './constants';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = useCallback((checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  }, [setTheme]);

  const isDarkMode = theme === 'dark';

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
      <div className="flex items-center space-x-3">
        {isDarkMode ? (
          <Moon className="w-5 h-5 " />
        ) : (
          <Sun className="w-5 h-5" />
        )}
        <div className="space-y-0.5">
          <Label className="text-base font-medium cursor-pointer" onClick={() => handleThemeToggle(!isDarkMode)}>
            {SETTING_LABELS.THEME}
          </Label>
          <p className="text-sm text-muted-foreground">
            {isDarkMode ? 'Chế độ tối' : 'Chế độ sáng'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted-foreground">
          {isDarkMode ? 'Tối' : 'Sáng'}
        </span>
        <Switch
          checked={isDarkMode}
          onCheckedChange={handleThemeToggle}
          aria-label="Toggle theme"
        />
      </div>
    </div>
  );
};

ThemeSelector.displayName = 'ThemeSelector';

export default React.memo(ThemeSelector);
