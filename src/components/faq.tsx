import { useState } from 'react';

const FAQ = () => {
    const [activeIdx, setActiveIdx] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIdx(activeIdx === index ? null : index);
    };

    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-semibold text-center mb-12">Frequently Asked Questions</h2>
                <div className="space-y-6">
                    {[
                        { q: "Can I cancel my subscription anytime?", a: "Yes! You can cancel your plan from your dashboard without any penalty." },
                        { q: "Is there a trial available?", a: "All paid plans come with a 14-day free trial, no credit card required." },
                        { q: "What payment methods do you accept?", a: "We accept all major credit cards and PayPal." },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white shadow-md rounded-xl">
                            <div
                                onClick={() => toggleFAQ(idx)}
                                className="p-4 flex justify-between items-center cursor-pointer"
                            >
                                <h3 className="font-semibold text-lg">{item.q}</h3>
                                <button className="text-gray-500 focus:outline-none">
                                    <svg
                                        className={`w-5 h-5 transform transition-transform duration-300 ${activeIdx === idx ? 'rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                            </div>
                            {activeIdx === idx && <div className="p-4 text-gray-600">{item.a}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
