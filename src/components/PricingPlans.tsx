
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from 'react-router-dom';

const plans = [
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

const PricingPlans = () => {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works best for your business.
            All plans include a 14-day free trial.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-lg overflow-hidden shadow-lg border transition-all ${
                plan.highlight 
                  ? 'border-brand-purple scale-105 shadow-xl' 
                  : 'border-gray-100'
              }`}
            >
              {plan.highlight && (
                <div className="bg-brand-purple text-white py-2 px-4 text-center text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "Free" && <span className="text-gray-600">/month</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <Link to="/signup" className="w-full">
                  <Button 
                    variant={plan.buttonVariant as "outline" | "default"}
                    className={`w-full ${plan.highlight ? 'bg-brand-purple hover:bg-brand-tertiary-purple' : ''}`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>
              
              <div className="border-t border-gray-100 p-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="mr-2 mt-1">
                        <Check className="h-4 w-4 text-brand-purple" />
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need a custom plan? Contact us for enterprise pricing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
              <Check className="h-4 w-4 text-brand-purple" />
              <span className="text-sm">No credit card required</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
              <Check className="h-4 w-4 text-brand-purple" />
              <span className="text-sm">Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
              <Check className="h-4 w-4 text-brand-purple" />
              <span className="text-sm">14-day free trial</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
