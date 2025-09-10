// src/components/ThemeToggle.tsx
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Sun className="w-5 h-5 text-yellow-500" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        className="bg-slate-300 dark:bg-slate-700"
      />
      <Moon className="w-5 h-5 text-purple-500" />
    </div>
  );
};
