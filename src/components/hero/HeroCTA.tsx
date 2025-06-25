
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Zap } from "lucide-react";

const HeroCTA = () => {
  return (
    <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700 flex flex-col sm:flex-row gap-4 pt-6">
      <Link to="/signup" className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
        <Button size="lg" className="relative w-full sm:w-auto h-14 px-8 text-modern-lg font-bold bg-gradient-to-r from-brand-purple to-brand-tertiary-purple hover:from-brand-tertiary-purple hover:to-brand-purple transition-all duration-300 shadow-2xl hover:shadow-brand-purple/40 hover:scale-105 transform rounded-2xl">
          <Zap className="mr-2 h-5 w-5 animate-pulse" />
          Start your free trial
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
        </Button>
      </Link>
      <Link to="/features" className="group relative">
        <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-modern-lg font-bold border-2 border-brand-purple/30 hover:border-brand-purple/60 hover:bg-brand-purple/10 transition-all duration-300 hover:scale-105 transform rounded-2xl backdrop-blur-sm bg-white/70">
          <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-125" />
          Watch demo
        </Button>
      </Link>
    </div>
  );
};

export default HeroCTA;
