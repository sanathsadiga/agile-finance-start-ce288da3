
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from 'react-router-dom';

const monthlyPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for freelancers just getting started",
    features: [
      "1 user",
      "5 invoices per month",
      "Basic expense tracking",
      "Simple reporting",
      "Email support"
    ],
    highlight: false,
    buttonText: "Start for free",
    buttonVariant: "outline"
  },
  {
    name: "Professional",
    price: "$15",
    period: "/month",
    description: "For growing businesses with more clients",
    features: [
      "3 users included",
      "Unlimited invoices",
      "Advanced expense tracking",
      "Detailed financial reports",
      "Priority email support",
      "Client portal"
    ],
    highlight: true,
    buttonText: "Start free trial",
    buttonVariant: "default"
  },
  {
    name: "Business",
    price: "$29",
    period: "/month",
    description: "For established businesses with multiple team members",
    features: [
      "10 users included",
      "Unlimited invoices",
      "Advanced expense tracking",
      "Custom financial reports",
      "Priority support",
      "Client portal",
      "Team permissions",
      "API access"
    ],
    highlight: false,
    buttonText: "Start free trial",
    buttonVariant: "outline"
  }
];

const yearlyPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for freelancers just getting started",
    features: [
      "1 user",
      "5 invoices per month",
      "Basic expense tracking",
      "Simple reporting",
      "Email support"
    ],
    highlight: false,
    buttonText: "Start for free",
    buttonVariant: "outline"
  },
  {
    name: "Professional",
    price: "$150",
    period: "/year",
    description: "For growing businesses with more clients",
    features: [
      "3 users included",
      "Unlimited invoices",
      "Advanced expense tracking",
      "Detailed financial reports",
      "Priority email support",
      "Client portal",
      "Save $30 compared to monthly"
    ],
    highlight: true,
    buttonText: "Start free trial",
    buttonVariant: "default"
  },
  {
    name: "Business",
    price: "$290",
    period: "/year",
    description: "For established businesses with multiple team members",
    features: [
      "10 users included",
      "Unlimited invoices",
      "Advanced expense tracking",
      "Custom financial reports",
      "Priority support",
      "Client portal",
      "Team permissions",
      "API access",
      "Save $58 compared to monthly"
    ],
    highlight: false,
    buttonText: "Start free trial",
    buttonVariant: "outline"
  },
  {
    name: "Enterprise",
    price: "$250",
    period: "one-time setup",
    description: "Custom solution for larger organizations",
    features: [
      "Unlimited users",
      "Unlimited everything",
      "Custom integrations",
      "Dedicated account manager",
      "White-label solution",
      "Custom reporting",
      "API access",
      "24/7 premium support",
      "On-premise installation option"
    ],
    highlight: false,
    buttonText: "Contact Sales",
    buttonVariant: "outline"
  }
];

const PricingPlans = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const plans = billingPeriod === 'monthly' ? monthlyPlans : yearlyPlans;

  return (
    <section id="pricing" className="py-16 bg-gradient-to-b from-purple-50/50 via-white to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-brand-purple/20 rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-brand-tertiary-purple/30 rounded-full animate-bounce" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-purple-400/25 rotate-45 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-responsive-4xl font-bold text-gray-900 tracking-tight mb-3">Simple, Transparent Pricing</h2>
          <p className="text-modern-lg text-gray-600 max-w-xl mx-auto">
            Choose the plan that fits your business. All come with a 14-day free trial.
          </p>

          {/* Modern Toggle */}
          <div className="inline-flex mt-6 bg-gray-100/80 backdrop-blur-sm rounded-full p-1 border border-gray-200/50 shadow-lg">
            {["monthly", "yearly"].map((period) => (
              <button
                key={period}
                onClick={() => setBillingPeriod(period)}
                className={`px-5 py-2 text-modern-sm rounded-full transition-all duration-300 ${
                  billingPeriod === period
                    ? "bg-brand-purple text-white shadow-lg transform scale-105"
                    : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {period === "monthly" ? "Monthly" : "Yearly (Save 15%)"}
              </button>
            ))}
          </div>
        </div>

        {/* Modern Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`flex flex-col rounded-3xl border overflow-hidden relative group transition-all duration-500 hover:scale-105 ${
                plan.highlight
                  ? "bg-white/90 backdrop-blur-lg ring-2 ring-brand-purple shadow-2xl shadow-brand-purple/20"
                  : "bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl hover:shadow-2xl"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple rounded-t-3xl"></div>
              )}
              
              {plan.highlight && (
                <span className="absolute top-3 left-0 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple text-white text-modern-xs font-bold px-3 py-1 rounded-r-full shadow-lg">
                  Most Popular
                </span>
              )}

              <div className="p-6 flex-grow">
                <h3 className="text-modern-xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline mb-3">
                  <span className="text-responsive-3xl font-black text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-modern-sm text-gray-500 ml-1">{plan.period}</span>}
                </div>
                <p className="text-modern-sm text-gray-600 mb-6 leading-relaxed">{plan.description}</p>

                <Link to="/signup" className="block">
                  <Button
                    variant={plan.buttonVariant as "default" | "outline"}
                    className={`w-full transition-all duration-300 hover:scale-105 ${
                      plan.highlight 
                        ? "bg-gradient-to-r from-brand-purple to-brand-tertiary-purple text-white hover:from-brand-tertiary-purple hover:to-brand-purple shadow-lg" 
                        : "border-brand-purple/30 hover:border-brand-purple/60 hover:bg-brand-purple/10"
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>

              <div className="border-t border-gray-100/50 bg-gray-50/30 backdrop-blur-sm p-6">
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-modern-sm text-gray-700">
                      <Check className="w-4 h-4 text-brand-purple mr-2 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hover overlay */}
              <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                plan.highlight 
                  ? "bg-gradient-to-br from-brand-purple/5 via-transparent to-brand-tertiary-purple/5"
                  : "bg-gradient-to-br from-gray-100/20 via-transparent to-gray-100/20"
              }`}></div>
            </div>
          ))}
        </div>

        {/* Modern Notes Section */}
        <div className="text-center mt-12">
          <p className="text-modern-base text-gray-600 mb-6">Need a custom plan? Contact us for enterprise pricing.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["No credit card required", "Cancel anytime", "14-day free trial"].map((msg, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white transition border border-gray-200/50 shadow-sm hover:shadow-md"
              >
                <Check className="h-3 w-3 text-brand-purple" />
                <span className="text-modern-sm font-medium text-gray-700">{msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
