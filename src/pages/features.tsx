import { Helmet } from 'react-helmet-async';
import { CheckCircle, Zap, Shield, TrendingUp, DollarSign, FileText, BarChart, Users, Globe, Clock, Smartphone, HeadphonesIcon } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Lightning-Fast Automation",
    description: "Automate repetitive financial tasks and save hours every week with our intelligent workflow engine."
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Bank-Level Security",
    description: "Your data is protected with enterprise-grade encryption and multi-factor authentication."
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Real-Time Analytics",
    description: "Get instant insights into your financial performance with customizable dashboards and reports."
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: "Multi-Currency Support",
    description: "Handle international transactions seamlessly with automatic currency conversion and tracking."
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Smart Invoicing",
    description: "Create professional invoices in seconds with AI-powered templates and automatic follow-ups."
  },
  {
    icon: <BarChart className="w-8 h-8" />,
    title: "Advanced Reporting",
    description: "Generate comprehensive financial reports and forecasts to make data-driven decisions."
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Team Collaboration",
    description: "Invite team members and control access with granular permission settings."
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Cloud-Based Access",
    description: "Access your financial data from anywhere, anytime, on any device with automatic syncing."
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Time Tracking",
    description: "Track billable hours and automatically convert them into professional invoices."
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Mobile Optimized",
    description: "Manage your finances on the go with our responsive design and mobile apps."
  },
  {
    icon: <HeadphonesIcon className="w-8 h-8" />,
    title: "24/7 Support",
    description: "Get help when you need it with our dedicated customer support team and extensive documentation."
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Easy Integration",
    description: "Connect with your favorite tools and services through our extensive integration marketplace."
  }
];

export default function FeaturesPage() {
  const featuresStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FinanceFlow Features",
    "applicationCategory": "BusinessApplication",
    "url": "https://financeflow.com/features",
    "description": "Comprehensive financial management features including automated invoicing, expense tracking, real-time analytics, and multi-currency support for modern businesses.",
    "featureList": features.map(feature => feature.title),
    "provider": {
      "@type": "Organization",
      "name": "FinanceFlow",
      "url": "https://financeflow.com"
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white text-gray-800 relative overflow-hidden">
      <Helmet>
        <title>Features - FinanceFlow | Complete Financial Management Platform Capabilities</title>
        <meta name="description" content="Discover FinanceFlow's powerful features: automated invoicing, expense tracking, real-time analytics, multi-currency support, and more. See how we revolutionize business finance management." />
        <meta name="keywords" content="financial management features, automated invoicing, expense tracking, real-time analytics, multi-currency support, financial reporting, business automation, accounting software features, fintech platform" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://financeflow.com/features" />
        <meta property="og:title" content="FinanceFlow Features - Complete Financial Management Platform" />
        <meta property="og:description" content="Explore FinanceFlow's comprehensive features designed to automate and streamline your business finances. From intelligent invoicing to advanced analytics." />
        <meta property="og:image" content="https://financeflow.com/images/features-overview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="FinanceFlow features overview showcasing automated financial management capabilities" />
        <meta property="og:site_name" content="FinanceFlow" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://financeflow.com/features" />
        <meta property="twitter:title" content="FinanceFlow Features - Intelligent Financial Management Tools" />
        <meta property="twitter:description" content="Discover how FinanceFlow's features transform business finance management with automation, analytics, and intelligent insights." />
        <meta property="twitter:image" content="https://financeflow.com/images/features-twitter.jpg" />
        <meta property="twitter:image:alt" content="FinanceFlow platform features and capabilities overview" />
        <meta property="twitter:creator" content="@financeflow" />
        <meta property="twitter:site" content="@financeflow" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://financeflow.com/features" />
        
        {/* Page-specific meta */}
        <meta name="category" content="Product Features" />
        <meta name="coverage" content="Product Capabilities" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        
        {/* Rich snippets */}
        <meta itemProp="name" content="FinanceFlow Features - Financial Management Platform" />
        <meta itemProp="description" content="Comprehensive financial management features including automation, analytics, and intelligent business insights." />
        <meta itemProp="image" content="https://financeflow.com/images/features-hero.jpg" />
        
        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify(featuresStructuredData)}
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
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Features",
                "item": "https://financeflow.com/features"
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-brand-purple/20 rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-brand-tertiary-purple/30 rounded-full animate-bounce" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-purple-400/25 rotate-45 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-brand-purple/40 rounded-full animate-ping"></div>
      </div>

      <Navbar />
      
      {/* Modern Hero Section */}
      <section className="py-16 text-center bg-white/50 backdrop-blur-sm animate-fade-up relative z-10">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-purple/15 via-white/70 to-brand-tertiary-purple/15 px-6 py-3 rounded-full border border-brand-purple/30 mb-6 backdrop-blur-lg shadow-lg">
            <Zap className="h-5 w-5 text-brand-purple animate-pulse" />
            <span className="text-sm font-bold text-brand-purple tracking-wide">Powerful Features</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple bg-clip-text text-transparent animate-gradient bg-300%">
              Everything You Need
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the comprehensive suite of features that make FinanceFlow the most powerful financial management platform for modern businesses.
          </p>
        </div>
      </section>

      {/* Modern Features Grid */}
      <section className="py-16 animate-fade-up relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:scale-105 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-brand-purple/20 to-brand-tertiary-purple/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-brand-purple/15 via-white/80 to-brand-tertiary-purple/15 rounded-2xl flex items-center justify-center text-brand-purple border border-brand-purple/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-brand-purple transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple text-white text-center relative z-10">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-black mb-4 animate-fade-up">Ready to Transform Your Business?</h3>
          <p className="text-lg mb-8 animate-fade-up delay-100 opacity-90 max-w-2xl mx-auto">
            Join thousands of businesses already using FinanceFlow to automate their finances and accelerate growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-200">
            <a href="/signup" className="bg-white text-brand-purple px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Start Free Trial
            </a>
            <a href="/pricing" className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-brand-purple transition-all duration-300 hover:scale-105">
              View Pricing
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
