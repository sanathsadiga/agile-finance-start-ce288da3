
import React, { useEffect, useRef } from 'react';
import HeroTrustBadge from './hero/HeroTrustBadge';
import HeroTitle from './hero/HeroTitle';
import HeroSubtitle from './hero/HeroSubtitle';
import HeroCTA from './hero/HeroCTA';
import HeroTrustIndicators from './hero/HeroTrustIndicators';
import HeroDashboard from './hero/HeroDashboard';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Staggered animation for hero elements
    const elements = heroRef.current?.querySelectorAll('.hero-animate');
    if (elements) {
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('opacity-100', 'translate-y-0');
          element.classList.remove('opacity-0', 'translate-y-8');
        }, 150 * index);
      });
    }

    // Floating animation for background elements
    const floatingElements = heroRef.current?.querySelectorAll('.floating');
    if (floatingElements) {
      floatingElements.forEach((element, index) => {
        (element as HTMLElement).style.animationDelay = `${index * 0.5}s`;
      });
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-purple-50/20 to-white">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {Array.from({length: 20}).map((_, i) => (
          <div
            key={i}
            className="floating absolute w-2 h-2 bg-brand-purple/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${4 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Enhanced gradient orbs */}
        <div className="absolute -top-64 -right-64 w-96 h-96 bg-gradient-to-r from-brand-purple/15 to-brand-tertiary-purple/15 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute -bottom-64 -left-64 w-96 h-96 bg-gradient-to-r from-brand-purple/10 to-purple-200/20 rounded-full blur-3xl animate-pulse opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-tertiary-purple/10 rounded-full blur-2xl animate-bounce opacity-40" style={{animationDuration: '6s'}}></div>
      </div>

      <div ref={heroRef} className="container mx-auto px-4 md:px-6 relative z-10 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <div className="flex flex-col space-y-8 lg:w-1/2 max-w-2xl">
            <HeroTrustBadge />
            <HeroTitle />
            <HeroSubtitle />
            <HeroCTA />
            <HeroTrustIndicators />
          </div>
          
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
};

export default Hero;
