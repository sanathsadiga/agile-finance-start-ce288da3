
import { Helmet } from 'react-helmet-async';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import PricingPlans from '@/components/PricingPlans';
import Testimonials from '@/components/Testimonials';
import CookieConsent from '@/components/CookieConsent';
import FAQ from '@/components/faq';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Index() {
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FinanceFlow",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "url": "https://financeflow.com",
    "description": "Revolutionary financial management software for small businesses and freelancers. Automate invoicing, expense tracking, and financial reporting with intelligent precision.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock"
    },
    "provider": {
      "@type": "Organization",
      "name": "FinanceFlow Inc",
      "url": "https://financeflow.com"
    },
    "screenshot": "https://financeflow.com/images/dashboard-screenshot.jpg",
    "featureList": [
      "Automated Invoicing",
      "Expense Tracking",
      "Financial Reporting",
      "Multi-currency Support",
      "Real-time Analytics",
      "Tax Management"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1247"
    }
  };

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FinanceFlow",
    "url": "https://financeflow.com",
    "logo": "https://financeflow.com/images/logo.png",
    "description": "Leading provider of intelligent financial management software for small businesses and freelancers worldwide.",
    "sameAs": [
      "https://twitter.com/financeflow",
      "https://linkedin.com/company/financeflow",
      "https://facebook.com/financeflow"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://financeflow.com/contactus",
      "email": "support@financeflow.com"
    }
  };

  return (
    <>
      <Helmet>
        <title>FinanceFlow - Revolutionary Financial Management Software for Small Business</title>
        <meta name="description" content="Transform your business finances with FinanceFlow's intelligent automation platform. Streamline invoicing, expense tracking, and financial reporting. Start free today!" />
        <meta name="keywords" content="financial management software, small business accounting, automated invoicing, expense tracking, financial reporting, business finance automation, accounting software, fintech, financial dashboard" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://financeflow.com/" />
        <meta property="og:title" content="FinanceFlow - Revolutionary Financial Management Software for Modern Business" />
        <meta property="og:description" content="Join 10,000+ businesses automating their finances with FinanceFlow. Intelligent invoicing, expense tracking, and financial insights in one powerful platform." />
        <meta property="og:image" content="https://financeflow.com/images/homepage-hero.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="FinanceFlow dashboard showing automated financial management features" />
        <meta property="og:site_name" content="FinanceFlow" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://financeflow.com/" />
        <meta property="twitter:title" content="FinanceFlow - Smart Financial Management Made Simple" />
        <meta property="twitter:description" content="Automate your business finances with intelligent precision. Invoice, track expenses, and gain insights with FinanceFlow's revolutionary platform." />
        <meta property="twitter:image" content="https://financeflow.com/images/twitter-card.jpg" />
        <meta property="twitter:image:alt" content="FinanceFlow intelligent financial management platform interface" />
        <meta property="twitter:creator" content="@financeflow" />
        <meta property="twitter:site" content="@financeflow" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://financeflow.com/" />
        
        {/* Business/Product specific meta */}
        <meta name="application-name" content="FinanceFlow" />
        <meta name="author" content="FinanceFlow Team" />
        <meta name="category" content="Business Software" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name="target" content="Small Business, Freelancers, Startups" />
        
        {/* Mobile/App meta */}
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FinanceFlow" />
        
        {/* Rich snippets */}
        <meta itemProp="name" content="FinanceFlow - Revolutionary Financial Management Software" />
        <meta itemProp="description" content="Intelligent financial automation platform for modern businesses. Streamline invoicing, expenses, and reporting." />
        <meta itemProp="image" content="https://financeflow.com/images/product-hero.jpg" />
        
        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify(homeStructuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationStructuredData)}
        </script>
        
        {/* Breadcrumb structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://financeflow.com/"
              }
            ]
          })}
        </script>

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Alternative language versions */}
        <link rel="alternate" hrefLang="en" href="https://financeflow.com/" />
        <link rel="alternate" hrefLang="x-default" href="https://financeflow.com/" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <Features />
        <PricingPlans />
        <Testimonials />
        <FAQ />
        <Footer />
        <CookieConsent />
      </div>
    </>
  );
}
