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
  showText = true,
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  return (
    <button
      onClick={handleGoBack}
      className={`flex items-center gap-1.5 px-3 py-2 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700/70 backdrop-blur-sm rounded-full shadow-sm border border-white/30 dark:border-slate-700/30 transition-colors duration-200 ${className}`}
      aria-label="Go back"
    >
      <ArrowLeftIcon className={`w-5 h-5 text-slate-600 dark:text-slate-300 ${iconClassName}`} />
      {showText && (
        <span className={`text-sm font-medium text-slate-600 dark:text-slate-300 ${textClassName}`}>
          Back
        </span>
      )}
    </button>
  );
};

export default BackButton;
// cách sử dụng <BackButton />
// import BackButton from "@/components/ui/BackButton"; 

