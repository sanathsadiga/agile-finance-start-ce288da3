
import React, { useRef, useEffect } from 'react';
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    company: "Creative Solutions LLC",
    content: "FinanceFlow transformed how I manage my business finances. The invoicing and expense tracking features save me hours every week.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
  },
  {
    name: "Michael Chen",
    role: "Freelance Developer",
    company: "TechCreate",
    content: "The dashboard gives me a clear picture of my finances at a glance. It's incredibly intuitive and perfect for freelancers.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Agency Director",
    company: "Digital Growth Partners",
    content: "The automated financial reports have made tax season so much easier. I couldn't imagine running my agency without it now.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
  },
  {
    name: "David Kim",
    role: "Restaurant Owner",
    company: "Taste of Seoul",
    content: "Managing expenses across multiple locations used to be a nightmare. With FinanceFlow, I can now do it effortlessly from my phone.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
  }
];

const Testimonials = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animation for card entry
    const cards = carouselRef.current?.querySelectorAll('.testimonial-card');
    
    if (cards) {
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate-scale-in');
          card.classList.remove('opacity-0', 'scale-95');
        }, 150 * index);
      });
    }
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-purple-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Businesses Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what our customers are saying about their experience with FinanceFlow.
          </p>
        </div>

        <div ref={carouselRef} className="relative">
          {/* Background decoration */}
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl"></div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="testimonial-card opacity-0 scale-95 transition-all duration-500 h-full p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-brand-purple text-brand-purple"
                        />
                      ))}
                    </div>
                    <blockquote className="mb-4 text-gray-600 italic">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="mt-auto flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-brand-purple/30">
                        <img src={testimonial.image} alt={testimonial.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                        <p className="text-sm text-brand-purple">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-2">
              <CarouselPrevious className="static translate-x-0 translate-y-0 bg-white hover:bg-brand-purple hover:text-white transition-colors" />
              <CarouselNext className="static translate-x-0 translate-y-0 bg-white hover:bg-brand-purple hover:text-white transition-colors" />
            </div>
          </Carousel>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center gap-8 flex-wrap">
            <img src="https://dummy.lovable.ai/logos/logo1.svg" alt="Company logo" className="h-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
            <img src="https://dummy.lovable.ai/logos/logo2.svg" alt="Company logo" className="h-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
            <img src="https://dummy.lovable.ai/logos/logo3.svg" alt="Company logo" className="h-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
            <img src="https://dummy.lovable.ai/logos/logo4.svg" alt="Company logo" className="h-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
            <img src="https://dummy.lovable.ai/logos/logo5.svg" alt="Company logo" className="h-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
