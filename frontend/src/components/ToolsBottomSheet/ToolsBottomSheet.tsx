'use client';

import { useCallback, useEffect } from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import { motion } from 'motion/react';

import {
  Dialog,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';

import { APP_TOOLS } from '@/features/tools';
import type { ToolId } from '@/features/tools';

import { cn } from '@/lib/utils';

export interface ToolsBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTool: (toolId: ToolId) => void;
}

const gridItemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.96,
  },

  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      delay: 0.18 + index * 0.018,
      duration: 0.18,
ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

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

  // PRELOAD ICONS
  useEffect(() => {
    APP_TOOLS.forEach((tool) => {
      if (!tool.iconUrl) return;

      const img = new Image();
      img.src = tool.iconUrl;
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal forceMount>
        {/* OVERLAY */}
        <DialogOverlay forceMount asChild>
          <motion.div
            animate={{
              opacity: open ? 1 : 0,
            }}
            transition={{
              duration: 0.16,
              ease: 'easeOut',
            }}
            className={cn(
              'fixed inset-0 z-50',
              'bg-black/40',
              open
                ? 'pointer-events-auto'
                : 'pointer-events-none',
              'will-change-opacity',
            )}
          />
        </DialogOverlay>

        {/* CONTENT */}
        <DialogPrimitive.Content
          forceMount
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 mx-auto',
            'w-full max-w-md outline-none',
            'pb-[calc(env(safe-area-inset-bottom)+12px)]',
            open
              ? 'pointer-events-auto'
              : 'pointer-events-none',
          )}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tools-sheet-title"
            initial={false}
            animate={{
              y: open ? 0 : '100%',
            }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 32,
              mass: 0.72,
            }}
            className={cn(
              'mx-3 overflow-hidden rounded-t-[30px]',
              'border border-white/8',
              'bg-background/96',
              'shadow-[0_-8px_30px_rgba(0,0,0,0.12)]',
              'transform-gpu will-change-transform',
              'backface-hidden',
            )}
          >
            <div className="px-4 pt-3 pb-5">
              {/* HANDLE */}
              <div
                onClick={() => onOpenChange(false)}
                className={cn(
                  'mx-auto mb-5 h-1.5 w-11 rounded-full',
                  'bg-muted-foreground/20',
                )}
              />

              {/* HEADER */}
              <div className="mb-5 px-1">
                <DialogPrimitive.Title
                  id="tools-sheet-title"
                  className="text-[15px] font-semibold text-foreground"
                >
                  Tiện ích
                </DialogPrimitive.Title>

                <DialogPrimitive.Description
                  className={cn(
                    'mt-1 text-xs',
                    'text-muted-foreground',
                  )}
                >
                  Chọn công cụ để bắt đầu
                </DialogPrimitive.Description>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-3 gap-3">
                {APP_TOOLS.map((tool, index) => {
                  const disabled = !tool.isAvailable;

                  return (
                    <motion.button
                      key={tool.id}
                      type="button"
                      custom={index}
                      variants={gridItemVariants}
                      initial="hidden"
                      animate={open ? 'visible' : 'hidden'}
                      whileTap={
                        disabled
                          ? undefined
                          : {
                              scale: 0.92,
                            }
                      }
                      disabled={disabled}
                      onClick={() =>
                        handleSelect(
                          tool.id,
                          tool.isAvailable,
                        )
                      }
                      className={cn(
                        'group relative flex flex-col items-center justify-center',
                        'gap-2 rounded-2xl p-2',
                        'select-none',
                        'transform-gpu will-change-transform',
                        disabled &&
                          'cursor-not-allowed opacity-40',
                      )}
                    >
                      {/* ICON */}
                      <div
                        className={cn(
                          'flex h-14 w-14 items-center justify-center',
                        )}
                      >
                        {tool.iconUrl ? (
                          <img
                            src={tool.iconUrl}
                            alt={tool.label}
                            loading="eager"
                            draggable={false}
                            className={cn(
                              'h-11 w-11 object-contain',
                              'pointer-events-none select-none',
                              'transform-gpu will-change-transform',
                              !disabled &&
                                'transition-transform duration-150 group-active:scale-90',
                            )}
                          />
                        ) : null}
                      </div>

                      {/* LABEL */}
                      <span
                        className={cn(
                          'text-center text-[11px] font-medium leading-tight',
                          disabled
                            ? 'text-muted-foreground'
                            : 'text-foreground',
                        )}
                      >
                        {tool.label}
                      </span>

                      {/* DISABLED */}
                      {disabled && (
                        <span
                          className={cn(
                            'text-[9px]',
                            'text-muted-foreground',
                          )}
                        >
                          Sắp ra mắt
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}