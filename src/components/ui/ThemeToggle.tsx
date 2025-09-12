import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  theme, 
  onToggle, 
  className 
}) => {
  const isDark = theme === 'dark';
  
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch
        checked={isDark}
        onCheckedChange={onToggle}
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
};