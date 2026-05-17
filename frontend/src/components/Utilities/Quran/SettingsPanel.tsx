// SettingsPanel.tsx - Settings panel component for QuranReader
import React from 'react';
import { Languages, Palette, Info, Volume2, Type, ZoomIn, ZoomOut } from 'lucide-react';
import { useQuranStore } from '@/stores/quranStore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import type { SettingsPanelProps } from './types';

const SettingsPanel: React.FC<SettingsPanelProps> = React.memo(({
  isOpen,
  onOpenChange,
  selectedLanguage,
  onLanguageChange,
  showTranslation,
  onToggleTranslation,
  showTajweed,
  onToggleTajweed,
  showTajweedLegend,
  onToggleTajweedLegend,
  globalVolume,
  onVolumeChange,
  languages,
  uiText
}) => {
  const fontSize = useQuranStore((s) => s.fontSize);
  const setStoreFontSize = useQuranStore((s) => s.setFontSize);
  const handleLanguageClick = React.useCallback((languageCode: string) => {
    onLanguageChange(languageCode);
  }, [onLanguageChange]);

  const handleVolumeChange = React.useCallback(([value]: number[]) => {
    onVolumeChange(value);
  }, [onVolumeChange]);

  // Font size handlers
  const applyFontSize = React.useCallback((newSize: number) => {
    setStoreFontSize(newSize);
    document.documentElement.style.setProperty('--quran-font-size', `${newSize}rem`);
  }, [setStoreFontSize]);

  const increaseFontSize = React.useCallback(() => {
    const newSize = Math.min(fontSize + 0.1, 2.0);
    applyFontSize(newSize);
  }, [fontSize, applyFontSize]);

  const decreaseFontSize = React.useCallback(() => {
    const newSize = Math.max(fontSize - 0.1, 0.6);
    applyFontSize(newSize);
  }, [fontSize, applyFontSize]);

  const resetFontSize = React.useCallback(() => {
    applyFontSize(1.0);
  }, [applyFontSize]);

  // Apply font size on mount
  React.useEffect(() => {
    document.documentElement.style.setProperty('--quran-font-size', `${fontSize}rem`);
  }, [fontSize]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{uiText.settings}</SheetTitle>
          <SheetDescription>
            Tùy chỉnh trải nghiệm đọc Quran của bạn
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Language Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              <Languages className="h-4 w-4 inline mr-2" />
              {uiText.language}
            </label>
            <div className="space-y-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={selectedLanguage === lang.code ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleLanguageClick(lang.code)}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Display Options */}
          <div className="space-y-3">
            <Button
              variant={showTranslation ? "default" : "outline"}
              className="w-full justify-start"
              onClick={onToggleTranslation}
            >
              <Languages className="h-4 w-4 mr-2" />
              {uiText.translation}
            </Button>
            
            <Button
              variant={showTajweed ? "default" : "outline"}
              className="w-full justify-start"
              onClick={onToggleTajweed}
            >
              <Palette className="h-4 w-4 mr-2" />
              {uiText.tajweed}
            </Button>
            
            <Button
              variant={showTajweedLegend ? "default" : "outline"}
              className="w-full justify-start"
              onClick={onToggleTajweedLegend}
            >
              <Info className="h-4 w-4 mr-2" />
              {uiText.tajweedLegend}
            </Button>
          </div>

          <Separator />

          {/* Font Size Control */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              <Type className="h-4 w-4 inline mr-2" />
              Cỡ chữ Arabic ({Math.round(fontSize * 100)}%)
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={decreaseFontSize}
                disabled={fontSize <= 0.6}
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetFontSize}
                className="h-8 px-3 text-xs"
              >
                100%
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={increaseFontSize}
                disabled={fontSize >= 2.0}
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Volume Control */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              <Volume2 className="h-4 w-4 inline mr-2" />
              {uiText.volume}
            </label>
            <Slider
              value={[globalVolume]}
              onValueChange={handleVolumeChange}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});

SettingsPanel.displayName = 'SettingsPanel';

export default SettingsPanel;
