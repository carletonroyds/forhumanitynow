import React from 'react';
import type { Question } from '../types';

interface QuestionSlideProps {
  question: Question;
  index: number;
  total: number;
  score: number | undefined;
  onScoreChange: (id: number, score: number) => void;
}

const ratingOptions = Array.from({ length: 10 }, (_, i) => i + 1);

const QuestionSlide: React.FC<QuestionSlideProps> = ({ question, index, total, score, onScoreChange }) => {
  return (
    <div className="flex flex-col h-full">
      <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-fuchsia-300/80 mb-3">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {question.title}
      </span>

      <h2 className="text-2xl sm:text-3xl md:text-[2.15rem] font-semibold text-white leading-snug tracking-tight mb-6 sm:mb-10 landscape:mb-4">
        “{question.statement}”
      </h2>

      <div className="mt-auto">
        <div className="flex items-center justify-between text-[11px] sm:text-xs font-medium text-white/40 mb-2.5 sm:mb-3 px-0.5 tracking-wide uppercase">
          <span>Not at all true</span>
          <span>Completely true</span>
        </div>

        <div className="grid grid-cols-5 sm:flex sm:flex-row gap-1.5 sm:gap-2.5">
          {ratingOptions.map((value) => {
            const isSelected = score === value;
            return (
              <button
                key={value}
                onClick={() => onScoreChange(question.id, value)}
                aria-pressed={isSelected}
                className={`aspect-square sm:flex-1 sm:h-14 rounded-xl text-base sm:text-lg font-bold flex items-center justify-center
                  border transition-all duration-200 ease-out
                  ${
                    isSelected
                      ? 'bg-gradient-to-br from-fuchsia-400 to-violet-500 text-white border-transparent scale-105 shadow-lg shadow-fuchsia-500/30'
                      : 'bg-white/[0.04] hover:bg-white/[0.09] text-white/70 border-white/10 hover:border-white/20 hover:scale-[1.03]'
                  }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionSlide;
