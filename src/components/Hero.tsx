
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { TrendingUp, Award, HeartHandshake, ChartBar, ChartLine, ChartPie } from "lucide-react";

const Hero = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animation for the chart elements
    const charts = chartRef.current?.querySelectorAll('.chart-element');
    if (charts) {
      charts.forEach((chart, index) => {
        setTimeout(() => {
          chart.classList.remove('translate-y-8', 'opacity-0');
          chart.classList.add('translate-y-0', 'opacity-100');
        }, 200 * index);
      });
    }
    
    // Animation for the dancing bars
    const bars = chartRef.current?.querySelectorAll('.bar');
    if (bars) {
      setInterval(() => {
        bars.forEach(bar => {
          const height = Math.floor(Math.random() * 60) + 20; // Random height between 20% and 80%
          (bar as HTMLElement).style.height = `${height}%`;
        });
      }, 1000);
    }
  }, []);

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          <div className="flex flex-col space-y-6 md:w-1/2 animate-fade-in">
            <div className="flex items-center gap-2 text-brand-purple bg-brand-purple/10 w-fit px-4 py-2 rounded-full animate-fade-in">
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">Trusted by 10,000+ businesses</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Simplify your <span className="text-brand-purple animate-pulse">financial management</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              Take control of your business finances with our all-in-one platform for invoicing, expense tracking, and financial insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto group bg-gradient-to-r from-brand-purple to-brand-tertiary-purple hover:opacity-90 transition-all duration-300">
                  Start your free trial
                  <TrendingUp className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto hover:bg-brand-purple/10 transition-all duration-300">
                  Explore features
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <HeartHandshake className="h-5 w-5 text-brand-purple" />
              <p className="text-sm text-gray-500">
                14-day free trial • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
          
          <div ref={chartRef} className="md:w-1/2 rounded-lg overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 bg-white p-6 border border-gray-100">
            <div className="relative bg-white rounded-lg overflow-hidden">
              {/* Animated dashboard elements */}
              <div className="aspect-video bg-white relative">
                <div className="absolute top-0 left-0 w-full h-8 bg-brand-purple/10 rounded-t-lg flex items-center px-3">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                
                <div className="pt-12 px-4 grid grid-cols-12 gap-4 h-full">
                  {/* Sidebar */}
                  <div className="col-span-3 bg-gray-50 h-full rounded-lg p-3">
                    <div className="h-10 w-full bg-brand-purple/20 mb-3 rounded-md chart-element translate-y-8 opacity-0 transition-all duration-500"></div>
                    <div className="h-5 w-2/3 bg-gray-200 mb-2 rounded-md chart-element translate-y-8 opacity-0 transition-all duration-500"></div>
                    <div className="h-5 w-2/3 bg-gray-200 mb-2 rounded-md chart-element translate-y-8 opacity-0 transition-all duration-500"></div>
                    <div className="h-5 w-2/3 bg-gray-200 mb-2 rounded-md chart-element translate-y-8 opacity-0 transition-all duration-500"></div>
                  </div>
                  
                  {/* Main content */}
                  <div className="col-span-9 h-full flex flex-col gap-4">
                    {/* Stats cards */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-50 p-3 rounded-lg chart-element translate-y-8 opacity-0 transition-all duration-500">
                        <div className="h-4 w-16 bg-green-200 mb-1 rounded"></div>
                        <div className="h-6 w-20 bg-green-300 rounded font-bold"></div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg chart-element translate-y-8 opacity-0 transition-all duration-500">
                        <div className="h-4 w-16 bg-blue-200 mb-1 rounded"></div>
                        <div className="h-6 w-20 bg-blue-300 rounded font-bold"></div>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg chart-element translate-y-8 opacity-0 transition-all duration-500">
                        <div className="h-4 w-16 bg-red-200 mb-1 rounded"></div>
                        <div className="h-6 w-20 bg-red-300 rounded font-bold"></div>
                      </div>
                    </div>
                    
                    {/* Chart */}
                    <div className="bg-white border border-gray-100 rounded-lg p-3 flex-grow chart-element translate-y-8 opacity-0 transition-all duration-500">
                      <div className="h-5 w-24 bg-gray-200 mb-3 rounded"></div>
                      <div className="flex items-end h-24 gap-2 pt-2">
                        <div className="bar bg-brand-purple/80 w-6 rounded-t-md transition-all duration-1000 ease-in-out" style={{height: '40%'}}></div>
                        <div className="bar bg-brand-purple/60 w-6 rounded-t-md transition-all duration-1000 ease-in-out" style={{height: '60%'}}></div>
                        <div className="bar bg-brand-purple/40 w-6 rounded-t-md transition-all duration-1000 ease-in-out" style={{height: '30%'}}></div>
                        <div className="bar bg-brand-purple/70 w-6 rounded-t-md transition-all duration-1000 ease-in-out" style={{height: '50%'}}></div>
                        <div className="bar bg-brand-purple/90 w-6 rounded-t-md transition-all duration-1000 ease-in-out" style={{height: '70%'}}></div>
                        <div className="bar bg-brand-purple/50 w-6 rounded-t-md transition-all duration-1000 ease-in-out" style={{height: '40%'}}></div>
                        <div className="bar bg-brand-purple/80 w-6 rounded-t-md transition-all duration-1000 ease-in-out" style={{height: '55%'}}></div>
                        <div className="bar bg-brand-purple/60 w-6 rounded-t-md transition-all duration-1000 ease-in-out" style={{height: '65%'}}></div>
                        <div className="bar bg-brand-purple/40 w-6 rounded-t-md transition-all duration-1000 ease-in-out" style={{height: '45%'}}></div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 chart-element translate-y-8 opacity-0 transition-all duration-500">
                      <ChartBar className="h-5 w-5 text-brand-purple animate-pulse" />
                      <ChartLine className="h-5 w-5 text-brand-purple animate-bounce" />
                      <ChartPie className="h-5 w-5 text-brand-purple animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Real-time financial insights at your fingertips</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
