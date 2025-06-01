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
    HelpCircle
} from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from "framer-motion";

const tools = [
    { icon: "🟣", name: "Stripe" },
    { icon: "🔵", name: "PayPal" },
    { icon: "🟢", name: "QuickBooks" },
    { icon: "🟡", name: "Google Sheets" },
    { icon: "🔴", name: "Slack" },
];


// Fluid rotate and scale effect
const rotateIn = {
    hidden: { opacity: 0, rotate: -90, scale: 0.7 }, // Slightly smaller and rotated
    visible: (i: number) => ({
        opacity: 1,
        rotate: 0, // Rotate to 0 degrees
        scale: 1,  // Scale to full size
        transition: {
            delay: i * 0.1, // Delay each item's appearance for a staggered effect
            duration: 0.8, // Longer duration for smooth entry
            ease: "easeOut", // Smooth easing to settle the animation
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

const FeatureCard = ({ Icon, title, description, tag }) => (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition duration-300">
        <div className="flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-5">
            <Icon className="text-brand-purple w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <span className="inline-block text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            {tag}
        </span>
    </div>
);

const FeaturesPage = () => {
    return (
        <main className="bg-white text-gray-800">
            <Navbar />
            {/* Hero */}
            <section className="py-24 bg-gradient-to-b from-purple-50 via-white to-white text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Everything You Need to Run Your Finances Smoothly
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        From invoicing to insights, we've built the all-in-one tool for freelancers, teams, and small businesses.
                    </p>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="py-20 bg-gradient-to-b ">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition"
                            >
                                {/* Icon circle */}
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-brand-purple mb-4">
                                    <f.icon className="w-6 h-6" />
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{f.title}</h3>
                                {f.tag && (
                                    <span className="inline-block mb-2 text-xs font-medium text-brand-purple bg-blue-50 px-2 py-1 rounded">
                                        {f.tag}
                                    </span>
                                )}
                                <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Use Cases */}

            <section className="py-24 bg-blue-50">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Centered Header and Subtext */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Use Cases
                        </h2>
                        <p className="text-lg text-gray-600">
                            Whether you're freelancing or scaling a company, our platform adapts to your financial needs—making it easier to stay organized and focused.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-10">
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
                                className="bg-white rounded-xl shadow p-6 border border-gray-200 flex items-start gap-4"
                            >
                                <div className="mt-1">
                                    <div className="w-6 h-6 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold">
                                        ✓
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Why Choose Us */}
            <section className="py-24 bg-gray-50 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-gray-900">Why Choose Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            "Lightning-fast setup — get started in minutes.",
                            "Built-in automation saves hours each week.",
                            "Affordable pricing with powerful features."
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-start gap-6 p-8 bg-white shadow-lg rounded-xl transition-transform hover:scale-105 hover:shadow-2xl">
                                <CheckCircle className="text-green-500 w-8 h-8" />
                                <p className="text-lg font-medium text-gray-800">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Comparison Chart */}
            <section className="py-24 bg-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-10 text-gray-900">How We Compare</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full max-w-full mx-auto text-left table-auto border-separate shadow-lg rounded-lg">
                            <thead>
                                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                                    <th className="py-6 px-8 text-lg font-semibold uppercase tracking-wider">
                                        Feature
                                    </th>
                                    <th className="py-6 px-8 text-lg font-semibold uppercase tracking-wider">
                                        Our App
                                    </th>
                                    <th className="py-6 px-8 text-lg font-semibold uppercase tracking-wider">
                                        Competitor A
                                    </th>
                                    <th className="py-6 px-8 text-lg font-semibold uppercase tracking-wider">
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
                                    <tr key={i} className="border-t border-gray-200 hover:bg-gray-50 transition duration-200">
                                        <td className="py-6 px-8 font-medium border-b border-gray-200">
                                            {label}
                                        </td>
                                        <td className="py-6 px-8 text-center text-green-600 font-semibold border-b border-gray-200">
                                            {ours}
                                        </td>
                                        <td className="py-6 px-8 text-center text-red-500 font-semibold border-b border-gray-200">
                                            {a}
                                        </td>
                                        <td className="py-6 px-8 text-center text-red-500 font-semibold border-b border-gray-200">
                                            {b}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>



            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-12">Visual Walkthrough</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        {["Dashboard Overview", "Create Invoices", "Expense Uploads"].map((label, i) => (
                            <div
                                key={i}
                                className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="h-56 bg-gray-200 rounded-lg mb-6"></div>
                                <h4 className="font-semibold text-xl text-gray-800 mb-2">{label}</h4>
                                <p className="text-sm text-gray-600">A quick look at how this works in action.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Integrations */}
            <section className="py-24 bg-white text-center">
                <motion.h2
                    className="text-3xl font-bold mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    Works with Tools You Already Use
                </motion.h2>

                <div className="flex justify-center flex-wrap gap-6 text-gray-700 text-lg">
                    {tools.map((tool, i) => (
                        <motion.span
                            key={tool.name}
                            className="px-6 py-4 bg-gray-100 rounded-full flex items-center justify-center transition-all"
                            variants={rotateIn}
                            initial="hidden"
                            animate="visible"
                            custom={i}
                        >
                            <span className="text-xl">{tool.icon}</span>
                            <span className="ml-2 font-semibold">{tool.name}</span>
                        </motion.span>
                    ))}
                </div>
            </section>

            {/* Support */}
            <section className="py-24 bg-gray-50 text-center">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
                    Customer Support That Cares
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
                    Our support team is available 24/7 — whether you prefer chat, email, or phone, we’ve got your back.
                </p>

                <div className="flex justify-center gap-12 flex-wrap">
                    {[
                        ["Live Chat", Zap],
                        ["Help Center", HelpCircle],
                        ["Email Support", CheckCircle]
                    ].map(([label, Icon], i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg w-56 hover:scale-105 transition-all"
                        >
                            <div className="mb-4 p-4 bg-indigo-100 rounded-full">
                                <Icon className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h3 className="font-semibold text-xl text-gray-800">
                                {typeof label === 'string' ? label : null}
                            </h3>
                            <p className="text-gray-500 mt-2">Quick, easy, and reliable support when you need it most.</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-brand-purple text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Start for Free — Upgrade Anytime</h2>
                <p className="mb-6 max-w-xl mx-auto">
                    Join thousands of small businesses simplifying their finances with our all-in-one tool.
                </p>
                <a
                    href="/signup"
                    className="bg-white text-brand-purple font-semibold py-3 px-6 rounded-md hover:bg-gray-100 transition"
                >
                    Try It Now
                </a>
            </section>
            <Footer />
        </main>
    );
};

export default FeaturesPage;
