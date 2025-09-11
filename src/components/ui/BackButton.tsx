// components/BackButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface BackButtonProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({
  className = '',
  iconClassName = '',
  textClassName = '',
  showText = false, // mặc định mobile ẩn text
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  return (
    <button
      onClick={handleGoBack}
      className={`
        flex items-center gap-1 px-2 py-1
        bg-white/60 dark:bg-slate-800/60
        hover:bg-white/80 dark:hover:bg-slate-700/80
        backdrop-blur-sm rounded-full
        shadow-sm border border-white/20 dark:border-slate-700/20
        transition-colors duration-200
        ${className}
      `}
      aria-label="Go back"
    >
      <ArrowLeftIcon className={`w-4 h-4 text-slate-700 dark:text-slate-200 ${iconClassName}`} />
      {showText && (
        <span className={`text-xs font-medium text-slate-700 dark:text-slate-200 ${textClassName}`}>
          Trở về
        </span>
      )}
    </button>
  );
};

export default BackButton;
