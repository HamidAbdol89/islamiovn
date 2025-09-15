import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import BackButton from "@/components/ui/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import type { SurahSelectionProps } from "./types";

const SurahSelectionScreen: React.FC<SurahSelectionProps> = React.memo(
  ({ surahList, onSurahSelect, uiText }) => {
    const handleSurahClick = React.useCallback(
      (surahIndex: string) => {
        onSurahSelect(parseInt(surahIndex));
      },
      [onSurahSelect]
    );

    // Skeleton list nếu chưa load
    const isLoading = !surahList || surahList.length === 0;

    return (
      <div className="min-h-screen bg-background">
        {/* Header giống mobile */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-background">
          <BackButton />
          <h1 className="text-lg font-semibold">{uiText.title}</h1>
          <div className="w-8" /> {/* giữ cân đối */}
        </div>

        {/* Danh sách Surah */}
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="grid gap-2 px-4 py-4 max-w-2xl mx-auto">
            {isLoading
              ? Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-6 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-5 rounded-md" />
                  </div>
                ))
              : surahList.map((surah) => (
                  <Button
                    key={surah.index}
                    variant="outline"
                    className="h-auto p-4 justify-between rounded-xl  hover:text-white transition-all duration-200"
                    onClick={() => handleSurahClick(surah.index)}
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="min-w-[2.5rem] text-center rounded-md"
                      >
                        {surah.index}
                      </Badge>
                      <div className="text-left">
                        <div className="font-medium">{surah.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {surah.count} {uiText.verses} • {surah.type}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 opacity-70" />
                  </Button>
                ))}
          </div>
        </ScrollArea>
      </div>
    );
  }
);

SurahSelectionScreen.displayName = "SurahSelectionScreen";

export default SurahSelectionScreen;
