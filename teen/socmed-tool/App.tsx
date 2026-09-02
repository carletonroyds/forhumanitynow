import React, { useState, useCallback } from 'react';
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

  const currentMechanism = MECHANISMS[currentIndex];

  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-gray-900 p-4 font-sans pt-12 md:pt-20">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            10 Social Media <span className="text-red-600">Antidotes</span><br />
            <span className="font-normal">The Unconscious Highjacks</span>
          </h1>
          <p className="text-gray-600 mt-4 text-xl">
            An interactive tool for Critical Thinking.
          </p>
        </header>

        <main className="mb-8">
          <MechanismCard key={currentMechanism.id} mechanism={currentMechanism} />
        </main>

        <footer className="w-full">
          <Navigation
            currentIndex={currentIndex}
            total={MECHANISMS.length}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </footer>
      </div>
    </div>
  );
};

export default App;