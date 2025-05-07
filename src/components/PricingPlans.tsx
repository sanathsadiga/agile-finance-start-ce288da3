
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
    <section id="pricing" className="py-20 bg-gradient-to-b from-purple-50 to-white">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Simple, Transparent Pricing</h2>
      <p className="text-lg text-gray-600 max-w-xl mx-auto">
        Choose the plan that fits your business. All come with a 14-day free trial.
      </p>

      {/* Toggle */}
      <div className="inline-flex mt-8 bg-gray-100 rounded-full p-1">
        {["monthly", "yearly"].map((period) => (
          <button
            key={period}
            onClick={() => setBillingPeriod(period)}
            className={`px-6 py-2 text-sm rounded-full transition-all ${
              billingPeriod === period
                ? "bg-brand-purple text-white shadow-md"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {period === "monthly" ? "Monthly" : "Yearly (Save 15%)"}
          </button>
        ))}
      </div>
    </div>

    {/* Pricing Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {plans.map((plan, idx) => (
        <div
          key={idx}
          className={`flex flex-col rounded-2xl border border-gray-200 shadow-lg overflow-hidden relative ${
            plan.highlight
              ? "bg-white/70 backdrop-blur-md ring-2 ring-brand-purple"
              : "bg-white"
          }`}
        >
          {plan.highlight && (
            <span className="absolute top-0 left-0 bg-brand-purple text-white text-xs font-semibold px-4 py-1 rounded-br-xl">
              Most Popular
            </span>
          )}

          <div className="p-6 flex-grow">
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
              {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
            </div>
            <p className="text-gray-600 mb-6">{plan.description}</p>

            <Link to="/signup" className="block mt-auto">
              <Button
                variant={plan.buttonVariant as "default" | "outline"}
                className={`w-full ${plan.highlight ? "bg-brand-purple text-white hover:bg-brand-tertiary-purple" : ""}`}
              >
                {plan.buttonText}
              </Button>
            </Link>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 p-6">
            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start text-sm text-gray-700">
                  <Check className="w-4 h-4 text-brand-purple mr-2 mt-1" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>

    {/* Notes */}
    <div className="text-center mt-12">
      <p className="text-gray-600 mb-4">Need a custom plan? Contact us for enterprise pricing.</p>
      <div className="flex flex-wrap justify-center gap-4">
        {["No credit card required", "Cancel anytime", "14-day free trial"].map((msg, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition"
          >
            <Check className="h-4 w-4 text-brand-purple" />
            <span className="text-sm">{msg}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

  );
  
};

export default PricingPlans;
