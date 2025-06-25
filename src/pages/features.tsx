import React from 'react';
import {
    BarChart3,
    FileText,
    FileMinus,
    BarChart,
    Users,
    Settings,
    CheckCircle,
    Zap,
    HelpCircle,
    Sparkles,
    Star,
    ArrowRight
} from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from "framer-motion";
import { Helmet } from 'react-helmet-async';

const tools = [
    { icon: "🟣", name: "Stripe" },
    { icon: "🔵", name: "PayPal" },
    { icon: "🟢", name: "QuickBooks" },
    { icon: "🟡", name: "Google Sheets" },
    { icon: "🔴", name: "Slack" },
];

const rotateIn = {
    hidden: { opacity: 0, rotate: -90, scale: 0.7 },
    visible: (i: number) => ({
        opacity: 1,
        rotate: 0,
        scale: 1,
        transition: {
            delay: i * 0.1,
            duration: 0.8,
            ease: "easeOut",
        },
    }),
};

const features = [
    {
        icon: BarChart3,
        title: "Interactive Dashboard",
        description: "Track income, overdue invoices, and expense trends with intuitive charts and real-time summaries.",
        tag: "Overview"
    },
    {
        icon: FileText,
        title: "Smart Invoicing",
        description: "Generate professional invoices, set auto-reminders, and receive payments seamlessly.",
        tag: "Billing"
    },
    {
        icon: FileMinus,
        title: "Expense Tracking",
        description: "Capture, categorize, and store all your expenses digitally — with receipt uploads and analytics.",
        tag: "Spending"
    },
    {
        icon: BarChart,
        title: "Insightful Reports",
        description: "Get auto-generated reports for P&L, taxes, and cash flow — export them anytime.",
        tag: "Analytics"
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description: "Grant permission-based access to staff and accountants. Keep things streamlined.",
        tag: "Collaboration"
    },
    {
        icon: Settings,
        title: "Custom Configuration",
        description: "Set your currency, tax rules, invoice design, and business profile — all from one place.",
        tag: "Settings"
    }
];

