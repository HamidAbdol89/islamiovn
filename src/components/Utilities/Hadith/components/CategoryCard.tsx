import { memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ChevronRight } from 'lucide-react';
import type { CategoryCardProps } from '../types';

const CategoryCard = memo<CategoryCardProps>(({ category, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(category);
  }, [category, onClick]);

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-border hover:border-primary/50"
      onClick={handleClick}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {category.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="gap-1">
            <Star className="h-3 w-3" />
            {category.hadeeths_count} Hadith
          </Badge>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;
