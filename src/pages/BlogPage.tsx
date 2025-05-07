import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BlogPage() {
    const [blogPosts, setBlogPosts] = useState([]);
    
    // Dummy API call or data fetching
    useEffect(() => {
        // Simulating fetching data (This would be an API call in a real application)
        const fetchedPosts = [
            {
                title: "How to Manage Business Finances Effectively",
                description: "In this blog, we share practical tips on how small business owners can manage their finances and stay organized.",
                link: "/blog/how-to-manage-business-finances"
            },
            {
                title: "Top 5 Accounting Mistakes to Avoid",
                description: "Avoid common accounting mistakes with these tips that can save you time and money while keeping your business finances in check.",
                link: "/blog/top-5-accounting-mistakes"
            },
            {
                title: "The Benefits of Automating Your Invoicing",
                description: "Automation is the future! Learn how automating your invoicing process can streamline your workflow and improve cash flow.",
                link: "/blog/benefits-of-automating-invoicing"
            }
        ];

        setBlogPosts(fetchedPosts);
    }, []);

    return (
        <main className="bg-gradient-to-b from-white to-purple-50 text-gray-800">
            <Helmet>
                <title>FinanceFlow - Blog</title>
                <meta name="description" content="Stay updated with the latest tips, trends, and news in accounting and finance management." />
                <meta name="keywords" content="blog, accounting, finance, business, invoicing, automation" />
                <meta property="og:title" content="FinanceFlow - Blog" />
                <meta property="og:description" content="Stay updated with the latest tips, trends, and news in accounting and finance management." />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://financeflow.com/blog" />
            </Helmet>
            <Navbar />

            {/* Hero */}
            <section className="py-20 text-center animate-fade-up">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Blog</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore our latest articles, tips, and insights on managing your business finances efficiently.
                    </p>
                </div>
            </section>

            {/* Blog Posts Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {/* Dummy Post for Now */}
                        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition animate-fade-up">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Manage Business Finances Effectively</h3>
                                <p className="text-gray-600 mb-6">
                                    In this blog, we share practical tips on how small business owners can manage their finances and stay organized.
                                </p>
                                <Link to="/blog/how-to-manage-business-finances">
                                    <button className="text-brand-purple font-semibold hover:text-brand-purple-dark transition">
                                        Read More
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Dynamically Rendered Blog Posts */}
                        {blogPosts.map((post, idx) => (
                            <div key={idx} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition animate-fade-up">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{post.title}</h3>
                                    <p className="text-gray-600 mb-6">{post.description}</p>
                                    <Link to={post.link}>
                                        <button className="text-brand-purple font-semibold hover:text-brand-purple-dark transition">
                                            Read More
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple text-white text-center">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl font-bold mb-4 animate-fade-up">Stay Informed and Ahead</h3>
                    <p className="text-lg mb-8 animate-fade-up delay-100">Get the latest updates and tips from the finance world, straight to your inbox.</p>
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
