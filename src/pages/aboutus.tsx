
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
    const aboutStructuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "FinanceFlow",
        "url": "https://financeflow.com",
        "logo": "https://financeflow.com/images/logo.png",
        "description": "FinanceFlow revolutionizes financial management for small businesses with intelligent automation, reducing manual tasks and improving efficiency.",
        "foundingDate": "2023",
        "founder": {
            "@type": "Person",
            "name": "Sarah Nelson"
        },
        "numberOfEmployees": "6-10",
        "industry": "Financial Technology",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "US"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "url": "https://financeflow.com/contact"
        },
        "sameAs": [
            "https://twitter.com/financeflow",
            "https://linkedin.com/company/financeflow",
            "https://facebook.com/financeflow"
        ]
    };

    return (
        <main className="bg-gradient-to-b from-white to-purple-50 text-gray-800">
            <Helmet>
                <title>About FinanceFlow - Meet the Team Behind Smart Financial Management Software</title>
                <meta name="description" content="Discover FinanceFlow's mission to revolutionize small business financial management. Meet our expert team of engineers, designers, and financial technology specialists building the future of automated business finance." />
                <meta name="keywords" content="about financeflow, financial software company, business automation team, fintech startup, small business solutions, financial management experts, company mission, team, financial technology leadership" />
                
                {/* Open Graph / Facebook - Page Specific */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://financeflow.com/aboutus" />
                <meta property="og:title" content="About FinanceFlow - The Team Revolutionizing Business Financial Management" />
                <meta property="og:description" content="Meet the passionate team behind FinanceFlow's intelligent financial automation platform. Learn how we're helping over 10,000 small businesses streamline their finances and focus on growth." />
                <meta property="og:image" content="https://financeflow.com/images/about-team-hero.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="FinanceFlow team working together on financial management software innovation" />
                <meta property="og:site_name" content="FinanceFlow" />
                <meta property="og:locale" content="en_US" />
                
                {/* Twitter - Page Specific */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://financeflow.com/aboutus" />
                <meta property="twitter:title" content="About FinanceFlow - Building the Future of Business Finance Technology" />
                <meta property="twitter:description" content="Meet our team of financial technology experts dedicated to simplifying business financial management through intelligent automation and user-focused design." />
                <meta property="twitter:image" content="https://financeflow.com/images/about-twitter-card.jpg" />
                <meta property="twitter:image:alt" content="FinanceFlow leadership team and company mission overview" />
                <meta property="twitter:creator" content="@financeflow" />
                <meta property="twitter:site" content="@financeflow" />
                
                {/* Additional SEO */}
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
                <meta name="googlebot" content="index, follow" />
                <link rel="canonical" href="https://financeflow.com/aboutus" />
                
                {/* Page-specific structured data */}
                <script type="application/ld+json">
                    {JSON.stringify(aboutStructuredData)}
                </script>
                
                {/* About page specific meta tags */}
                <meta name="company" content="FinanceFlow" />
                <meta name="industry" content="Financial Technology" />
                <meta name="founded" content="2023" />
                <meta name="company_size" content="6-10 employees" />
                <meta name="company_type" content="Private" />
                <meta name="headquarters" content="United States" />
                
                {/* Business/Company specific meta */}
                <meta name="business_model" content="SaaS" />
                <meta name="target_market" content="Small Business, Freelancers, Startups" />
                <meta name="funding_stage" content="Seed" />
                
                {/* LinkedIn specific */}
                <meta property="linkedin:owner" content="financeflow-company" />
                
                {/* Additional marketing meta */}
                <meta name="theme-color" content="#8B5CF6" />
                <meta name="apple-mobile-web-app-title" content="FinanceFlow About" />
                
                {/* Rich snippets for About page */}
                <meta itemProp="name" content="About FinanceFlow - Financial Management Software Company" />
                <meta itemProp="description" content="Learn about FinanceFlow's mission, team, and vision for revolutionizing small business financial management through intelligent automation." />
                <meta itemProp="image" content="https://financeflow.com/images/about-page-hero.jpg" />
                
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
                                "name": "About Us",
                                "item": "https://financeflow.com/aboutus"
                            }
                        ]
                    })}
                </script>
            </Helmet>

            <Navbar />
            {/* Hero */}
            <section className="py-20 text-center animate-fade-up">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">About FinanceFlow</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        FinanceFlow is more than just software — we're your financial automation ally. Discover who we are, why we build, and how we help businesses grow.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-2 gap-12">
                    <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition animate-fade-up">
                        <h3 className="text-2xl font-bold text-brand-purple mb-4">Our Mission</h3>
                        <p className="text-gray-700 leading-relaxed">
                            To revolutionize financial management using intelligent automation — reducing manual tasks, improving efficiency, and enabling businesses to focus on what matters most: growth and innovation.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition animate-fade-up delay-100">
                        <h3 className="text-2xl font-bold text-brand-purple mb-4">Our Vision</h3>
                        <p className="text-gray-700 leading-relaxed">
                            To become the most trusted financial automation platform, empowering businesses of all sizes to manage finances, track performance, and scale operations — securely and seamlessly.
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
                        A diverse team of creators, engineers, and problem-solvers who are passionate about building the future of financial technology and business automation.
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
                    <h3 className="text-3xl font-bold mb-4 animate-fade-up">Let's Build Something Together</h3>
                    <p className="text-lg mb-8 animate-fade-up delay-100">We're always open to collaboration, feedback, or just a quick hello.</p>
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
