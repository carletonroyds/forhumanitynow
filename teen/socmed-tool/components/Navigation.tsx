import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface NavigationProps {
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentIndex, total, onNext, onPrev }) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  const buttonClasses = "flex items-center gap-2 px-8 py-4 bg-gray-800 text-white text-xl font-bold rounded-xl hover:bg-gray-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex justify-between items-center mt-8 px-2 md:px-0">
      <button
        onClick={onPrev}
        disabled={isFirst}
        className={buttonClasses}
        aria-label="Previous mechanism"
      >
        <ChevronLeftIcon className="w-8 h-8" />
        <span>Previous</span>
      </button>

      <span className="text-gray-500 font-medium text-lg hidden md:block">
        {currentIndex + 1} of {total}
      </span>

      <button
        onClick={onNext}
        disabled={isLast}
        className={buttonClasses}
        aria-label="Next mechanism"
      >
        <span>Next</span>
        <ChevronRightIcon className="w-8 h-8" />
      </button>
    </div>
  );
};

export default Navigation;