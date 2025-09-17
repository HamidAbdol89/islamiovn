// Component to display avatars of users who favorited a masjid
import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FavoriteUser } from '../services/masjidFavoriteApi';

interface FavoriteUsersAvatarsProps {
  users: FavoriteUser[];
  totalCount: number;
  isLoading?: boolean;
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

const FavoriteUsersAvatars: React.FC<FavoriteUsersAvatarsProps> = React.memo(({
  users,
  totalCount,
  isLoading = false,
  maxDisplay = 5,
  size = 'sm',
  showCount = true,
  className
}) => {
  const displayUsers = users.slice(0, maxDisplay);
  const remainingCount = Math.max(0, totalCount - maxDisplay);

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  const sizeClass = sizeClasses[size];

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <div className="flex -space-x-1">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "rounded-full bg-muted animate-pulse border-2 border-background",
                sizeClass
              )}
            />
          ))}
        </div>
        {showCount && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Heart className="w-3 h-3" />
            <span>...</span>
          </div>
        )}
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className={cn("flex items-center gap-1 text-muted-foreground", className)}>
        <Heart className="w-3 h-3" />
        <span className="text-xs">Chưa có ai yêu thích</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Avatar Stack */}
      <div className="flex -space-x-1">
        {displayUsers.map((favoriteUser, index) => (
          <div
            key={favoriteUser.user.id}
            className={cn(
              "relative rounded-full border-2 border-background overflow-hidden bg-muted",
              sizeClass
            )}
            style={{ zIndex: maxDisplay - index }}
            title={`${favoriteUser.user.name}${favoriteUser.favoriteInfo.hasVisited ? ' (đã thăm)' : ''}`}
          >
            {favoriteUser.user.picture ? (
              <img
                src={favoriteUser.user.picture}
                alt={favoriteUser.user.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className={cn(
                "w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium",
                sizeClass
              )}>
                {favoriteUser.user.name.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Visited indicator */}
            {favoriteUser.favoriteInfo.hasVisited && (
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-background" />
            )}
          </div>
        ))}
        
        {/* Remaining count indicator */}
        {remainingCount > 0 && (
          <div
            className={cn(
              "rounded-full border-2 border-background bg-muted flex items-center justify-center text-muted-foreground font-medium",
              sizeClass
            )}
            title={`+${remainingCount} người khác`}
          >
            +{remainingCount > 99 ? '99' : remainingCount}
          </div>
        )}
      </div>

      {/* Count and label */}
      {showCount && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Heart className="w-3 h-3 fill-current text-red-500" />
          <span className="font-medium">
            {totalCount === 1 ? '1 người' : `${totalCount} người`}
          </span>
        </div>
      )}
    </div>
  );
});

FavoriteUsersAvatars.displayName = 'FavoriteUsersAvatars';

// Compact version for small spaces
export const CompactFavoriteAvatars: React.FC<Omit<FavoriteUsersAvatarsProps, 'showCount' | 'size'>> = React.memo((props) => (
  <FavoriteUsersAvatars
    {...props}
    size="sm"
    showCount={false}
    maxDisplay={3}
  />
));

CompactFavoriteAvatars.displayName = 'CompactFavoriteAvatars';

export default FavoriteUsersAvatars;
