import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactUsPage() {
    return (
        <main className="bg-gradient-to-b from-white to-purple-50 text-gray-800">
            <Helmet>
                <title>Contact Us - FinanceFlow</title>
                <meta name="description" content="Get in touch with the FinanceFlow team for inquiries, support, or collaboration opportunities." />
                <link rel="canonical" href="https://financeflow.com/contact" />
            </Helmet>
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 text-center bg-white animate-fade-up">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We’d love to hear from you! Whether you have questions, feedback, or just want to say hello — reach out.
                    </p>
                </div>
            </section>

            {/* Contact Form and Info */}
            <section className="py-16 animate-fade-up">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 max-w-6xl">
                    {/* Contact Form */}
                    <form className="bg-white p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold mb-6 text-brand-purple">Send Us a Message</h2>
                        <div className="grid gap-4">
                            <input type="text" placeholder="Your Name" className="border rounded-lg px-4 py-3 w-full" required />
                            <input type="email" placeholder="Your Email" className="border rounded-lg px-4 py-3 w-full" required />
                            <input type="tel" placeholder="Your Phone Number" className="border rounded-lg px-4 py-3 w-full" />
                            <textarea placeholder="Your Message" rows={5} className="border rounded-lg px-4 py-3 w-full" required></textarea>
                            <button type="submit" className="bg-brand-purple text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition flex items-center gap-2">
                                <Send className="w-4 h-4" /> Submit
                            </button>
                        </div>
                    </form>

                    {/* Contact Info */}
                    <div className="p-8 bg-white rounded-2xl shadow-md space-y-6">
                        <h2 className="text-2xl font-bold text-brand-purple">Contact Information</h2>
                        <div className="flex items-start gap-4">
                            <Mail className="w-6 h-6 text-brand-purple" />
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-gray-600">support@financeflow.com</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Phone className="w-6 h-6 text-brand-purple" />
                            <div>
                                <p className="font-medium">Phone</p>
                                <p className="text-gray-600">+1 (800) 123-4567</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <MapPin className="w-6 h-6 text-brand-purple" />
                            <div>
                                <p className="font-medium">Address</p>
                                <p className="text-gray-600">123 Automation Ave, Suite 200, San Francisco, CA</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Placeholder */}
            <section className="py-10 animate-fade-up delay-100">
                <div className="container mx-auto px-4">
                    <div className="rounded-2xl overflow-hidden shadow-md">
                        <iframe
                            title="Our Location"
                            src="https://maps.google.com/maps?q=San%20Francisco&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            className="w-full h-72 border-0"
                            allowFullScreen={true}  // Corrected: Use boolean value true here
                            loading="lazy"
                        ></iframe>

                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white animate-fade-up delay-200">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: "How long does it take to get a response?",
                                a: "Our support team usually responds within 24 hours on weekdays."
                            },
                            {
                                q: "Can I book a demo?",
                                a: "Absolutely! Just send us a message with your availability, and we’ll set up a time."
                            },
                            {
                                q: "Where is your team based?",
                                a: "Our core team operates remotely across the US, India, and Europe."
                            },
                        ].map((item, idx) => (
                            <div key={idx} className="p-5 bg-gray-100 rounded-xl">
                                <p className="font-semibold text-brand-purple">{item.q}</p>
                                <p className="text-gray-700 mt-2">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-brand-purple to-brand-tertiary-purple text-white text-center">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl font-bold mb-4 animate-fade-up">Let’s Talk!</h3>
                    <p className="text-lg mb-8 animate-fade-up delay-100">No matter your question, we’re here to help — don’t hesitate to reach out.</p>
                    <a href="mailto:support@financeflow.com">
                        <button className="bg-white text-brand-purple px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-100 transition animate-fade-up delay-200">
                            Email Us
                        </button>
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}
