import React, { useCallback } from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BackButton from "@/components/ui/BackButton";
import type { DuaSource, DuaSourceInfo } from './types';
import { VIETNAMESE_TEXT, DUA_SOURCES } from './constants';

interface DuaSourceSelectorProps {
  onChonNguon: (nguon: DuaSource) => void;
}

// Simple Source Card Component
const SourceCard = React.memo<{
  sourceInfo: DuaSourceInfo;
  onSelect: () => void;
}>(({ sourceInfo, onSelect }) => {
  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
     
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1">{sourceInfo.tenNguon}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {sourceInfo.moTa}
              </p>
              
              <div className="flex items-center gap-2">
                <Badge variant="default">
                  {sourceInfo.soLuongDua} dua
                </Badge>
                <Badge variant="outline">
                  {sourceInfo.tacGia}
                </Badge>
              </div>
            </div>
          </div>
          
          <ChevronRight className="w-6 h-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
});

SourceCard.displayName = 'SourceCard';

const DuaSourceSelector = React.memo<DuaSourceSelectorProps>(({
  onChonNguon
}) => {
  const handleChonNguon = useCallback((nguon: DuaSource) => {
    onChonNguon(nguon);
  }, [onChonNguon]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Card className="sticky top-0 z-20 rounded-none border-x-0 border-t-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <BackButton />
            
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            
            <div>
              <h1 className="font-bold text-lg">
                {VIETNAMESE_TEXT.TIEU_DE_CHON_NGUON}
              </h1>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="p-2 space-y-2">
        

        {/* Available Sources */}
        <div className="space-y-3">
          {Object.values(DUA_SOURCES).map(sourceInfo => (
            <SourceCard
              key={sourceInfo.id}
              sourceInfo={sourceInfo}
              onSelect={() => handleChonNguon(sourceInfo.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default React.memo(DuaSourceSelector);
