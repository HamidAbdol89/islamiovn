import React from 'react';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Scholar } from '../types';

interface ScholarCardProps {
  scholar: Scholar;
  onClick: () => void;
  isFeatured?: boolean;
}

const ScholarCard: React.FC<ScholarCardProps> = React.memo(({ 
  scholar, 
  onClick, 
  isFeatured = false 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };
  if (isFeatured) {
    return (
      <div
        onClick={handleClick}
        className="flex-shrink-0 w-[80vw] sm:w-[280px] rounded-xl shadow-luxury dark:shadow-luxury-dark bg-card border-border transition-smooth hover:shadow-xl snap-start cursor-pointer"
      >
        <div className="relative p-4 flex items-center space-x-4 h-full">
          <div 
            className={`absolute inset-0 ${
              scholar.color.replace('bg-gradient-to-r', 'bg-gradient-to-br')
            } opacity-10 rounded-xl`}
          />
          
          <Avatar className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden">
            <AvatarImage src={scholar.avatar} alt={scholar.name} />
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base line-clamp-1">{scholar.name}</h3>
            <p className="text-sm line-clamp-2 text-muted-foreground">{scholar.title}</p>
            
            <Badge variant="orange" className="text-[10px] px-2 py-0.5">
  Nổi bật
</Badge>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="rounded-xl p-4 cursor-pointer transition-smooth bg-card border-border hover:bg-accent shadow-luxury dark:shadow-luxury-dark hover:shadow-xl"
    >
      <div className="flex items-center space-x-3">
        <Avatar className={`w-16 h-16 flex-shrink-0 overflow-hidden ${scholar.color}`}>
          <AvatarImage src={scholar.avatar} alt={scholar.name} />
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{scholar.name}</h3>
          <p className="text-sm truncate text-muted-foreground">{scholar.title}</p>
          {scholar.tags && (
            <div className="flex flex-wrap gap-1 mt-1">
              {scholar.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ScholarCard.displayName = 'ScholarCard';

export default ScholarCard;
