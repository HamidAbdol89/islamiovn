import React, { useMemo, useCallback } from 'react';
import { Check, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { THEME_OPTIONS, SETTING_LABELS } from './constants';
import type { ThemeOption } from './types';

interface ThemeButtonProps {
  readonly option: ThemeOption;
  readonly isSelected: boolean;
  readonly onSelect: (themeId: string) => void;
}

const ThemeButton = React.memo<ThemeButtonProps>(({ option, isSelected, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(option.id);
  }, [option.id, onSelect]);

  const buttonClassName = useMemo(() => 
    `flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all relative ${
      isSelected
        ? 'border-primary bg-primary/10'
        : 'border-muted hover:border-primary/50'
    }`,
    [isSelected]
  );

  const IconComponent = option.icon;

  return (
    <button
      onClick={handleClick}
      className={buttonClassName}
    >
      <IconComponent className="w-5 h-5 mb-1" />
      <span className="text-xs">{option.name}</span>
      {isSelected && (
        <Check className="w-4 h-4 text-primary absolute top-1 right-1" />
      )}
    </button>
  );
});

ThemeButton.displayName = 'ThemeButton';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeSelect = useCallback((themeId: string) => {
    setTheme(themeId as any);
  }, [setTheme]);

  const themeButtons = useMemo(() => 
    THEME_OPTIONS.map((option) => (
      <ThemeButton
        key={option.id}
        option={option}
        isSelected={theme === option.id}
        onSelect={handleThemeSelect}
      />
    )),
    [theme, handleThemeSelect]
  );

  return (
    <div className="p-4">
      <div className="flex items-center mb-3">
        <Moon className="mr-3 w-5 h-5" />
        <span>{SETTING_LABELS.THEME}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {themeButtons}
      </div>
    </div>
  );
};

ThemeSelector.displayName = 'ThemeSelector';

export default React.memo(ThemeSelector);
