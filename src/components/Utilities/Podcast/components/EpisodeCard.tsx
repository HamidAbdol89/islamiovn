import React from 'react';
import { Play, Pause, Calendar, Clock } from 'lucide-react';
import type { PodcastEpisode, Scholar } from '../types';

interface EpisodeCardProps {
  episode: PodcastEpisode;
  scholar: Scholar;
  isDarkMode: boolean;
  isCurrentEpisode: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  formatDate: (dateString: string) => string;
}

const EpisodeCard: React.FC<EpisodeCardProps> = React.memo(({
  episode,
  scholar,
  isDarkMode,
  isCurrentEpisode,
  isPlaying,
  onPlay,
  formatDate
}) => {
  return (
    <div
      onClick={onPlay}
      className={`rounded-xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      } shadow-md transition-all duration-200 hover:shadow-lg ${
        isCurrentEpisode ? 
          (isDarkMode ? 'ring-2 ring-blue-400' : 'ring-2 ring-blue-500') : ''
      } cursor-pointer`}
    >
      <div className="flex p-4">
        {/* Thumbnail section */}
        <div className="relative mr-4 flex-shrink-0">
          {episode.thumbnail ? (
            <div className="relative">
              <img 
                src={episode.thumbnail} 
                alt={episode.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className={`absolute inset-0 flex items-center justify-center w-full h-full rounded-lg ${
                isCurrentEpisode ? 'bg-black bg-opacity-30' : ''
              }`}>
                {isCurrentEpisode && (
                  isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )
                )}
              </div>
            </div>
          ) : (
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
              isCurrentEpisode && isPlaying
                ? 'bg-red-500'
                : scholar.color.replace('bg-gradient-to-r', 'bg-gradient-to-br')
            }`}>
              {isCurrentEpisode && isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm md:text-base leading-tight mb-1 line-clamp-2">
            {episode.title}
          </h3>
          <p className={`text-xs mb-3 line-clamp-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {episode.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span className={`flex items-center space-x-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span>{formatDate(episode.publishDate)}</span>
            </span>
            <span className={`flex items-center space-x-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>{episode.duration}</span>
            </span>
            {isCurrentEpisode && (
              <span className={`flex items-center space-x-1 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              } font-medium`}>
                <span>•</span>
                <span>{isPlaying ? 'Playing' : 'Paused'}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

EpisodeCard.displayName = 'EpisodeCard';

export default EpisodeCard;
