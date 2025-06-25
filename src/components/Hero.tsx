
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { TrendingUp, Award, HeartHandshake, ChartBar, ChartLine, ChartPie, ArrowRight, Play, Sparkles, Zap, Shield } from "lucide-react";

const Hero = () => {
  const chartRef = useRef<HTMLDivElement>(null);
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

    // Animation for the chart elements
    const charts = chartRef.current?.querySelectorAll('.chart-element');
    if (charts) {
      charts.forEach((chart, index) => {
        setTimeout(() => {
          chart.classList.remove('translate-y-8', 'opacity-0');
          chart.classList.add('translate-y-0', 'opacity-100');
        }, 300 + (200 * index));
      });
    }
    
    // Animation for the dancing bars
    const bars = chartRef.current?.querySelectorAll('.bar');
    if (bars) {
      setInterval(() => {
        bars.forEach(bar => {
          const height = Math.floor(Math.random() * 60) + 20;
          (bar as HTMLElement).style.height = `${height}%`;
        });
      }, 1000);
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
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-brand-tertiary-purple/10 rounded-full blur-2xl animate-bounce opacity-40" style={{animationDuration: '6s'}}></div>
      </div>

      <div ref={heroRef} className="container mx-auto px-4 md:px-6 relative z-10 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="flex flex-col space-y-10 lg:w-1/2 max-w-2xl">
            {/* Enhanced trust badge with glow effect */}
            <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700 flex items-center gap-3 text-brand-purple bg-gradient-to-r from-brand-purple/10 via-white/50 to-brand-tertiary-purple/10 w-fit px-8 py-4 rounded-full border border-brand-purple/30 backdrop-blur-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-brand-purple/20">
              <div className="relative">
                <Award className="h-6 w-6 animate-pulse" />
                <div className="absolute inset-0 bg-brand-purple/20 rounded-full blur-sm animate-ping"></div>
              </div>
              <span className="text-sm font-bold tracking-wide">Trusted by 10,000+ businesses worldwide</span>
              <Sparkles className="h-4 w-4 animate-spin" style={{animationDuration: '3s'}} />
            </div>
            
            {/* Ultra-modern headline with enhanced gradient */}
            <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                <span className="block">Simplify your</span>
                <span className="bg-gradient-to-r from-brand-purple via-brand-tertiary-purple via-purple-600 to-brand-purple bg-clip-text text-transparent animate-gradient bg-300% relative inline-block">
                  financial
                  <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple rounded-full transform scale-x-0 animate-scale-x opacity-80"></div>
                  <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-purple to-transparent opacity-60"></div>
                </span>
                <span className="block mt-2">management</span>
              </h1>
            </div>

            {/* Enhanced subtitle with better typography */}
            <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700">
              <p className="text-2xl md:text-3xl text-gray-600 leading-relaxed font-light max-w-xl">
                Take control of your business finances with our 
                <span className="font-bold text-brand-purple bg-gradient-to-r from-brand-purple to-brand-tertiary-purple bg-clip-text text-transparent"> revolutionary platform</span> for 
                invoicing, expense tracking, and financial insights.
              </p>
            </div>
            
            {/* Enhanced CTA buttons with modern styling */}
            <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700 flex flex-col sm:flex-row gap-6 pt-8">
              <Link to="/signup" className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <Button size="lg" className="relative w-full sm:w-auto h-16 px-10 text-xl font-bold bg-gradient-to-r from-brand-purple to-brand-tertiary-purple hover:from-brand-tertiary-purple hover:to-brand-purple transition-all duration-300 shadow-2xl hover:shadow-brand-purple/40 hover:scale-105 transform rounded-2xl">
                  <Zap className="mr-3 h-6 w-6 animate-pulse" />
                  Start your free trial
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Button>
              </Link>
              <Link to="/features" className="group relative">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 text-xl font-bold border-3 border-brand-purple/30 hover:border-brand-purple/60 hover:bg-brand-purple/10 transition-all duration-300 hover:scale-105 transform rounded-2xl backdrop-blur-sm bg-white/70">
                  <Play className="mr-3 h-6 w-6 transition-transform group-hover:scale-125" />
                  Watch demo
                </Button>
              </Link>
            </div>
            
            {/* Enhanced trust indicators with modern cards */}
            <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700 flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-6">
              <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm px-6 py-4 rounded-2xl border border-gray-200/50 hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="relative">
                  <HeartHandshake className="h-8 w-8 text-brand-purple" />
                  <div className="absolute -inset-1 bg-brand-purple/20 rounded-full blur animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <p className="text-lg font-bold text-gray-700">14-day free trial</p>
                  <p className="text-sm text-gray-500">No credit card required</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm px-6 py-4 rounded-2xl border border-gray-200/50 hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-purple to-brand-tertiary-purple border-3 border-white shadow-lg"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-tertiary-purple to-purple-400 border-3 border-white shadow-lg"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-300 border-3 border-white shadow-lg"></div>
                </div>
                <div className="flex flex-col">
                  <p className="text-lg font-bold text-gray-700">Join thousands</p>
                  <p className="text-sm text-gray-500">of happy customers</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Revolutionary dashboard mockup */}
          <div ref={chartRef} className="lg:w-1/2 w-full max-w-2xl">
            <div className="relative group">
              {/* Enhanced glow effects */}
              <div className="absolute -inset-6 bg-gradient-to-r from-brand-purple/30 to-brand-tertiary-purple/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-70 animate-pulse"></div>
              <div className="absolute -inset-3 bg-gradient-to-r from-brand-purple/20 to-brand-tertiary-purple/20 rounded-2xl blur-xl opacity-50"></div>
              
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-3xl border border-white/30 transition-all duration-700 hover:scale-[1.02] hover:shadow-4xl group-hover:bg-white/95">
                {/* Ultra-modern browser header */}
                <div className="h-16 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-t-3xl flex items-center px-6 border-b border-gray-200/50">
                  <div className="flex gap-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-400 to-red-500 animate-pulse shadow-lg"></div>
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 animate-pulse shadow-lg" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-green-500 animate-pulse shadow-lg" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full text-sm text-gray-600 border border-gray-200/50 shadow-inner">
                      <Shield className="inline h-4 w-4 mr-2 text-green-500" />
                      financeflow.com/dashboard
                    </div>
                  </div>
                </div>
                
                <div className="p-8 space-y-8">
                  {/* Modern header with enhanced user info */}
                  <div className="flex items-center justify-between chart-element translate-y-8 opacity-0 transition-all duration-700">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">Welcome back, Sarah</h3>
                      <p className="text-gray-500 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        Here's your financial overview
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple rounded-full blur opacity-40"></div>
                      <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-brand-purple to-brand-tertiary-purple flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        S
                      </div>
                    </div>
                  </div>

                  {/* Ultra-modern stats cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-green-50 via-green-100 to-green-50 p-6 rounded-2xl chart-element translate-y-8 opacity-0 transition-all duration-700 hover:scale-110 transform border border-green-200/50 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-4 bg-gradient-to-r from-green-300 to-green-400 rounded-full"></div>
                        <TrendingUp className="h-5 w-5 text-green-600 animate-bounce" />
                      </div>
                      <div className="h-8 w-20 bg-gradient-to-r from-green-400 to-green-500 rounded-lg font-bold mb-2 shadow-inner"></div>
                      <div className="text-xs text-green-700 font-bold bg-green-200/50 px-2 py-1 rounded-full">+12% this month</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-6 rounded-2xl chart-element translate-y-8 opacity-0 transition-all duration-700 hover:scale-110 transform border border-blue-200/50 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-4 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full"></div>
                        <ChartBar className="h-5 w-5 text-blue-600 animate-pulse" />
                      </div>
                      <div className="h-8 w-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg font-bold mb-2 shadow-inner"></div>
                      <div className="text-xs text-blue-700 font-bold bg-blue-200/50 px-2 py-1 rounded-full">5 pending</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 p-6 rounded-2xl chart-element translate-y-8 opacity-0 transition-all duration-700 hover:scale-110 transform border border-purple-200/50 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-4 bg-gradient-to-r from-purple-300 to-purple-400 rounded-full"></div>
                        <ChartPie className="h-5 w-5 text-purple-600 animate-spin" style={{animationDuration: '3s'}} />
                      </div>
                      <div className="h-8 w-20 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg font-bold mb-2 shadow-inner"></div>
                      <div className="text-xs text-purple-700 font-bold bg-purple-200/50 px-2 py-1 rounded-full">On track</div>
                    </div>
                  </div>
                  
                  {/* Revolutionary chart design */}
                  <div className="bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 chart-element translate-y-8 opacity-0 transition-all duration-700 shadow-inner">
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-6 w-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                      <ChartLine className="h-6 w-6 text-brand-purple animate-pulse" />
                    </div>
                    <div className="relative">
                      {/* Enhanced grid */}
                      <div className="absolute inset-0 grid grid-cols-9 grid-rows-4 gap-1 opacity-30">
                        {Array.from({length: 36}).map((_, i) => (
                          <div key={i} className="border border-gray-300/50 rounded-sm"></div>
                        ))}
                      </div>
                      
                      {/* Revolutionary animated bars */}
                      <div className="relative flex items-end h-32 gap-3 pt-4">
                        {Array.from({length: 9}).map((_, i) => (
                          <div key={i} className="relative flex-1 flex flex-col items-center">
                            <div 
                              className="bar w-full bg-gradient-to-t from-brand-purple via-brand-tertiary-purple to-purple-400 rounded-t-xl transition-all duration-1000 ease-in-out shadow-lg hover:shadow-xl relative overflow-hidden" 
                              style={{height: `${40 + Math.random() * 40}%`}}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-t-xl"></div>
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/50 rounded-full"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced modern caption */}
                <div className="px-8 pb-8">
                  <div className="text-center bg-gradient-to-r from-brand-purple/10 via-white/50 to-brand-tertiary-purple/10 rounded-2xl p-4 border border-brand-purple/20 backdrop-blur-sm shadow-inner">
                    <p className="text-lg font-bold text-brand-purple flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5 animate-spin" style={{animationDuration: '3s'}} />
                      Real-time financial insights at your fingertips
                      <Zap className="h-5 w-5 animate-pulse" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
