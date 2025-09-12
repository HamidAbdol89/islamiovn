import React, { useMemo } from 'react';
import type { Scholar } from '../types';
import { FEATURED_SCHOLARS, SCHOLAR_CATEGORIES } from '../constants';
import ScholarCard from './ScholarCard';

interface ScholarListProps {
  scholars: Scholar[];
  isDarkMode: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onScholarSelect: (scholarId: string) => void;
}

const ScholarList: React.FC<ScholarListProps> = React.memo(({
  scholars,
  isDarkMode,
  searchTerm,
  onSearchChange,
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
    <div className="pb-24">
      <div className="p-4">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-2">Islamic Knowledge Audio</h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Listen to inspiring lectures from leading Islamic scholars worldwide.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-6 sticky top-16 z-10 bg-opacity-95 backdrop-blur-sm">
          <input
            type="text"
            placeholder="Search scholars..."
            className={`w-full p-3 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 text-white placeholder-gray-400' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
            }`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* FEATURED SCHOLARS */}   
        {!searchTerm && (
          <div className="mb-6 px-4">
            <h3 className="text-xl font-bold mb-4">Featured Scholars</h3>
            
            {/* Changed layout for mobile */}
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory no-scrollbar">
              {featuredScholars.map(scholar => (
                <ScholarCard
                  key={scholar.id}
                  scholar={scholar}
                  isDarkMode={isDarkMode}
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
            <h3 className="text-xl font-bold mb-4 px-4">{category.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
              {category.scholars.map((scholar) => (
                <ScholarCard
                  key={scholar.id}
                  scholar={scholar}
                  isDarkMode={isDarkMode}
                  onClick={() => onScholarSelect(scholar.id)}
                  isFeatured={false}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Display when no results found */}
        {hasNoResults && (
          <div className={`p-8 text-center rounded-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              No matching scholars found
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

ScholarList.displayName = 'ScholarList';

export default ScholarList;
