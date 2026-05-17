import React, { useCallback } from 'react';
import { CaretRight } from 'phosphor-react';
import type { SettingItemProps } from './types';

/**
 * Color variants for the icon container.
 * Each maps to bg + text Tailwind pairs using the project's teal/accent palette.
 */
export type IconVariant =
  | 'teal'
  | 'violet'
  | 'amber'
  | 'green'
  | 'red'
  | 'blue'
  | 'pink'
  | 'gray';

const iconVariantClasses: Record<IconVariant, string> = {
  teal:   'bg-primary/10 text-primary dark:bg-primary/20 dark:text-white',
  violet: 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-white',
  amber:  'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-white',
  green:  'bg-green-600/10 text-green-700 dark:bg-green-600/20 dark:text-white',
  red:    'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-white',
  blue:   'bg-accent/10 text-accent dark:bg-accent/20 dark:text-white',
  pink:   'bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-white',
  gray:   'bg-muted text-muted-foreground dark:bg-muted dark:text-white',
};

export interface SettingItemExtendedProps extends SettingItemProps {
  iconVariant?: IconVariant;
  value?: string;
  /** Divider above this row (rendered by parent via CSS, but useful signal) */
  divider?: boolean;
}

const SettingItem = React.memo<SettingItemExtendedProps>(({
  icon: Icon,
  label,
  onClick,
  rightContent,
  showChevron = true,
  iconVariant = 'gray',
  value,
}) => {
  const handleClick = useCallback(() => onClick?.(), [onClick]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        'w-full flex items-center gap-3 px-4 py-3.5',
        'text-left transition-colors duration-100',
        'hover:bg-secondary active:bg-secondary/80',
        onClick ? 'cursor-pointer' : 'cursor-default',
        // separator between rows via CSS sibling
        '[&+&]:border-t [&+&]:border-border',
      ].join(' ')}
    >
      {/* Icon pill */}
      <span className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-shrink-0 ${iconVariantClasses[iconVariant]}`}>
        <Icon className="w-[18px] h-[18px]" />
      </span>

      {/* Label */}
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>

      {/* Right side */}
      <span className="flex items-center gap-2">
        {value && (
          <span className="text-[13px] text-muted-foreground">{value}</span>
        )}
        {rightContent}
        {showChevron && onClick && (
          <CaretRight className="w-4 h-4 text-muted-foreground" />
        )}
      </span>
    </button>
  );
});

SettingItem.displayName = 'SettingItem';
export default SettingItem;
