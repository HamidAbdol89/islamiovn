import React, { useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AudioPlayerState } from '../types';

interface DuaBottomControlsProps {
  trangThaiPlayer: AudioPlayerState;
  coTheTruoc: boolean;
  coTheTiep: boolean;
  docLienTuc: boolean;
  onTruoc: () => void;
  onTiep: () => void;
  onTogglePhat: () => void;
  onToggleTatTieng: () => void;
  onToggleDocLienTuc: () => void;
}

const DuaBottomControls = React.memo<DuaBottomControlsProps>(({
  trangThaiPlayer,
  coTheTruoc,
  coTheTiep,
  docLienTuc,
  onTruoc,
  onTiep,
  onTogglePhat,
  onToggleTatTieng,
  onToggleDocLienTuc
}) => {
  // Memoized handlers
  const handleTruoc = useCallback(() => {
    onTruoc();
  }, [onTruoc]);

  const handleTiep = useCallback(() => {
    onTiep();
  }, [onTiep]);

  const handleTogglePhat = useCallback(() => {
    onTogglePhat();
  }, [onTogglePhat]);

  const handleToggleTatTieng = useCallback(() => {
    onToggleTatTieng();
  }, [onToggleTatTieng]);

  const handleToggleDocLienTuc = useCallback(() => {
    onToggleDocLienTuc();
  }, [onToggleDocLienTuc]);

  // Memoized button variants
  const variantTatTieng = useMemo(() => 
    trangThaiPlayer.tatTieng ? "secondary" : "outline",
    [trangThaiPlayer.tatTieng]
  );

  const variantDocLienTuc = useMemo(() => 
    docLienTuc ? "secondary" : "outline",
    [docLienTuc]
  );

  return (
    <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t p-4">
      <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleTruoc}
          disabled={!coTheTruoc}
          className="shrink-0 transition-smooth"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Audio Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant={variantTatTieng}
            size="icon"
            onClick={handleToggleTatTieng}
            className="transition-smooth"
          >
            {trangThaiPlayer.tatTieng ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            onClick={handleTogglePhat}
            size="lg"
            className="w-14 h-14 bg-luxury-gradient hover:opacity-90 transition-smooth"
          >
            {trangThaiPlayer.dangPhat ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </Button>
          
          <Button
            variant={variantDocLienTuc}
            size="icon"
            onClick={handleToggleDocLienTuc}
            className="transition-smooth"
          >
            <Repeat className="w-4 h-4" />
          </Button>
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleTiep}
          disabled={!coTheTiep}
          className="shrink-0 transition-smooth"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

DuaBottomControls.displayName = 'DuaBottomControls';

export default DuaBottomControls;
