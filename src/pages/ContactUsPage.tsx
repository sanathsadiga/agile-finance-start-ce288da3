import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactUsPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white text-gray-800 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-3 h-3 bg-brand-purple/20 rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
                <div className="absolute bottom-20 right-20 w-4 h-4 bg-brand-tertiary-purple/30 rounded-full animate-bounce" style={{animationDuration: '4s'}}></div>
                <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-purple-400/25 rotate-45 animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-brand-purple/40 rounded-full animate-ping"></div>
            </div>

            {/* Helmet Meta Tags for SEO */}
            <Helmet>
                <title>Contact Us - FinanceFlow</title>
                <meta name="description" content="Get in touch with the FinanceFlow team for inquiries, support, or collaboration opportunities." />
                <link rel="canonical" href="https://financeflow.com/contact" />
            </Helmet>
            
            <Navbar />

            {/* Modern Hero Section */}
            <section className="py-20 text-center bg-white/50 backdrop-blur-sm animate-fade-up relative z-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        <span className="bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple bg-clip-text text-transparent animate-gradient bg-300%">
                            Contact Us
                        </span>
                    </h1>
                    <p className="text-modern-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        We'd love to hear from you! Whether you have questions, feedback, or just want to say hello — reach out.
                    </p>
                </div>
            </section>

            {/* Modern Contact Form and Info */}
            <section className="py-16 animate-fade-up relative z-10">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 max-w-6xl">
                    {/* Contact Form */}
                    <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-500">
                        <h2 className="text-responsive-3xl font-bold mb-6 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple bg-clip-text text-transparent">
                            Send Us a Message
                        </h2>
                        <form className="grid gap-4">
                            <input 
                                type="text" 
                                placeholder="Your Name" 
                                className="border border-gray-200/50 rounded-2xl px-4 py-3 w-full focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all bg-white/50 backdrop-blur-sm" 
                                required 
                            />
                            <input 
                                type="email" 
                                placeholder="Your Email" 
                                className="border border-gray-200/50 rounded-2xl px-4 py-3 w-full focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all bg-white/50 backdrop-blur-sm" 
                                required 
                            />
                            <input 
                                type="tel" 
                                placeholder="Your Phone Number" 
                                className="border border-gray-200/50 rounded-2xl px-4 py-3 w-full focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all bg-white/50 backdrop-blur-sm" 
                            />
                            <textarea 
                                placeholder="Your Message" 
                                rows={5} 
                                className="border border-gray-200/50 rounded-2xl px-4 py-3 w-full focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all bg-white/50 backdrop-blur-sm resize-none" 
                                required
                            ></textarea>
                            <button 
                                type="submit" 
                                className="bg-gradient-to-r from-brand-purple to-brand-tertiary-purple text-white px-6 py-3 rounded-full font-semibold hover:from-brand-tertiary-purple hover:to-brand-purple transition-all duration-300 flex items-center gap-2 justify-center shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <Send className="w-4 h-4" /> Submit Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-500 space-y-6">
                        <h2 className="text-responsive-3xl font-bold bg-gradient-to-r from-brand-purple to-brand-tertiary-purple bg-clip-text text-transparent">
                            Contact Information
                        </h2>
                        <div className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-all">
                            <div className="p-3 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple rounded-full">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Email</p>
                                <p className="text-gray-600">support@financeflow.com</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-all">
                            <div className="p-3 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple rounded-full">
                                <Phone className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Phone</p>
                                <p className="text-gray-600">+1 (800) 123-4567</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-all">
                            <div className="p-3 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple rounded-full">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Address</p>
                                <p className="text-gray-600">123 Automation Ave, Suite 200, San Francisco, CA</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modern Map Section */}
            <section className="py-10 animate-fade-up delay-100 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50">
                        <iframe
                            title="Our Location"
                            src="https://maps.google.com/maps?q=San%20Francisco&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            className="w-full h-80 border-0"
                            allowFullScreen={true}
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* Modern FAQ Section */}
            <section className="py-16 bg-white/50 backdrop-blur-sm animate-fade-up delay-200 relative z-10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-responsive-4xl font-bold text-center text-gray-900 mb-10 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: "How long does it take to get a response?",
                                a: "Our support team usually responds within 24 hours on weekdays."
                            },
                            {
                                q: "Can I book a demo?",
                                a: "Absolutely! Just send us a message with your availability, and we'll set up a time."
                            },
                            {
                                q: "Where is your team based?",
                                a: "Our core team operates remotely across the US, India, and Europe."
                            },
                        ].map((item, idx) => (
                            <div key={idx} className="p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                                <p className="font-semibold text-brand-purple text-modern-lg mb-2">{item.q}</p>
                                <p className="text-gray-700 text-modern-base leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modern CTA Section */}
            <section className="py-16 bg-gradient-to-r from-brand-purple via-brand-tertiary-purple to-brand-purple text-white text-center relative z-10">
                <div className="container mx-auto px-4">
                    <h3 className="text-responsive-4xl font-bold mb-4 animate-fade-up">Let's Talk!</h3>
                    <p className="text-modern-lg mb-8 animate-fade-up delay-100 opacity-90">
                        No matter your question, we're here to help — don't hesitate to reach out.
                    </p>
                    <a href="mailto:support@financeflow.com">
                        <button className="bg-white text-brand-purple px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-all duration-300 animate-fade-up delay-200 hover:scale-105">
                            Email Us Now
                        </button>
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}
