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
    <div className="pb-24 bg-background text-foreground transition-smooth relative">
      {/* Search Overlay - Covers entire screen when searching */}
      {searchTerm && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md" data-search-overlay="true">
          <div className="pt-16 pb-24 h-full overflow-y-auto" data-search-overlay="true">
            <div className="p-4">
              <h3 className="text-xl font-bold mb-4 px-4 text-foreground">
                Kết quả tìm kiếm cho "{searchTerm}"
              </h3>
              
              {/* Search Results */}
              {filteredCategories.map((category) => (
                <div key={category.id} className="mb-8">
                  <h4 className="text-lg font-semibold mb-3 px-4 text-foreground/80">
                    {category.name}
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
                    {category.scholars.map((scholar, index) => (
                      <div
                        key={`search-${category.id}-${scholar.id}-${index}`}
                        data-search-result="true"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onScholarSelect(scholar.id);
                        }}
                        className="rounded-xl p-4 cursor-pointer transition-all duration-300 bg-card border border-border hover:bg-accent hover:border-primary/20 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-16 h-16 flex-shrink-0 overflow-hidden rounded-full ${scholar.color} ring-2 ring-primary/10`}>
                            <img src={scholar.avatar} alt={scholar.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate text-foreground">{scholar.name}</h3>
                            <p className="text-sm truncate text-muted-foreground">{scholar.title}</p>
                            {scholar.tags && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {scholar.tags.slice(0, 2).map(tag => (
                                  <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* No results found */}
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
        </div>
      )}

      {/* Normal View - Only show when not searching */}
      {!searchTerm && (
        <div className="p-4">
          {/* FEATURED SCHOLARS */}   
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
          
          {/* Display by category */}
          {SCHOLAR_CATEGORIES.map((category) => {
            const categoryScholars = scholars.filter(scholar => 
              category.scholarIds.includes(scholar.id)
            );
            
            if (categoryScholars.length === 0) return null;
            
            return (
              <div key={category.id} className="mb-8">
                <h3 className="text-xl font-bold mb-4 px-4 text-[var(--foreground)]">{category.name}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
                  {categoryScholars.map((scholar) => (
                    <ScholarCard
                      key={scholar.id}
                      scholar={scholar}
                      onClick={() => onScholarSelect(scholar.id)}
                      isFeatured={false}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

ScholarList.displayName = 'ScholarList';

export default ScholarList;