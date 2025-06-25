import { Helmet } from 'react-helmet-async';
import { Check, Star, Zap, Crown, Rocket } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for freelancers and small startups getting started with financial management.",
    features: [
      "Up to 5 invoices per month",
      "Basic expense tracking",
      "Simple financial reports",
      "Email support",
      "Mobile app access"
    ],
    icon: <Star className="w-6 h-6" />,
    popular: false,
    ctaText: "Get Started Free"
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "Ideal for growing businesses that need advanced features and automation.",
    features: [
      "Unlimited invoices",
      "Advanced expense tracking",
      "Automated workflows",
      "Custom financial reports",
      "Priority support",
      "Multi-currency support",
      "Team collaboration (up to 5 users)",
      "API access"
    ],
    icon: <Zap className="w-6 h-6" />,
    popular: true,
    ctaText: "Start Free Trial"
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For larger organizations requiring enterprise-grade features and support.",
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "Advanced analytics & forecasting",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 phone support",
      "Advanced security features",
      "Custom branding",
      "SLA guarantee"
    ],
    icon: <Crown className="w-6 h-6" />,
    popular: false,
    ctaText: "Contact Sales"
  }
];

export default function PricingPage() {
  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "FinanceFlow Pricing Plans",
    "description": "Flexible pricing plans for financial management software, from free starter to enterprise solutions.",
    "url": "https://financeflow.com/pricing",
    "offers": plans.map(plan => ({
      "@type": "Offer",
      "name": plan.name,
      "price": plan.price === "Free" ? "0" : plan.price.replace("$", ""),
      "priceCurrency": "USD",
      "billingIncrement": plan.period === "forever" ? "P0M" : "P1M",
      "availability": "https://schema.org/InStock",
      "url": "https://financeflow.com/signup"
    }))
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white text-gray-800 relative overflow-hidden">
      <Helmet>
        <title>Pricing Plans - FinanceFlow | Flexible Financial Management Software Pricing</title>
        <meta name="description" content="Choose the perfect FinanceFlow plan for your business. From free starter to enterprise solutions. Transparent pricing with no hidden fees. Start your free trial today!" />
        <meta name="keywords" content="financial software pricing, business accounting plans, invoice software cost, expense tracking pricing, financial management subscription, fintech pricing, accounting software plans" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://financeflow.com/pricing" />
        <meta property="og:title" content="FinanceFlow Pricing - Transparent Plans for Every Business Size" />
        <meta property="og:description" content="Flexible pricing plans starting free. Professional features from $29/month. Enterprise solutions available. No hidden fees, cancel anytime." />
        <meta property="og:image" content="https://financeflow.com/images/pricing-plans.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="FinanceFlow pricing plans comparison showing features and costs" />
        <meta property="og:site_name" content="FinanceFlow" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://financeflow.com/pricing" />
        <meta property="twitter:title" content="FinanceFlow Pricing - Plans Starting Free" />
        <meta property="twitter:description" content="Transparent pricing for powerful financial management. Free plan available, professional features from $29/month." />
        <meta property="twitter:image" content="https://financeflow.com/images/pricing-twitter.jpg" />
        <meta property="twitter:image:alt" content="FinanceFlow pricing plans and features comparison" />
        <meta property="twitter:creator" content="@financeflow" />
        <meta property="twitter:site" content="@financeflow" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://financeflow.com/pricing" />
        
        {/* Pricing specific meta */}
        <meta name="category" content="Pricing" />
        <meta name="price_range" content="Free - $99" />
        <meta name="billing_cycle" content="Monthly" />
        <meta name="free_trial" content="Available" />
        <meta name="payment_methods" content="Credit Card, PayPal" />
        
        {/* Rich snippets */}
        <meta itemProp="name" content="FinanceFlow Pricing Plans" />
        <meta itemProp="description" content="Flexible financial management software pricing with free and premium plans." />
        <meta itemProp="image" content="https://financeflow.com/images/pricing-hero.jpg" />
        
        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify(pricingStructuredData)}
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
                "name": "Pricing",
                "item": "https://financeflow.com/pricing"
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
            <Rocket className="h-5 w-5 text-brand-purple animate-pulse" />
            <span className="text-sm font-bold text-brand-purple tracking-wide">Simple Pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple bg-clip-text text-transparent animate-gradient bg-300%">
              Choose Your Plan
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Flexible pricing that grows with your business. Start free and upgrade when you're ready for more advanced features.
          </p>
        </div>
      </section>

      {/* Modern Pricing Cards */}
      <section className="py-16 animate-fade-up relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`group relative p-8 bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 hover:scale-105 animate-fade-up ${
                  plan.popular 
                    ? 'border-brand-purple shadow-brand-purple/20 scale-105' 
                    : 'border-gray-200/50 hover:border-brand-purple/30'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-brand-purple to-brand-tertiary-purple text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-brand-purple/20 to-brand-tertiary-purple/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-brand-purple to-brand-tertiary-purple' 
                      : 'bg-gradient-to-br from-gray-600 to-gray-700'
                  }`}>
                    {plan.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-black text-brand-purple">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">{plan.description}</p>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="relative mt-0.5">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                  plan.popular
                    ? 'bg-gradient-to-r from-brand-purple to-brand-tertiary-purple text-white hover:from-brand-tertiary-purple hover:to-brand-purple'
                    : 'bg-white border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white'
                }`}>
                  {plan.ctaText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern FAQ Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm animate-fade-up delay-200 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-10 tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing accordingly."
              },
              {
                q: "Is there a free trial?",
                a: "Absolutely! All paid plans come with a 14-day free trial. No credit card required to start."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
              },
              {
                q: "Is my data secure?",
                a: "Yes, we use bank-level encryption and security measures to protect your financial data. We're SOC 2 Type II certified."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <h3 className="font-bold text-brand-purple text-lg mb-2">{item.q}</h3>
                <p className="text-gray-700 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple text-white text-center relative z-10">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-black mb-4 animate-fade-up">Ready to Get Started?</h3>
          <p className="text-lg mb-8 animate-fade-up delay-100 opacity-90 max-w-2xl mx-auto">
            Join thousands of businesses that trust FinanceFlow with their financial management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-200">
            <a href="/signup" className="bg-white text-brand-purple px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Start Free Trial
            </a>
            <a href="/contactus" className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-brand-purple transition-all duration-300 hover:scale-105">
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
