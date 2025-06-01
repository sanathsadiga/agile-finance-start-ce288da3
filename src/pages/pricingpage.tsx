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

    return (
        <div className="bg-white">
            <Navbar />
            {/* Hero Section */}
            <section id="pricing" className="py-20 bg-gradient-to-b from-purple-50 to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="max-w-5xl mx-auto text-center py-20 px-6">
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 relative inline-block">
                                Flexible plans for  <span className="text-primary relative inline-block">
                                    every stage
                                    <svg
                                        className="absolute bottom-0 left-0 w-full h-6"
                                        viewBox="0 0 300 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            d="M0 18 C 50 20, 250 0, 300 18"
                                            stroke="#00BFF3"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            d="M0 20 C 50 22, 250 2, 300 20"
                                            stroke="#00BFF3"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                    </svg>



                                </span>
                            </h2>
                            <p className="mt-6 text-lg sm:text-xl text-gray-600 font-medium">
                                Simple pricing, powerful features — built for every stage.
                            </p>

                            <div className="mt-10 flex justify-center flex-wrap gap-8 text-base sm:text-lg text-gray-800">
    <div className="flex items-center gap-3 text-gray-700">
        <span className="text-primary text-xl">✓</span>
        <span>Reliable and secure platform</span>
    </div>
    <div className="flex items-center gap-3 text-gray-700">
        <span className="text-primary text-xl">✓</span>
        <span>Zero commitment — leave when you want</span>
    </div>
    <div className="flex items-center gap-3 text-gray-700">
        <span className="text-primary text-xl">✓</span>
        <span>24/7 online support</span>
    </div>
</div>

                        </div>



                        {/* Toggle */}
                        <div className="inline-flex mt-8 bg-gray-100 rounded-full p-1">
                            {["monthly", "yearly"].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setBillingPeriod(period)}
                                    className={`flex items-center gap-2 px-6 py-2 text-sm rounded-full transition-all ${billingPeriod === period
                                        ? "bg-brand-purple text-white shadow-md"
                                        : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    {period === "monthly" ? <Calendar className="w-4 h-4" /> : <CalendarCheck className="w-4 h-4" />}
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
                                className={`flex flex-col transition-all transform hover:scale-105 duration-300 ease-in-out rounded-2xl shadow-lg overflow-hidden relative ${plan.highlight ? "bg-gradient-to-r from-purple-100 to-purple-50 ring-2 ring-brand-purple" : "bg-white"}`}
                            >
                                {plan.highlight && (
                                    <span className="absolute top-0 left-0 bg-gradient-to-r from-purple-500 to-purple-700 text-white text-xs font-semibold px-6 py-2 rounded-br-xl shadow-lg">
                                        Most Popular
                                    </span>
                                )}

                                <div className="p-8 flex-grow flex flex-col">
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline mb-4">
                                        <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                                        {plan.period && <span className="text-gray-500 ml-2 text-xl">{plan.period}</span>}
                                    </div>
                                    <p className="text-gray-700 mb-6 text-lg">{plan.description}</p>

                                    <Link to="/signup" className="block mt-auto">
                                        <Button
                                            variant={plan.buttonVariant as "default" | "outline"}
                                            className={`w-full py-3 text-lg font-semibold rounded-md ${plan.highlight ? "bg-brand-purple text-white hover:bg-brand-tertiary-purple" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                                        >
                                            {plan.buttonText}
                                        </Button>
                                    </Link>
                                </div>

                                <div className="border-t border-gray-100 bg-gray-50 p-6">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center text-sm text-gray-700">
                                                <Check className="w-5 h-5 text-brand-purple mr-3" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Notes */}
                    <div className="text-center mt-16">
                        <p className="text-lg text-gray-700 mb-6 font-medium">Need a custom plan? Contact us for enterprise pricing.</p>
                        <div className="flex flex-wrap justify-center gap-6">
                            {["No credit card required", "Cancel anytime", "14-day free trial"].map((msg, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-3 rounded-full shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    <Check className="h-5 w-5 text-brand-purple" />
                                    <span className="text-base font-semibold text-gray-800">{msg}</span>
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
