import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, CalendarCheck } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import FAQ from '@/components/faq';
import { Helmet } from 'react-helmet-async';

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

const PricingPage = () => {
    useEffect(() => {
        AOS.init({ duration: 100 });
    }, []);
    const [billingPeriod, setBillingPeriod] = useState('monthly');
    const plans = billingPeriod === 'monthly' ? monthlyPlans : yearlyPlans;

    const pricingStructuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "FinanceFlow Financial Management Software",
        "description": "Professional financial management software with flexible pricing for businesses of all sizes",
        "brand": {
            "@type": "Brand",
            "name": "FinanceFlow"
        },
        "offers": [
            {
                "@type": "Offer",
                "name": "Starter Plan",
                "price": "0",
                "priceCurrency": "USD",
                "priceValidUntil": "2025-12-31",
                "availability": "https://schema.org/InStock",
                "url": "https://financeflow.com/pricing"
            },
            {
                "@type": "Offer", 
                "name": "Professional Plan",
                "price": "15",
                "priceCurrency": "USD",
                "priceValidUntil": "2025-12-31",
                "availability": "https://schema.org/InStock",
                "url": "https://financeflow.com/pricing"
            },
            {
                "@type": "Offer",
                "name": "Business Plan", 
                "price": "29",
                "priceCurrency": "USD",
                "priceValidUntil": "2025-12-31",
                "availability": "https://schema.org/InStock",
                "url": "https://financeflow.com/pricing"
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/30 via-white to-purple-50/30 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-3 h-3 bg-brand-purple/20 rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
                <div className="absolute bottom-20 right-20 w-4 h-4 bg-brand-tertiary-purple/30 rounded-full animate-bounce" style={{animationDuration: '4s'}}></div>
                <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-purple-400/25 rotate-45 animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-brand-purple/40 rounded-full animate-ping"></div>
            </div>

            <Helmet>
                <title>FinanceFlow Pricing - Affordable Financial Management Plans | Free Trial Available</title>
                <meta name="description" content="Choose the perfect FinanceFlow plan for your business. Start FREE with unlimited invoices, expense tracking, and reporting. Professional plans from $15/month. 14-day free trial on all paid plans. No credit card required." />
                <meta name="keywords" content="financial software pricing, invoice software cost, business accounting plans, small business finance pricing, freelancer invoicing plans, expense tracking pricing, financial management cost, business software pricing" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://financeflow.com/pricing" />
                <meta property="og:title" content="FinanceFlow Pricing - Affordable Financial Management Plans" />
                <meta property="og:description" content="Choose the perfect plan for your business. Start FREE or upgrade to Professional ($15/month) or Business ($29/month). 14-day free trial included." />
                <meta property="og:image" content="https://financeflow.com/images/og-pricing.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://financeflow.com/pricing" />
                <meta property="twitter:title" content="FinanceFlow Pricing - Start Free, Scale Smart" />
                <meta property="twitter:description" content="Transparent pricing for financial management. Start FREE, upgrade when ready. Plans from $15/month with 14-day free trial." />
                <meta property="twitter:image" content="https://financeflow.com/images/twitter-pricing.jpg" />
                
                {/* Additional SEO */}
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://financeflow.com/pricing" />
                
                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(pricingStructuredData)}
                </script>
                
                {/* Marketing Meta Tags */}
                <meta name="price_range" content="$0-$29" />
                <meta name="business_type" content="SaaS" />
                <meta name="target_audience" content="small business, freelancers, startups" />
            </Helmet>

            <Navbar />
            
            {/* Modern Hero Section */}
            <section className="py-20 bg-gradient-to-b from-white/50 to-purple-50/50 backdrop-blur-sm relative z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="max-w-5xl mx-auto text-center py-20 px-6">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 relative inline-block mb-6">
                                Flexible plans for{" "}
                                <span className="bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple bg-clip-text text-transparent animate-gradient bg-300% relative inline-block">
                                    every stage
                                    <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple rounded-full transform scale-x-0 animate-scale-x opacity-80"></div>
                                </span>
                            </h1>
                            <p className="mt-6 text-modern-lg text-gray-600 font-medium max-w-2xl mx-auto">
                                Simple pricing, powerful features — built for every stage of your business journey.
                            </p>

                            <div className="mt-10 flex justify-center flex-wrap gap-6 text-modern-base text-gray-700">
                                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50">
                                    <span className="text-brand-purple text-lg">✓</span>
                                    <span>Reliable and secure platform</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50">
                                    <span className="text-brand-purple text-lg">✓</span>
                                    <span>Zero commitment — leave when you want</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50">
                                    <span className="text-brand-purple text-lg">✓</span>
                                    <span>24/7 online support</span>
                                </div>
                            </div>
                        </div>

                        {/* Modern Toggle */}
                        <div className="inline-flex mt-8 bg-white/80 backdrop-blur-sm rounded-full p-1 border border-gray-200/50 shadow-lg">
                            {["monthly", "yearly"].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setBillingPeriod(period)}
                                    className={`flex items-center gap-2 px-6 py-3 text-modern-sm rounded-full transition-all duration-300 ${
                                        billingPeriod === period
                                            ? "bg-gradient-to-r from-brand-purple to-brand-tertiary-purple text-white shadow-lg transform scale-105"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                                    }`}
                                >
                                    {period === "monthly" ? <Calendar className="w-4 h-4" /> : <CalendarCheck className="w-4 h-4" />}
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

                    {/* Modern Notes */}
                    <div className="text-center mt-16">
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

            {/* Comparison Table */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Feature Comparison</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Starter Plan Card */}
                        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Starter</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Users Included</span>
                                    <span className="text-gray-800">1</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Invoices</span>
                                    <span className="text-gray-800">5/month</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Expense Tracking</span>
                                    <span className="text-gray-800">Basic</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Reports</span>
                                    <span className="text-gray-800">Simple</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Support</span>
                                    <span className="text-gray-800">Email</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Client Portal</span>
                                    <span className="text-gray-800">-</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">API Access</span>
                                    <span className="text-gray-800">-</span>
                                </div>
                            </div>
                        </div>

                        {/* Professional Plan Card */}
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
                            <h3 className="text-xl font-bold text-center text-blue-800 mb-4">Professional</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Users Included</span>
                                    <span className="text-gray-800">3</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Invoices</span>
                                    <span className="text-gray-800">Unlimited</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Expense Tracking</span>
                                    <span className="text-gray-800">Advanced</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Reports</span>
                                    <span className="text-gray-800">Detailed</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Support</span>
                                    <span className="text-gray-800">Priority Email</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Client Portal</span>
                                    <span className="text-gray-800">✔</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">API Access</span>
                                    <span className="text-gray-800">-</span>
                                </div>
                            </div>
                        </div>

                        {/* Business Plan Card */}
                        <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
                            <h3 className="text-xl font-bold text-center text-green-800 mb-4">Business</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Users Included</span>
                                    <span className="text-gray-800">10</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Invoices</span>
                                    <span className="text-gray-800">Unlimited</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Expense Tracking</span>
                                    <span className="text-gray-800">Advanced</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Reports</span>
                                    <span className="text-gray-800">Custom</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Support</span>
                                    <span className="text-gray-800">Priority</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Client Portal</span>
                                    <span className="text-gray-800">✔</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">API Access</span>
                                    <span className="text-gray-800">✔</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Testimonials */}
            <section className="bg-white py-20">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-12">What Our Customers Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                name: "Anita Sharma",
                                role: "Freelancer",
                                feedback: "This tool saved me hours each week. The reporting is super clear!",
                            },
                            {
                                name: "Raj Mehta",
                                role: "Startup Founder",
                                feedback: "We upgraded to Professional and it’s totally worth it. Great support too!",
                            },
                            {
                                name: "Sarah Lee",
                                role: "Finance Manager",
                                feedback: "The Business plan is amazing for teams. We love the API access.",
                            },
                        ].map((testimonial, i) => {
                            const initials = testimonial.name
                                .split(" ")
                                .map((name) => name[0].toUpperCase())
                                .join("");

                            return (
                                <div key={i} className="bg-gray-50 p-8 rounded-xl shadow-xl transform transition-all hover:scale-105">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-20 h-20 bg-gray-300 text-white rounded-full flex items-center justify-center text-2xl font-semibold">
                                            {initials}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 italic mb-4 text-lg">“{testimonial.feedback}”</p>
                                    <div className="font-semibold text-gray-900 text-lg">{testimonial.name}</div>
                                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <FAQ />


            {/* CTA Section */}
            <section className="py-16 bg-brand-purple text-white text-center">
                <h2 className="text-3xl font-semibold mb-4">Ready to get started?</h2>
                <p className="mb-6 text-lg">Create your account today and explore all features free for 14 days.</p>
                <Link to="/signup">
                    <Button className="bg-white text-brand-purple hover:bg-gray-100">Start Free Trial</Button>
                </Link>
            </section>
            <Footer />
        </div>
    );
};

export default PricingPage;
