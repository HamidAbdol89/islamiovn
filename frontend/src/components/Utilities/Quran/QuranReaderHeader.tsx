// QuranReaderHeader.tsx - Header component for QuranReader
import React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/BackButton";
import type { QuranReaderHeaderProps } from "./types";

const QuranReaderHeader: React.FC<QuranReaderHeaderProps> = React.memo(
  ({ currentSurahInfo, selectedSurah, versesCount, onBackClick, onSettingsClick }) => {
    const surahTitle = currentSurahInfo?.title || `Surah ${selectedSurah}`;
    const surahInfo = `${versesCount} câu • ${currentSurahInfo?.type || ""}`;

    return (
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back + Info */}
          <div className="flex items-center gap-3">
            <BackButton onClick={onBackClick}  />
            <div className="leading-tight">
              <h1 className="text-base font-semibold">{surahTitle}</h1>
              <p className="text-xs text-muted-foreground">{surahInfo}</p>
            </div>
          </div>

          {/* Right: Settings */}
          <Button variant="ghost" size="sm" onClick={onSettingsClick}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }
);

QuranReaderHeader.displayName = "QuranReaderHeader";

export default QuranReaderHeader;
