import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const teamMembers = [
    { name: "Sarah Nelson", role: "Founder & CEO", initial: "S" },
    { name: "James Patel", role: "CTO", initial: "J" },
    { name: "Leah Matthews", role: "Lead Designer", initial: "L" },
    { name: "Ravi Kumar", role: "Engineering Lead", initial: "R" },
    { name: "Emily Tan", role: "Marketing Head", initial: "E" },
    { name: "Ankit Sharma", role: "Customer Success", initial: "A" },
];

export default function AboutUsPage() {
    return (
        <main className="bg-gradient-to-b from-white to-purple-50 text-gray-800">
            <Helmet>
                <title>FinanceFlow - Simplify Your Financial Management</title>
                <meta name="description" content="Take control of your business finances with our all-in-one platform for invoicing, expense tracking, and financial insights." />
                <meta name="keywords" content="finance, invoicing, expense tracking, small business, financial management" />
                <meta property="og:title" content="FinanceFlow - About us" />
                <meta property="og:description" content="Take control of your business finances with our all-in-one platform for invoicing, expense tracking, and financial insights." />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://financeflow.com/aboutus" />
            </Helmet>
            <Navbar />
            {/* Hero */}
            <section className="py-20 text-center animate-fade-up">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">About Us</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Zigment is more than just software — we’re your automation ally. Discover who we are, why we build, and how we help businesses grow.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-2 gap-12">
                    <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition animate-fade-up">
                        <h3 className="text-2xl font-bold text-brand-purple mb-4">Our Mission</h3>
                        <p className="text-gray-700 leading-relaxed">
                            To revolutionize lead conversion using intelligent automation — reducing manual tasks, improving efficiency, and enabling businesses to focus on what matters.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition animate-fade-up delay-100">
                        <h3 className="text-2xl font-bold text-brand-purple mb-4">Our Vision</h3>
                        <p className="text-gray-700 leading-relaxed">
                            To become the most trusted automation platform, empowering teams of all sizes to convert, communicate, and grow at scale — securely and seamlessly.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-16 text-center bg-white animate-fade-up">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">What Drives Us</h2>
                    <p className="text-gray-600 max-w-xl mx-auto mb-12">
                        These values guide our decisions, shape our culture, and define how we serve our customers.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {["Trust & Transparency", "Innovation with Purpose", "User-First Thinking", "Security & Integrity", "Simplicity", "Sustainable Growth"].map((value, idx) => (
                            <div key={idx} className="bg-gray-100 rounded-xl p-6 hover:bg-gray-200 transition">
                                <Check className="w-5 h-5 text-brand-purple mb-2" />
                                <p className="text-sm font-medium text-gray-700">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-up">Meet Our Team</h2>
                    <p className="text-gray-600 max-w-xl mx-auto mb-12 animate-fade-up">
                        A diverse team of creators, engineers, and problem-solvers who are passionate about building the future of AI-driven automation.
                    </p>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto animate-fade-up delay-100">
                        {teamMembers.map((member, idx) => (
                            <div
                                key={idx}
                                className="text-center bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
                            >
                                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-brand-purple to-brand-tertiary-purple flex items-center justify-center text-white text-2xl font-bold">
                                    {member.initial}
                                </div>
                                <h4 className="mt-4 text-lg font-semibold text-gray-900">{member.name}</h4>
                                <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple text-white text-center">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl font-bold mb-4 animate-fade-up">Let’s Build Something Together</h3>
                    <p className="text-lg mb-8 animate-fade-up delay-100">We’re always open to collaboration, feedback, or just a quick hello.</p>
                    <Link to="/contact">
                        <button className="bg-white text-brand-purple px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-100 transition animate-fade-up delay-200">
                            Contact Us
                        </button>
                    </Link>
                </div>
            </section>
            <Footer />
        </main>
    );
}
