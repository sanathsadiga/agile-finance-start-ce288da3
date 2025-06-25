
import React, { useEffect, useRef } from 'react';
import { 
  BarChart3, 
  FileText, 
  FileMinus, 
  BarChart, 
  Users, 
  Settings,
  ArrowRight,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: <BarChart3 className="h-12 w-12 text-brand-purple" />,
    title: "Smart Dashboard",
    description: "Get a comprehensive overview of your financial status with an intuitive dashboard featuring real-time analytics, income tracking, expense monitoring, and outstanding invoice alerts.",
    highlight: "Real-time insights",
    gradient: "from-purple-500/20 to-blue-500/20"
  },
  {
    icon: <FileText className="h-12 w-12 text-brand-purple" />,
    title: "Professional Invoicing",
    description: "Create, customize, and send professional invoices in seconds. Track payment status, download PDF copies, and automatically update records when payments are received.",
    highlight: "Instant PDF generation",
    gradient: "from-blue-500/20 to-green-500/20"
  },
  {
    icon: <FileMinus className="h-12 w-12 text-brand-purple" />,
    title: "Smart Expense Tracking",
    description: "Effortlessly record and categorize business expenses. Attach digital receipts, set spending alerts, and maintain organized records that are always audit-ready.",
    highlight: "Receipt scanning",
    gradient: "from-green-500/20 to-yellow-500/20"
  },
  {
    icon: <BarChart className="h-12 w-12 text-brand-purple" />,
    title: "Advanced Reporting",
    description: "Generate detailed profit & loss statements, expense breakdowns, and income tracking reports with beautiful data visualizations and exportable formats.",
    highlight: "Interactive charts",
    gradient: "from-yellow-500/20 to-red-500/20"
  },
  {
    icon: <Users className="h-12 w-12 text-brand-purple" />,
    title: "Team Collaboration",
    description: "Build your organization profile and seamlessly invite team members to collaborate on financial management with role-based permissions and access controls.",
    highlight: "Role-based access",
    gradient: "from-red-500/20 to-pink-500/20"
  },
  {
    icon: <Settings className="h-12 w-12 text-brand-purple" />,
    title: "Flexible Configuration",
    description: "Customize your business details, select preferred currencies, configure tax settings, and set up automated workflows that match your specific business requirements.",
    highlight: "Multi-currency support",
    gradient: "from-pink-500/20 to-purple-500/20"
  }
];

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.feature-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('opacity-100', 'translate-y-0', 'scale-100');
                card.classList.remove('opacity-0', 'translate-y-8', 'scale-95');
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="relative py-20 md:py-32 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-brand-purple/5 to-brand-tertiary-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r from-brand-tertiary-purple/5 to-purple-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Enhanced header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-purple/10 to-brand-tertiary-purple/10 px-6 py-3 rounded-full border border-brand-purple/20 mb-6 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-brand-purple animate-pulse" />
            <span className="text-sm font-semibold text-brand-purple">Powerful Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Everything you need to
            <span className="block bg-gradient-to-r from-brand-purple to-brand-tertiary-purple bg-clip-text text-transparent">
              manage your finances
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Streamline your business operations with our comprehensive suite of 
            financial management tools designed for modern businesses.
          </p>
        </div>
        
        {/* Features grid */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card opacity-0 translate-y-8 scale-95 transition-all duration-700 group relative"
            >
              {/* Card background with gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}></div>
              
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-100/50 hover:border-brand-purple/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl group-hover:bg-white/90">
                {/* Icon with animated background */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 to-brand-tertiary-purple/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-brand-purple/10 to-brand-tertiary-purple/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-brand-purple/20">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-brand-purple transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <ArrowRight className="h-5 w-5 text-brand-purple opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                  
                  {/* Highlight badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-purple/10 to-brand-tertiary-purple/10 px-4 py-2 rounded-full border border-brand-purple/20">
                    <div className="w-2 h-2 bg-brand-purple rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-brand-purple">{feature.highlight}</span>
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-purple/5 to-brand-tertiary-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-20">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-brand-purple/5 to-brand-tertiary-purple/5 p-8 rounded-2xl border border-brand-purple/20 backdrop-blur-sm">
            <div className="flex flex-col text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to get started?</h3>
              <p className="text-gray-600">Join thousands of businesses already using FinanceFlow</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                Start Free Trial
              </button>
              <button className="px-6 py-3 border-2 border-brand-purple/20 text-brand-purple rounded-xl font-semibold hover:bg-brand-purple/5 transition-colors duration-300">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
