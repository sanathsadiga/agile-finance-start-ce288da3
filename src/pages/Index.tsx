
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FinanceFlow",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": "All-in-one financial management platform for small businesses, freelancers, and startups. Manage invoices, track expenses, and get financial insights.",
    "url": "https://financeflow.com",
    "author": {
      "@type": "Organization",
      "name": "FinanceFlow"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "priceValidUntil": "2025-12-31"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2547"
    },
    "features": [
      "Invoice Management",
      "Expense Tracking", 
      "Financial Reporting",
      "Team Collaboration",
      "Payment Processing"
    ]
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>FinanceFlow - #1 Financial Management Software for Small Business | Free Invoice & Expense Tracking</title>
        <meta name="description" content="Streamline your business finances with FinanceFlow's all-in-one platform. Create professional invoices, track expenses, manage payments, and get real-time financial insights. Trusted by 10,000+ small businesses. Start free today!" />
        <meta name="keywords" content="financial management software, invoice software, expense tracking, small business accounting, freelancer invoicing, business finance tools, payment tracking, financial reporting, cash flow management, business dashboard" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://financeflow.com/" />
        <meta property="og:title" content="FinanceFlow - #1 Financial Management Software for Small Business" />
        <meta property="og:description" content="Streamline your business finances with FinanceFlow's all-in-one platform. Create invoices, track expenses, and get financial insights. Trusted by 10,000+ businesses." />
        <meta property="og:image" content="https://financeflow.com/images/og-homepage.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="FinanceFlow" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://financeflow.com/" />
        <meta property="twitter:title" content="FinanceFlow - #1 Financial Management Software for Small Business" />
        <meta property="twitter:description" content="Streamline your business finances with FinanceFlow's all-in-one platform. Create invoices, track expenses, and get financial insights." />
        <meta property="twitter:image" content="https://financeflow.com/images/twitter-homepage.jpg" />
        <meta property="twitter:creator" content="@financeflow" />
        <meta property="twitter:site" content="@financeflow" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="author" content="FinanceFlow Team" />
        <meta name="publisher" content="FinanceFlow" />
        <meta name="copyright" content="© 2024 FinanceFlow. All rights reserved." />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        
        {/* Business/Local SEO */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="ICBM" content="37.7749, -122.4194" />
        
        {/* Technical SEO */}
        <link rel="canonical" href="https://financeflow.com/" />
        <link rel="alternate" hrefLang="en" href="https://financeflow.com/" />
        <link rel="alternate" hrefLang="x-default" href="https://financeflow.com/" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        {/* Additional Marketing Tags */}
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FinanceFlow" />
        
        {/* Verification Tags (replace with actual values) */}
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        <meta name="yandex-verification" content="your-yandex-verification-code" />
        
        {/* Rich Snippets for Business */}
        <meta itemProp="name" content="FinanceFlow - Financial Management Software" />
        <meta itemProp="description" content="All-in-one financial management platform for small businesses and freelancers" />
        <meta itemProp="image" content="https://financeflow.com/images/logo-large.png" />
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
