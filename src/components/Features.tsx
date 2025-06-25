import React, { useEffect, useRef } from 'react';
import { 
  BarChart3, 
  FileText, 
  FileMinus, 
  BarChart, 
  Users, 
  Settings,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Clock,
  Target
} from "lucide-react";

const features = [
  {
    icon: <BarChart3 className="h-14 w-14 text-brand-purple" />,
    title: "AI-Powered Dashboard",
    description: "Get intelligent insights with machine learning analytics, predictive cash flow forecasting, and automated financial health scoring.",
    highlight: "Real-time AI insights",
    gradient: "from-purple-500/20 via-blue-500/20 to-purple-500/20",
    accentColor: "purple",
    stats: "99.9% uptime"
  },
  {
    icon: <FileText className="h-14 w-14 text-brand-purple" />,
    title: "Smart Invoice Engine",
    description: "Create stunning invoices with AI-powered templates, automated follow-ups, and instant payment processing with global currency support.",
    highlight: "Instant PDF generation",
    gradient: "from-blue-500/20 via-green-500/20 to-blue-500/20",
    accentColor: "blue",
    stats: "10x faster"
  },
  {
    icon: <FileMinus className="h-14 w-14 text-brand-purple" />,
    title: "Intelligent Expense AI",
    description: "Automatically categorize expenses using AI, scan receipts with OCR technology, and get smart spending recommendations.",
    highlight: "AI-powered categorization",
    gradient: "from-green-500/20 via-yellow-500/20 to-green-500/20",
    accentColor: "green",
    stats: "95% accuracy"
  },
  {
    icon: <BarChart className="h-14 w-14 text-brand-purple" />,
    title: "Advanced Analytics Hub",
    description: "Generate beautiful reports with interactive charts, export to multiple formats, and get actionable business insights powered by AI.",
    highlight: "Interactive data visualization",
    gradient: "from-yellow-500/20 via-red-500/20 to-yellow-500/20",
    accentColor: "yellow",
    stats: "50+ templates"
  },
  {
    icon: <Users className="h-14 w-14 text-brand-purple" />,
    title: "Collaborative Workspace",
    description: "Built-in team chat, real-time collaboration, advanced permission systems, and seamless integration with popular business tools.",
    highlight: "Real-time collaboration",
    gradient: "from-red-500/20 via-pink-500/20 to-red-500/20",
    accentColor: "red",
    stats: "Unlimited users"
  },
  {
    icon: <Settings className="h-14 w-14 text-brand-purple" />,
    title: "Enterprise Configuration",
    description: "Advanced API integrations, custom workflows, white-label solutions, and enterprise-grade security with SOC 2 compliance.",
    highlight: "Enterprise-grade security",
    gradient: "from-pink-500/20 via-purple-500/20 to-pink-500/20",
    accentColor: "pink",
    stats: "SOC 2 certified"
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
                card.classList.remove('opacity-0', 'translate-y-12', 'scale-95');
              }, index * 200);
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

  const getAccentClass = (color: string) => {
    const classes = {
      purple: 'border-purple-300/50 bg-purple-50/50',
      blue: 'border-blue-300/50 bg-blue-50/50',
      green: 'border-green-300/50 bg-green-50/50',
      yellow: 'border-yellow-300/50 bg-yellow-50/50',
      red: 'border-red-300/50 bg-red-50/50',
      pink: 'border-pink-300/50 bg-pink-50/50'
    };
    return classes[color as keyof typeof classes] || classes.purple;
  };

  return (
    <section id="features" className="relative py-20 md:py-24 bg-gradient-to-b from-white via-gray-50/20 to-white overflow-hidden">
      {/* Modern background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-brand-purple/20 rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute top-40 right-20 w-4 h-4 bg-brand-tertiary-purple/30 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-purple-400/25 rotate-45 animate-pulse"></div>
        
        <div className="absolute top-1/4 -left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-brand-purple/6 to-brand-tertiary-purple/6 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 -right-1/3 w-[400px] h-[400px] bg-gradient-to-r from-brand-tertiary-purple/4 to-purple-200/10 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Modern header design */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-purple/15 via-white/70 to-brand-tertiary-purple/15 px-6 py-3 rounded-full border border-brand-purple/30 mb-6 backdrop-blur-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-brand-purple animate-pulse" />
              <div className="absolute inset-0 bg-brand-purple/30 rounded-full blur animate-ping"></div>
            </div>
            <span className="text-modern-base font-black text-brand-purple tracking-wide">Revolutionary Features</span>
            <Zap className="h-4 w-4 text-brand-tertiary-purple animate-bounce" />
          </div>
          
          <h2 className="text-responsive-4xl md:text-responsive-5xl lg:text-responsive-6xl font-black mb-6 tracking-tight leading-[0.9]">
            <span className="block">Everything you need to</span>
            <span className="block bg-gradient-to-r from-brand-purple via-brand-tertiary-purple via-purple-600 to-brand-purple bg-clip-text text-transparent animate-gradient bg-300%">
              dominate your finances
            </span>
          </h2>
          
          <p className="text-modern-xl md:text-modern-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Experience the future of financial management with our 
            <span className="font-bold text-brand-purple"> AI-powered platform</span> designed for 
            modern businesses who demand excellence.
          </p>
        </div>
        
        {/* Modern features grid */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card opacity-0 translate-y-12 scale-95 transition-all duration-1000 group relative"
            >
              {/* Multi-layered glow effects */}
              <div className={`absolute -inset-2 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl`}></div>
              <div className="absolute -inset-1 bg-gradient-to-br from-white/50 to-gray-100/50 rounded-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur"></div>
              
              <div className="relative bg-white/95 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/50 hover:border-brand-purple/30 transition-all duration-700 hover:scale-105 group-hover:bg-white/98 shadow-xl hover:shadow-3xl group-hover:shadow-brand-purple/20">
                {/* Enhanced icon */}
                <div className="relative mb-6">
                  <div className="absolute -inset-3 bg-gradient-to-r from-brand-purple/20 to-brand-tertiary-purple/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-brand-purple/15 via-white/80 to-brand-tertiary-purple/15 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-700 border border-brand-purple/30 shadow-lg">
                    {feature.icon}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                  </div>
                </div>
                
                {/* Content with enhanced typography */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-modern-xl font-black text-gray-800 group-hover:text-brand-purple transition-colors duration-300 mb-2 leading-tight">
                        {feature.title}
                      </h3>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-modern-xs font-bold ${getAccentClass(feature.accentColor)} border mb-3`}>
                        <Target className="h-3 w-3" />
                        {feature.stats}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-brand-purple opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 mt-1" />
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed text-modern-base font-light">
                    {feature.description}
                  </p>
                  
                  {/* Enhanced highlight badge */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-purple/15 via-white/70 to-brand-tertiary-purple/15 px-4 py-2 rounded-full border border-brand-purple/30 backdrop-blur-sm shadow-inner">
                      <div className="relative">
                        <div className="w-2 h-2 bg-brand-purple rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 bg-brand-purple/50 rounded-full blur animate-ping"></div>
                      </div>
                      <span className="text-modern-xs font-bold text-brand-purple">{feature.highlight}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span className="text-modern-xs font-medium">Live</span>
                    </div>
                  </div>
                </div>
                
                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-brand-purple/20 to-brand-tertiary-purple/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <Shield className="h-3 w-3 text-brand-purple" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modern call to action */}
        <div className="text-center mt-20">
          <div className="relative inline-flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-brand-purple/10 via-white/80 to-brand-tertiary-purple/10 p-8 rounded-3xl border border-brand-purple/30 backdrop-blur-xl shadow-2xl hover:scale-105 transition-transform duration-500">
            {/* Background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-purple/20 to-brand-tertiary-purple/20 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
            
            <div className="relative flex flex-col text-center sm:text-left z-10">
              <h3 className="text-modern-2xl font-black text-gray-800 mb-2 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-brand-purple animate-spin" style={{animationDuration: '3s'}} />
                Ready to revolutionize your business?
              </h3>
              <p className="text-modern-lg text-gray-600 font-light">Join thousands of forward-thinking businesses already using FinanceFlow</p>
            </div>
            <div className="relative flex gap-3 z-10">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <button className="relative px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple text-white rounded-2xl font-bold hover:scale-105 transition-transform duration-300 shadow-xl text-modern-base">
                  <Zap className="inline h-4 w-4 mr-2 animate-pulse" />
                  Start Free Trial
                </button>
              </div>
              <button className="px-6 py-3 border-2 border-brand-purple/30 text-brand-purple rounded-2xl font-bold hover:bg-brand-purple/10 transition-colors duration-300 hover:scale-105 transform text-modern-base backdrop-blur-sm">
                <Shield className="inline h-4 w-4 mr-2" />
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
