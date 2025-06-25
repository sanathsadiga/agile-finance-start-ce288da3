
import React from 'react';
import { Award, Sparkles, Zap } from "lucide-react";

const HeroTrustBadge = () => {
  return (
    <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700 flex items-center gap-3 text-brand-purple bg-gradient-to-r from-brand-purple/10 via-white/50 to-brand-tertiary-purple/10 w-fit px-6 py-3 rounded-full border border-brand-purple/30 backdrop-blur-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-brand-purple/20">
      <div className="relative">
        <Award className="h-5 w-5 animate-pulse" />
        <div className="absolute inset-0 bg-brand-purple/20 rounded-full blur-sm animate-ping"></div>
      </div>
      <span className="text-modern-sm font-bold tracking-wide">Trusted by 10,000+ businesses worldwide</span>
      <Sparkles className="h-4 w-4 animate-spin" style={{animationDuration: '3s'}} />
    </div>
  );
};

export default HeroTrustBadge;
