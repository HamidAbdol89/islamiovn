import React, { useCallback } from 'react';
import { Moon, Sun } from 'phosphor-react';
import { useTheme } from '@/context/ThemeContext';
import { SETTING_LABELS } from './constants';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleLight = useCallback(() => setTheme('light'), [setTheme]);
  const handleDark  = useCallback(() => setTheme('dark'),  [setTheme]);

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 [&+*]:border-t [&+*]:border-border">
      {/* Icon pill */}
      <span className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-shrink-0 bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-white">
        {isDark
          ? <Moon className="w-[18px] h-[18px]" />
          : <Sun  className="w-[18px] h-[18px]" />
        }
      </span>

      <span className="flex-1 text-sm font-medium text-foreground">{SETTING_LABELS.THEME}</span>

      {/* Segmented control */}
      <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
        <button
          type="button"
          onClick={handleLight}
          className={[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
            !isDark
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          ].join(' ')}
        >
          <Sun className="w-3.5 h-3.5" />
          Sáng
        </button>
        <button
          type="button"
          onClick={handleDark}
          className={[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
            isDark
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          ].join(' ')}
        >
          <Moon className="w-3.5 h-3.5" />
          Tối
        </button>
      </div>
    </div>
  );
};

ThemeSelector.displayName = 'ThemeSelector';
export default React.memo(ThemeSelector);
