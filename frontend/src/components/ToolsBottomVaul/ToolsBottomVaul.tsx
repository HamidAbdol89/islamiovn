'use client';

import { useCallback } from 'react';
import { Drawer } from 'vaul';
import { motion, AnimatePresence } from 'motion/react';

import { APP_TOOLS } from '@/features/tools';
import type { ToolId } from '@/features/tools';

import { cn } from '@/lib/utils';

export interface ToolsBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTool: (toolId: ToolId) => void;
}

export function ToolsBottomSheet({
  open,
  onOpenChange,
  onSelectTool,
}: ToolsBottomSheetProps) {
  const handleSelect = useCallback(
    (toolId: ToolId, isAvailable: boolean) => {
      if (!isAvailable) return;

      onSelectTool(toolId);
      onOpenChange(false);
    },
    [onOpenChange, onSelectTool],
  );

  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      shouldScaleBackground={false}
      modal
      snapPoints={[0.985]}
      fadeFromIndex={0}
    >
      <Drawer.Portal>
        {/* OVERLAY */}
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]" />

        {/* CONTENT */}
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 outline-none">
          <div
            className={cn(
              'mx-auto flex w-full max-w-md flex-col overflow-hidden',
              'rounded-t-[28px]',
              'border-x border-t border-border/60',
              'bg-background/98 backdrop-blur-xl',
              'shadow-[0_-20px_60px_rgba(0,0,0,0.18)]',
            )}
            style={{
              paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
            }}
          >
            {/* HANDLE */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-[5px] w-10 rounded-full bg-muted-foreground/20" />
            </div>

            {/* HEADER */}
            <div className="px-6 pt-3 pb-5">
              <Drawer.Title className="text-[18px] font-semibold tracking-tight text-foreground">
                Tiện ích
              </Drawer.Title>
            </div>

            {/* SEPARATOR */}
            <div className="mx-6 h-px bg-border/70" />

            {/* GRID */}
            <div className="px-4 pt-7">
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.18,
                        ease: 'easeOut',
                      },
                    }}
                    exit={{
                      opacity: 0,
                      y: 4,
                      transition: {
                        duration: 0.12,
                      },
                    }}
                    className="grid grid-cols-4 gap-y-8"
                  >
                    {APP_TOOLS.map((tool) => {
                      const disabled = !tool.isAvailable;

                      return (
                        <button
                          key={tool.id}
                          type="button"
                          disabled={disabled}
                          onClick={() =>
                            handleSelect(tool.id, tool.isAvailable)
                          }
                          className={cn(
                            'flex flex-col items-center justify-start',
                            'gap-[10px]',
                            'select-none active:scale-[0.97]',
                            'transition-transform duration-100',
                            disabled && 'opacity-40',
                          )}
                        >
                          {/* ICON */}
                          {tool.iconUrl && (
                            <img
                              src={tool.iconUrl}
                              alt={tool.label}
                              draggable={false}
                              className={cn(
                                'h-[44px] w-[44px]',
                                'object-contain',
                                'pointer-events-none select-none',
                              )}
                            />
                          )}

                          {/* LABEL */}
                          <span
                            className={cn(
                              'max-w-[76px]',
                              'text-center leading-[1.15]',
                              'text-[11px] font-medium tracking-tight',
                              disabled
                                ? 'text-muted-foreground'
                                : 'text-foreground',
                            )}
                          >
                            {tool.label}
                          </span>

                          {/* COMING SOON */}
                          {disabled && (
                            <span className="text-[9px] font-medium text-muted-foreground/80">
                              Sắp ra mắt
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}