
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-bold text-lg mb-4">FinanceFlow</h3>
            <p className="text-gray-600 mb-4">
              Simple accounting software for small businesses and freelancers.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-3 text-gray-600">
              <li><Link to="/#features" className="hover:text-brand-purple transition-colors">Features</Link></li>
              <li><Link to="/#pricing" className="hover:text-brand-purple transition-colors">Pricing</Link></li>
              <li><Link to="/#" className="hover:text-brand-purple transition-colors">Integrations</Link></li>
              <li><Link to="/#" className="hover:text-brand-purple transition-colors">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3 text-gray-600">
              <li><Link to="/#" className="hover:text-brand-purple transition-colors">Help Center</Link></li>
              <li><Link to="/#" className="hover:text-brand-purple transition-colors">Documentation</Link></li>
              <li><Link to="/#" className="hover:text-brand-purple transition-colors">Blog</Link></li>
              <li><Link to="/#" className="hover:text-brand-purple transition-colors">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3 text-gray-600">
              <li><Link to="/#" className="hover:text-brand-purple transition-colors">About</Link></li>
              <li><Link to="/#" className="hover:text-brand-purple transition-colors">Careers</Link></li>
              <li><Link to="/#" className="hover:text-brand-purple transition-colors">Contact</Link></li>
              <li><Link to="/#" className="hover:text-brand-purple transition-colors">Legal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {currentYear} FinanceFlow. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/#" className="text-gray-600 hover:text-brand-purple transition-colors">
                Terms
              </Link>
              <Link to="/#" className="text-gray-600 hover:text-brand-purple transition-colors">
                Privacy
              </Link>
              <Link to="/#" className="text-gray-600 hover:text-brand-purple transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
