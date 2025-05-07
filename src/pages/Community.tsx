import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CommunityPage() {
    const [communityPosts, setCommunityPosts] = useState([]);
    const [events, setEvents] = useState([]);
    
    // Dummy data for posts and events (to be replaced with real API calls)
    useEffect(() => {
        const fetchedPosts = [
            {
                title: "How to Handle Stress as a Small Business Owner",
                description: "Join the discussion on how to manage business stress effectively. Share your tips or seek advice from others!",
                link: "/community/discussion1"
            },
            {
                title: "Best Practices for Managing Cash Flow in 2025",
                description: "A great place to talk about the current best practices in managing cash flow for small businesses.",
                link: "/community/discussion2"
            }
        ];

        const fetchedEvents = [
            {
                title: "Small Business Meetup - New York",
                date: "May 15, 2025",
                location: "New York City, NY",
                link: "/community/event1"
            },
            {
                title: "Online Webinar: Marketing for Small Businesses",
                date: "June 1, 2025",
                location: "Virtual",
                link: "/community/event2"
            }
        ];

        setCommunityPosts(fetchedPosts);
        setEvents(fetchedEvents);
    }, []);

    return (
        <main className="bg-gradient-to-b from-white to-purple-50 text-gray-800">
            <Helmet>
                <title>FinanceFlow - Community</title>
                <meta name="description" content="Join the FinanceFlow community to engage in discussions, find events, and share experiences!" />
                <meta name="keywords" content="community, small business, discussions, events, networking" />
                <meta property="og:title" content="FinanceFlow - Community" />
                <meta property="og:description" content="Join the FinanceFlow community to engage in discussions, find events, and share experiences!" />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://financeflow.com/community" />
            </Helmet>
            <Navbar />

            {/* Hero */}
            <section className="py-20 text-center animate-fade-up">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Join the Community</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Connect with like-minded business owners, share experiences, and grow together.
                    </p>
                </div>
            </section>

            {/* Community Posts Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">Active Discussions</h2>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {communityPosts.map((post, idx) => (
                            <div key={idx} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition animate-fade-up">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{post.title}</h3>
                                    <p className="text-gray-600 mb-6">{post.description}</p>
                                    <Link to={post.link}>
                                        <button className="text-brand-purple font-semibold hover:text-brand-purple-dark transition">
                                            Join the Discussion
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">Upcoming Events</h2>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {events.map((event, idx) => (
                            <div key={idx} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition animate-fade-up">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{event.title}</h3>
                                    <p className="text-gray-600 mb-6">Date: {event.date}</p>
                                    <p className="text-gray-600 mb-6">Location: {event.location}</p>
                                    <Link to={event.link}>
                                        <button className="text-brand-purple font-semibold hover:text-brand-purple-dark transition">
                                            Learn More
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community Posts Submission Section */}
            <section className="py-16 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple text-white text-center">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl font-bold mb-4 animate-fade-up">Become a Contributor</h3>
                    <p className="text-lg mb-8 animate-fade-up delay-100">Have something to share? Write a post or share your experience with the community!</p>
                    <Link to="/community/create-post">
                        <button className="bg-white text-brand-purple px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-100 transition animate-fade-up delay-200">
                            Share a Post
                        </button>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
