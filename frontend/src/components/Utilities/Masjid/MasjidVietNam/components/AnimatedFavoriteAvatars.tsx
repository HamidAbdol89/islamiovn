// Simple Favorite Avatars with only avatar motion up/down
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { FavoriteUser } from '../services/masjidFavoriteApi';

interface AnimatedFavoriteAvatarsProps {
  favoriteUsers: FavoriteUser[];
  totalFavorites: number;
  isFavorited: boolean;
  isPending?: boolean;
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const AnimatedFavoriteAvatars: React.FC<AnimatedFavoriteAvatarsProps> = ({
  favoriteUsers,
  totalFavorites,
  isPending: _isPending = false, // Prefix with _ to suppress unused warning
  maxDisplay = 5,
  size = 'sm',
  showCount = true
}) => {
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
    <div className="flex items-center gap-2">
   

      {/* 🚀 Avatar Stack with simple up/down motion */}
      <div className="flex items-center -space-x-2">
        <AnimatePresence mode="popLayout">
          {displayUsers.map((user, index) => (
            <motion.div
              key={`${user.user.id}-${user.favoriteInfo.createdAt}`}
              variants={avatarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative"
              style={{ zIndex: maxDisplay - index }}
            >
              <Avatar className={`${avatarSize} border-2 border-background shadow-sm`}>
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

        {/* Remaining count badge - no animation */}
        {remainingCount > 0 && (
          <Badge 
            variant="secondary" 
            className={`${avatarSize} rounded-full flex items-center justify-center border-2 border-background shadow-sm`}
          >
            +{remainingCount}
          </Badge>
        )}
      </div>

      {/* Total count - no animation */}
     {showCount && totalFavorites > 0 && (
  <div className="flex items-center gap-1 text-muted-foreground">
    <span className="text-sm font-medium">
      {totalFavorites}
    </span>
  </div>
)}

    </div>
  );
};

// Memoize for performance
export default React.memo(AnimatedFavoriteAvatars);
