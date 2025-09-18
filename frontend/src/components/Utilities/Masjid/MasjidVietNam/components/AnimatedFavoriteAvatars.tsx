// Simple Favorite Avatars with only avatar motion up/down
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users } from 'lucide-react';
import type { FavoriteUser } from '../services/masjidFavoriteApi';

interface AnimatedFavoriteAvatarsProps {
  favoriteUsers: FavoriteUser[];
  totalFavorites: number;
  isFavorited: boolean;
  isPending?: boolean;
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  masjidName?: string; // For Sheet title
}

const AnimatedFavoriteAvatars: React.FC<AnimatedFavoriteAvatarsProps> = ({
  favoriteUsers,
  totalFavorites,
  isPending: _isPending = false, // Prefix with _ to suppress unused warning
  maxDisplay = 10, // Increased to 10 avatars
  size = 'sm',
  showCount = true,
  masjidName
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const displayUsers = favoriteUsers.slice(0, maxDisplay);
  const remainingCount = Math.max(0, totalFavorites - maxDisplay);

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm', 
    lg: 'w-10 h-10 text-base'
  };

  const avatarSize = sizeClasses[size];

  // 🎯 Simple avatar motion: slide up when added, slide down when removed
  const avatarVariants = {
    hidden: { 
      y: 20,
      opacity: 0,
      scale: 0.8
    },
    visible: { 
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as any,
        stiffness: 400,
        damping: 25,
        duration: 0.4
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };



  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <div className="flex items-center gap-2">
        {/* 🚀 Avatar Stack with simple up/down motion - Only clickable if there are users */}
        {totalFavorites > 0 ? (
          <SheetTrigger asChild>
            
            <div 
              className="flex items-center -space-x-2 cursor-pointer hover:scale-105 transition-transform duration-200 rounded-full p-1 hover:bg-accent/50 hover:ring-2 hover:ring-primary/20"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering parent card's onClick
              }}
              title="Xem tất cả người đã yêu thích"
            >
              <AnimatePresence mode="popLayout">
                {displayUsers.map((user, index) => (
                  <motion.div
                    key={user.user.id}
                    variants={avatarVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05, // Stagger animation
                      ease: "easeOut"
                    }}
                    className="relative"
                  >
                    <Avatar className={`${avatarSize} border-2 border-background shadow-sm hover:z-10 hover:scale-110 transition-transform duration-200`}>
                      <AvatarImage 
                        src={user.user.picture} 
                        alt={user.user.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {user.user.name?.charAt(0)?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Remaining count badge - clickable */}
              {remainingCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className={`${avatarSize} rounded-full flex items-center justify-center border-2 border-background shadow-sm hover:scale-110 transition-transform duration-200`}
                >
                  +{remainingCount}
                </Badge>
              )}
            </div>
          </SheetTrigger>
        ) : (
          // Non-clickable version when no favorites
          <div className="flex items-center -space-x-2 opacity-50">
            <div className={`${avatarSize} rounded-full bg-muted flex items-center justify-center border-2 border-background`}>
              <Users className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Total count - no animation */}
        {showCount && totalFavorites > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-sm font-medium">
              {totalFavorites}
            </span>
          </div>
        )}
      </div>

      {/* Sheet Content - All Users List */}
      <SheetContent color="secondary" side="bottom" className="h-[70vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {masjidName ? `${masjidName} - Người đã yêu thích (${totalFavorites})` : `Người đã yêu thích (${totalFavorites})`}
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-full mt-4">
          <div className="space-y-3">
            {favoriteUsers.length > 0 ? (
              favoriteUsers.map((user) => (
                <div key={user.user.id} className="flex items-center gap-3 p-3 rounded-lg bg-card hover:bg-accent transition-colors">
                  <Avatar className="w-10 h-10">
                    <AvatarImage 
                      src={user.user.picture} 
                      alt={user.user.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {user.user.name?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {user.user.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {new Date(user.favoriteInfo.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      {user.favoriteInfo.hasVisited && (
                        <Badge variant="outline" className="text-xs">
                          Đã thăm
                        </Badge>
                      )}
                      {user.favoriteInfo.rating && (
                        <div className="flex items-center gap-1">
                          <span>⭐</span>
                          <span>{user.favoriteInfo.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có ai yêu thích masjid này</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

// Memoize for performance
export default React.memo(AnimatedFavoriteAvatars);
