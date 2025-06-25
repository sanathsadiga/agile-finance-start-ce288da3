
import React from 'react';

const HeroSubtitle = () => {
  return (
    <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700">
      <p className="text-responsive-xl md:text-responsive-2xl text-gray-600 leading-relaxed font-light max-w-xl">
        Take control of your business finances with our 
        <span className="font-bold text-brand-purple bg-gradient-to-r from-brand-purple to-brand-tertiary-purple bg-clip-text text-transparent"> revolutionary platform</span> for 
        invoicing, expense tracking, and financial insights.
      </p>
    </div>
  );
};

export default HeroSubtitle;