const FeaturesPage = () => {
    const featuresStructuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "FinanceFlow Features",
        "applicationCategory": "BusinessApplication",
        "description": "Comprehensive financial management features including invoicing, expense tracking, reporting, team collaboration, and integrations.",
        "featureList": [
            "Interactive Dashboard with Real-time Analytics",
            "Professional Invoice Generation & Management", 
            "Automated Expense Tracking with Receipt Upload",
            "Advanced Financial Reporting & P&L Statements",
            "Team Collaboration with Permission Management",
            "Custom Business Configuration & Tax Settings",
            "Integration with Popular Business Tools",
            "24/7 Customer Support"
        ],
        "operatingSystem": "Web",
        "url": "https://financeflow.com/features",
        "screenshot": "https://financeflow.com/images/dashboard-screenshot.png",
        "softwareVersion": "2.0",
        "releaseNotes": "Enhanced reporting features and new integrations"
    };

    return (
        <main className="bg-gradient-to-b from-white via-purple-50/30 to-white text-gray-800 overflow-hidden">
            <Helmet>
                <title>FinanceFlow Features - Complete Financial Management Tools for Modern Businesses</title>
                <meta name="description" content="Explore FinanceFlow's powerful features: Interactive dashboards, smart invoicing, expense tracking, financial reporting, team collaboration, and integrations. Everything you need to manage business finances efficiently." />
                <meta name="keywords" content="financial management features, invoice software features, expense tracking tools, business dashboard, financial reporting, team collaboration, business integrations, accounting software features, cash flow management" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://financeflow.com/features" />
                <meta property="og:title" content="FinanceFlow Features - Complete Financial Management Toolkit" />
                <meta property="og:description" content="Discover all the powerful features that make FinanceFlow the #1 choice for business financial management. From smart invoicing to advanced reporting." />
                <meta property="og:image" content="https://financeflow.com/images/og-features.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://financeflow.com/features" />
                <meta property="twitter:title" content="FinanceFlow Features - Everything You Need for Business Finance" />
                <meta property="twitter:description" content="Explore comprehensive features: Smart invoicing, expense tracking, financial reporting, team tools, and integrations. See why 10,000+ businesses choose FinanceFlow." />
                <meta property="twitter:image" content="https://financeflow.com/images/twitter-features.jpg" />
                
                {/* Additional SEO */}
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://financeflow.com/features" />
                
                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(featuresStructuredData)}
                </script>
                
                {/* Feature-specific Meta Tags */}
                <meta name="software_type" content="Financial Management Software" />
                <meta name="primary_features" content="invoicing, expense tracking, reporting, dashboard, team collaboration" />
                <meta name="integration_support" content="Stripe, PayPal, QuickBooks, Google Sheets, Slack" />
                <meta name="target_users" content="freelancers, small businesses, startups, agencies" />
            </Helmet>

            <Navbar />
            
            {/* Modern Hero */}
            <section className="py-20 bg-gradient-to-b from-purple-50/30 via-white/50 to-white text-center relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-20 w-3 h-3 bg-brand-purple/20 rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
                    <div className="absolute bottom-40 right-20 w-4 h-4 bg-brand-tertiary-purple/30 rounded-full animate-bounce" style={{animationDuration: '4s'}}></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-purple/15 via-white/70 to-brand-tertiary-purple/15 px-6 py-3 rounded-full border border-brand-purple/30 mb-6 backdrop-blur-lg shadow-lg">
                        <Star className="h-5 w-5 text-brand-purple animate-pulse" />
                        <span className="text-modern-base font-black text-brand-purple tracking-wide">Powerful Features</span>
                    </div>
                    <h1 className="text-responsive-4xl md:text-responsive-5xl font-black mb-4 leading-tight">
                        Everything You Need to Run Your Finances 
                        <span className="block bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple bg-clip-text text-transparent">Smoothly</span>
                    </h1>
                    <p className="text-modern-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        From invoicing to insights, we've built the all-in-one tool for freelancers, teams, and small businesses.
                    </p>
                </div>
            </section>

            {/* Modern Feature Cards */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="group bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200/50 shadow-xl p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105"
                            >
                                <div className="relative mb-6">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-brand-purple/20 to-brand-tertiary-purple/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple/15 via-white/80 to-brand-tertiary-purple/15 border border-brand-purple/30 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                        <f.icon className="w-8 h-8 text-brand-purple" />
                                    </div>
                                </div>

                                <h3 className="text-modern-xl font-black text-gray-800 mb-2 group-hover:text-brand-purple transition-colors duration-300">{f.title}</h3>
                                {f.tag && (
                                    <span className="inline-block mb-3 text-modern-xs font-bold text-brand-purple bg-brand-purple/10 px-3 py-1 rounded-full border border-brand-purple/20">
                                        {f.tag}
                                    </span>
                                )}
                                <p className="text-gray-600 text-modern-sm leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modern Use Cases */}
            <section className="py-16 bg-gradient-to-b from-blue-50/30 to-white relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-1/4 w-[300px] h-[300px] bg-gradient-to-r from-brand-purple/5 to-brand-tertiary-purple/5 rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-responsive-4xl font-black text-gray-900 mb-3 tracking-tight">
                            Use Cases
                        </h2>
                        <p className="text-modern-lg text-gray-600 leading-relaxed">
                            Whether you're freelancing or scaling a company, our platform adapts to your financial needs—making it easier to stay organized and focused.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Freelancers tracking payments and invoices",
                                desc: "Easily manage client payments, send invoices, and monitor income in one place.",
                            },
                            {
                                title: "Startups automating financial reporting",
                                desc: "Save time with automated reports and clear insights to guide your financial decisions.",
                            },
                            {
                                title: "Agencies managing team expenses and billing",
                                desc: "Handle team-based expenses, bill clients efficiently, and stay on top of cash flow.",
                            },
                        ].map(({ title, desc }, i) => (
                            <div
                                key={i}
                                className="group bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-gray-200/50 flex items-start gap-4 hover:shadow-2xl transition-all duration-500 hover:scale-105"
                            >
                                <div className="mt-1">
                                    <div className="w-8 h-8 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        ✓
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-modern-lg font-black text-gray-800 mb-2 group-hover:text-brand-purple transition-colors duration-300">{title}</h3>
                                    <p className="text-gray-600 text-modern-sm leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modern Why Choose Us */}
            <section className="py-16 bg-gradient-to-b from-gray-50/30 to-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-responsive-3xl font-black mb-10 text-gray-900">Why Choose Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            "Lightning-fast setup — get started in minutes.",
                            "Built-in automation saves hours each week.",
                            "Affordable pricing with powerful features."
                        ].map((benefit, i) => (
                            <div key={i} className="group flex items-start gap-4 p-6 bg-white/90 backdrop-blur-lg shadow-xl rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-100/50">
                                <div className="relative">
                                    <CheckCircle className="text-green-500 w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <p className="text-modern-lg font-bold text-gray-800 leading-relaxed text-left">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modern Comparison Chart */}
            <section className="py-16 bg-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-responsive-3xl font-black mb-8 text-gray-900">How We Compare</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full max-w-full mx-auto text-left table-auto border-separate shadow-2xl rounded-2xl overflow-hidden">
                            <thead>
                                <tr className="bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple text-white">
                                    <th className="py-4 px-6 text-modern-lg font-bold uppercase tracking-wider">
                                        Feature
                                    </th>
                                    <th className="py-4 px-6 text-modern-lg font-bold uppercase tracking-wider">
                                        Our App
                                    </th>
                                    <th className="py-4 px-6 text-modern-lg font-bold uppercase tracking-wider">
                                        Competitor A
                                    </th>
                                    <th className="py-4 px-6 text-modern-lg font-bold uppercase tracking-wider">
                                        Competitor B
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="text-gray-800">
                                {[
                                    ["Unlimited Invoices", "✔", "✖", "✔"],
                                    ["Custom Roles", "✔", "✖", "✖"],
                                    ["Free Tier", "✔", "✖", "✖"],
                                    ["Real-Time Insights", "✔", "✔", "✖"],
                                ].map(([label, ours, a, b], i) => (
                                    <tr key={i} className="border-t border-gray-200 hover:bg-gray-50/50 transition duration-200">
                                        <td className="py-4 px-6 font-bold border-b border-gray-200 text-modern-base">
                                            {label}
                                        </td>
                                        <td className="py-4 px-6 text-center text-green-600 font-black border-b border-gray-200 text-modern-lg">
                                            {ours}
                                        </td>
                                        <td className="py-4 px-6 text-center text-red-500 font-black border-b border-gray-200 text-modern-lg">
                                            {a}
                                        </td>
                                        <td className="py-4 px-6 text-center text-red-500 font-black border-b border-gray-200 text-modern-lg">
                                            {b}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Modern Visual Walkthrough */}
            <section className="py-16 bg-gradient-to-b from-gray-50/30 to-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-responsive-4xl font-black text-gray-800 mb-10">Visual Walkthrough</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {["Dashboard Overview", "Create Invoices", "Expense Uploads"].map((label, i) => (
                            <div
                                key={i}
                                className="group bg-white/90 backdrop-blur-lg border-2 border-gray-200/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                            >
                                <div className="h-48 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 rounded-2xl mb-4 flex items-center justify-center group-hover:from-brand-purple/10 group-hover:to-brand-tertiary-purple/10 transition-all duration-500">
                                    <Sparkles className="h-12 w-12 text-gray-400 group-hover:text-brand-purple transition-colors duration-500" />
                                </div>
                                <h4 className="font-black text-modern-xl text-gray-800 mb-2 group-hover:text-brand-purple transition-colors duration-300">{label}</h4>
                                <p className="text-modern-sm text-gray-600">A quick look at how this works in action.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modern Integrations */}
            <section className="py-16 bg-white text-center">
                <motion.h2
                    className="text-responsive-3xl font-black mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    Works with Tools You Already Use
                </motion.h2>

                <div className="flex justify-center flex-wrap gap-4 text-gray-700 text-modern-lg">
                    {tools.map((tool, i) => (
                        <motion.span
                            key={tool.name}
                            className="px-5 py-3 bg-gray-100/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-white hover:shadow-lg"
                            variants={rotateIn}
                            initial="hidden"
                            animate="visible"
                            custom={i}
                        >
                            <span className="text-modern-xl">{tool.icon}</span>
                            <span className="ml-2 font-bold">{tool.name}</span>
                        </motion.span>
                    ))}
                </div>
            </section>

            {/* Modern Support */}
            <section className="py-16 bg-gradient-to-b from-gray-50/30 to-white text-center">
                <h2 className="text-responsive-4xl font-black text-gray-800 mb-4">
                    Customer Support That Cares
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-modern-lg leading-relaxed">
                    Our support team is available 24/7 — whether you prefer chat, email, or phone, we've got your back.
                </p>

                <div className="flex justify-center gap-8 flex-wrap">
                    {[
                        ["Live Chat", Zap],
                        ["Help Center", HelpCircle],
                        ["Email Support", CheckCircle]
                    ].map(([label, Icon], i) => (
                        <div
                            key={i}
                            className="group flex flex-col items-center bg-white/90 backdrop-blur-lg p-6 rounded-3xl shadow-xl w-56 hover:scale-105 transition-all duration-500 border border-gray-100/50"
                        >
                            <div className="mb-4 p-4 bg-gradient-to-br from-brand-purple/15 via-white/80 to-brand-tertiary-purple/15 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <Icon className="w-10 h-10 text-brand-purple" />
                            </div>
                            <h3 className="font-black text-modern-xl text-gray-800 group-hover:text-brand-purple transition-colors duration-300">
                                {typeof label === 'string' ? label : null}
                            </h3>
                            <p className="text-gray-500 mt-2 text-modern-sm">Quick, easy, and reliable support when you need it most.</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modern CTA */}
            <section className="py-12 bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/90 to-brand-tertiary-purple/90"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-responsive-3xl font-black mb-3">Start for Free — Upgrade Anytime</h2>
                    <p className="mb-6 max-w-xl mx-auto text-modern-lg leading-relaxed">
                        Join thousands of small businesses simplifying their finances with our all-in-one tool.
                    </p>
                    <a
                        href="/signup"
                        className="group inline-flex items-center gap-2 bg-white text-brand-purple font-bold py-4 px-8 rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                        Try It Now
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </a>
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default FeaturesPage;
