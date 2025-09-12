import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface LoadingStateProps {
  isDarkMode: boolean;
}

interface ErrorStateProps {
  isDarkMode: boolean;
  error: string;
  onRetry: () => void;
}

interface EmptyStateProps {
  isDarkMode: boolean;
  message: string;
}

export const LoadingState: React.FC<LoadingStateProps> = React.memo(({ isDarkMode }) => (
  <div className={`rounded-xl p-8 text-center ${
    isDarkMode ? 'bg-gray-800' : 'bg-white'
  } shadow-lg`}>
    <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      Loading lecture list...
    </p>
  </div>
));

export const ErrorState: React.FC<ErrorStateProps> = React.memo(({ isDarkMode, error, onRetry }) => (
  <div className={`rounded-xl p-6 text-center ${
    isDarkMode ? 'bg-gray-800' : 'bg-white'
  } shadow-lg`}>
    <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
    <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      {error}
    </p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
    >
      Try Again
    </button>
  </div>
));

export const EmptyState: React.FC<EmptyStateProps> = React.memo(({ isDarkMode, message }) => (
  <div className={`rounded-xl p-8 text-center ${
    isDarkMode ? 'bg-gray-800' : 'bg-white'
  } shadow-lg`}>
    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      {message}
    </p>
  </div>
));

LoadingState.displayName = 'LoadingState';
ErrorState.displayName = 'ErrorState';
EmptyState.displayName = 'EmptyState';
