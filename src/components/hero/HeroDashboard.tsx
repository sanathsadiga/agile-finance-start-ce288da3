
import React, { useEffect, useRef } from 'react';
import { TrendingUp, ChartBar, ChartLine, ChartPie, Shield, Sparkles, Zap } from "lucide-react";

const HeroDashboard = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div ref={chartRef} className="lg:w-1/2 w-full max-w-2xl">
      <div className="relative group">
        {/* Enhanced glow effects */}
        <div className="absolute -inset-6 bg-gradient-to-r from-brand-purple/30 to-brand-tertiary-purple/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-70 animate-pulse"></div>
        <div className="absolute -inset-3 bg-gradient-to-r from-brand-purple/20 to-brand-tertiary-purple/20 rounded-2xl blur-xl opacity-50"></div>
        
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-3xl border border-white/30 transition-all duration-700 hover:scale-[1.02] hover:shadow-4xl group-hover:bg-white/95">
          {/* Ultra-modern browser header */}
          <div className="h-12 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-t-3xl flex items-center px-4 border-b border-gray-200/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-red-500 animate-pulse shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 animate-pulse shadow-lg" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500 animate-pulse shadow-lg" style={{animationDelay: '0.2s'}}></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full text-modern-xs text-gray-600 border border-gray-200/50 shadow-inner">
                <Shield className="inline h-3 w-3 mr-1 text-green-500" />
                financeflow.com/dashboard
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Modern header with enhanced user info */}
            <div className="flex items-center justify-between chart-element translate-y-8 opacity-0 transition-all duration-700">
              <div>
                <h3 className="text-modern-xl font-bold text-gray-800 mb-1">Welcome back, Sarah</h3>
                <p className="text-modern-sm text-gray-500 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Here's your financial overview
                </p>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple rounded-full blur opacity-40"></div>
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-brand-purple to-brand-tertiary-purple flex items-center justify-center text-white font-bold text-modern-base shadow-lg">
                  S
                </div>
              </div>
            </div>

            {/* Ultra-modern stats cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-green-50 via-green-100 to-green-50 p-4 rounded-2xl chart-element translate-y-8 opacity-0 transition-all duration-700 hover:scale-110 transform border border-green-200/50 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-6 h-3 bg-gradient-to-r from-green-300 to-green-400 rounded-full"></div>
                  <TrendingUp className="h-4 w-4 text-green-600 animate-bounce" />
                </div>
                <div className="h-6 w-16 bg-gradient-to-r from-green-400 to-green-500 rounded-lg font-bold mb-2 shadow-inner"></div>
                <div className="text-modern-xs text-green-700 font-bold bg-green-200/50 px-2 py-1 rounded-full">+12% this month</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-4 rounded-2xl chart-element translate-y-8 opacity-0 transition-all duration-700 hover:scale-110 transform border border-blue-200/50 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-6 h-3 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full"></div>
                  <ChartBar className="h-4 w-4 text-blue-600 animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg font-bold mb-2 shadow-inner"></div>
                <div className="text-modern-xs text-blue-700 font-bold bg-blue-200/50 px-2 py-1 rounded-full">5 pending</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 p-4 rounded-2xl chart-element translate-y-8 opacity-0 transition-all duration-700 hover:scale-110 transform border border-purple-200/50 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-6 h-3 bg-gradient-to-r from-purple-300 to-purple-400 rounded-full"></div>
                  <ChartPie className="h-4 w-4 text-purple-600 animate-spin" style={{animationDuration: '3s'}} />
                </div>
                <div className="h-6 w-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg font-bold mb-2 shadow-inner"></div>
                <div className="text-modern-xs text-purple-700 font-bold bg-purple-200/50 px-2 py-1 rounded-full">On track</div>
              </div>
            </div>
            
            {/* Revolutionary chart design */}
            <div className="bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 chart-element translate-y-8 opacity-0 transition-all duration-700 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                <ChartLine className="h-5 w-5 text-brand-purple animate-pulse" />
              </div>
              <div className="relative">
                {/* Enhanced grid */}
                <div className="absolute inset-0 grid grid-cols-9 grid-rows-4 gap-1 opacity-30">
                  {Array.from({length: 36}).map((_, i) => (
                    <div key={i} className="border border-gray-300/50 rounded-sm"></div>
                  ))}
                </div>
                
                {/* Revolutionary animated bars */}
                <div className="relative flex items-end h-24 gap-2 pt-3">
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
          <div className="px-6 pb-6">
            <div className="text-center bg-gradient-to-r from-brand-purple/10 via-white/50 to-brand-tertiary-purple/10 rounded-2xl p-3 border border-brand-purple/20 backdrop-blur-sm shadow-inner">
              <p className="text-modern-base font-bold text-brand-purple flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin" style={{animationDuration: '3s'}} />
                Real-time financial insights at your fingertips
                <Zap className="h-4 w-4 animate-pulse" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDashboard;
