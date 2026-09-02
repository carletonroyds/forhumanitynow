import React, { useState, useEffect } from 'react';
import { Mechanism } from '../types';

interface MechanismCardProps {
  mechanism: Mechanism;
}

const MechanismCard: React.FC<MechanismCardProps> = ({ mechanism }) => {
  const [visibleSections, setVisibleSections] = useState(1);

  useEffect(() => {
    setVisibleSections(1);

    const timer2 = setTimeout(() => {
      setVisibleSections(2);
    }, 3000);

    const timer3 = setTimeout(() => {
      setVisibleSections(3);
    }, 6000);

    return () => {
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [mechanism.id]);

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300">
      <header className="px-6 md:px-8 py-8 bg-gray-700 text-white flex items-center justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-gray-400 mr-3">{mechanism.id}.</span>{mechanism.name}
          </h2>
        </div>
        <img 
          src={mechanism.image} 
          alt={`${mechanism.name} icon`}
          className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover bg-gray-500 flex-shrink-0"
          aria-hidden="true"
        />
      </header>
      
      <div className="divide-y divide-gray-300">
        <section className="p-6 md:p-8 bg-gray-200">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-wider text-gray-600 text-center">
            How It's Triggered
          </h3>
          <p className="text-gray-800 text-xl md:text-2xl leading-relaxed text-center">
            {mechanism.trigger}
          </p>
        </section>

        <div 
          className="grid transition-[grid-template-rows] duration-700 ease-in-out"
          style={{ gridTemplateRows: visibleSections >= 2 ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <section className="p-6 md:p-8 bg-gray-100">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-wider text-gray-600 text-center">
                Effect on Brain & Behavior
              </h3>
              <p className="text-gray-800 text-xl md:text-2xl leading-relaxed text-center">
                {mechanism.effect}
              </p>
            </section>
          </div>
        </div>

        <div 
          className="grid transition-[grid-template-rows] duration-700 ease-in-out"
          style={{ gridTemplateRows: visibleSections >= 3 ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <section className="p-6 md:p-8 bg-gray-50">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-wider text-gray-600 text-center">
                Self-Empowering Antidote
              </h3>
              <p className="text-gray-800 text-xl md:text-2xl leading-relaxed text-center">
                {mechanism.antidote}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanismCard;