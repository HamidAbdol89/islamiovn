import React from 'react';
import { Play, Pause } from 'lucide-react';
import type { PodcastEpisode, Scholar } from '../types';

interface MiniPlayerProps {
  currentEpisode: PodcastEpisode;
  currentScholar: Scholar | undefined;
  isDarkMode: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlayPause: () => void;
  onRewind: () => void;
  onForward: () => void;
  formatTime: (seconds: number) => string;
}

const MiniPlayer: React.FC<MiniPlayerProps> = React.memo(({
  currentEpisode,
  currentScholar,
  isDarkMode,
  isPlaying,
  currentTime,
  duration,
  onTogglePlayPause,
  onRewind,
  onForward,
  formatTime
}) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-t backdrop-blur-sm bg-opacity-95`}>
      <div className="p-4">
        <div className="flex items-center space-x-3">
          {/* Rewind button */}
          <button
            onClick={onRewind}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Rewind 10 seconds"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
            </svg>
          </button>

          {/* Main play/pause button */}
          <button
            onClick={onTogglePlayPause}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentScholar?.color.replace('bg-gradient-to-r', 'bg-gradient-to-br') || 'bg-blue-500'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white ml-0.5" />
            )}
          </button>

          {/* Forward button */}
          <button
            onClick={onForward}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Forward 10 seconds"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
            </svg>
          </button>

          {/* Episode info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Now Playing: {currentEpisode.title}</p>
            <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentScholar?.name}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className={`mt-2 w-full h-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
            style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
        
        {duration > 0 && (
          <div className="flex justify-between text-xs mt-1">
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              {formatTime(currentTime)}
            </span>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              {formatTime(duration)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

MiniPlayer.displayName = 'MiniPlayer';

export default MiniPlayer;
