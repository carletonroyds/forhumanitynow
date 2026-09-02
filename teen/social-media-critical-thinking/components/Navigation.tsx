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

  const buttonClasses = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1d1c1a] px-3 py-3 text-sm font-extrabold text-white shadow-[0_5px_0_#a9a197] transition hover:-translate-y-0.5 hover:bg-[#c93c32] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#c93c32] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-35 min-[360px]:px-4 sm:px-6 sm:text-base";

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <button
        onClick={onPrev}
        disabled={isFirst}
        className={buttonClasses}
        aria-label="Previous mechanism"
      >
        <ChevronLeftIcon className="h-5 w-5" />
        <span className="hidden min-[360px]:inline">Previous</span>
      </button>

      <div className="flex flex-col items-center gap-1.5" aria-label={`Card ${currentIndex + 1} of ${total}`}>
        <span className="text-sm font-black tabular-nums text-[#35312d]">
          {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#d4cdc2] sm:w-24">
          <div
            className="h-full rounded-full bg-[#c93c32] transition-[width] duration-300"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={isLast}
        className={buttonClasses}
        aria-label="Next mechanism"
      >
        <span className="hidden min-[360px]:inline">Next</span>
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Navigation;
