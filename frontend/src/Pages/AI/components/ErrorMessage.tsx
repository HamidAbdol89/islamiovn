import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
        Đã xảy ra lỗi
      </h3>
      
      <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4 max-w-md">
        {error}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Thử lại</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
