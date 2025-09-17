import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ComponentType<any>;
  isActive?: boolean;
  onClick?: () => void;
  delay?: number;
}

const AnimatedCard = React.memo<AnimatedCardProps>(({ 
  children, 
  className, 
  title, 
  description, 
  icon: Icon,
  isActive = false,
  onClick,
  delay = 0
}) => {
  const cardClasses = cn(
    "transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg",
    "animate-in fade-in slide-in-from-bottom-4",
    isActive && "ring-2 ring-primary ring-offset-2",
    onClick && "cursor-pointer hover:bg-accent/50",
    className
  );

  const cardStyle = {
    animationDelay: `${delay}ms`,
    animationFillMode: 'both'
  };

  return (
    <Card 
      className={cardClasses} 
      onClick={onClick}
      style={cardStyle}
    >
      {(title || description) && (
        <CardHeader>
          {title && (
            <CardTitle className="flex items-center gap-2">
              {Icon && <Icon className="w-5 h-5" />}
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={!title && !description ? "pt-6" : ""}>
        {children}
      </CardContent>
    </Card>
  );
});

AnimatedCard.displayName = 'AnimatedCard';

export default AnimatedCard;
