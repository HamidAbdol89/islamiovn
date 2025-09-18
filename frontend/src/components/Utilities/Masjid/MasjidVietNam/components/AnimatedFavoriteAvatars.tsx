// Simple Favorite Avatars with only avatar motion up/down
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
  isPending: _isPending = false,
  maxDisplay = 10,
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

  // 🎯 Simple avatar motion
  const avatarVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.8 },
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
      transition: { duration: 0.3 }
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={(open) => setIsSheetOpen(open)}>
      <div className="flex items-center gap-2">
        {totalFavorites > 0 ? (
          <div
            className="flex items-center -space-x-2 cursor-pointer hover:scale-105 transition-transform duration-200 rounded-full p-1 hover:bg-accent/50 hover:ring-2 hover:ring-primary/20"
            onClick={(e) => {
              e.stopPropagation();
              setIsSheetOpen(true); // mở sheet trực tiếp
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
                    delay: index * 0.05,
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

            {remainingCount > 0 && (
              <Badge
                variant="secondary"
                className={`${avatarSize} rounded-full flex items-center justify-center border-2 border-background shadow-sm hover:scale-110 transition-transform duration-200`}
              >
                +{remainingCount}
              </Badge>
            )}
          </div>
        ) : (
          <div className="flex items-center -space-x-2 opacity-50">
            <div className={`${avatarSize} rounded-full bg-muted flex items-center justify-center border-2 border-background`}>
              <Users className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        )}

        {showCount && totalFavorites > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-sm font-medium">{totalFavorites}</span>
          </div>
        )}
      </div>

      {/* Sheet Content */}
      <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-sm">
            <Users className="w-3 h-3" />
            {masjidName 
              ? `${masjidName} - ${totalFavorites} lượt thích` 
              : `${totalFavorites} lượt thích`}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-3">
          {favoriteUsers.length > 0 ? (
            favoriteUsers.map((favoriteUser, index) => (
              <motion.div
                key={favoriteUser.user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                  <AvatarImage
                    src={favoriteUser.user.picture}
                    alt={favoriteUser.user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {favoriteUser.user.name?.charAt(0)?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">
                    {favoriteUser.user.name}
                  </div>
                 
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có ai yêu thích masjid này</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default React.memo(AnimatedFavoriteAvatars);
