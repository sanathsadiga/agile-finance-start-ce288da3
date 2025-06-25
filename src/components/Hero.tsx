
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { TrendingUp, Award, HeartHandshake, ChartBar, ChartLine, ChartPie, ArrowRight, Play } from "lucide-react";

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
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating absolute top-1/4 left-1/4 w-20 h-20 bg-brand-purple/5 rounded-full blur-xl animate-bounce" style={{animationDuration: '6s'}}></div>
        <div className="floating absolute top-1/3 right-1/4 w-32 h-32 bg-brand-tertiary-purple/10 rounded-full blur-2xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="floating absolute bottom-1/4 left-1/3 w-16 h-16 bg-brand-purple/8 rounded-full blur-lg animate-bounce" style={{animationDuration: '5s'}}></div>
        
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-brand-purple/10 to-brand-tertiary-purple/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-brand-purple/5 to-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div ref={heroRef} className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <div className="flex flex-col space-y-8 lg:w-1/2 max-w-2xl">
            {/* Trust badge */}
            <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700 flex items-center gap-3 text-brand-purple bg-gradient-to-r from-brand-purple/10 to-brand-tertiary-purple/10 w-fit px-6 py-3 rounded-full border border-brand-purple/20 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <Award className="h-5 w-5 animate-pulse" />
              <span className="text-sm font-semibold">Trusted by 10,000+ businesses worldwide</span>
            </div>
            
            {/* Main headline with gradient text */}
            <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                Simplify your{' '}
                <span className="bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple bg-clip-text text-transparent animate-gradient bg-300% relative">
                  financial
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple rounded-full transform scale-x-0 animate-scale-x"></div>
                </span>
                <br />
                management
              </h1>
            </div>

            {/* Subtitle with modern typography */}
            <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700">
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
                Take control of your business finances with our 
                <span className="font-semibold text-brand-purple"> all-in-one platform</span> for 
                invoicing, expense tracking, and financial insights.
              </p>
            </div>
            
            {/* CTA buttons with modern design */}
            <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700 flex flex-col sm:flex-row gap-4 pt-6">
              <Link to="/signup" className="group">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-gradient-to-r from-brand-purple to-brand-tertiary-purple hover:from-brand-tertiary-purple hover:to-brand-purple transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform">
                  Start your free trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/features" className="group">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold border-2 border-brand-purple/20 hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-all duration-300 hover:scale-105 transform">
                  <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Watch demo
                </Button>
              </Link>
            </div>
            
            {/* Trust indicators with icons */}
            <div className="hero-animate opacity-0 translate-y-8 transition-all duration-700 flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
              <div className="flex items-center gap-3">
                <HeartHandshake className="h-6 w-6 text-brand-purple" />
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-700">14-day free trial</p>
                  <p className="text-xs text-gray-500">No credit card required</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-brand-purple/20 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-brand-tertiary-purple/20 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-200 border-2 border-white"></div>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-700">Join thousands</p>
                  <p className="text-xs text-gray-500">of happy customers</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced dashboard mockup */}
          <div ref={chartRef} className="lg:w-1/2 w-full max-w-2xl">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-brand-purple/20 to-brand-tertiary-purple/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-60"></div>
              
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                {/* Browser header with enhanced design */}
                <div className="h-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-2xl flex items-center px-4 border-b border-gray-200/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-white/60 backdrop-blur-sm px-4 py-1 rounded-full text-xs text-gray-500 border border-gray-200/50">
                      financeflow.com/dashboard
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Header with user info */}
                  <div className="flex items-center justify-between chart-element translate-y-8 opacity-0 transition-all duration-700">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Welcome back, Sarah</h3>
                      <p className="text-sm text-gray-500">Here's your financial overview</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-purple to-brand-tertiary-purple flex items-center justify-center text-white font-semibold">
                      S
                    </div>
                  </div>

                  {/* Enhanced stats cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl chart-element translate-y-8 opacity-0 transition-all duration-700 hover:scale-105 transform">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-6 h-3 bg-green-200 rounded"></div>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="h-6 w-16 bg-green-300 rounded font-bold mb-1"></div>
                      <div className="text-xs text-green-600 font-medium">+12% this month</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl chart-element translate-y-8 opacity-0 transition-all duration-700 hover:scale-105 transform">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-6 h-3 bg-blue-200 rounded"></div>
                        <ChartBar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="h-6 w-16 bg-blue-300 rounded font-bold mb-1"></div>
                      <div className="text-xs text-blue-600 font-medium">5 pending</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl chart-element translate-y-8 opacity-0 transition-all duration-700 hover:scale-105 transform">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-6 h-3 bg-purple-200 rounded"></div>
                        <ChartPie className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="h-6 w-16 bg-purple-300 rounded font-bold mb-1"></div>
                      <div className="text-xs text-purple-600 font-medium">On track</div>
                    </div>
                  </div>
                  
                  {/* Enhanced chart with grid */}
                  <div className="bg-white/70 backdrop-blur-sm border border-gray-100/50 rounded-xl p-4 chart-element translate-y-8 opacity-0 transition-all duration-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <ChartLine className="h-5 w-5 text-brand-purple animate-pulse" />
                    </div>
                    <div className="relative">
                      {/* Grid lines */}
                      <div className="absolute inset-0 grid grid-cols-9 gap-1 opacity-20">
                        {Array.from({length: 36}).map((_, i) => (
                          <div key={i} className="border-r border-b border-gray-200"></div>
                        ))}
                      </div>
                      
                      {/* Chart bars */}
                      <div className="relative flex items-end h-24 gap-2 pt-2">
                        <div className="bar bg-gradient-to-t from-brand-purple to-brand-purple/60 w-6 rounded-t-md transition-all duration-1000 ease-in-out shadow-sm" style={{height: '40%'}}></div>
                        <div className="bar bg-gradient-to-t from-brand-purple to-brand-purple/60 w-6 rounded-t-md transition-all duration-1000 ease-in-out shadow-sm" style={{height: '60%'}}></div>
                        <div className="bar bg-gradient-to-t from-brand-purple to-brand-purple/60 w-6 rounded-t-md transition-all duration-1000 ease-in-out shadow-sm" style={{height: '30%'}}></div>
                        <div className="bar bg-gradient-to-t from-brand-purple to-brand-purple/60 w-6 rounded-t-md transition-all duration-1000 ease-in-out shadow-sm" style={{height: '50%'}}></div>
                        <div className="bar bg-gradient-to-t from-brand-purple to-brand-purple/60 w-6 rounded-t-md transition-all duration-1000 ease-in-out shadow-sm" style={{height: '70%'}}></div>
                        <div className="bar bg-gradient-to-t from-brand-purple to-brand-purple/60 w-6 rounded-t-md transition-all duration-1000 ease-in-out shadow-sm" style={{height: '40%'}}></div>
                        <div className="bar bg-gradient-to-t from-brand-purple to-brand-purple/60 w-6 rounded-t-md transition-all duration-1000 ease-in-out shadow-sm" style={{height: '55%'}}></div>
                        <div className="bar bg-gradient-to-t from-brand-purple to-brand-purple/60 w-6 rounded-t-md transition-all duration-1000 ease-in-out shadow-sm" style={{height: '65%'}}></div>
                        <div className="bar bg-gradient-to-t from-brand-purple to-brand-purple/60 w-6 rounded-t-md transition-all duration-1000 ease-in-out shadow-sm" style={{height: '45%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced caption */}
                <div className="px-6 pb-6">
                  <div className="text-center bg-gradient-to-r from-brand-purple/5 to-brand-tertiary-purple/5 rounded-lg p-3 border border-brand-purple/10">
                    <p className="text-sm font-medium text-brand-purple">Real-time financial insights at your fingertips</p>
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
