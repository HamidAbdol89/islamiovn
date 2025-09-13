import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Scholar } from '../types';
import { FEATURED_SCHOLARS, SCHOLAR_CATEGORIES } from '../constants';
import ScholarCard from './ScholarCard';

interface ScholarListProps {
  scholars: Scholar[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onScholarSelect: (scholarId: string) => void;
}

// Memoized Vietnamese UI text
const UI_TEXT = {
  FEATURED_SCHOLARS: 'Học Giả Nổi Bật',
  NO_RESULTS: 'Không tìm thấy học giả phù hợp',
} as const;

const ScholarList: React.FC<ScholarListProps> = React.memo(({
  scholars,
  searchTerm,
  onScholarSelect
}) => {
  const featuredScholars = useMemo(() => 
    scholars.filter(scholar => FEATURED_SCHOLARS.includes(scholar.id)),
    [scholars]
  );

  const filteredCategories = useMemo(() => 
    SCHOLAR_CATEGORIES.map((category) => ({
      ...category,
      scholars: scholars.filter(scholar => 
        category.scholarIds.includes(scholar.id) &&
        (searchTerm === '' || 
         scholar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         scholar.bio.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })).filter(category => category.scholars.length > 0),
    [scholars, searchTerm]
  );

  const hasNoResults = useMemo(() => 
    searchTerm && scholars.filter(scholar => 
      scholar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholar.bio.toLowerCase().includes(searchTerm.toLowerCase())
    ).length === 0,
    [scholars, searchTerm]
  );

  return (
    <div className="pb-24 bg-background text-foreground transition-smooth">
      <div className="p-4">
        {/* FEATURED SCHOLARS */}   
        {!searchTerm && (
          <div className="mb-6 px-4">
<h3 className="text-xl font-bold mb-4 text-[var(--foreground)]">{UI_TEXT.FEATURED_SCHOLARS}</h3>
            
            {/* Horizontal scroll layout for mobile */}
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory no-scrollbar">
              {featuredScholars.map(scholar => (
                <ScholarCard
                  key={scholar.id}
                  scholar={scholar}
                  onClick={() => onScholarSelect(scholar.id)}
                  isFeatured={true}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Display by category */}
        {filteredCategories.map((category) => (
          <div key={category.id} className="mb-8">
<h3 className="text-xl font-bold mb-4 px-4 text-[var(--foreground)]">{category.name}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
              {category.scholars.map((scholar) => (
                <ScholarCard
                  key={scholar.id}
                  scholar={scholar}
                  onClick={() => onScholarSelect(scholar.id)}
                  isFeatured={false}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Display when no results found using shadcn Card */}
        {hasNoResults && (
          <Card className="mx-4 bg-card border-border shadow-luxury dark:shadow-luxury-dark transition-smooth">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {UI_TEXT.NO_RESULTS}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
});

ScholarList.displayName = 'ScholarList';

export default ScholarList;