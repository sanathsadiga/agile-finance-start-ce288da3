
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="py-16 md:py-24 overflow-hidden bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          <div className="flex flex-col space-y-6 md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Simple accounting <span className="text-brand-purple">for growing businesses</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              Manage your finances with confidence. Create invoices, track expenses, and gain valuable insights with our intuitive accounting platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start your free trial
                </Button>
              </Link>
              <Link to="/#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore features
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              No credit card required. Free for 14 days.
            </p>
          </div>
          
          <div className="md:w-1/2 rounded-lg overflow-hidden shadow-2xl">
            <div className="relative bg-white rounded-lg p-4 border border-gray-100 shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-brand-purple to-brand-tertiary-purple rounded-md overflow-hidden relative">
                <div className="absolute inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-3/4 h-1/2 bg-white rounded-lg shadow-lg flex flex-col">
                    <div className="h-8 bg-brand-purple rounded-t-lg flex items-center px-3">
                      <div className="w-3 h-3 rounded-full bg-white/70 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-white/50 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-white/30"></div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="h-8 bg-brand-purple/20 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-2">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-brand-purple/20 rounded mb-3"></div>
                <div className="flex justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-brand-purple/30 rounded w-1/4"></div>
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
