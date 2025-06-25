import { Link } from "react-router-dom";
import { Check, Sparkles, Zap, ArrowRight, Heart } from "lucide-react";
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
        <main className="bg-gradient-to-b from-white via-purple-50/30 to-white text-gray-800 overflow-hidden">
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
            
            {/* Modern Hero */}
            <section className="py-16 text-center animate-fade-up relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-20 w-3 h-3 bg-brand-purple/20 rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
                    <div className="absolute bottom-40 right-20 w-4 h-4 bg-brand-tertiary-purple/30 rounded-full animate-bounce" style={{animationDuration: '4s'}}></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-purple/15 via-white/70 to-brand-tertiary-purple/15 px-6 py-3 rounded-full border border-brand-purple/30 mb-6 backdrop-blur-lg shadow-lg">
                        <Heart className="h-5 w-5 text-brand-purple animate-pulse" />
                        <span className="text-modern-base font-black text-brand-purple tracking-wide">About Our Journey</span>
                    </div>
                    <h1 className="text-responsive-4xl md:text-responsive-5xl font-black text-gray-900 mb-4 leading-tight">About FinanceFlow</h1>
                    <p className="text-modern-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        FinanceFlow is more than just software — we're your financial automation ally. Discover who we are, why we build, and how we help businesses grow.
                    </p>
                </div>
            </section>

            {/* Modern Mission & Vision */}
            <section className="py-12">
                <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-2 gap-8">
                    <div className="group p-6 bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-up border border-gray-100/50 hover:scale-105">
                        <div className="relative mb-4">
                            <div className="absolute -inset-2 bg-gradient-to-r from-brand-purple/20 to-brand-tertiary-purple/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="relative w-16 h-16 bg-gradient-to-br from-brand-purple/15 via-white/80 to-brand-tertiary-purple/15 rounded-2xl flex items-center justify-center border border-brand-purple/30 shadow-lg">
                                <Sparkles className="h-8 w-8 text-brand-purple" />
                            </div>
                        </div>
                        <h3 className="text-modern-2xl font-black text-brand-purple mb-3">Our Mission</h3>
                        <p className="text-gray-700 leading-relaxed text-modern-base">
                            To revolutionize financial management using intelligent automation — reducing manual tasks, improving efficiency, and enabling businesses to focus on what matters most: growth and innovation.
                        </p>
                    </div>
                    <div className="group p-6 bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-up delay-100 border border-gray-100/50 hover:scale-105">
                        <div className="relative mb-4">
                            <div className="absolute -inset-2 bg-gradient-to-r from-brand-purple/20 to-brand-tertiary-purple/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="relative w-16 h-16 bg-gradient-to-br from-brand-purple/15 via-white/80 to-brand-tertiary-purple/15 rounded-2xl flex items-center justify-center border border-brand-purple/30 shadow-lg">
                                <Zap className="h-8 w-8 text-brand-purple" />
                            </div>
                        </div>
                        <h3 className="text-modern-2xl font-black text-brand-purple mb-3">Our Vision</h3>
                        <p className="text-gray-700 leading-relaxed text-modern-base">
                            To become the most trusted financial automation platform, empowering businesses of all sizes to manage finances, track performance, and scale operations — securely and seamlessly.
                        </p>
                    </div>
                </div>
            </section>

            {/* Modern Core Values */}
            <section className="py-12 text-center bg-white/50 backdrop-blur-sm animate-fade-up">
                <div className="container mx-auto px-4">
                    <h2 className="text-responsive-3xl font-black text-gray-900 mb-4">What Drives Us</h2>
                    <p className="text-gray-600 max-w-xl mx-auto mb-10 text-modern-base leading-relaxed">
                        These values guide our decisions, shape our culture, and define how we serve our customers.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                        {["Trust & Transparency", "Innovation with Purpose", "User-First Thinking", "Security & Integrity", "Simplicity", "Sustainable Growth"].map((value, idx) => (
                            <div key={idx} className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-gray-100/50">
                                <div className="relative mb-3">
                                    <Check className="w-5 h-5 text-brand-purple group-hover:scale-110 transition-transform duration-300 mx-auto" />
                                    <div className="absolute inset-0 bg-brand-purple/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <p className="text-modern-sm font-bold text-gray-700 group-hover:text-brand-purple transition-colors duration-300">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modern Team Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-purple/15 via-white/70 to-brand-tertiary-purple/15 px-6 py-3 rounded-full border border-brand-purple/30 mb-6 backdrop-blur-lg shadow-lg">
                        <Sparkles className="h-5 w-5 text-brand-purple animate-pulse" />
                        <span className="text-modern-base font-black text-brand-purple tracking-wide">Our Amazing Team</span>
                    </div>
                    <h2 className="text-responsive-3xl font-black text-gray-900 mb-3 animate-fade-up">Meet Our Team</h2>
                    <p className="text-gray-600 max-w-xl mx-auto mb-10 animate-fade-up text-modern-base leading-relaxed">
                        A diverse team of creators, engineers, and problem-solvers who are passionate about building the future of financial technology and business automation.
                    </p>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto animate-fade-up delay-100">
                        {teamMembers.map((member, idx) => (
                            <div
                                key={idx}
                                className="group text-center bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100/50"
                            >
                                <div className="relative mb-4">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-brand-purple/30 to-brand-tertiary-purple/30 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <div className="relative w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-brand-purple to-brand-tertiary-purple flex items-center justify-center text-white text-modern-xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        {member.initial}
                                    </div>
                                </div>
                                <h4 className="text-modern-lg font-bold text-gray-900 group-hover:text-brand-purple transition-colors duration-300">{member.name}</h4>
                                <p className="text-modern-sm text-gray-600">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modern CTA */}
            <section className="py-12 bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/90 to-brand-tertiary-purple/90"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h3 className="text-responsive-3xl font-black mb-3 animate-fade-up flex items-center justify-center gap-3">
                        <Heart className="h-8 w-8 animate-pulse" />
                        Let's Build Something Together
                    </h3>
                    <p className="text-modern-lg mb-6 animate-fade-up delay-100 max-w-2xl mx-auto">We're always open to collaboration, feedback, or just a quick hello.</p>
                    <Link to="/contact">
                        <button className="group relative bg-white text-brand-purple px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-up delay-200 hover:scale-105">
                            <span className="flex items-center gap-2">
                                Contact Us
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                            </span>
                        </button>
                    </Link>
                </div>
            </section>
            <Footer />
        </main>
    );
}
