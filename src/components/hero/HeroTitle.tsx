
import React from 'react';

const HeroTitle = () => {
  return (
    <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700">
      <h1 className="text-responsive-5xl md:text-responsive-6xl lg:text-6xl font-black leading-[0.9] tracking-tight">
        <span className="block">Simplify your</span>
        <span className="bg-gradient-to-r from-brand-purple via-brand-tertiary-purple via-purple-600 to-brand-purple bg-clip-text text-transparent animate-gradient bg-300% relative inline-block">
          financial
          <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple rounded-full transform scale-x-0 animate-scale-x opacity-80"></div>
          <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-purple to-transparent opacity-60"></div>
        </span>
        <span className="block mt-2">management</span>
      </h1>
    </div>
  );
};

export default HeroTitle;
