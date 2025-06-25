
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, Sparkles } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-xl shadow-lg shadow-purple-100/20 py-4 sticky top-0 z-50 border-b border-purple-100/30">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
        <Link to="/" className="flex items-center group">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-brand-purple/30 to-brand-tertiary-purple/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-purple/10 to-brand-tertiary-purple/10 rounded-xl border border-brand-purple/20">
              <Sparkles className="w-5 h-5 text-brand-purple animate-pulse" />
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-tertiary-purple">
                FinanceFlow
              </span>
            </div>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="relative text-gray-700 hover:text-brand-purple transition-all duration-300 font-medium group">
            <span>Home</span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link to="/features" className="relative text-gray-700 hover:text-brand-purple transition-all duration-300 font-medium group">
            <span>Features</span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link to="/pricing" className="relative text-gray-700 hover:text-brand-purple transition-all duration-300 font-medium group">
            <span>Pricing</span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link to="/aboutus" className="relative text-gray-700 hover:text-brand-purple transition-all duration-300 font-medium group">
            <span>About us</span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
          </Link>
          
          <div className="pl-6 space-x-3 border-l border-gray-200/50">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="outline" className="flex items-center gap-2 border-brand-purple/30 hover:bg-brand-purple/10 transition-all duration-300 hover:scale-105">
                  <User className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-brand-purple/30 hover:bg-brand-purple/10 transition-all duration-300 hover:scale-105">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-brand-purple to-brand-tertiary-purple hover:from-brand-tertiary-purple hover:to-brand-purple transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu} 
            aria-label="Toggle menu"
            className="relative hover:bg-brand-purple/10 transition-all duration-300"
          >
            <div className="relative">
              {isMenuOpen ? (
                <X className="h-6 w-6 text-brand-purple" />
              ) : (
                <Menu className="h-6 w-6 text-brand-purple" />
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl absolute top-full left-0 right-0 shadow-2xl z-50 border-b border-purple-100/30">
          <div className="flex flex-col space-y-4 px-6 py-8 bg-gradient-to-b from-white/90 to-purple-50/30">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-brand-purple transition-all duration-300 font-medium py-2 border-b border-gray-100/50 hover:border-brand-purple/30"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className="text-gray-700 hover:text-brand-purple transition-all duration-300 font-medium py-2 border-b border-gray-100/50 hover:border-brand-purple/30"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-700 hover:text-brand-purple transition-all duration-300 font-medium py-2 border-b border-gray-100/50 hover:border-brand-purple/30"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/aboutus" 
              className="text-gray-700 hover:text-brand-purple transition-all duration-300 font-medium py-2 border-b border-gray-100/50 hover:border-brand-purple/30"
              onClick={() => setIsMenuOpen(false)}
            >
              About us
            </Link>
            
            <div className="pt-6 space-y-3 border-t border-gray-200/50">
              {isAuthenticated ? (
                <Link to="/dashboard" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple hover:from-brand-tertiary-purple hover:to-brand-purple transition-all duration-300">
                    <User className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-brand-purple/30 hover:bg-brand-purple/10 transition-all duration-300">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-brand-purple to-brand-tertiary-purple hover:from-brand-tertiary-purple hover:to-brand-purple transition-all duration-300">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
