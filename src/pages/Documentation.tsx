import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const docs = [
    { title: 'Getting Started', content: 'This document will help you get started with our platform. It covers everything from setting up your account to making your first transaction.' },
    { title: 'API Documentation', content: 'The API documentation provides all the details you need to integrate with our system. It includes all available endpoints and usage examples.' },
    { title: 'FAQs', content: 'Find answers to the most frequently asked questions by users. From account-related queries to troubleshooting steps.' },
    { title: 'Best Practices', content: 'This document provides tips and recommendations on using our platform most effectively and efficiently.' },
    { title: 'Release Notes', content: 'Stay updated on the latest updates, features, and fixes that have been released.' },
    { title: 'Getting Started', content: 'This document will help you get started with our platform. It covers everything from setting up your account to making your first transaction.' },
    { title: 'API Documentation', content: 'The API documentation provides all the details you need to integrate with our system. It includes all available endpoints and usage examples.' },
    { title: 'FAQs', content: 'Find answers to the most frequently asked questions by users. From account-related queries to troubleshooting steps.' },
    { title: 'Best Practices', content: 'This document provides tips and recommendations on using our platform most effectively and efficiently.' },
    { title: 'Release Notes', content: 'Stay updated on the latest updates, features, and fixes that have been released.' },
    { title: 'Getting Started', content: 'This document will help you get started with our platform. It covers everything from setting up your account to making your first transaction.' },
    { title: 'API Documentation', content: 'The API documentation provides all the details you need to integrate with our system. It includes all available endpoints and usage examples.' },
    { title: 'FAQs', content: 'Find answers to the most frequently asked questions by users. From account-related queries to troubleshooting steps.' },
    { title: 'Best Practices', content: 'This document provides tips and recommendations on using our platform most effectively and efficiently.' },
    { title: 'Release Notes', content: 'Stay updated on the latest updates, features, and fixes that have been released.' }
    
];

export default function DocumentationPage() {
    const [selectedDoc, setSelectedDoc] = useState(docs[0]);

    return (
        <main className="bg-gray-100 min-h-screen flex flex-col">
            <Helmet>
                <title>Documentation</title>
                <meta name="description" content="Explore the documentation to get detailed information about using the platform." />
                <meta name="keywords" content="documentation, guide, API, FAQ, platform, release notes" />
                <meta property="og:title" content="Documentation" />
                <meta property="og:description" content="Explore the documentation to get detailed information about using the platform." />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://yourwebsite.com/documentation" />
            </Helmet>
            <Navbar />

            {/* Hero Section with Title */}
            <section className="bg-gradient-to-b from-indigo-700 to-blue-300 text-white text-center py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">Documentation</h1>
                    <p className="text-lg max-w-2xl mx-auto">
                        Explore all the resources and guides you need to get started and make the most out of our platform.
                    </p>
                </div>
            </section>

            <section className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/4 bg-gray-800 text-white p-6 h-full overflow-y-auto">
                    <h3 className="text-2xl font-semibold mb-6">Docs</h3>
                    <ul className="space-y-4">
                        {docs.map((doc, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => setSelectedDoc(doc)}
                                    className={`text-lg font-medium text-gray-100 hover:text-blue-400 transition duration-300 w-full text-left p-2 rounded-md ${selectedDoc.title === doc.title ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                                >
                                    {doc.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Document Content Area */}
                <div className="w-3/4 bg-white p-8 overflow-y-auto flex flex-col">
                    <div className="mb-8">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-4">{selectedDoc.title}</h2>
                        <p className="text-lg text-gray-600">{selectedDoc.content}</p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
