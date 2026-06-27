import React from 'react';

interface ProgressBarProps {
  current: number; // 0-indexed
  total: number;
  answeredIds: Set<number>;
  onJump: (index: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, answeredIds, onJump }) => {
  const pct = ((current + 1) / total) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-white/50">
          Question {current + 1} of {total}
        </span>
        <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-white/50">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="hidden sm:flex items-center gap-1.5 mt-3">
        {Array.from({ length: total }, (_, i) => {
          const isAnswered = answeredIds.has(i + 1);
          const isCurrent = i === current;
          const canJump = isAnswered || i <= current;
          return (
            <button
              key={i}
              onClick={() => canJump && onJump(i)}
              disabled={!canJump}
              aria-label={`Go to question ${i + 1}`}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'bg-white scale-y-150'
                  : isAnswered
                  ? 'bg-white/60 hover:bg-white/80'
                  : 'bg-white/15'
              } ${canJump ? 'cursor-pointer' : 'cursor-default'}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
