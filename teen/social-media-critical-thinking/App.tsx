'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { MECHANISMS } from './constants';
import MechanismCard from './components/MechanismCard';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, MECHANISMS.length - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNext();
      }

      if (event.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const currentMechanism = MECHANISMS[currentIndex];

  return (
    <div className="min-h-[100svh] bg-[#f4efe5] text-[#24211d]">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:py-10">
        <header className="mb-7 md:mb-9">
          <div className="mb-5 flex items-center justify-between border-b border-[#24211d]/15 pb-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#c93c32]">
              Attention Lab
            </p>
            <p className="text-xs font-semibold text-[#5d5750]">A critical-thinking field guide</p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <h1 className="max-w-3xl text-4xl font-black leading-[0.94] tracking-[-0.045em] text-[#1d1c1a] sm:text-5xl md:text-7xl">
              10 Social Media <span className="text-[#c93c32]">Antidotes</span>
            </h1>
            <p className="max-w-xs text-base font-medium leading-relaxed text-[#625c54] md:pb-1 md:text-right">
              Notice the hijack. Name the effect. Choose your response.
            </p>
          </div>
        </header>

        <main className="mb-6" aria-live="polite">
          <MechanismCard key={currentMechanism.id} mechanism={currentMechanism} />
        </main>

        <footer className="w-full pb-4">
          <Navigation
            currentIndex={currentIndex}
            total={MECHANISMS.length}
            onNext={handleNext}
            onPrev={handlePrev}
          />
          <p className="mt-4 hidden text-center text-xs font-semibold text-[#777067] sm:block">
            Tip: use the left and right arrow keys to move through the guide.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
