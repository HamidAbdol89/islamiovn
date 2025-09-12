import React from 'react';
import type { Scholar } from '../types';

interface ScholarCardProps {
  scholar: Scholar;
  isDarkMode: boolean;
  onClick: () => void;
  isFeatured?: boolean;
}

const ScholarCard: React.FC<ScholarCardProps> = React.memo(({ 
  scholar, 
  isDarkMode, 
  onClick, 
  isFeatured = false 
}) => {
  if (isFeatured) {
    return (
      <div
        onClick={onClick}
        className={`
          flex-shrink-0 w-[80vw] sm:w-[280px] rounded-xl shadow-lg
          transition-all duration-300 hover:shadow-xl snap-start cursor-pointer
          ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        `}
      >
        {/* Mobile-friendly layout */}
        <div className="relative p-4 flex items-center space-x-4 h-full">
          {/* Light gradient background */}
          <div 
            className={`absolute inset-0 ${
              scholar.color.replace('bg-gradient-to-r', 'bg-gradient-to-br')
            } opacity-10 rounded-xl`}
          />
          
          {/* Larger avatar for mobile */}
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg ${
            scholar.color
          } flex-shrink-0 overflow-hidden`}>
            <img
              src={scholar.avatar}
              alt={scholar.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Concise content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base line-clamp-1">{scholar.name}</h3>
            <p className={`text-sm line-clamp-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {scholar.title}
            </p>
            
            {/* Simplified featured badge */}
            <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
              isDarkMode ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800'
            }`}>
              Featured
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-4 cursor-pointer transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 hover:bg-gray-700' 
          : 'bg-white hover:bg-gray-50'
      } shadow-md hover:shadow-lg`}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-16 h-16 rounded-lg ${scholar.color} flex-shrink-0 overflow-hidden`}>
          <img
            src={scholar.avatar}
            alt={scholar.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{scholar.name}</h3>
          <p className={`text-sm truncate ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {scholar.title}
          </p>
          {/* Add tags if available */}
          {scholar.tags && (
            <div className="flex flex-wrap gap-1 mt-1">
              {scholar.tags.slice(0, 2).map(tag => (
                <span 
                  key={tag} 
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  {tag}
                </span>
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
