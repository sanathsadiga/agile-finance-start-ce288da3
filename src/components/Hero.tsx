
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { TrendingUp, Award, HeartHandshake } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 overflow-hidden bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          <div className="flex flex-col space-y-6 md:w-1/2 animate-fade-in">
            <div className="flex items-center gap-2 text-brand-purple bg-brand-purple/10 w-fit px-4 py-2 rounded-full">
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">Trusted by 10,000+ businesses</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Simplify your <span className="text-brand-purple">financial management</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              Take control of your business finances with our all-in-one platform for invoicing, expense tracking, and financial insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto group">
                  Start your free trial
                  <TrendingUp className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
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
          
          <div className="md:w-1/2 rounded-lg overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="relative bg-white rounded-lg p-4 border border-gray-100">
              <div className="aspect-video bg-gradient-to-br from-brand-purple to-brand-tertiary-purple rounded-md overflow-hidden relative">
                <div className="absolute inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-11/12 h-4/5 bg-white rounded-lg shadow-lg flex flex-col animate-fade-in">
                    <div className="h-8 bg-brand-purple rounded-t-lg flex items-center px-3">
                      <div className="w-3 h-3 rounded-full bg-white/70 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-white/50 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-white/30"></div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          <div className="h-8 bg-brand-purple/20 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-16 bg-brand-purple/10 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-2">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-6 bg-brand-purple/20 rounded w-32 animate-pulse"></div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-brand-purple/10 animate-pulse"></div>
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
