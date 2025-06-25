
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ArrowUp } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-b from-white via-purple-50/30 to-white border-t border-purple-100/50 py-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-3 h-3 bg-brand-purple/20 rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-brand-tertiary-purple/30 rounded-full animate-bounce" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-purple-400/25 rotate-45 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-brand-purple/30 to-brand-tertiary-purple/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-brand-purple/10 to-brand-tertiary-purple/10 rounded-xl border border-brand-purple/20">
                  <Sparkles className="w-5 h-5 text-brand-purple animate-pulse" />
                  <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-tertiary-purple">
                    FinanceFlow
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm">
              Revolutionary financial management software that automates your business finances with intelligent precision and modern elegance.
            </p>
            <div className="flex items-center gap-2 text-brand-purple">
              <Heart className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Made with passion</span>
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple bg-clip-text text-transparent">Product</h3>
            <ul className="space-y-4 text-gray-600">
              <li>
                <Link to="/features" className="hover:text-brand-purple transition-all duration-300 relative group text-sm">
                  <span>Features</span>
                  <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-brand-purple transition-all duration-300 relative group text-sm">
                  <span>Pricing</span>
                  <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/#" className="hover:text-brand-purple transition-all duration-300 relative group text-sm">
                  <span>Integrations</span>
                  <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/#" className="hover:text-brand-purple transition-all duration-300 relative group text-sm">
                  <span>Changelog</span>
                  <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple bg-clip-text text-transparent">Resources</h3>
            <ul className="space-y-4 text-gray-600">
              <li>
                <Link to="/#" className="hover:text-brand-purple transition-all duration-300 relative group text-sm">
                  <span>Help Center</span>
                  <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="hover:text-brand-purple transition-all duration-300 relative group text-sm">
                  <span>Documentation</span>
                  <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-brand-purple transition-all duration-300 relative group text-sm">
                  <span>Blog</span>
                  <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-brand-purple transition-all duration-300 relative group text-sm">
                  <span>Community</span>
                  <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple bg-clip-text text-transparent">Company</h3>
            <ul className="space-y-4 text-gray-600">
              <li>
                <Link to="/aboutus" className="hover:text-brand-purple transition-all duration-300 relative group text-sm">
                  <span>About</span>
                  <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/#" className="hover:text-brand-purple transition-all duration-300 relative group text-sm">
                  <span>Careers</span>
                  <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/contactus" className="hover:text-brand-purple transition-all duration-300 relative group text-sm">
                  <span>Contact</span>
                  <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/#" className="hover:text-brand-purple transition-all duration-300 relative group text-sm">
                  <span>Legal</span>
                  <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-purple-100/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {currentYear} FinanceFlow. All rights reserved. Built with ❤️ for modern businesses.
            </p>
            <div className="flex items-center space-x-6">
              <Link to="/#" className="text-gray-600 hover:text-brand-purple transition-all duration-300 text-sm relative group">
                <span>Terms</span>
                <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link to="/#" className="text-gray-600 hover:text-brand-purple transition-all duration-300 text-sm relative group">
                <span>Privacy</span>
                <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link to="/#" className="text-gray-600 hover:text-brand-purple transition-all duration-300 text-sm relative group">
                <span>Cookies</span>
                <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple group-hover:w-full transition-all duration-300"></div>
              </Link>
              <button 
                onClick={scrollToTop}
                className="text-gray-600 hover:text-brand-purple transition-all duration-300 p-2 hover:bg-brand-purple/10 rounded-full group"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
