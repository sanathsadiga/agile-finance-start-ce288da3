
import React from 'react';
import { HeartHandshake, Clock } from "lucide-react";

const HeroTrustIndicators = () => {
  return (
    <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700 flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-2xl border border-gray-200/50 hover:scale-105 transition-transform duration-300 shadow-lg">
        <div className="relative">
          <HeartHandshake className="h-6 w-6 text-brand-purple" />
          <div className="absolute -inset-1 bg-brand-purple/20 rounded-full blur animate-pulse"></div>
        </div>
        <div className="flex flex-col">
          <p className="text-modern-base font-bold text-gray-700">14-day free trial</p>
          <p className="text-modern-xs text-gray-500">No credit card required</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-2xl border border-gray-200/50 hover:scale-105 transition-transform duration-300 shadow-lg">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-tertiary-purple border-2 border-white shadow-lg"></div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-tertiary-purple to-purple-400 border-2 border-white shadow-lg"></div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-300 border-2 border-white shadow-lg"></div>
        </div>
        <div className="flex flex-col">
          <p className="text-modern-base font-bold text-gray-700">Join thousands</p>
          <p className="text-modern-xs text-gray-500">of happy customers</p>
        </div>
      </div>
    </div>
  );
};

export default HeroTrustIndicators;
