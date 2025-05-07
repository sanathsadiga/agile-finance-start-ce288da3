
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import PricingPlans from '@/components/PricingPlans';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import CookieConsent from '@/components/CookieConsent';

const Index = () => {
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('.scroll-animate').forEach((element) => {
      observer.observe(element);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>FinanceFlow - Simplify Your Financial Management</title>
        <meta name="description" content="Take control of your business finances with our all-in-one platform for invoicing, expense tracking, and financial insights." />
        <meta name="keywords" content="finance, invoicing, expense tracking, small business, financial management" />
        <meta property="og:title" content="FinanceFlow - Simplify Your Financial Management" />
        <meta property="og:description" content="Take control of your business finances with our all-in-one platform for invoicing, expense tracking, and financial insights." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://financeflow.com/" />
      </Helmet>
      
      <Navbar />
      <Hero />
      <CookieConsent />
      <Features />
      <PricingPlans />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
